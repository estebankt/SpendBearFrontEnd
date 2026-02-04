/**
 * Core data type definitions for SpendBear Frontend
 * These types align with the backend API but serve mock data for now
 */

// Transaction Types
export enum TransactionType {
  Income = 'Income',
  Expense = 'Expense',
}

export interface Transaction {
  id: string;
  merchant: string;
  icon: string;
  iconColor: string;
  category: string;
  categoryId: string;
  date: string; // ISO date string
  amount: number;
  type: TransactionType;
  description?: string;
  currency: string;
}

// Budget Types
export enum BudgetPeriod {
  Monthly = 'Monthly',
  Weekly = 'Weekly',
  Custom = 'Custom',
}

export interface CategoryBudget {
  id: string;
  category: string;
  categoryId: string;
  icon: string;
  color: string;
  budgeted: number;
  spent: number;
  remaining: number;
  percentageUsed: number;
  period: BudgetPeriod;
  warningThreshold: number; // percentage
  isOverBudget: boolean;
  isNearLimit: boolean; // >= warningThreshold
}

// Analytics Types
export interface CategoryBreakdown {
  category: string;
  categoryId: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

export interface MonthlyAnalytics {
  periodStart: string; // ISO date
  periodEnd: string; // ISO date
  totalSpending: number;
  totalIncome: number;
  netSavings: number;
  budgetAdherence: number; // percentage (0-100)
  categoryBreakdown: CategoryBreakdown[];
  topCategories: CategoryBreakdown[]; // top 5 by spending
  spendingTrend: {
    week: number;
    actual: number;
    projected: number;
  }[];
}

// Transaction Filter Types
export interface TransactionFilters {
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType | 'all';
}

// Notification Types (for future use)
export enum NotificationStatus {
  Pending = 0,
  Read = 1,
  Dismissed = 2,
}

export enum NotificationType {
  BudgetWarning = 0,
  BudgetExceeded = 1,
  LargeTransaction = 2,
  MonthlyReport = 3,
}

export interface Notification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  createdAt: string;
  actionUrl?: string;
}

// User Profile Type
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  currency: string;
}
