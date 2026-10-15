import axios from 'axios';
import type { CreateTaskInput, Task } from '../types/task';
import { getAuthToken } from './authStorage';

const API_URL = import.meta.env.PROD
  ? 'https://personal-task-manager-8sqp.onrender.com'
  : 'http://localhost:5050';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AuthResponse {
  data: {
    email: string;
    token: string;
  };
}

const authenticate = async (path: '/auth/login' | '/auth/register', email: string, password: string) => {
  const response = await API.post<AuthResponse>(path, { email, password });
  return response.data.data;
};

export const register = (email: string, password: string) =>
  authenticate('/auth/register', email, password);

export const login = (email: string, password: string) =>
  authenticate('/auth/login', email, password);

type ApiTask = Partial<Task> & {
  _id: string;
  tag?: Task['category'];
  status?: string;
};

const unwrapResponseData = (payload: unknown): unknown => {
  if (typeof payload === 'object' && payload !== null) {
    if ('data' in payload) return payload.data;
    if ('value' in payload) return payload.value;
  }
  return payload;
};

const normalizeTask = (task: ApiTask): Task => ({
  ...task,
  title: task.title ?? '',
  description: task.description ?? '',
  dueDate: task.dueDate ?? '',
  category: task.category ?? task.tag ?? 'Urgent',
  completed: task.completed ?? (task.status?.toLowerCase() === 'completed'),
});

export const getTasks = async (): Promise<Task[]> => {
  const response = await API.get('/tasks');
  const data = unwrapResponseData(response.data);
  return Array.isArray(data) ? data.map((task) => normalizeTask(task as ApiTask)) : [];
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await API.get(`/tasks/${id}`);
  return normalizeTask(unwrapResponseData(response.data) as ApiTask);
};

export const createTask = async (taskData: CreateTaskInput): Promise<Task> => {
  const response = await API.post('/tasks', taskData);
  return normalizeTask(unwrapResponseData(response.data) as ApiTask);
};

export const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return normalizeTask(unwrapResponseData(response.data) as ApiTask);
};

export const deleteTask = async (id: string): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};

export default API;