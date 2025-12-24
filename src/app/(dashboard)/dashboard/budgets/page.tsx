'use client';

import { useState } from 'react';
import { CATEGORY_BUDGETS, MONTHLY_ANALYTICS } from '@/lib/constants';
import BudgetSummaryCards from '@/components/dashboard/budgets/BudgetSummaryCards';
import SpendingTrendChart from '@/components/dashboard/budgets/SpendingTrendChart';
import CategoryBudgetList from '@/components/dashboard/budgets/CategoryBudgetList';

export default function BudgetsPage() {
  // Month selector (hardcoded for now since we're using mock data)
  const [currentMonth] = useState('January 2024');

  // Calculate summary values
  const totalBudgeted = CATEGORY_BUDGETS.reduce((sum, b) => sum + b.budgeted, 0);
  const totalSpent = CATEGORY_BUDGETS.reduce((sum, b) => sum + b.spent, 0);
  const leftToSpend = totalBudgeted - totalSpent;

  // Days calculation (mock data for January 2024)
  const today = new Date();
  const currentDay = today.getDate();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysRemaining = daysInMonth - currentDay;

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
            <button className="text-text-muted hover:text-text-main transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <span className="text-sm font-medium text-text-main min-w-[120px] text-center">
              {currentMonth}
            </span>
            <button className="text-text-muted hover:text-text-main transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>

          {/* Add Category Button */}
          <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">add</span>
            Add Category
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <BudgetSummaryCards
        leftToSpend={leftToSpend}
        totalBudgeted={totalBudgeted}
        daysRemaining={daysRemaining}
        totalDaysInMonth={daysInMonth}
      />

      {/* Spending Trend Chart */}
      <SpendingTrendChart data={MONTHLY_ANALYTICS.spendingTrend} />

      {/* Category Budget List */}
      <CategoryBudgetList budgets={CATEGORY_BUDGETS} />
    </div>
  );
}
