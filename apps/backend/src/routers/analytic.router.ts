import { Router, type RequestHandler } from "express";
import { getAnalytics } from "../controllers/analytic.controller";
import auth from "../middleware/auth";

const analyticRouter = Router();

analyticRouter.get("/",auth as RequestHandler, getAnalytics as any);

export default analyticRouter;