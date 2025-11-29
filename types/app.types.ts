// Application State Types

export type ViewType = 'dashboard' | 'transactions' | 'budgets' | 'settings';

export interface DateRange {
  start: Date;
  end: Date;
}

export interface AppState {
  // UI State
  isMobileNavOpen: boolean;
  activeView: ViewType;
  selectedCategory: string | null;
  dateRange: DateRange;

  // Actions
  toggleMobileNav: () => void;
  setActiveView: (view: ViewType) => void;
  setSelectedCategory: (categoryId: string | null) => void;
  setDateRange: (range: DateRange) => void;
}

// Form Types
export interface TransactionFormData {
  amount: string;
  description: string;
  categoryId: string;
  date: string;
  type: 'expense' | 'income';
}

export interface BudgetFormData {
  categoryId: string;
  amount: string;
  period: 'weekly' | 'monthly' | 'yearly';
  startDate: string;
}

// UI Component Types
export type BudgetStatus = 'healthy' | 'warning' | 'exceeded';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface ToastConfig {
  title: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning';
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data: T | null;
}
