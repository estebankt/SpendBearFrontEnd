import apiClient from './client';
import type {
  User,
  Transaction,
  Budget,
  Category,
  Notification,
  MonthlySummary,
  PaginatedResponse,
  RegisterUserRequest,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  CreateCategoryRequest,
  CreateBudgetRequest,
  UpdateBudgetRequest,
  TransactionFilters,
  BudgetFilters,
  NotificationFilters,
} from '@/types/api';

// ============================================
// Identity API
// ============================================

export const identityApi = {
  /**
   * Get current user profile
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/api/identity/me');
    return response.data;
  },

  /**
   * Register new user (call on first login)
   */
  register: async (data: RegisterUserRequest): Promise<void> => {
    await apiClient.post('/api/identity/register', data);
  },
};

// ============================================
// Transaction API
// ============================================

export const transactionApi = {
  /**
   * List transactions with optional filters and pagination
   */
  list: async (filters?: TransactionFilters): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<PaginatedResponse<Transaction>>(
      '/api/spending/transactions',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Create a new transaction
   */
  create: async (data: CreateTransactionRequest): Promise<Transaction> => {
    const response = await apiClient.post<Transaction>('/api/spending/transactions', data);
    return response.data;
  },

  /**
   * Update an existing transaction
   */
  update: async (id: string, data: UpdateTransactionRequest): Promise<void> => {
    await apiClient.put(`/api/spending/transactions/${id}`, data);
  },

  /**
   * Delete a transaction
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/spending/transactions/${id}`);
  },
};

// ============================================
// Category API
// ============================================

export const categoryApi = {
  /**
   * List all categories (system + user)
   */
  list: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/spending/categories');
    return response.data;
  },

  /**
   * Create a custom category
   */
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const response = await apiClient.post<Category>('/api/spending/categories', data);
    return response.data;
  },
};

// ============================================
// Budget API
// ============================================

export const budgetApi = {
  /**
   * List budgets with optional filters
   */
  list: async (filters?: BudgetFilters): Promise<Budget[]> => {
    const response = await apiClient.get<Budget[]>('/api/budgets', { params: filters });
    return response.data;
  },

  /**
   * Create a new budget
   */
  create: async (data: CreateBudgetRequest): Promise<Budget> => {
    const response = await apiClient.post<Budget>('/api/budgets', data);
    return response.data;
  },

  /**
   * Update an existing budget
   */
  update: async (id: string, data: UpdateBudgetRequest): Promise<void> => {
    await apiClient.put(`/api/budgets/${id}`, data);
  },

  /**
   * Delete a budget
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/budgets/${id}`);
  },
};

// ============================================
// Analytics API
// ============================================

export const analyticsApi = {
  /**
   * Get monthly financial summary
   */
  monthlySummary: async (year: number, month: number): Promise<MonthlySummary> => {
    const response = await apiClient.get<MonthlySummary>('/api/analytics/summary/monthly', {
      params: { year, month },
    });
    return response.data;
  },
};

// ============================================
// Notification API
// ============================================

export const notificationApi = {
  /**
   * List notifications with optional filters and pagination
   */
  list: async (filters?: NotificationFilters): Promise<PaginatedResponse<Notification>> => {
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      '/api/notifications',
      { params: filters }
    );
    return response.data;
  },

  /**
   * Mark a notification as read
   */
  markRead: async (id: string): Promise<void> => {
    await apiClient.put(`/api/notifications/${id}/read`);
  },
};
