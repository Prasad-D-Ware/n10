import type { Response } from "express";
import prisma from "../db/prisma";
import { ExecutionStatus } from "../generated/prisma";
import type { CustomRequest } from "../middleware/auth";
import executeNodes from "../execution-engine/engine";

export type Flow = {
    nodes: any;
    edges: any;
}

const execute = async (req: CustomRequest, res: Response) => {
    try {
        const { workflowId } = req.body;
        const user_id = req.user.id;

        const workflow = await prisma.workflow.findUnique({
            where: { id: workflowId , user_id },
            select : {
                flow: true,
                enabled: true,
            },
        });

        if (!workflow) {
            res.status(404).json({ success: false, message: "Workflow not found" });
            return;
        }

        if(!workflow?.enabled){
            res.status(203).json({ success: false, message: "Workflow is not enabled" });
            return;
        }

        const flow = workflow?.flow as Flow;

        const { nodes } = flow;

        // console.log("workflowId",workflowId ,"-----------------");
        // console.log(nodes);

        const execution = await prisma.execution.create({
            data : {
                workflow_id : workflowId
            }
        })

        if(!execution){
            res.status(403).json({ success: false, message: "Failed to create execution" });
            return;
        }

        try {
            await executeNodes(workflowId, nodes, execution.id);
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
            res.status(200).json({ success: false, message: err?.message || "Workflow execution failed" });
            return;
        }
    } catch (error) {
        console.log("Error while executing workflow", error);
        res.status(500).json({ success: false, message: "Error while executing workflow" });
        return;
    }
}

const getExecutions = async (req: CustomRequest, res: Response) => {
    const user_id = req.user.id;

    try {
        const executions = await prisma.execution.findMany({
            where:{
                workflow: { user_id }
            },
            select: {
                id: true,
                status: true,
                started_at: true,
                ended_at: true,
                workflow: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                ended_at: "desc",
            }
        });

        if(!executions){
            res.status(404).json({ success: false, message: "Executions not found" });
            return;
        }
        
        res.status(200).json({ success: true, message: "Executions fetched successfully", executions });
        return;

    } catch (error) {
        res.status(500).json({ success: false, message: "Error while fetching execution" });
        return;
    }
}


export { execute, getExecutions };