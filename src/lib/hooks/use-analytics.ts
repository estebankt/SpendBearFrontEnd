import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/endpoints';

export function useMonthlyAnalytics(year: number, month: number) {
  return useQuery({
    queryKey: ['analytics', 'monthly', year, month],
    queryFn: () => analyticsApi.monthlySummary(year, month),
    enabled: year > 0 && month > 0,
  });
}
