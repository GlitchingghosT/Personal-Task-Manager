import dns from "dns";
import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import serverless from "serverless-http";
import taskRoutes from "./routes/taskRoutes";

dotenv.config();

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

console.log("🔍 MONGODB_URI is:", process.env.MONGODB_URI ? "Loaded ✅" : "MISSING ❌");

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in your .env file");
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Connected");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1);
    }
};

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Task Manager API is running..." });
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

export const handler = serverless(app);

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}