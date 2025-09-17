import type { Request, Response } from "express";
import prisma from "../db/prisma";
import executeNodes from "../execution-engine/engine";
import type { Flow } from "./execution.controller";


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

        // Execute the workflow with webhook data
        await executeNodes(workflowId as string, nodes);

        res.status(200).json({ 
            success: true, 
            message: "Webhook received and workflow executed successfully",
            workflowName: workflow.name
        });
        return;
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
