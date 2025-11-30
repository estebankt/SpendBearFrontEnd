'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateTransaction } from '@/lib/hooks/useTransactions';
import { useCategories } from '@/lib/hooks/useCategories';
import { createTransactionSchema, type CreateTransactionFormData } from '@/lib/utils/validators';
import { formatDateForInput } from '@/lib/utils/formatters';
import { Loader2 } from 'lucide-react';

export function QuickAddForm() {
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const createTransaction = useCreateTransaction();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
    defaultValues: {
      date: formatDateForInput(),
      type: 'expense',
    },
  });

  const onSubmit = async (data: CreateTransactionFormData) => {
    try {
      await createTransaction.mutateAsync({
        amount: parseFloat(data.amount),
        currency: 'USD',
        description: data.description,
        categoryId: data.categoryId,
        date: data.date,
        type: data.type,
      });

      toast.success('Transaction added successfully!');
      reset({
        amount: '',
        description: '',
        categoryId: '',
        date: formatDateForInput(),
        type: transactionType,
      });
    } catch (error) {
      toast.error('Failed to add transaction. Please try again.');
      console.error('Failed to create transaction:', error);
    }
  };

  const filteredCategories = categories?.filter(cat => cat.type === transactionType) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Add Transaction</CardTitle>
        <CardDescription>Add a new expense or income in seconds</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Transaction Type */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={transactionType === 'expense' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setTransactionType('expense');
                setValue('type', 'expense');
                setValue('categoryId', '');
              }}
            >
              Expense
            </Button>
            <Button
              type="button"
              variant={transactionType === 'income' ? 'default' : 'outline'}
              className="flex-1"
              onClick={() => {
                setTransactionType('income');
                setValue('type', 'income');
                setValue('categoryId', '');
              }}
            >
              Income
            </Button>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount')}
              className={errors.amount ? 'border-destructive' : ''}
            />
            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={value => setValue('categoryId', value)}>
              <SelectTrigger className={errors.categoryId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categoriesLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : filteredCategories.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No categories available
                  </div>
                ) : (
                  filteredCategories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.icon && <span className="mr-2">{category.icon}</span>}
                      {category.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
              className={errors.date ? 'border-destructive' : ''}
            />
            {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={createTransaction.isPending}>
            {createTransaction.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Transaction'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
