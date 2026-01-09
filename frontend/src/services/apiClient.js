import axios from 'axios';

// Default to backend dev server if VITE_API_URL is not provided
const DEFAULT_BASE = 'http://localhost:5000/api';
const configuredBase = (import.meta.env && import.meta.env.VITE_API_URL) || DEFAULT_BASE;

const apiClient = axios.create({
  baseURL: configuredBase,
  withCredentials: true,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  // Prevent double "/api" when baseURL already ends with "/api" and path starts with "/api/..."
  const base = (config.baseURL || '').replace(/\/+$/, '');
  if (base.endsWith('/api') && typeof config.url === 'string' && config.url.startsWith('/api/')) {
    config.url = config.url.replace(/^\/api\//, '/');
  }

  const token = window.localStorage.getItem('iaac_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.localStorage.removeItem('iaac_token');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
