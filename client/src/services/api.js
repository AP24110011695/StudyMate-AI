import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: async (endpoint) => {
    const response = await axiosInstance.get(endpoint);
    return response.data;
  },
  post: async (endpoint, body) => {
    const response = await axiosInstance.post(endpoint, body);
    return response.data;
  },
  put: async (endpoint, body) => {
    const response = await axiosInstance.put(endpoint, body);
    return response.data;
  },
  delete: async (endpoint) => {
    const response = await axiosInstance.delete(endpoint);
    return response.data;
  },
  postFormData: async (endpoint, formData) => {
    const response = await axiosInstance.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
