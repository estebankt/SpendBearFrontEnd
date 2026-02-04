import apiClient from './client';
import type {
  ApiUser,
  ApiCategory,
  ApiTransaction,
  ApiBudget,
  ApiMonthlySummary,
  ApiNotification,
  PaginatedResponse,
  TransactionListParams,
  BudgetListParams,
  NotificationListParams,
} from './types';
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  CreateBudgetInput,
  UpdateBudgetInput,
  CreateCategoryInput,
  RegisterUserInput,
} from './schemas';

export const identityApi = {
  me: async (): Promise<ApiUser> => {
    console.log('[ENDPOINTS] identityApi.me called');
    const response = await apiClient.get('/identity/me');
    console.log('[ENDPOINTS] identityApi.me response status:', response.status);
    console.log('[ENDPOINTS] identityApi.me response data:', JSON.stringify(response.data).slice(0, 200));
    return response.data;
  },
  register: async (input: RegisterUserInput): Promise<void> => {
    await apiClient.post('/identity/register', input);
  },
};

export const transactionApi = {
  list: async (params?: TransactionListParams): Promise<PaginatedResponse<ApiTransaction>> => {
    console.log('[ENDPOINTS] transactionApi.list called with params:', params);
    const response = await apiClient.get('/transactions', { params });
    console.log('[ENDPOINTS] transactionApi.list response status:', response.status);
    console.log('[ENDPOINTS] transactionApi.list response data:', JSON.stringify(response.data).slice(0, 500));
    return response.data;
  },
  create: async (input: CreateTransactionInput): Promise<ApiTransaction> => {
    const { data } = await apiClient.post('/transactions', input);
    return data;
  },
  update: async (id: string, input: UpdateTransactionInput): Promise<void> => {
    await apiClient.put(`/transactions/${id}`, input);
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/transactions/${id}`);
  },
};

export const categoryApi = {
  list: async (): Promise<ApiCategory[]> => {
    console.log('[ENDPOINTS] categoryApi.list called');
    const response = await apiClient.get('/categories');
    console.log('[ENDPOINTS] categoryApi.list response status:', response.status);
    console.log('[ENDPOINTS] categoryApi.list response data:', JSON.stringify(response.data).slice(0, 500));
    return response.data;
  },
  create: async (input: CreateCategoryInput): Promise<ApiCategory> => {
    const { data } = await apiClient.post('/categories', input);
    return data;
  },
};

export const budgetApi = {
  list: async (params?: BudgetListParams): Promise<ApiBudget[]> => {
    console.log('[ENDPOINTS] budgetApi.list called with params:', params);
    const response = await apiClient.get('/budgets', { params });
    console.log('[ENDPOINTS] budgetApi.list response status:', response.status);
    console.log('[ENDPOINTS] budgetApi.list response data:', JSON.stringify(response.data).slice(0, 500));
    return response.data;
  },
  create: async (input: CreateBudgetInput): Promise<ApiBudget> => {
    const { data } = await apiClient.post('/budgets', input);
    return data;
  },
  update: async (id: string, input: UpdateBudgetInput): Promise<void> => {
    await apiClient.put(`/budgets/${id}`, input);
  },
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/budgets/${id}`);
  },
};

export const analyticsApi = {
  monthlySummary: async (year: number, month: number): Promise<ApiMonthlySummary> => {
    console.log('[ENDPOINTS] analyticsApi.monthlySummary called with:', { year, month });
    const response = await apiClient.get('/analytics/monthly', {
      params: { year, month },
    });
    console.log('[ENDPOINTS] analyticsApi.monthlySummary response status:', response.status);
    console.log('[ENDPOINTS] analyticsApi.monthlySummary response data:', JSON.stringify(response.data).slice(0, 500));
    return response.data;
  },
};

export const notificationApi = {
  list: async (params?: NotificationListParams): Promise<PaginatedResponse<ApiNotification>> => {
    const { data } = await apiClient.get('/notifications', { params });
    return data;
  },
  markRead: async (id: string): Promise<void> => {
    await apiClient.put(`/notifications/${id}/read`);
  },
};
