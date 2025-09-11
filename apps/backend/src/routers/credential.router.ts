import { Router, type RequestHandler } from "express";
import { createCredential, getAllCredentials, updateCredential, deleteCredential } from "../controllers/credential.controller";
import auth from "../middleware/auth";

const credentialRouter = Router();

credentialRouter.post("/create", auth as RequestHandler , createCredential as any);
credentialRouter.get("/", auth as RequestHandler , getAllCredentials as any);
credentialRouter.put("/:id", auth as RequestHandler, updateCredential as any);
credentialRouter.delete("/:id", auth as RequestHandler, deleteCredential as any);

export default credentialRouter;