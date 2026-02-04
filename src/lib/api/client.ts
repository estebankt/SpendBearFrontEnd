import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/backend',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug interceptors
apiClient.interceptors.request.use((config) => {
  console.log(`[API CLIENT] Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`, config.params ?? '');
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API CLIENT] Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`[API CLIENT] Error:`, error.response?.status, error.response?.data, error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
