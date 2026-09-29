"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const getOwnerId = (req, res) => {
    const ownerId = req.get("X-Client-ID");
    if (!ownerId || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(ownerId)) {
        res.status(400).json({ success: false, message: "A valid client ID is required" });
        return null;
    }
    return ownerId;
};
const getTasks = async (req, res) => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId)
        return;
    try {
        const tasks = await Task_1.Task.find({ ownerId }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: tasks.length, data: tasks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};
exports.getTasks = getTasks;
const getTaskById = async (req, res) => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId)
        return;
    try {
        const task = await Task_1.Task.findOne({ _id: req.params.id, ownerId });
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({ success: true, data: task });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};
exports.getTaskById = getTaskById;
const createTask = async (req, res) => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId)
        return;
    try {
        const { title, description, dueDate, category, completed } = req.body;
        const task = await Task_1.Task.create({ ownerId, title, description, dueDate, category, completed });
        res.status(201).json({ success: true, data: task });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId)
        return;
    try {
        const { title, description, dueDate, category, completed } = req.body;
        const task = await Task_1.Task.findOneAndUpdate({ _id: req.params.id, ownerId }, { title, description, dueDate, category, completed }, { new: true, runValidators: true });
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({ success: true, data: task });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const ownerId = getOwnerId(req, res);
    if (!ownerId)
        return;
    try {
        const task = await Task_1.Task.findOneAndDelete({ _id: req.params.id, ownerId });
        if (!task) {
            res.status(404).json({ success: false, message: "Task not found" });
            return;
        }
        res.status(200).json({ success: true, message: "Task deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error });
    }
};
exports.deleteTask = deleteTask;
