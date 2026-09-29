import axios from 'axios';

const API_URL = import.meta.env.PROD
  ? 'https://tasktimely-backend.onrender.com'
  : 'http://localhost:5050';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  category?: string;
  completed: boolean;
}

export interface TaskPayload {
  title: string;
  description?: string;
  dueDate?: string;
  category?: string;
  completed?: boolean;
}

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async (): Promise<Task[]> => {
  const response = await API.get('/tasks');
  return response.data.data || [];
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await API.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (taskData: TaskPayload): Promise<Task> => {
  const response = await API.post('/tasks', taskData);
  return response.data.data;
};

export const updateTask = async (id: string, taskData: Partial<TaskPayload>): Promise<Task> => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};

export default API;