import express from "express";
import authRouter from "./routers/auth.routers";
import cors from "cors";
import credentialRouter from "./routers/credential.router";
import cookieParser from "cookie-parser";
import workflowRouter from "./routers/workflows.routers";
import availableTriggerRouter from "./routers/available-triggers.router";
import executeRouter from "./routers/execution.router";

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(cors({
    credentials : true,
    origin : "http://localhost:5173"
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/credentials", credentialRouter);
app.use("/api/v1/workflows", workflowRouter);
app.use("/api/v1/availableTrigger", availableTriggerRouter);
app.use("/api/v1/execute", executeRouter);

app.listen(3000,()=> {
    console.log("Server running on 3000")
})