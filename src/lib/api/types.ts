/**
 * Backend API response types
 * These map directly to the backend API contracts
 */

// Paginated response wrapper
export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// Problem details error response (RFC 7807)
export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Identity
export interface ApiUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

// Categories
export interface ApiCategory {
  id: string;
  name: string;
  description?: string;
  isSystemCategory: boolean;
}

// Transactions
export interface ApiTransaction {
  id: string;
  amount: number;
  currency: string;
  date: string;
  description: string;
  categoryId: string;
  type: string; // "Income" | "Expense"
}

export interface TransactionListParams {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Budgets
export interface ApiBudget {
  id: string;
  name: string;
  amount: number;
  currency: string;
  period: string; // "Monthly" | "Weekly" | "Custom"
  startDate: string;
  endDate?: string;
  categoryId?: string | null;
  currentSpent: number;
  remainingAmount: number;
  percentageUsed: number;
  warningThreshold: number;
  isExceeded: boolean;
  warningTriggered: boolean;
}

export interface BudgetListParams {
  activeOnly?: boolean;
  categoryId?: string;
  date?: string;
}

// Analytics
export interface ApiMonthlySummary {
  periodStart: string;
  periodEnd: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  spendingByCategory: Record<string, number>;
  incomeByCategory: Record<string, number>;
}

// Notifications
export interface ApiNotification {
  id: string;
  type: number;
  status: number;
  title: string;
  message: string;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationListParams {
  status?: number;
  type?: number;
  unreadOnly?: boolean;
  pageNumber?: number;
  pageSize?: number;
}
