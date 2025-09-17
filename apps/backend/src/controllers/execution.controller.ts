import type { Request, Response } from "express";
import prisma from "../db/prisma";
import type { CustomRequest } from "../middleware/auth";
import executeNodes from "../execution-engine/engine";

type Flow = {
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

        await executeNodes(workflowId, nodes);

        res.status(200).json({ success: true, message: "Workflow executed successfully" });
        return;
    } catch (error) {
        console.log("Error while executing workflow", error);
        res.status(500).json({ success: false, message: "Error while executing workflow" });
        return;
    }
}

export { execute };