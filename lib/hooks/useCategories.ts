import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/lib/api/endpoints';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await categoriesApi.getAll();
      return response.data.data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      const response = await categoriesApi.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useExpenseCategories() {
  const { data: categories, ...rest } = useCategories();

  return {
    data: categories?.filter(cat => cat.type === 'expense'),
    ...rest,
  };
}

export function useIncomeCategories() {
  const { data: categories, ...rest } = useCategories();

  return {
    data: categories?.filter(cat => cat.type === 'income'),
    ...rest,
  };
}
