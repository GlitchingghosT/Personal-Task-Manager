import { Request, Response } from "express";
import { Task } from "../models/Task";

const getOwnerId = (req: Request, res: Response): string | null => {
    const ownerId = req.auth?.userId;
    if (!ownerId) {
        res.status(401).json({ success: false, message: "Authentication required" });
        return null;
    }
    return ownerId;
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId) return;

    try {
        const tasks = await Task.find({ ownerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId) return;

    try {
        const task = await Task.findOne({ _id: req.params.id, ownerId });
        if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId) return;

    try {
        const { title, description, dueDate, category, completed } = req.body;
        const task = await Task.create({ ownerId, title, description, dueDate, category, completed });
        res.status(201).json({ success: true, data: task });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Invalid task data";
        res.status(400).json({ success: false, message });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId) return;

    try {
        const { title, description, dueDate, category, completed } = req.body;
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, ownerId },
            { title, description, dueDate, category, completed },
            { new: true, runValidators: true }
        );
        if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
        res.status(200).json({ success: true, data: task });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Invalid task data";
        res.status(400).json({ success: false, message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId) return;

    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, ownerId });
        if (!task) { res.status(404).json({ success: false, message: "Task not found" }); return; }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};