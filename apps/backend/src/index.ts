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
import analyticRouter from "./routers/analytic.router";

export const executionEvents = new EventEmitter();
// Increase max listeners for production to handle multiple SSE connections
executionEvents.setMaxListeners(0); // 0 means unlimited

const app = express();
app.use(cookieParser());

app.use(express.json());

// Configure CORS for both development and production
const allowedOrigins = [
    "http://localhost:5173",
    "https://n10.prsd.dev"
].filter(Boolean);

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.get("/",(req,res) => {
    res.json({
        message : "Healthy!"
    })
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/credentials", credentialRouter);
app.use("/api/v1/workflows", workflowRouter);
app.use("/api/v1/availableTrigger", availableTriggerRouter);
app.use("/api/v1/execute", executeRouter);
app.use("/api/v1/webhook", webhookRouter);
app.use("/api/v1/analytics", analyticRouter);

// SSE endpoint for real-time execution updates
app.get("/api/v1/execute/stream", (req, res) => {
    // Set CORS headers for SSE
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
        res.setHeader("Access-Control-Allow-Credentials", "true");
    }
    
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
    
    // Send initial connection message
    res.write(`data: ${JSON.stringify({ type: "connected", message: "SSE connection established" })}\n\n`);
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