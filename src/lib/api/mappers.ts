import type { ApiTransaction, ApiCategory, ApiBudget, ApiMonthlySummary } from './types';
import type { Transaction, CategoryBudget, MonthlyAnalytics, CategoryBreakdown } from '@/lib/types';
import { TransactionType, BudgetPeriod } from '@/lib/types';

// Category name → display config lookup
const CATEGORY_DISPLAY: Record<string, { icon: string; color: string }> = {
  'Groceries': { icon: 'shopping_cart', color: '#66D9EF' },
  'Dining Out': { icon: 'restaurant', color: '#F92672' },
  'Transportation': { icon: 'directions_car', color: '#E6DB74' },
  'Entertainment': { icon: 'movie', color: '#AE81FF' },
  'Shopping': { icon: 'shopping_bag', color: '#FD971F' },
  'Healthcare': { icon: 'local_hospital', color: '#A6E22E' },
  'Utilities': { icon: 'bolt', color: '#75715E' },
  'Salary': { icon: 'payments', color: '#A6E22E' },
  'Freelance': { icon: 'work', color: '#66D9EF' },
  'Rent': { icon: 'home', color: '#F92672' },
  'Subscriptions': { icon: 'subscriptions', color: '#AE81FF' },
  'Fitness': { icon: 'fitness_center', color: '#A6E22E' },
  'Travel': { icon: 'flight', color: '#66D9EF' },
  'Gifts': { icon: 'card_giftcard', color: '#F92672' },
  'Education': { icon: 'school', color: '#E6DB74' },
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
