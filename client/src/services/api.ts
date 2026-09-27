import axios from 'axios';
import type { Task, CreateTaskInput, UpdateTaskInput } from '../types/task';

const API = axios.create({
  baseURL: 'http://localhost:5050/api',
});

export const getTasks = async (): Promise<Task[]> => {
  const response = await API.get<{ success: boolean; data: Task[] }>('/tasks');
  return response.data.data;
};

export const getTaskById = async (id: string): Promise<Task> => {
  const response = await API.get<{ success: boolean; data: Task }>(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (taskData: CreateTaskInput): Promise<Task> => {
  const response = await API.post<{ success: boolean; data: Task }>('/tasks', taskData);
  return response.data.data;
};

export const updateTask = async (id: string, updates: UpdateTaskInput): Promise<Task> => {
  const response = await API.put<{ success: boolean; data: Task }>(`/tasks/${id}`, updates);
  return response.data.data;
};

export const deleteTask = async (id: string): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};