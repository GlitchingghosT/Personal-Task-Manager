import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async () => {
  const response = await API.get('/tasks');
  return response.data.data || [];
};

export const getTaskById = async (id: string) => {
  const response = await API.get(`/tasks/${id}`);
  return response.data.data;
};

export const createTask = async (taskData: any) => {
  const response = await API.post('/tasks', taskData);
  return response.data.data;
};

export const updateTask = async (id: string, taskData: any) => {
  const response = await API.put(`/tasks/${id}`, taskData);
  return response.data.data;
};

export const deleteTask = async (id: string) => {
  const response = await API.delete(`/tasks/${id}`);
  return response.data;
};

export default API;