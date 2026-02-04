import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { budgetApi } from '@/lib/api/endpoints';
import type { BudgetListParams } from '@/lib/api/types';
import type { CreateBudgetInput, UpdateBudgetInput } from '@/lib/api/schemas';

export function useBudgets(params?: BudgetListParams) {
  return useQuery({
    queryKey: ['budgets', params],
    queryFn: () => budgetApi.list(params),
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateBudgetInput) => budgetApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget created');
    },
    onError: () => {
      toast.error('Failed to create budget');
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBudgetInput }) =>
      budgetApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget updated');
    },
    onError: () => {
      toast.error('Failed to update budget');
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget deleted');
    },
    onError: () => {
      toast.error('Failed to delete budget');
    },
  });
}
