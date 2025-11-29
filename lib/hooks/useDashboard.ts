import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/api/endpoints';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: async () => {
      const response = await dashboardApi.getStats();
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSpendingTrends(period: 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    queryKey: ['dashboard', 'trends', period],
    queryFn: async () => {
      const response = await dashboardApi.getSpendingTrends(period);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
