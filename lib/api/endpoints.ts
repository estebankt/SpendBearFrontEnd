import apiClient from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
  Category,
  DashboardStats,
  SpendingTrend,
} from '@/types/api.types';

// Transactions API
export const transactionsApi = {
  getAll: (filters?: TransactionFilters) =>
    apiClient.get<PaginatedResponse<Transaction>>('/transactions', { params: filters }),

  getById: (id: string) => apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`),

  create: (data: CreateTransactionInput) =>
    apiClient.post<ApiResponse<Transaction>>('/transactions', data),

  update: ({ id, ...data }: UpdateTransactionInput) =>
    apiClient.patch<ApiResponse<Transaction>>(`/transactions/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/transactions/${id}`),
};

// Budgets API
export const budgetsApi = {
  getAll: () => apiClient.get<ApiResponse<Budget[]>>('/budgets'),

  getById: (id: string) => apiClient.get<ApiResponse<Budget>>(`/budgets/${id}`),

  create: (data: CreateBudgetInput) => apiClient.post<ApiResponse<Budget>>('/budgets', data),

  update: ({ id, ...data }: UpdateBudgetInput) =>
    apiClient.patch<ApiResponse<Budget>>(`/budgets/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/budgets/${id}`),

  getStatus: (id: string) => apiClient.get<ApiResponse<Budget>>(`/budgets/${id}/status`),
};

// Categories API
export const categoriesApi = {
  getAll: () => apiClient.get<ApiResponse<Category[]>>('/categories'),

  getById: (id: string) => apiClient.get<ApiResponse<Category>>(`/categories/${id}`),

  create: (data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Category>>('/categories', data),

  update: (id: string, data: Partial<Category>) =>
    apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, data),

  delete: (id: string) => apiClient.delete<ApiResponse<void>>(`/categories/${id}`),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats'),

  getSpendingTrends: (period: 'week' | 'month' | 'year') =>
    apiClient.get<ApiResponse<SpendingTrend[]>>('/dashboard/trends', { params: { period } }),
};

// User API
export const userApi = {
  getProfile: () => apiClient.get<ApiResponse<{ email: string; name: string }>>('/user/profile'),

  updateProfile: (data: { name?: string }) =>
    apiClient.patch<ApiResponse<{ email: string; name: string }>>('/user/profile', data),
};
