import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionApi } from '@/lib/api/endpoints';
import type {
  Transaction,
  TransactionFilters,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  PaginatedResponse,
} from '@/types/api';
import { toast } from 'sonner';

// ============================================
// Query Keys
// ============================================

export const transactionKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionKeys.all, 'list'] as const,
  list: (filters?: TransactionFilters) => [...transactionKeys.lists(), filters] as const,
  detail: (id: string) => [...transactionKeys.all, 'detail', id] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch transactions with optional filters and pagination
 */
export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: transactionKeys.list(filters),
    queryFn: () => transactionApi.list(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

// ============================================
// Mutations
// ============================================

/**
 * Create a new transaction
 */
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTransactionRequest) => transactionApi.create(data),
    onMutate: async (newTransaction) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueriesData({
        queryKey: transactionKeys.lists(),
      });

      // Optimistically update to the new value
      queryClient.setQueriesData<PaginatedResponse<Transaction>>(
        { queryKey: transactionKeys.lists() },
        (old) => {
          if (!old) return old;

          // Create a temporary transaction for optimistic update
          const tempTransaction: Transaction = {
            id: 'temp-' + Date.now(),
            userId: '', // Will be set by server
            ...newTransaction,
            category: undefined, // Will be populated by server
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          return {
            ...old,
            items: [tempTransaction, ...old.items],
            totalCount: old.totalCount + 1,
          };
        }
      );

      return { previousTransactions };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });

      toast.success('Transaction created successfully');
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousTransactions) {
        context.previousTransactions.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      toast.error('Failed to create transaction');
    },
  });
}

/**
 * Update an existing transaction
 */
export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTransactionRequest }) =>
      transactionApi.update(id, data),
    onSuccess: (_data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });

      toast.success('Transaction updated successfully');
    },
    onError: () => {
      toast.error('Failed to update transaction');
    },
  });
}

/**
 * Delete a transaction
 */
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionApi.delete(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: transactionKeys.lists() });

      // Snapshot the previous value
      const previousTransactions = queryClient.getQueriesData({
        queryKey: transactionKeys.lists(),
      });

      // Optimistically remove from lists
      queryClient.setQueriesData<PaginatedResponse<Transaction>>(
        { queryKey: transactionKeys.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.filter((t) => t.id !== id),
            totalCount: Math.max(0, old.totalCount - 1),
          };
        }
      );

      return { previousTransactions };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: transactionKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });

      toast.success('Transaction deleted successfully');
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousTransactions) {
        context.previousTransactions.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      toast.error('Failed to delete transaction');
    },
  });
}
