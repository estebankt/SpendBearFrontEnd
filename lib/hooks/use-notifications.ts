import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/lib/api/endpoints';
import type {
  Notification,
  NotificationFilters,
  PaginatedResponse,
} from '@/types/api';
import { NotificationStatus } from '@/types/api';
import { toast } from 'sonner';

// ============================================
// Query Keys
// ============================================

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

// ============================================
// Queries
// ============================================

/**
 * Fetch notifications with optional filters and pagination
 */
export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: () => notificationApi.list(filters),
    staleTime: 30 * 1000, // 30 seconds - notifications should be relatively fresh
  });
}

/**
 * Fetch only unread notifications
 */
export function useUnreadNotifications() {
  return useQuery({
    queryKey: notificationKeys.list({ unreadOnly: true, pageSize: 50 }),
    queryFn: () => notificationApi.list({ unreadOnly: true, pageSize: 50 }),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 60 * 1000, // Refetch every minute for new notifications
  });
}

/**
 * Get unread notification count
 */
export function useUnreadCount() {
  const { data } = useUnreadNotifications();

  return {
    count: data?.totalCount ?? 0,
    hasUnread: (data?.totalCount ?? 0) > 0,
  };
}

// ============================================
// Mutations
// ============================================

/**
 * Mark a notification as read
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      // Snapshot the previous value
      const previousNotifications = queryClient.getQueriesData({
        queryKey: notificationKeys.lists(),
      });

      // Optimistically update notification status
      queryClient.setQueriesData<PaginatedResponse<Notification>>(
        { queryKey: notificationKeys.lists() },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            items: old.items.map((notification) =>
              notification.id === id
                ? {
                    ...notification,
                    status: NotificationStatus.Read,
                    readAt: new Date().toISOString(),
                  }
                : notification
            ),
          };
        }
      );

      return { previousNotifications };
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
    onError: (_error, _variables, context) => {
      // Rollback to the previous value
      if (context?.previousNotifications) {
        context.previousNotifications.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }

      toast.error('Failed to mark notification as read');
    },
  });
}
