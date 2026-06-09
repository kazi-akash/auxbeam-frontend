import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '@/lib/api/axios';
import { useAuth } from '@/lib/context/AuthContext';
import { useEcho } from '@/lib/providers/EchoProvider';
import type { Notification } from '@/lib/types';

// Admin notifications live under a separate query key namespace so they don't
// collide with the customer-facing notifications cache.
const adminNotifKeys = {
  all: (filters?: object) => ['admin', 'notifications', filters] as const,
  unreadCount: () => ['admin', 'notifications', 'unread-count'] as const,
};

export function useAdminNotifications(filters?: { page?: number; per_page?: number }) {
  return useQuery({
    queryKey: adminNotifKeys.all(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/notifications', { params: filters });
      return res.data.data as { data: Notification[]; total: number };
    },
  });
}

export function useAdminUnreadNotificationCount() {
  return useQuery({
    queryKey: adminNotifKeys.unreadCount(),
    queryFn: async () => {
      const res = await api.get('/api/admin/notifications/unread-count');
      return res.data.data as { unread_count: number };
    },
    refetchInterval: 60 * 1000,
  });
}

export function useAdminMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post(`/api/admin/notifications/${id}/mark-as-read`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.all() });
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.unreadCount() });
    },
  });
}

export function useAdminMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/notifications/mark-all-as-read');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.all() });
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.unreadCount() });
    },
  });
}

export function useAdminDeleteNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/admin/notifications/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.all() });
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.unreadCount() });
    },
  });
}

export function useAdminClearNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/notifications/clear');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.all() });
      queryClient.invalidateQueries({ queryKey: adminNotifKeys.unreadCount() });
    },
  });
}

/**
 * Subscribes the admin user to their private Reverb channel for real-time
 * admin notifications (low stock, campaign events, report ready, etc.).
 * Mount this once in the admin layout.
 */
export function useAdminNotificationChannel() {
  const { user } = useAuth();
  const { getEcho } = useEcho();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user?.id || user.user_type !== 'admin') return;

    let channel: ReturnType<import('laravel-echo').default['private']> | null = null;

    getEcho().then((echo) => {
      if (!echo) return;

      channel = echo.private(`App.Models.User.${user.id}`);

      channel.notification((notification: Record<string, unknown>) => {
        queryClient.setQueryData<{ unread_count: number }>(
          adminNotifKeys.unreadCount(),
          (old) => ({ unread_count: (old?.unread_count ?? 0) + 1 }),
        );
        queryClient.invalidateQueries({ queryKey: adminNotifKeys.all() });

        const title = (notification.title as string) ?? 'New notification';
        const message = (notification.message as string) ?? '';

        // Use warning toast for alerts, info for everything else
        const alertTypes = ['low_stock_alert', 'out_of_stock_alert', 'campaign_failed', 'meta_pixel_error'];
        const type = notification.type as string;
        if (alertTypes.includes(type)) {
          toast.warning(message ? `${title}: ${message}` : title);
        } else {
          toast.info(message ? `${title}: ${message}` : title);
        }
      });
    });

    return () => {
      if (channel) {
        getEcho().then((echo) => echo?.leave(`App.Models.User.${user.id}`));
      }
    };
  }, [user?.id, user?.user_type]); // eslint-disable-line react-hooks/exhaustive-deps
}
