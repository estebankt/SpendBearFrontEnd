'use client';

import * as React from 'react';
import { differenceInDays, addMonths, addWeeks } from 'date-fns';
import { Pencil, Trash2, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProgressBar } from '@/components/ui/progress-bar';
import { CategoryBadge } from '@/components/features/categories/category-badge';
import type { Budget } from '@/types/api';
import { BudgetPeriod } from '@/types/api';
import { cn } from '@/lib/utils/cn';

export interface BudgetCardProps {
  budget: Budget;
  spent?: number; // Amount spent in this budget period
  onEdit?: (budget: Budget) => void;
  onDelete?: (budget: Budget) => void;
}

/**
 * Budget Card Component
 *
 * Features:
 * - Display budget name, spent/limit, progress bar
 * - Percentage indicator with color coding
 * - Days remaining in period
 * - Edit and delete actions
 */
export function BudgetCard({ budget, spent = 0, onEdit, onDelete }: BudgetCardProps) {
  const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

  const formattedSpent = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: budget.currency,
  }).format(spent);

  const formattedLimit = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: budget.currency,
  }).format(budget.amount);

  // Calculate days remaining in period
  const getDaysRemaining = () => {
    const startDate = new Date(budget.startDate);
    let endDate: Date;

    switch (budget.period) {
      case BudgetPeriod.Monthly:
        endDate = addMonths(startDate, 1);
        break;
      case BudgetPeriod.Weekly:
        endDate = addWeeks(startDate, 1);
        break;
      case BudgetPeriod.Custom:
        // For custom, we'll default to 30 days
        endDate = addMonths(startDate, 1);
        break;
      default:
        endDate = addMonths(startDate, 1);
    }

    const daysRemaining = differenceInDays(endDate, new Date());
    return Math.max(0, daysRemaining);
  };

  const daysRemaining = getDaysRemaining();

  // Determine progress bar variant based on percentage
  const getProgressVariant = (): 'success' | 'warning' | 'danger' => {
    if (percentage >= budget.warningThreshold) return 'danger';
    if (percentage >= budget.warningThreshold * 0.75) return 'warning';
    return 'success';
  };

  const getPeriodLabel = () => {
    switch (budget.period) {
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

  return (
    <Card className="p-5 hover:shadow-md transition-shadow group">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{budget.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{getPeriodLabel()}</span>
              {budget.category && (
                <>
                  <span className="text-xs text-muted-foreground">•</span>
                  <CategoryBadge
                    name={budget.category.name}
                    isSystemCategory={budget.category.isSystemCategory}
                    variant="compact"
                  />
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(budget)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(budget)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Spending Amount */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <div>
              <span className={cn(
                'text-2xl font-bold',
                percentage >= budget.warningThreshold ? 'text-destructive' : 'text-foreground'
              )}>
                {formattedSpent}
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                of {formattedLimit}
              </span>
            </div>
            <span className={cn(
              'text-sm font-medium',
              percentage >= budget.warningThreshold ? 'text-destructive' :
              percentage >= budget.warningThreshold * 0.75 ? 'text-warning' :
              'text-success'
            )}>
              {percentage.toFixed(0)}%
            </span>
          </div>

          {/* Progress Bar */}
          <ProgressBar
            value={percentage}
            max={100}
            variant={getProgressVariant()}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
          </span>
          <span>
            {budget.warningThreshold}% warning threshold
          </span>
        </div>

        {/* Alert if over budget */}
        {percentage >= 100 && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-destructive/10 text-destructive text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Budget exceeded!</span>
          </div>
        )}

        {/* Warning if approaching threshold */}
        {percentage >= budget.warningThreshold && percentage < 100 && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-warning/10 text-warning text-sm">
            <TrendingUp className="h-4 w-4" />
            <span>Approaching budget limit</span>
          </div>
        )}
      </div>
    </Card>
  );
}
