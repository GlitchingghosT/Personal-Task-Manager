"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    ownerId: { type: String, required: true, index: true },
    title: { type: String, required: [true, "Please add a task title"], trim: true },
    description: { type: String, required: [true, "Please add a description"], trim: true },
    dueDate: { type: Date, required: [true, "Please add a due date"] },
    category: { type: String, enum: ["Urgent", "Important"], required: true },
    completed: { type: Boolean, default: false },
}, { timestamps: true });
exports.Task = (0, mongoose_1.model)("Task", taskSchema);
