import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/task-manager"
        );
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Database connection error: ${(error as Error).message}`);
        process.exit(1);
    }
};