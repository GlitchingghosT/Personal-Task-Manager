import axios from 'axios';
import type { Task } from '../types/task';

const API_URL = import.meta.env.PROD
  ? 'https://tasktimely-backend.onrender.com'
  : 'http://localhost:5050';

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

export const createTask = async (taskData: Omit<Task, '_id'>): Promise<Task> => {
  const response = await API.post('/tasks', taskData);
  return response.data.data;
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};

export default API;