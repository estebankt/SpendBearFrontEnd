import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { statementImportApi } from '@/lib/api/endpoints';
import type { UpdateCategoriesInput } from '@/lib/api/types';

export function useStatementImports() {
  return useQuery({
    queryKey: ['statement-imports'],
    queryFn: () => statementImportApi.list(),
  });
}

export function useStatementImport(id: string | null) {
  return useQuery({
    queryKey: ['statement-import', id],
    queryFn: () => statementImportApi.get(id!),
    enabled: !!id,
  });
}

export function useStatementImportPolling(id: string | null) {
  return useQuery({
    queryKey: ['statement-import', id],
    queryFn: () => statementImportApi.get(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Keep polling while uploading or parsing
      if (status === 'Uploading' || status === 'Parsing') {
        return 2000; // Poll every 2 seconds
      }
      return false; // Stop polling
    },
  });
}

export function useUploadStatement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => statementImportApi.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statement-imports'] });
    },
    onError: () => {
      toast.error('Failed to upload statement');
    },
  });
}

export function useUpdateCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCategoriesInput }) =>
      statementImportApi.updateCategories(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['statement-import', id] });
    },
    onError: () => {
      toast.error('Failed to update categories');
    },
  });
}

export function useConfirmImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => statementImportApi.confirm(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statement-imports'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Transactions imported successfully');
    },
    onError: () => {
      toast.error('Failed to import transactions');
    },
  });
}

export function useCancelImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => statementImportApi.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statement-imports'] });
    },
    onError: () => {
      toast.error('Failed to cancel import');
    },
  });
}
