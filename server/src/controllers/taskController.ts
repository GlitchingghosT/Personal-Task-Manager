import { Request, Response } from "express";

// 1. Define the shape of our Task
interface ITask {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    category: "Urgent" | "Important"; // UPDATED
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// 2. Our fake "database" array
let tasks: ITask[] = [];

// GET /api/tasks
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// GET /api/tasks/:id
export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task = tasks.find(t => t._id === req.params.id);
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({ success: true, data: task });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};

// POST /api/tasks
export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, description, dueDate, category, completed } = req.body;
        
        // Manual validation
        if (!title || !description || !dueDate || !category) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }

        const newTask: ITask = {
            _id: Date.now().toString(), 
            title,
            description,
            dueDate,
            category,
            completed: completed || false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        tasks.push(newTask);
        res.status(201).json({ success: true, data: newTask });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// PUT /api/tasks/:id
export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const index = tasks.findIndex(t => t._id === req.params.id);
        if (index === -1) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }

        tasks[index] = { 
            ...tasks[index], 
            ...req.body, 
            updatedAt: new Date() 
        };

        res.status(200).json({ success: true, data: tasks[index] });
    } catch (error: any) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const index = tasks.findIndex(t => t._id === req.params.id);
        if (index === -1) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }

        tasks.splice(index, 1);
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};