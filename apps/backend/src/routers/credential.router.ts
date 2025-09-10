import { Router } from "express";
import { createCredential, getAllCredentials } from "../controllers/credential.controller";

const credentialRouter = Router();

credentialRouter.post("/create", createCredential);
credentialRouter.get("/", getAllCredentials);

export default credentialRouter;