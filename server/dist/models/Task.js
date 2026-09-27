"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const mongoose_1 = require("mongoose");
const taskSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Task description is required'],
        trim: true,
    },
    tag: {
        type: String,
        enum: ['Urgent', 'Important'],
        default: 'Urgent',
    },
}, { timestamps: true });
exports.Task = (0, mongoose_1.model)('Task', taskSchema);
//# sourceMappingURL=Task.js.map