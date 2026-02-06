import type { ApiTransaction, ApiCategory, ApiBudget, ApiMonthlySummary } from './types';
import type { Transaction, CategoryBudget, MonthlyAnalytics, CategoryBreakdown } from '@/lib/types';
import { TransactionType, BudgetPeriod } from '@/lib/types';

// Category name → display config lookup
const CATEGORY_DISPLAY: Record<string, { icon: string; color: string }> = {
  // Food & Drink (Pink)
  'Groceries': { icon: 'shopping_cart', color: '#f92472' },
  'Dining Out': { icon: 'restaurant', color: '#f92472' },
  'Fast Food': { icon: 'fastfood', color: '#f92472' },
  'Coffee/Tea': { icon: 'coffee', color: '#f92472' },
  'Alcohol/Bars': { icon: 'wine_bar', color: '#f92472' },

  // Transportation & Travel (Blue)
  'Gas/Fuel': { icon: 'local_gas_station', color: '#66d9ef' },
  'Public Transit': { icon: 'directions_bus', color: '#66d9ef' },
  'Rideshare/Taxi': { icon: 'local_taxi', color: '#66d9ef' },
  'Parking': { icon: 'local_parking', color: '#66d9ef' },
  'Vehicle Maintenance': { icon: 'car_repair', color: '#66d9ef' },
  'Travel': { icon: 'flight', color: '#66d9ef' },

  // Housing & Utilities (Yellow)
  'Rent/Mortgage': { icon: 'home', color: '#e6db74' },
  'Utilities': { icon: 'bolt', color: '#e6db74' },
  'Internet/Phone': { icon: 'wifi', color: '#e6db74' },
  'Insurance': { icon: 'security', color: '#e6db74' },
  'Home Goods': { icon: 'chair', color: '#e6db74' },
  'Home Office': { icon: 'desk', color: '#e6db74' },
  'Education': { icon: 'school', color: '#e6db74' },

  // Lifestyle, Shopping & Entertainment (Purple)
  'Entertainment': { icon: 'movie', color: '#AE81FF' },
  'Subscriptions': { icon: 'autorenew', color: '#AE81FF' },
  'Electronics': { icon: 'devices', color: '#AE81FF' },
  'Clothing': { icon: 'checkroom', color: '#AE81FF' },
  'Hobbies': { icon: 'palette', color: '#AE81FF' },
  'Gifts/Donations': { icon: 'volunteer_activism', color: '#AE81FF' },

  // Health & Care (Orange)
  'Healthcare': { icon: 'medical_services', color: '#FD971F' },
  'Personal Care': { icon: 'face', color: '#FD971F' },
  'Fitness': { icon: 'fitness_center', color: '#FD971F' },
  'Pet Care': { icon: 'pets', color: '#FD971F' },

  // Income (Green)
  'Salary': { icon: 'payments', color: '#a6e22e' },
  'Side Hustle Income': { icon: 'monetization_on', color: '#a6e22e' },
  'Freelance Work': { icon: 'work', color: '#a6e22e' },
};

const DEFAULT_DISPLAY = { icon: 'category', color: '#75715E' };

function getCategoryDisplay(categoryName: string) {
  return CATEGORY_DISPLAY[categoryName] || DEFAULT_DISPLAY;
}

export function mapTransaction(
  t: ApiTransaction,
  categories: ApiCategory[]
): Transaction {
  const category = categories.find((c) => c.id === t.categoryId);
  const categoryName = category?.name || 'Unknown';
  const display = getCategoryDisplay(categoryName);

  return {
    id: t.id,
    merchant: t.description,
    icon: display.icon,
    iconColor: display.color,
    category: categoryName,
    categoryId: t.categoryId,
    date: t.date,
    amount: t.amount,
    type: t.type as TransactionType,
    description: t.description,
    currency: t.currency,
  };
}

export function mapBudget(
  b: ApiBudget,
  categories: ApiCategory[]
): CategoryBudget {
  const category = categories.find((c) => c.id === b.categoryId);
  const categoryName = b.categoryId ? (category?.name || 'Unknown') : 'All Categories';
  const display = b.categoryId ? getCategoryDisplay(categoryName) : { icon: 'account_balance_wallet', color: '#F92672' };
  const spent = b.currentSpent ?? 0;
  const remaining = b.remainingAmount ?? (b.amount - spent);
  const percentageUsed = b.percentageUsed ?? (b.amount > 0 ? (spent / b.amount) * 100 : 0);

  return {
    id: b.id,
    category: categoryName,
    categoryId: b.categoryId || 'global',
    icon: display.icon,
    color: display.color,
    budgeted: b.amount,
    spent,
    remaining,
    percentageUsed,
    period: b.period as BudgetPeriod,
    warningThreshold: b.warningThreshold,
    isOverBudget: b.isExceeded ?? percentageUsed > 100,
    isNearLimit: b.warningTriggered ?? percentageUsed >= b.warningThreshold,
  };
}

export function mapMonthlySummary(
  s: ApiMonthlySummary,
  categories: ApiCategory[]
): MonthlyAnalytics {
  const totalSpending = s.totalExpense;
  const entries = Object.entries(s.spendingByCategory);

  const categoryBreakdown: CategoryBreakdown[] = entries
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId);
      const categoryName = category?.name || 'Unknown';
      const display = getCategoryDisplay(categoryName);
      return {
        category: categoryName,
        categoryId,
        amount,
        percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0,
        color: display.color,
        icon: display.icon,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const topCategories = categoryBreakdown.slice(0, 5);

  return {
    periodStart: s.periodStart,
    periodEnd: s.periodEnd,
    totalSpending: s.totalExpense,
    totalIncome: s.totalIncome,
    netSavings: s.netBalance,
    budgetAdherence: 0, // Not available from backend — would need budget data
    categoryBreakdown,
    topCategories,
    spendingTrend: [], // Not available from monthly summary endpoint
  };
}
