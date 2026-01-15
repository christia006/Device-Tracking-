import axios from 'axios';
import config from '../config';
import authService from './auth';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// =====================================
// Auth API
// =====================================
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
};

// =====================================
// Device API
// =====================================
export const deviceAPI = {
  getAll: () => api.get('/devices'),
  
  getById: (id) => api.get(`/devices/${id}`),
  
  revoke: (id) => api.post(`/devices/${id}/revoke`),
  
  delete: (id) => api.delete(`/devices/${id}`),
};

// =====================================
// Location API
// =====================================
export const locationAPI = {
  getRecent: (deviceId) => api.get(`/locations/${deviceId}/recent`),
  
  getWeekly: (deviceId) => api.get(`/locations/${deviceId}/weekly`),
};

// =====================================
// Audit API
// =====================================
export const auditAPI = {
  getLogs: (limit = 50) => api.get(`/audit/logs?limit=${limit}`),
};

export default api;
