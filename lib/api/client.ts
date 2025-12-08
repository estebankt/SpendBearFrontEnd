import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types/api';

/**
 * Axios client instance for SpendBear API
 *
 * Features:
 * - Base URL from environment variable
 * - 10 second timeout
 * - Auth0 token injection via interceptors
 * - Error response handling
 * - Automatic 401 redirect to login
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5109',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============================================
// Request Interceptor - Add Auth Token
// ============================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Try to get the access token from Auth0
    // On client side, we'll fetch from /api/auth/token endpoint
    // On server side, we'll use getAccessToken from Auth0
    if (typeof window !== 'undefined') {
      try {
        const response = await fetch('/api/auth/token');
        if (response.ok) {
          const { accessToken } = await response.json();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
        }
      } catch (error) {
        console.error('Failed to fetch access token:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============================================
// Response Interceptor - Handle Errors
// ============================================

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access forbidden:', error.response.data);
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      console.error('Resource not found:', error.response.data);
    }

    // Handle 500 Internal Server Error
    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    // Transform error to ApiError format
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      errors: error.response?.data?.errors,
      traceId: error.response?.data?.traceId,
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
