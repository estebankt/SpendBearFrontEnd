'use client';

import { useState, useMemo } from 'react';
import { useBudgets } from '@/lib/hooks/use-budgets';
import { useCategories } from '@/lib/hooks/use-categories';
import { useMonthlyAnalytics } from '@/lib/hooks/use-analytics';
import { mapBudget } from '@/lib/api/mappers';
import BudgetSummaryCards from '@/components/dashboard/budgets/BudgetSummaryCards';
import SpendingTrendChart from '@/components/dashboard/budgets/SpendingTrendChart';
import CategoryBudgetList from '@/components/dashboard/budgets/CategoryBudgetList';
import BudgetFormDialog from '@/components/dashboard/budgets/BudgetFormDialog';
import type { ApiBudget } from '@/lib/api/types';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function BudgetsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<ApiBudget | null>(null);

  const { data: budgetsData = [], isLoading, isError } = useBudgets({ activeOnly: true });
  const { data: categories = [] } = useCategories();
  const { data: analyticsData } = useMonthlyAnalytics(year, month);

  const mappedBudgets = useMemo(() => {
    return budgetsData.map((b) => mapBudget(b, categories));
  }, [budgetsData, categories]);

  const totalBudgeted = mappedBudgets.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = mappedBudgets.reduce((sum, b) => sum + b.spent, 0);
  const leftToSpend = totalBudgeted - totalSpent;

  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysRemaining = daysInMonth - currentDay;

  const currentMonthLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  const handlePrevMonth = () => {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const handleNextMonth = () => {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Spending trend from analytics (if available), otherwise show empty
  const spendingTrend = analyticsData
    ? [] // No direct spending trend from backend
    : [];

  return (
    <div className="max-w-7xl">
      {/* Page Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-main mb-2">Budgets</h1>
          <p className="text-text-muted">Manage your monthly budgets and spending</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Month Selector */}
          <div className="flex items-center gap-2 bg-surface-dark-highlight rounded-lg px-4 py-2">
            <button onClick={handlePrevMonth} className="text-text-muted hover:text-text-main transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm font-medium text-text-main min-w-[120px] text-center">
              {currentMonthLabel}
            </span>
            <button onClick={handleNextMonth} className="text-text-muted hover:text-text-main transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Add Budget Button */}
          <button
            onClick={() => { setEditingBudget(null); setFormOpen(true); }}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Add Budget
          </button>
        </div>
      </div>

      {/* Loading/Error */}
      {isLoading && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-text-muted">Loading budgets...</p>
        </div>
      )}

      {isError && (
        <div className="glass-panel rounded-lg p-12 text-center">
          <span className="material-symbols-outlined text-4xl text-primary mb-4 block">error</span>
          <p className="text-sm text-text-muted">Failed to load budgets</p>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          {/* Summary Cards */}
          <BudgetSummaryCards
            leftToSpend={leftToSpend}
            totalBudgeted={totalBudgeted}
            daysRemaining={daysRemaining}
            totalDaysInMonth={daysInMonth}
          />

          {/* Spending Trend Chart - only show if we have data */}
          {spendingTrend.length > 0 && (
            <SpendingTrendChart data={spendingTrend} />
          )}

          {/* Category Budget List */}
          <CategoryBudgetList
            budgets={mappedBudgets}
            onEdit={(budget) => {
              const raw = budgetsData.find((b) => b.id === budget.id);
              if (raw) { setEditingBudget(raw); setFormOpen(true); }
            }}
          />
        </>
      )}

      {/* Budget Form Dialog */}
      <BudgetFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        budget={editingBudget}
      />
    </div>
  );
}
