import { Router, type RequestHandler } from "express";
import { webhookTrigger } from "../controllers/webhook.controller";

const webhookRouter = Router();

// Webhook endpoint - no auth required as it's a public webhook
webhookRouter.get("/:workflowId", webhookTrigger as any);

export default webhookRouter;
