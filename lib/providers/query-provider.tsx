'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

/**
 * TanStack Query Provider
 *
 * Provides React Query functionality to the entire app with:
 * - Caching and background refetching
 * - Optimistic updates
 * - Automatic cache invalidation
 * - DevTools in development
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh
            staleTime: 60 * 1000, // 1 minute

            // Cache time: how long inactive data stays in cache
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)

            // Refetch on window focus for fresh data
            refetchOnWindowFocus: true,

            // Retry failed requests
            retry: 1,

            // Retry delay
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
          },
          mutations: {
            // Retry failed mutations once
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
