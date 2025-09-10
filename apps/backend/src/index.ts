import express from "express";
import authRouter from "./routers/auth.routers";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors({
    credentials : true,
    origin : "http://localhost:5173"
}));

app.use("/api/v1/auth", authRouter);

app.listen(3000,()=> {
    console.log("Server running on 3000")
})