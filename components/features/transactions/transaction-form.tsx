'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema, type TransactionFormData } from '@/lib/utils/validators';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CurrencyInput } from '@/components/ui/currency-input';
import { DatePicker } from '@/components/ui/date-picker';
import { CategorySelect } from '@/components/features/categories/category-select';
import { TransactionType, type Transaction } from '@/types/api';
import { useCreateTransaction, useUpdateTransaction } from '@/lib/hooks/use-transactions';
import { Loader2 } from 'lucide-react';

export interface TransactionFormProps {
  transaction?: Transaction;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Transaction Form Component
 *
 * Features:
 * - Create or edit transactions
 * - React Hook Form with Zod validation
 * - Currency input, date picker, category select
 * - Income/Expense type toggle
 * - Loading states
 */
export function TransactionForm({ transaction, onSuccess, onCancel }: TransactionFormProps) {
  const isEditing = !!transaction;

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction
      ? {
          amount: transaction.amount,
          currency: transaction.currency,
          date: new Date(transaction.date),
          description: transaction.description,
          categoryId: transaction.categoryId,
          type: transaction.type,
        }
      : {
          amount: 0,
          currency: 'USD',
          date: new Date(),
          description: '',
          categoryId: '',
          type: TransactionType.Expense,
        },
  });

  const onSubmit = async (data: TransactionFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: transaction.id,
          data: {
            ...data,
            date: data.date.toISOString(),
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          date: data.date.toISOString(),
        });
      }

      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation (toast notification)
      console.error('Transaction form error:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Toggle */}
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={field.value === TransactionType.Expense ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => field.onChange(TransactionType.Expense)}
                  >
                    Expense
                  </Button>
                  <Button
                    type="button"
                    variant={field.value === TransactionType.Income ? 'default' : 'outline'}
                    className="flex-1"
                    onClick={() => field.onChange(TransactionType.Income)}
                  >
                    Income
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amount */}
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  currency="USD"
                  placeholder="$0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategorySelect value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date */}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  maxDate={new Date()}
                />
              </FormControl>
              <FormDescription>When did this transaction occur?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Coffee at Starbucks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Update' : 'Create'} Transaction
          </Button>
        </div>
      </form>
    </Form>
  );
}
