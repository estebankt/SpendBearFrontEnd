import { z } from 'zod';
import { TransactionType } from '@/types/api';

/**
 * Transaction Validation Schema
 *
 * Validates transaction form inputs before submission
 */
export const transactionSchema = z.object({
  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be positive')
    .max(999999999, 'Amount is too large'),

  currency: z.string().min(1, 'Currency is required'),

  date: z
    .date({ message: 'Date must be a valid date' })
    .max(new Date(), 'Date cannot be in the future'),

  description: z
    .string({ message: 'Description is required' })
    .min(1, 'Description is required')
    .max(200, 'Description is too long'),

  categoryId: z
    .string({ message: 'Category is required' })
    .uuid('Please select a valid category'),

  type: z.nativeEnum(TransactionType, {
    message: 'Transaction type is required',
  }),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Budget Validation Schema
 *
 * Validates budget form inputs before submission
 */
export const budgetSchema = z.object({
  name: z
    .string({ message: 'Budget name is required' })
    .min(1, 'Budget name is required')
    .max(50, 'Budget name is too long'),

  amount: z
    .number({ message: 'Amount must be a number' })
    .positive('Amount must be positive')
    .max(999999999, 'Amount is too large'),

  currency: z.string().min(1, 'Currency is required'),

  period: z.number().min(0).max(2),

  startDate: z.date({ message: 'Start date must be a valid date' }),

  categoryId: z.string().uuid().nullable().optional(),

  warningThreshold: z
    .number()
    .min(1, 'Warning threshold must be at least 1%')
    .max(100, 'Warning threshold cannot exceed 100%'),
});

export type BudgetFormData = z.infer<typeof budgetSchema>;

/**
 * Category Validation Schema
 */
export const categorySchema = z.object({
  name: z
    .string({ message: 'Category name is required' })
    .min(1, 'Category name is required')
    .max(50, 'Category name is too long'),

  description: z.string().max(200, 'Description is too long').optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
