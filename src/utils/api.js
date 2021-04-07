import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL
});

// Alter defaults after instance has been created
api.interceptors.request.use(async (config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('app_token')}`;
  config.headers['Content-Type'] = 'application/json';
  return config;
});

export default api;
