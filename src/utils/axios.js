import axios from 'axios';
import { getAccessToken } from './authUtil';
import router from '@/router';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
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
    if (error.response) {
      const status = error.response.status;
      if (status == 401) {
        console.log('Unauthorized, redirecting to login...');
      }
      if (status >= 500 && status < 600) {
        console.error('Server Error:', error.response.data);
        router.push('/500'); // /500 페이지로 리다이렉트
      }
    }
    return Promise.reject(error);
  }
);

export default api;
