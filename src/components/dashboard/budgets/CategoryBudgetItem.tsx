'use client';

import { CategoryBudget } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useDeleteBudget } from '@/lib/hooks/use-budgets';

interface CategoryBudgetItemProps {
  budget: CategoryBudget;
  onEdit?: (budget: CategoryBudget) => void;
}

export default function CategoryBudgetItem({ budget, onEdit }: CategoryBudgetItemProps) {
  const deleteMutation = useDeleteBudget();

  const {
    category,
    icon,
    color,
    spent,
    budgeted,
    remaining,
    percentageUsed,
    isOverBudget,
    isNearLimit,
  } = budget;

  const handleDelete = () => {
    if (confirm('Delete this budget?')) {
      deleteMutation.mutate(budget.id);
    }
  };

  return (
    <div className="p-4 border-b border-border-muted last:border-b-0 hover:bg-surface-dark-highlight/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: color + '20' }}
          >
            <span className="material-symbols-outlined text-xl" style={{ color }}>
              {icon}
            </span>
          </div>

          {/* Category Name */}
          <div>
            <h4 className="text-sm font-semibold text-text-main">{category}</h4>
            <p className="text-xs text-text-muted">
              {formatCurrency(spent)} of {formatCurrency(budgeted)}
            </p>
          </div>
        </div>

        {/* Warning & Actions */}
        <div className="flex items-center gap-3">
          {isOverBudget && (
            <span className="material-symbols-outlined text-primary text-xl" title="Over budget">
              error
            </span>
          )}
          {isNearLimit && !isOverBudget && (
            <span className="material-symbols-outlined text-accent-yellow text-xl" title="Near limit">
              warning
            </span>
          )}

          {/* Action Buttons */}
          <div className="flex gap-1">
            <button
              onClick={() => onEdit?.(budget)}
              className="p-1 hover:bg-surface-dark-highlight rounded transition-colors"
              title="Edit budget"
            >
              <span className="material-symbols-outlined text-text-muted text-lg">
                edit
              </span>
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="p-1 hover:bg-surface-dark-highlight rounded transition-colors disabled:opacity-50"
              title="Delete budget"
            >
              <span className="material-symbols-outlined text-text-muted text-lg">
                delete
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-surface-dark-highlight rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              isOverBudget
                ? 'bg-primary'
                : isNearLimit
                ? 'bg-accent-yellow'
                : 'bg-accent-green'
            }`}
            style={{ width: `${Math.min(percentageUsed, 100)}%` }}
          />
        </div>

        {/* Percentage Label */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-text-muted">{remaining >= 0 ? 'Remaining' : 'Over'}</span>
          <span
            className={`text-xs font-semibold ${
              isOverBudget ? 'text-primary' : isNearLimit ? 'text-accent-yellow' : 'text-accent-green'
            }`}
          >
            {remaining >= 0 ? formatCurrency(remaining) : formatCurrency(Math.abs(remaining))} ({Math.round(percentageUsed)}%)
          </span>
        </div>
      </div>
    </div>
  );
}
