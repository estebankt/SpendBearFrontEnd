import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetApi } from '@/lib/api/endpoints';
import type {
  Budget,
  BudgetFilters,
  CreateBudgetRequest,
  UpdateBudgetRequest,
} from '@/types/api';
import { toast } from 'sonner';

// ============================================
// Query Keys
// ============================================

export const budgetKeys = {
  all: ['budgets'] as const,
  lists: () => [...budgetKeys.all, 'list'] as const,
  list: (filters?: BudgetFilters) => [...budgetKeys.lists(), filters] as const,
  active: () => [...budgetKeys.lists(), { activeOnly: true }] as const,
  detail: (id: string) => [...budgetKeys.all, 'detail', id] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch budgets with optional filters
 */
export function useBudgets(filters?: BudgetFilters) {
  return useQuery({
    queryKey: budgetKeys.list(filters),
    queryFn: () => budgetApi.list(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Fetch only active budgets
 */
export function useActiveBudgets() {
  return useQuery({
    queryKey: budgetKeys.active(),
    queryFn: () => budgetApi.list({ activeOnly: true }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create a new budget
 */
export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetRequest) => budgetApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });

      toast.success('Budget created successfully');
    },
    onError: () => {
      toast.error('Failed to create budget');
    },
  });
}

/**
 * Update an existing budget
 */
export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBudgetRequest }) =>
      budgetApi.update(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.id) });

      toast.success('Budget updated successfully');
    },
    onError: () => {
      toast.error('Failed to update budget');
    },
  });
}

/**
 * Delete a budget
 */
export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetApi.delete(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: budgetKeys.lists() });

      // Snapshot the previous value
      const previousBudgets = queryClient.getQueriesData({
        queryKey: budgetKeys.lists(),
      });

      // Optimistically remove from lists
      queryClient.setQueriesData<Budget[]>(
        { queryKey: budgetKeys.lists() },
        (old) => {
          if (!old) return old;
          return old.filter((b) => b.id !== id);
        }
      );

      return { previousBudgets };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: budgetKeys.lists() });

      toast.success('Budget deleted successfully');
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousBudgets) {
        context.previousBudgets.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      toast.error('Failed to delete budget');
    },
  });
}
