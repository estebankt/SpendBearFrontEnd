import { z } from 'zod';

// Transaction validation schemas
export const createTransactionSchema = z.object({
  amount: z.string().min(1, 'Amount is required').refine(
    val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Amount must be a positive number' }
  ),
  description: z.string().min(1, 'Description is required').max(200, 'Description is too long'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['expense', 'income']),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;

// Budget validation schemas
export const createBudgetSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  amount: z.string().min(1, 'Amount is required').refine(
    val => {
      const num = parseFloat(val);
      return !isNaN(num) && num > 0;
    },
    { message: 'Amount must be a positive number' }
  ),
  period: z.enum(['weekly', 'monthly', 'yearly']),
  startDate: z.string().min(1, 'Start date is required'),
});

export type CreateBudgetFormData = z.infer<typeof createBudgetSchema>;

// Category validation schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  icon: z.string().optional(),
  color: z.string().optional(),
  type: z.enum(['expense', 'income']),
});

export type CreateCategoryFormData = z.infer<typeof createCategorySchema>;

// Profile validation schemas
export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

// Helper validation functions
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
