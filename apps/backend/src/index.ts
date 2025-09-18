import express from "express";
import authRouter from "./routers/auth.routers";
import cors from "cors";
import credentialRouter from "./routers/credential.router";
import cookieParser from "cookie-parser";
import workflowRouter from "./routers/workflows.routers";
import availableTriggerRouter from "./routers/available-triggers.router";
import executeRouter from "./routers/execution.router";
import webhookRouter from "./routers/webhook.router";
import { EventEmitter } from "events";

export const executionEvents = new EventEmitter();

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
app.use("/api/v1/webhook", webhookRouter);

// SSE endpoint for real-time execution updates
app.get("/api/v1/execute/stream", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const send = (event: any) => {
        try {
            res.write(`data: ${JSON.stringify(event)}\n\n`);
        } catch (_err) {
            // ignore write errors
        }
    };

    const listener = (event: any) => send(event);
    executionEvents.on("update", listener);

    req.on("close", () => {
        executionEvents.off("update", listener);
        try { res.end(); } catch {}
    });
});

app.listen(3000,()=> {
    console.log("Server running on 3000")
})