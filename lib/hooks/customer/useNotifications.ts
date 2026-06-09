import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import { useAuth } from '@/lib/context/AuthContext';
import { useEcho } from '@/lib/providers/EchoProvider';

interface NotificationFilters {
  page?: number;
  per_page?: number;
}

/** Fetch paginated notifications for the authenticated customer. */
export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: queryKeys.notifications.all(filters),
    queryFn: async () => {
      const res = await api.get('/api/notifications', { params: filters });
      return res.data.data;
    },
  });
}

/** Fetch the unread notification count. Real-time updates replace polling when Echo is active. */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const res = await api.get('/api/notifications/unread-count');
      return res.data.data as { unread_count: number };
    },
    // Fallback poll — real-time listener invalidates this cache first when active
    refetchInterval: 60 * 1000,
  });
}

/**
 * Subscribe to the authenticated user's private Reverb channel for real-time
 * notification events. Call once at the top of the dashboard layout.
 */
export function useNotificationChannel() {
  const { user } = useAuth();
  const { getEcho } = useEcho();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id) return;

    let channel: ReturnType<import('laravel-echo').default['private']> | null = null;

    getEcho().then((echo) => {
      if (!echo) return;

      channel = echo.private(`App.Models.User.${user.id}`);

      // Laravel broadcasts Illuminate\Notifications\Events\BroadcastNotificationCreated
      // under the event name matching the notification's broadcastAs() value.
      // The default fallback is the class name formatted as a dot-separated string.
      channel.notification((notification: Record<string, unknown>) => {
        // Optimistically bump unread count
        queryClient.setQueryData<{ unread_count: number }>(
          queryKeys.notifications.unreadCount(),
          (old) => ({ unread_count: (old?.unread_count ?? 0) + 1 }),
        );

        // Invalidate list so the new notification appears
        queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });

        // Show toast
        const title = (notification.title as string) ?? 'New notification';
        const message = (notification.message as string) ?? '';
        toast.info(message ? `${title}: ${message}` : title);
      });
    });

    return () => {
      if (channel) {
        getEcho().then((echo) => echo?.leave(`App.Models.User.${user.id}`));
      }
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Mark a single notification as read. */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/api/notifications/${id}/mark-as-read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}

/** Mark all notifications as read. */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/notifications/mark-all-as-read');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}

/** Delete a single notification. */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}

/** Clear all notifications. */
export function useClearNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/notifications/clear');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
    },
  });
}
