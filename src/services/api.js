import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Commodities
export const getAllCommodities = (params) => api.get('/commodities', { params });
export const getCommodityById = (id) => api.get(`/commodities/${id}`);
export const searchCommodities = (query) => api.get(`/commodities/search?q=${query}`);
export const getPriceHistory = (id, days) => api.get(`/commodities/${id}/history?days=${days}`);

// Categories
export const getCategories = () => api.get('/categories');

// Price Changes
export const getPriceChanges = (params) => api.get('/price-changes', { params });

// Upload
export const uploadPDF = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;