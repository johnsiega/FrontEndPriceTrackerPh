import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const registerUser = (userData) => api.post('/auth/register', userData);
export const forgotPassword = (email) => api.post('/auth/forgot-password', { email });
export const resetPassword = (token, newPassword) => api.post('/auth/reset-password', { token, newPassword });
export const verifyToken = () => api.get('/auth/verify');

// Commodities
export const getAllCommodities = (params) => api.get('/commodities', { params });
export const getCommodityById = (id) => api.get(`/commodities/${id}`);
export const searchCommodities = (query) => api.get(`/commodities/search?q=${query}`);
export const getPriceHistory = (id, days) => api.get(`/commodities/${id}/history?days=${days}`);

// Categories
export const getCategories = () => api.get('/categories');

// Price Changes
export const getPriceChanges = (params) => api.get('/price-changes', { params });

export default api;