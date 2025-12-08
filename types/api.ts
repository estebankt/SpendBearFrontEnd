// API Type Definitions for SpendBear Backend

// ============================================
// Enums
// ============================================

export enum TransactionType {
  Income = 0,
  Expense = 1,
}

export enum BudgetPeriod {
  Monthly = 0,
  Weekly = 1,
  Custom = 2,
}

export enum NotificationStatus {
  Pending = 0,
  Read = 1,
  Dismissed = 2,
}

export enum NotificationType {
  BudgetWarning = 0,
  BudgetExceeded = 1,
  // Add more notification types as needed
}

// ============================================
// Core Entity Types
// ============================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  isSystemCategory: boolean;
  userId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  date: string; // ISO datetime
  description: string;
  categoryId: string;
  category?: Category;
  type: TransactionType;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  name: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string; // ISO datetime
  categoryId?: string;
  category?: Category;
  warningThreshold: number; // Percentage (0-100)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  status: NotificationStatus;
  relatedEntityId?: string; // Budget ID, Transaction ID, etc.
  createdAt: string;
  readAt?: string;
}

export interface MonthlySummary {
  periodStart: string; // Date
  periodEnd: string; // Date
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  spendingByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}

// ============================================
// Request Types
// ============================================

export interface RegisterUserRequest {
  email: string;
  firstName: string;
  lastName: string;
}

export interface CreateTransactionRequest {
  amount: number;
  currency: string;
  date: string; // ISO datetime
  description: string;
  categoryId: string;
  type: TransactionType;
}

export interface UpdateTransactionRequest {
  amount: number;
  currency: string;
  date: string; // ISO datetime
  description: string;
  categoryId: string;
  type: TransactionType;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface CreateBudgetRequest {
  name: string;
  amount: number;
  currency: string;
  period: BudgetPeriod;
  startDate: string; // ISO datetime
  categoryId?: string;
  warningThreshold?: number; // Default: 80
}

export interface UpdateBudgetRequest {
  name: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string; // ISO datetime
  categoryId?: string;
  warningThreshold: number;
}

// ============================================
// Query Filters
// ============================================

export interface TransactionFilters {
  startDate?: string; // ISO datetime
  endDate?: string; // ISO datetime
  categoryId?: string; // UUID
  type?: TransactionType;
  pageNumber?: number; // Default: 1
  pageSize?: number; // Default: 50, max: 100
}

export interface BudgetFilters {
  activeOnly?: boolean; // Default: false
  categoryId?: string; // UUID, null for global
  date?: string; // ISO datetime, filter budgets active on this date
}

export interface NotificationFilters {
  status?: NotificationStatus;
  type?: NotificationType;
  unreadOnly?: boolean; // Default: false
  pageNumber?: number; // Default: 1
  pageSize?: number; // Default: 50
}

// ============================================
// Paginated Response Wrapper
// ============================================

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// ============================================
// API Error Response
// ============================================

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>; // Validation errors
  traceId?: string;
}

// ============================================
// Utility Types
// ============================================

export type ApiResponse<T> = {
  data: T;
  success: true;
} | {
  error: ApiError;
  success: false;
};
