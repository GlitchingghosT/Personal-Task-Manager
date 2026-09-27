import { Request, Response } from "express";
import { Task } from "../models/Task";

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, category, completed } = req.body;
        const task = await Task.create({ title, description, dueDate, category, completed });
        res.status(201).json({ success: true, data: task });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
        res.status(200).json({ success: true, data: task });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};