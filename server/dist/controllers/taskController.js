"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const Task_js_1 = require("../models/Task.js");
const getTasks = async (_req, res) => {
    try {
        const tasks = await Task_js_1.Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    try {
        const task = await Task_js_1.Task.findById(req.params.id);
        if (!task)
            return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(task);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        const newTask = await Task_js_1.Task.create({ title, description, tag });
        res.status(201).json(newTask);
    }
    catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        const updatedTask = await Task_js_1.Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedTask)
            return res.status(404).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);
    }
    catch (error) {
        res.status(400).json({ message: 'Error updating task', error });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task_js_1.Task.findByIdAndDelete(req.params.id);
        if (!deletedTask)
            return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting task', error });
    }
};
exports.deleteTask = deleteTask;
//# sourceMappingURL=taskController.js.map