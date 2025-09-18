import { Router, type RequestHandler } from "express";
import { execute, getExecutions } from "../controllers/execution.controller";
import auth from "../middleware/auth";

const executeRouter = Router();

executeRouter.post("/", auth as RequestHandler, execute as any);
executeRouter.get("/", auth as RequestHandler, getExecutions as any);

export default executeRouter;