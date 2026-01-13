import axios from 'axios';
import config from '../config';
import authService from './auth';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
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

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (username, password) => 
    api.post('/auth/login', { username, password }),
};

export const deviceAPI = {
  getAll: () => api.get('/devices'),
  getById: (id) => api.get(`/devices/${id}`),
  revoke: (id) => api.post(`/devices/${id}/revoke`),
  delete: (id) => api.delete(`/devices/${id}`),
};

export const locationAPI = {
  getRecent: (deviceId) => api.get(`/locations/${deviceId}/recent`),
  getWeekly: (deviceId) => api.get(`/locations/${deviceId}/weekly`),
};

export const auditAPI = {
  getLogs: (limit = 50) => api.get(`/audit/logs?limit=${limit}`),
};

export default api;