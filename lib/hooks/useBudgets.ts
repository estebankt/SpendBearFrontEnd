import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetsApi } from '@/lib/api/endpoints';
import type { CreateBudgetInput, UpdateBudgetInput } from '@/types/api.types';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await budgetsApi.getAll();
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - refresh more often for budget status
  });
}

export function useBudget(id: string) {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => {
      const response = await budgetsApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useBudgetStatus(id: string) {
  return useQuery({
    queryKey: ['budget-status', id],
    queryFn: async () => {
      const response = await budgetsApi.getStatus(id);
      return response.data.data;
    },
    enabled: !!id,
    refetchInterval: 60 * 1000, // Refetch every minute for real-time updates
  });
}

export function useCreateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateBudgetInput) => budgetsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateBudgetInput) => budgetsApi.update(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['budget', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteBudget() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => budgetsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
