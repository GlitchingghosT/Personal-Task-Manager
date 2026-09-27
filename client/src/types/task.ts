export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  category: "Urgent" | "Important"; // UPDATED
  completed: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate: string;
  category: "Urgent" | "Important"; // UPDATED
  completed?: boolean;
}

export type UpdateTaskInput = Partial<CreateTaskInput>;