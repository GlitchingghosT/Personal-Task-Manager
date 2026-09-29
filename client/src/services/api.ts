import axios from 'axios';
import type { CreateTaskInput, Task } from '../types/task';

const API_URL = import.meta.env.PROD
  ? 'https://tasktimely-backend.onrender.com'
  : 'http://localhost:5050';

const CLIENT_ID_KEY = 'tasktimely-client-id';
const clientId = localStorage.getItem(CLIENT_ID_KEY) ?? crypto.randomUUID();
localStorage.setItem(CLIENT_ID_KEY, clientId);

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'X-Client-ID': clientId,
  },
});

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