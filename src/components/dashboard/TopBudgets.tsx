'use client';

import Card from '@/components/ui/Card';
import { formatCurrency } from '@/lib/utils';
import { useBudgets } from '@/lib/hooks/use-budgets';
import { useCategories } from '@/lib/hooks/use-categories';
import { mapBudget } from '@/lib/api/mappers';
import { useMemo } from 'react';

export default function TopBudgets() {
  const { data: budgetsData = [], isLoading, error } = useBudgets({ activeOnly: true });
  const { data: categories = [], error: catError } = useCategories();

  const budgets = useMemo(() => {
    return budgetsData
      .map((b) => mapBudget(b, categories))
      .sort((a, b) => b.percentageUsed - a.percentageUsed)
      .slice(0, 3);
  }, [budgetsData, categories]);

  return (
    <Card className="animate-enter delay-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-main">Top Budgets</h3>
          <p className="text-sm text-text-muted">This month&apos;s progress</p>
        </div>
        <a href="/dashboard/budgets" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
          View All →
        </a>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-surface-dark-highlight rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-surface-dark-highlight rounded w-1/3 mb-1" />
                  <div className="h-3 bg-surface-dark-highlight rounded w-1/4" />
                </div>
              </div>
              <div className="h-2 bg-surface-dark-highlight rounded-full" />
            </div>
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-8">No budgets set</p>
      ) : (
        <div className="space-y-4">
          {budgets.map((budget) => {
            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: budget.color + '20' }}
                    >
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ color: budget.color }}
                      >
                        {budget.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-main">{budget.category}</p>
                      <p className="text-xs text-text-muted">
                        {formatCurrency(budget.spent)} / {formatCurrency(budget.budgeted)}
                      </p>
                    </div>
                  </div>
                  {budget.isNearLimit && (
                    <span className="px-2 py-1 rounded text-xs font-bold bg-primary/10 text-primary">
                      {budget.isOverBudget ? 'Over' : 'Near Limit'}
                    </span>
                  )}
                </div>
                <div className="h-2 bg-surface-dark-highlight rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      budget.isOverBudget ? 'bg-primary' : budget.isNearLimit ? 'bg-accent-yellow' : 'bg-accent-green'
                    }`}
                    style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
