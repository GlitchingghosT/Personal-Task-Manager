import { Schema, model, Document } from "mongoose";

export interface ITask extends Document {
    title: string;
    description: string;
    dueDate: Date;
    category: "Work" | "Personal" | "Urgent";
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: {
            type: String,
            required: [true, "Please add a task title"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Please add a description"],
            trim: true,
        },
        dueDate: {
            type: Date,
            required: [true, "Please add a due date"],
        },
        category: {
            type: String,
            enum: ["Work", "Personal", "Urgent"],
            required: [true, "Please select a category"],
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const Task = model<ITask>("Task", taskSchema);