'use client';

import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTransactionSchema, type CreateTransactionInput } from '@/lib/api/schemas';
import { useCreateTransaction, useUpdateTransaction } from '@/lib/hooks/use-transactions';
import { useCategories } from '@/lib/hooks/use-categories';
import type { ApiTransaction } from '@/lib/api/types';

const EMPTY_DEFAULTS: CreateTransactionInput = {
  amount: 0,
  currency: 'USD',
  date: '',
  description: '',
  categoryId: '',
  type: 'Expense',
};

interface TransactionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: ApiTransaction | null; // null = create, non-null = edit
}

export default function TransactionFormDialog({
  open,
  onOpenChange,
  transaction,
}: TransactionFormDialogProps) {
  const { data: categories = [] } = useCategories();
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const isEditing = !!transaction;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTransactionInput>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: EMPTY_DEFAULTS,
  });

  // Reset form when dialog opens/closes or transaction changes.
  // `reset` is intentionally omitted from deps — it's a stable RHF reference.
  // Including it caused the effect to re-fire on every render (because
  // the inline defaultValues object changed identity each render), which reset
  // the form while the user was filling it out.
  const resetRef = useRef(reset);
  resetRef.current = reset;

  useEffect(() => {
    if (!open) return;
    if (transaction) {
      resetRef.current({
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date.slice(0, 16),
        description: transaction.description,
        categoryId: transaction.categoryId,
        type: transaction.type as 'Income' | 'Expense',
      });
    } else {
      resetRef.current({
        ...EMPTY_DEFAULTS,
        date: new Date().toISOString().slice(0, 16),
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, transaction]);

  const onSubmit = (data: CreateTransactionInput) => {
    // Ensure date is in ISO format
    const payload = {
      ...data,
      date: new Date(data.date).toISOString(),
    };

    if (isEditing) {
      updateMutation.mutate(
        { id: transaction.id, input: payload },
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
            {isEditing ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 hover:bg-surface-dark-highlight rounded transition-colors"
          >
            <span className="material-symbols-outlined text-text-muted">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Type Toggle */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Type</label>
            <div className="flex gap-2">
              <label className="flex-1">
                <input type="radio" value="Expense" {...register('type')} className="sr-only peer" />
                <div className="px-4 py-2 rounded-lg text-sm font-medium text-center cursor-pointer transition-colors bg-surface-dark-highlight text-text-muted peer-checked:bg-primary peer-checked:text-white">
                  Expense
                </div>
              </label>
              <label className="flex-1">
                <input type="radio" value="Income" {...register('type')} className="sr-only peer" />
                <div className="px-4 py-2 rounded-lg text-sm font-medium text-center cursor-pointer transition-colors bg-surface-dark-highlight text-text-muted peer-checked:bg-accent-green peer-checked:text-white">
                  Income
                </div>
              </label>
            </div>
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

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Description</label>
            <input
              type="text"
              {...register('description')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="What was this for?"
            />
            {errors.description && (
              <p className="text-xs text-primary mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Category</label>
            <select
              {...register('categoryId')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-primary mt-1">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="text-xs font-medium text-text-muted mb-1 block">Date</label>
            <input
              type="datetime-local"
              {...register('date')}
              className="w-full bg-surface-dark-highlight rounded-lg px-4 py-2 text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {errors.date && (
              <p className="text-xs text-primary mt-1">{errors.date.message}</p>
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
