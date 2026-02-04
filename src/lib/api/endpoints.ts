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
    const { data } = await apiClient.get('/identity/me');
    return data;
  },
  register: async (input: RegisterUserInput): Promise<void> => {
    await apiClient.post('/identity/register', input);
  },
};

export const transactionApi = {
  list: async (params?: TransactionListParams): Promise<PaginatedResponse<ApiTransaction>> => {
    const { data } = await apiClient.get('/transactions', { params });
    return data;
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
    const { data } = await apiClient.get('/categories');
    return data;
  },
  create: async (input: CreateCategoryInput): Promise<ApiCategory> => {
    const { data } = await apiClient.post('/categories', input);
    return data;
  },
};

export const budgetApi = {
  list: async (params?: BudgetListParams): Promise<ApiBudget[]> => {
    const { data } = await apiClient.get('/budgets', { params });
    return data;
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
    const { data } = await apiClient.get('/analytics/monthly', {
      params: { year, month },
    });
    return data;
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
