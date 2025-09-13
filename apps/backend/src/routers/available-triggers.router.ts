import { Router } from "express";
import { createTrigger, getAllTriggers } from "../controllers/available-triggers.controller";

const availableTriggerRouter  = Router();

availableTriggerRouter.post("/",createTrigger);
availableTriggerRouter.get("/",getAllTriggers);


export default availableTriggerRouter;