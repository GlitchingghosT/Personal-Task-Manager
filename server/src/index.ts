import express, { Request, Response, Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
// import { connectDB } from "./config/db"; // <-- Comment this out
import taskRoutes from "./routes/taskRoutes";

dotenv.config();
const app: Application = express();
const PORT = process.env.PORT || 5050;

// dns.setServers(["8.8.8.8", "1.1.1.1"]); // <-- Comment this out
// connectDB(); // <-- Comment this out

app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ message: "Task Manager API is running..." });
});

app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});