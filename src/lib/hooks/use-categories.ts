import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { categoryApi } from '@/lib/api/endpoints';
import type { CreateCategoryInput } from '@/lib/api/schemas';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryApi.list,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryInput) => categoryApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created');
    },
    onError: () => {
      toast.error('Failed to create category');
    },
  });
}
