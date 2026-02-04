import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/backend',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
