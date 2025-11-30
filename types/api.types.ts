// API Response Types

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  createdAt: string;
  updatedAt: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  categoryId: string;
  category?: Category;
  date: string;
  type: 'expense' | 'income';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionInput {
  amount: number;
  currency: string;
  description: string;
  categoryId: string;
  date: string;
  type: 'expense' | 'income';
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {
  id: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: 'expense' | 'income';
  minAmount?: number;
  maxAmount?: number;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'expense' | 'income';
  userId?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

// Budget Types
export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  category?: Category;
  amount: number;
  currency: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate: string;
  spent: number;
  remaining: number;
  percentageUsed: number;
  status: 'healthy' | 'warning' | 'exceeded';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetInput {
  categoryId: string;
  amount: number;
  currency?: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
}

export interface UpdateBudgetInput extends Partial<CreateBudgetInput> {
  id: string;
}

// Dashboard Types
export interface DashboardStats {
  currentMonthSpending: number;
  previousMonthSpending: number;
  spendingChange: number;
  budgetUtilization: number;
  transactionCount: number;
  topCategories: Array<{
    category: Category;
    amount: number;
    percentage: number;
  }>;
}

export interface SpendingTrend {
  date: string;
  amount: number;
  category?: string;
}
