import axios from 'axios';
import { auth } from '../config/firebase';

// Create an Axios instance
const api = axios.create({
  baseURL: '/api',
});

// Attach token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
