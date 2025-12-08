import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoryApi } from '@/lib/api/endpoints';
import type { Category, CreateCategoryRequest } from '@/types/api';
import { toast } from 'sonner';

// ============================================
// Query Keys
// ============================================

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: () => [...categoryKeys.lists()] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch all categories (system + user)
 */
export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.list(),
    queryFn: () => categoryApi.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes - categories don't change often
  });
}

/**
 * Get only system categories
 */
export function useSystemCategories() {
  const { data, ...rest } = useCategories();

  return {
    data: data?.filter((cat) => cat.isSystemCategory),
    ...rest,
  };
}

/**
 * Get only user-created categories
 */
export function useUserCategories() {
  const { data, ...rest } = useCategories();

  return {
    data: data?.filter((cat) => !cat.isSystemCategory),
    ...rest,
  };
}

// ============================================
// Mutations
// ============================================

/**
 * Create a custom category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryApi.create(data),
    onMutate: async (newCategory) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: categoryKeys.list() });

      // Snapshot the previous value
      const previousCategories = queryClient.getQueryData<Category[]>(categoryKeys.list());

      // Optimistically add new category
      queryClient.setQueryData<Category[]>(categoryKeys.list(), (old) => {
        if (!old) return old;

        // Create temporary category for optimistic update
        const tempCategory: Category = {
          id: 'temp-' + Date.now(),
          name: newCategory.name,
          description: newCategory.description,
          isSystemCategory: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        return [...old, tempCategory];
      });

      return { previousCategories };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: categoryKeys.list() });

      toast.success('Category created successfully');
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousCategories) {
        queryClient.setQueryData(categoryKeys.list(), context.previousCategories);
      }

      toast.error('Failed to create category');
    },
  });
}
