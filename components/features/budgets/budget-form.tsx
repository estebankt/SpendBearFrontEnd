'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { budgetSchema, type BudgetFormData } from '@/lib/utils/validators';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { BudgetPeriod, type Budget } from '@/types/api';
import { useCreateBudget, useUpdateBudget } from '@/lib/hooks/use-budgets';
import { Loader2 } from 'lucide-react';

export interface BudgetFormProps {
  budget?: Budget;
  onSuccess?: () => void;
  onCancel?: () => void;
}

/**
 * Budget Form Component
 *
 * Features:
 * - Create or edit budgets
 * - React Hook Form with Zod validation
 * - Period selection (Monthly, Weekly, Custom)
 * - Optional category-specific budgets
 * - Warning threshold slider
 * - Loading states
 */
export function BudgetForm({ budget, onSuccess, onCancel }: BudgetFormProps) {
  const isEditing = !!budget;

  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();

  const form = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: budget
      ? {
          name: budget.name,
          amount: budget.amount,
          currency: budget.currency,
          period: budget.period,
          startDate: new Date(budget.startDate),
          categoryId: budget.categoryId || undefined,
          warningThreshold: budget.warningThreshold,
        }
      : {
          name: '',
          amount: 0,
          currency: 'USD',
          period: BudgetPeriod.Monthly,
          startDate: new Date(),
          categoryId: undefined,
          warningThreshold: 80,
        },
  });

  const onSubmit = async (data: BudgetFormData) => {
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: budget.id,
          data: {
            ...data,
            startDate: data.startDate.toISOString(),
            categoryId: data.categoryId || undefined,
          },
        });
      } else {
        await createMutation.mutateAsync({
          ...data,
          startDate: data.startDate.toISOString(),
          categoryId: data.categoryId || undefined,
        });
      }

      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation (toast notification)
      console.error('Budget form error:', error);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;
  const warningThreshold = form.watch('warningThreshold');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Name</FormLabel>
              <FormControl>
                <Input placeholder="Monthly Groceries" {...field} />
              </FormControl>
              <FormDescription>
                Give your budget a descriptive name
              </FormDescription>
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
              <FormLabel>Budget Limit</FormLabel>
              <FormControl>
                <CurrencyInput
                  value={field.value}
                  onChange={field.onChange}
                  currency="USD"
                  placeholder="$0.00"
                />
              </FormControl>
              <FormDescription>
                Maximum amount to spend in this budget period
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Period */}
        <FormField
          control={form.control}
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget Period</FormLabel>
              <Select
                value={String(field.value)}
                onValueChange={(value) => field.onChange(Number(value))}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={String(BudgetPeriod.Monthly)}>
                    Monthly
                  </SelectItem>
                  <SelectItem value={String(BudgetPeriod.Weekly)}>
                    Weekly
                  </SelectItem>
                  <SelectItem value={String(BudgetPeriod.Custom)}>
                    Custom
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How often this budget resets
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date */}
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                When this budget period begins
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Category (Optional) */}
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category (Optional)</FormLabel>
              <FormControl>
                <CategorySelect
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="All categories (global budget)"
                  allowClear
                />
              </FormControl>
              <FormDescription>
                Leave empty for a global budget, or select a category for a specific budget
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Warning Threshold */}
        <FormField
          control={form.control}
          name="warningThreshold"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Warning Threshold: {warningThreshold}%
              </FormLabel>
              <FormControl>
                <Slider
                  min={50}
                  max={100}
                  step={5}
                  value={[field.value]}
                  onValueChange={([value]) => field.onChange(value)}
                  className="py-4"
                />
              </FormControl>
              <FormDescription>
                Get notified when spending reaches this percentage of your budget
              </FormDescription>
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
            {isEditing ? 'Update' : 'Create'} Budget
          </Button>
        </div>
      </form>
    </Form>
  );
}
