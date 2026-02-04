'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBudgetSchema, type CreateBudgetInput } from '@/lib/api/schemas';
import { useCreateBudget, useUpdateBudget } from '@/lib/hooks/use-budgets';
import { useCategories } from '@/lib/hooks/use-categories';
import type { ApiBudget } from '@/lib/api/types';

interface BudgetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: ApiBudget | null; // null = create, non-null = edit
}

export default function BudgetFormDialog({
  open,
  onOpenChange,
  budget,
}: BudgetFormDialogProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();

  const isEditing = !!budget;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateBudgetInput>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: {
      name: '',
      amount: 0,
      currency: 'USD',
      period: 'Monthly' as const,
      startDate: new Date().toISOString().slice(0, 10),
      categoryId: null,
      warningThreshold: 80,
    },
  });

  useEffect(() => {
    if (open && budget) {
      reset({
        name: budget.name,
        amount: budget.amount,
        currency: budget.currency,
        period: budget.period as 'Monthly' | 'Weekly' | 'Custom',
        startDate: budget.startDate.slice(0, 10),
        categoryId: budget.categoryId || null,
        warningThreshold: budget.warningThreshold,
      });
    } else if (open) {
      reset({
        name: '',
        amount: 0,
        currency: 'USD',
        period: 'Monthly' as const,
        startDate: new Date().toISOString().slice(0, 10),
        categoryId: null,
        warningThreshold: 80,
      });
    }
  }, [open, budget, reset]);

  const onSubmit = (data: CreateBudgetInput) => {
    const payload = {
      ...data,
      startDate: new Date(data.startDate).toISOString(),
      categoryId: data.categoryId || null,
    };

    if (isEditing) {
      updateMutation.mutate(
        {
          id: budget.id,
          input: {
            name: payload.name,
            amount: payload.amount,
            period: payload.period,
            startDate: payload.startDate,
            categoryId: payload.categoryId,
            warningThreshold: payload.warningThreshold,
          },
        },
        { onSuccess: () => onOpenChange(false) }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog */}
      <div className="relative glass-panel rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-main">
            {isEditing ? 'Edit Budget' : 'New Budget'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-surface-dark-highlight rounded transition-colors"
          >
            <span className="material-symbols-outlined text-text-muted">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Name</label>
            <input
              type="text"
              {...register('name')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Budget name"
            />
            {errors.name && (
              <p className="text-xs text-primary mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Amount</label>
            <input
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="text-xs text-primary mt-1">{errors.amount.message}</p>
            )}
          </div>

          {/* Category (optional) */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">
              Category <span className="text-text-muted/50">(optional — leave empty for global budget)</span>
            </label>
            <select
              {...register('categoryId')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Global (all categories)</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Period */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Period</label>
            <select
              {...register('period')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="Monthly">Monthly</option>
              <option value="Weekly">Weekly</option>
              <option value="Custom">Custom</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Start Date</label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.startDate && (
              <p className="text-xs text-primary mt-1">{errors.startDate.message}</p>
            )}
          </div>

          {/* Warning Threshold */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">
              Warning Threshold (%)
            </label>
            <input
              type="number"
              min={1}
              max={100}
              {...register('warningThreshold', { valueAsNumber: true })}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.warningThreshold && (
              <p className="text-xs text-primary mt-1">{errors.warningThreshold.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-4 py-2 bg-surface-dark-highlight text-text-main rounded-lg font-medium hover:bg-surface-dark transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
