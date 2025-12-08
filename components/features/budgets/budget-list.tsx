'use client';

import * as React from 'react';
import { BudgetCard } from './budget-card';
import { BudgetFormModal } from './budget-form-modal';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useBudgets, useDeleteBudget } from '@/lib/hooks/use-budgets';
import type { Budget, BudgetFilters } from '@/types/api';
import { Wallet } from 'lucide-react';

export interface BudgetListProps {
  filters?: BudgetFilters;
}

/**
 * Budget List Component
 *
 * Features:
 * - Grid layout of budget cards
 * - Edit and delete functionality
 * - Loading skeletons
 * - Empty state
 * - Responsive design
 */
export function BudgetList({ filters }: BudgetListProps) {
  const { data: budgets, isLoading } = useBudgets(filters);
  const deleteMutation = useDeleteBudget();

  const [editingBudget, setEditingBudget] = React.useState<Budget | null>(null);
  const [deletingBudget, setDeletingBudget] = React.useState<Budget | null>(null);

  // TODO: Fetch and calculate spent amounts from transactions
  // For now, we'll use 0 as a placeholder
  const getSpentAmount = (_budget: Budget): number => {
    // This will be implemented later to fetch transactions
    // and calculate spent amount for the budget period
    return 0;
  };

  const handleEdit = (budget: Budget) => {
    setEditingBudget(budget);
  };

  const handleDelete = (budget: Budget) => {
    setDeletingBudget(budget);
  };

  const confirmDelete = async () => {
    if (!deletingBudget) return;

    try {
      await deleteMutation.mutateAsync(deletingBudget.id);
      setDeletingBudget(null);
    } catch (error) {
      // Error is handled by mutation (toast notification)
      console.error('Delete budget error:', error);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-5 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  // Empty state
  if (!budgets || budgets.length === 0) {
    return (
      <EmptyState
        icon={Wallet}
        title="No budgets yet"
        description="Create your first budget to start tracking your spending limits"
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => (
          <BudgetCard
            key={budget.id}
            budget={budget}
            spent={getSpentAmount(budget)}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Edit Modal */}
      <BudgetFormModal
        open={!!editingBudget}
        onOpenChange={(open) => !open && setEditingBudget(null)}
        budget={editingBudget || undefined}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deletingBudget}
        onOpenChange={(open) => !open && setDeletingBudget(null)}
        onConfirm={confirmDelete}
        title="Delete Budget"
        description={`Are you sure you want to delete "${deletingBudget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </>
  );
}
