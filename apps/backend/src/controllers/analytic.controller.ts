import type { Response } from "express";
import prisma from "../db/prisma";
import type { CustomRequest } from "../middleware/auth";

const getAnalytics = async (req: CustomRequest, res: Response) => {
    const user = req.user;
    try {
        const totalWorkflows = await prisma.workflow.count({
            where : { 
                user_id : user.id
            },
        });

        const successfulExecutions = await prisma.execution.count({
            where : {
                workflow :{
                    user_id : user.id
                },
                status: "SUCCESS"
            },
        });

        const failedExecutions = await prisma.execution.count({
            where : {
                workflow :{
                    user_id : user.id
                },
                status: "FAILED"
            },
        });

        const executionsWithTimes = await prisma.execution.findMany({
            where : {
                workflow :{
                    user_id : user.id
                },
                status: "SUCCESS",
            },
            select : {
                started_at: true,
                ended_at: true
            }
        });

        const avgExecutionTime = executionsWithTimes.length > 0 
            ? executionsWithTimes.reduce((sum, execution) => {
                if (!execution.started_at || !execution.ended_at) return sum;
                const duration = new Date(execution.ended_at).getTime() - new Date(execution.started_at).getTime();
                return sum + duration;
            }, 0) / executionsWithTimes.length / 1000
            : 0;

        const totalCreds = await prisma.credential.count({
            where : {
                user_id : user.id
            },
        });

        const analytics = {
            totalWorkflows,
            successfulExecutions,
            failedExecutions,
            avgExecutionTime,
            totalCreds
        }

        res.status(200).json({ success: true, message: "Analytics fetched successfully", analytics});
        return;
    } catch (error) {
        res.status(500).json({ success: false, message: "Error while getting analytics" });
        return;
    }
}

export { getAnalytics };