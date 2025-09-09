import axios from 'axios';
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { apiConfig } from '../config/api.config';

// Create axios instance
const api: AxiosInstance = axios.create(apiConfig);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    // Get token from Redux store via localStorage (Redux Persist stores it there)
    const persistData = localStorage.getItem('persist:root');
    if (persistData) {
      try {
        const parsed = JSON.parse(persistData);
        if (parsed.user) {
          const userState = JSON.parse(parsed.user);
          if (userState && userState.token) {
            config.headers.Authorization = `Bearer ${userState.token}`;
          }
        }
      } catch {
        // Fallback to direct localStorage if parsing fails
        const fallbackToken = localStorage.getItem('token');
        if (fallbackToken) {
          config.headers.Authorization = `Bearer ${fallbackToken}`;
        }
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // Clear Redux Persist storage
      localStorage.removeItem('persist:root');
      // Fallback: clear individual keys
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
