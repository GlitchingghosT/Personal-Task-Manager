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

## 📸 Screenshots

### Homepage
![Homepage](./screenshots/homepage.png)

### My Tasks
![My Tasks](./screenshots/my-tasks.png)

### New Task Form
![New Task Form](./screenshots/new-task.png)

## 📁 Folder Structure

personal-task-manager/
├── client/ # React frontend (Vite + TypeScript)
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── services/
│ │ └── types/
│ └── package.json
└── server/ # Express backend (Node + TypeScript)
├── src/
│ ├── controllers/
│ ├── routes/
│ └── index.ts
└── package.json


## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone <PASTE-YOUR-GITHUB-REPO-LINK-HERE>
cd personal-task-manager


Setup the Server
bash
cd server
npm install
npm run dev
Server runs on http://localhost:5050


Setup the Client
Open a new terminal:

bash
cd client
npm install
npm run dev
Client runs on http://localhost:5173


⚠️ Known Issues
Data Persistence: The server uses an in-memory array instead of a database. All tasks will be lost when the server restarts. This was a deliberate choice to keep the local setup frictionless (no MongoDB installation required for evaluation).

Authentication: There is no user authentication. All tasks are global to the application