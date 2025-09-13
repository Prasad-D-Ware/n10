import { Router, type RequestHandler } from "express";
import { createWorkflow, getAllWorkflow, getWorkflow, updateWorkflow, deleteWorkflow } from "../controllers/workflows.controllers";
import auth from "../middleware/auth";

const workflowRouter = Router();

workflowRouter.post("/create", auth as RequestHandler, createWorkflow as any);
workflowRouter.put("/:id", auth as RequestHandler, updateWorkflow as any);
workflowRouter.get("/:id", auth as RequestHandler, getWorkflow as any);
workflowRouter.get("/", auth as RequestHandler, getAllWorkflow as any);
workflowRouter.delete("/:id", auth as RequestHandler, deleteWorkflow as any);

export default workflowRouter;