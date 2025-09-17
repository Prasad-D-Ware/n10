import { Router, type RequestHandler } from "express";
import { execute } from "../controllers/execution.controller";
import auth from "../middleware/auth";

const executeRouter = Router();

executeRouter.post("/", auth as RequestHandler, execute as any);

export default executeRouter;