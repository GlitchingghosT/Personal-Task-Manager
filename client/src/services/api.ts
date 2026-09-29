import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050';

const API = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default API;