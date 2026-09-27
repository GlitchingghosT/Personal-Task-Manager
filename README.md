# TaskDuty - Personal Task Manager

A full-stack Personal Task Manager built as part of the Techstudio Internship Program (Stage 1). This application allows users to create, read, update, and delete tasks, with features for filtering, tracking due dates, and marking tasks as completed.

## 🚀 Tech Stack

**Client:**
- React (Vite)
- TypeScript
- Tailwind CSS
- React Router DOM
- Axios
- React Icons

**Server:**
- Node.js
- Express
- TypeScript
- In-Memory Store (See Known Issues)

## ✨ Features

- **CRUD Operations:** Create, read, update, and delete tasks.
- **Task Properties:** Each task has a Title, Description, Due Date, Category (Urgent/Important), and Completion Status.
- **Validation:** Form validation ensures all fields are required and prevents due dates in the past.
- **Filtering:** Filter tasks by category (Urgent/Important) and completion status (Pending/Completed).
- **Smart Sorting:** Overdue tasks are pinned to the top, followed by upcoming tasks, with completed tasks dropping to the bottom.
- **Visual Indicators:** Clear badges for "Overdue" and "Completed" tasks, with a visual divider separating active tasks from completed ones.
- **Responsive UI:** Designed to match the provided Figma mockup, with a clean, modern interface.

## 📁 Folder Structure
