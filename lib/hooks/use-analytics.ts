import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/endpoints';

// ============================================
// Query Keys
// ============================================

export const analyticsKeys = {
  all: ['analytics'] as const,
  monthlySummary: (year: number, month: number) =>
    [...analyticsKeys.all, 'monthly', year, month] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch monthly financial summary for a specific year and month
 *
 * @param year - Year (2000-2100)
 * @param month - Month (1-12)
 */
export function useMonthlySummary(year: number, month: number) {
  return useQuery({
    queryKey: analyticsKeys.monthlySummary(year, month),
    queryFn: () => analyticsApi.monthlySummary(year, month),
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: year >= 2000 && year <= 2100 && month >= 1 && month <= 12,
  });
}

/**
 * Fetch current month's summary
 */
export function useCurrentMonthlySummary() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JavaScript months are 0-indexed

  return useMonthlySummary(year, month);
}

/**
 * Fetch previous month's summary
 */
export function usePreviousMonthlySummary() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth(); // Previous month

  // Handle year rollover
  if (month === 0) {
    month = 12;
    year -= 1;
  }

  return useMonthlySummary(year, month);
}
