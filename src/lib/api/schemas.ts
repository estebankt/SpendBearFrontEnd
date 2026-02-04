import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(1),
  date: z.string().min(1, 'Date is required'),
  description: z.string().min(1, 'Description is required'),
  categoryId: z.string().uuid('Please select a category'),
  type: z.enum(['Income', 'Expense']),
});

export const updateTransactionSchema = createTransactionSchema;

export const createBudgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(1),
  period: z.enum(['Monthly', 'Weekly', 'Custom']),
  startDate: z.string().min(1, 'Start date is required'),
  categoryId: z.string().uuid().nullable().optional(),
  warningThreshold: z.number().min(1).max(100),
});

export const updateBudgetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['Monthly', 'Weekly', 'Custom']),
  startDate: z.string().min(1, 'Start date is required'),
  categoryId: z.string().uuid().nullable().optional(),
  warningThreshold: z.number().min(1).max(100),
});

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const registerUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type RegisterUserInput = z.infer<typeof registerUserSchema>;
