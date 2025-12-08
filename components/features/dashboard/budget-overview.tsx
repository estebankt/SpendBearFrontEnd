'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useActiveBudgets } from '@/lib/hooks/use-budgets';
import { ArrowRight, Wallet } from 'lucide-react';
import { BudgetPeriod } from '@/types/api';

/**
 * Budget Overview Widget
 *
 * Features:
 * - Shows top 3 active budgets
 * - Compact display with progress bars
 * - "View All" link to budgets page
 * - Loading skeleton
 * - Empty state
 */
export function BudgetOverview() {
  const { data: budgets, isLoading } = useActiveBudgets();

  // Get top 3 budgets
  const topBudgets = budgets?.slice(0, 3) || [];

  // Loading state
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-9 w-24" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Empty state
  if (!budgets || budgets.length === 0) {
    return (
      <Card className="p-6">
        <EmptyState
          icon={Wallet}
          title="No budgets"
          description="Create your first budget to track spending limits"
          action={{
            label: 'Create Budget',
            onClick: () => {
              window.location.href = '/budgets';
            },
          }}
        />
      </Card>
    );
  }

  const getPeriodLabel = (period: BudgetPeriod) => {
    switch (period) {
      case BudgetPeriod.Monthly:
        return 'Monthly';
      case BudgetPeriod.Weekly:
        return 'Weekly';
      case BudgetPeriod.Custom:
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  const getProgressVariant = (percentage: number, threshold: number): 'success' | 'warning' | 'danger' => {
    if (percentage >= threshold) return 'danger';
    if (percentage >= threshold * 0.75) return 'warning';
    return 'success';
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Active Budgets</h3>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/budgets">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Budget List */}
        <div className="space-y-4">
          {topBudgets.map((budget) => {
            // TODO: Calculate actual spent amount from transactions
            const spent = 0;
            const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

            const formattedSpent = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: budget.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(spent);

            const formattedLimit = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: budget.currency,
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(budget.amount);

            return (
              <div key={budget.id} className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{budget.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getPeriodLabel(budget.period)}
                      {budget.category && ` • ${budget.category.name}`}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-medium">
                      {formattedSpent} / {formattedLimit}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}%
                    </p>
                  </div>
                </div>
                <ProgressBar
                  value={percentage}
                  max={100}
                  variant={getProgressVariant(percentage, budget.warningThreshold)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
