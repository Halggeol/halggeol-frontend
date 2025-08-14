import axios from 'axios';
import { getAccessToken } from './authUtil';

const api = axios.create({
  baseURL: 'https://54.175.115.255:8080/backend-1.0-SNAPSHOT/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

export default api;
