import type { Request, Response } from "express";
import prisma from "../db/prisma";
import executeNodes from "../execution-engine/engine";
import type { Flow } from "./execution.controller";
import { ExecutionStatus } from "../generated/prisma";


const webhookTrigger = async (req: Request, res: Response) => {
    try {
        const { workflowId } = req.params;
        
        // Get the workflow by ID
        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId },
            select: {
                flow: true,
                enabled: true,
                name: true,
            },
        });

        if (!workflow) {
            res.status(404).json({ 
                success: false, 
                message: "Workflow not found" 
            });
            return;
        }

        if (!workflow.enabled) {
            res.status(400).json({ 
                success: false, 
                message: "Workflow is not enabled" 
            });
            return;
        }

        const flow = workflow.flow as Flow;
        const { nodes } = flow;

        console.log(`Webhook triggered for workflow ${workflowId}:`);

        const execution = await prisma.execution.create({
            data: {
                workflow_id: workflowId as string
            }
        })

        if(!execution){
            res.status(403).json({ success: false, message: "Failed to create execution" });
            return;
        }

        try {
            await executeNodes(workflowId as string, nodes, execution.id);
            await prisma.execution.update({
                where: { id: execution.id },
                data: { status: ExecutionStatus.SUCCESS, ended_at: new Date() }
            });
            res.status(200).json({ success: true, message: "Workflow executed successfully" });
            return;
        } catch (err: any) {
            await prisma.execution.update({
                where: { id: execution.id },
                data: { status: ExecutionStatus.FAILED, ended_at: new Date() }
            });
            res.status(400).json({ success: false, message: err?.message || "Workflow execution failed" });
            return;
        }
    } catch (error) {
        console.log("Error while processing webhook:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error while processing webhook" 
        });
        return;
    }
};

export { webhookTrigger };
