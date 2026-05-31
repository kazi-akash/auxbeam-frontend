import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  AdminOrderFilters,
  UpdateOrderStatusPayload,
  AssignTrackingPayload,
  UpdateOrderNotesPayload,
  OrderNotePayload,
  OrderReminderPayload,
  SetFollowUpPayload,
} from '@/lib/types';

// ─── Orders ───────────────────────────────────────────────────────────────────

export function useAdminOrders(filters?: AdminOrderFilters) {
  return useQuery({
    queryKey: queryKeys.admin.orders.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders', { params: filters });
      return res.data;
    },
  });
}

export function useAdminOrder(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.orders.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/orders/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateOrderStatusPayload;
    }) => {
      const res = await api.put(`/api/admin/orders/${id}/status`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.statusHistory(id) });
    },
  });
}

export function useAdminCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
      const res = await api.post(`/api/admin/orders/${id}/cancel`, { reason });
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.single(id) });
    },
  });
}

export function useAdminAssignTracking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: AssignTrackingPayload;
    }) => {
      const res = await api.post(`/api/admin/orders/${id}/tracking`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.single(id) });
    },
  });
}

export function useAdminUpdateOrderNotes() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateOrderNotesPayload;
    }) => {
      const res = await api.put(`/api/admin/orders/${id}/notes`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.single(id) });
    },
  });
}

export function useAdminDownloadOrderInvoice() {
  return useMutation({
    mutationFn: async (orderNumber: string) => {
      const res = await api.get(`/api/admin/orders/${orderNumber}/invoice`, {
        responseType: 'blob',
      });
      return res.data as Blob;
    },
  });
}

// ─── Advanced order management ────────────────────────────────────────────────

export function useAdminIncompleteOrders() {
  return useQuery({
    queryKey: queryKeys.admin.orders.incomplete(),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders/incomplete');
      return res.data;
    },
  });
}

export function useAdminHourlyOrderReport() {
  return useQuery({
    queryKey: queryKeys.admin.orders.hourlyReport(),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders/hourly-report');
      return res.data.data;
    },
  });
}

export function useAdminOrdersBySource() {
  return useQuery({
    queryKey: queryKeys.admin.orders.bySource(),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders/by-source');
      return res.data.data;
    },
  });
}

export function useAdminOrdersByUtmCampaign() {
  return useQuery({
    queryKey: queryKeys.admin.orders.byUtmCampaign(),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders/by-utm-campaign');
      return res.data.data;
    },
  });
}

export function useAdminOrdersNeedingFollowUp() {
  return useQuery({
    queryKey: queryKeys.admin.orders.needingFollowUp(),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders/needing-follow-up');
      return res.data;
    },
  });
}

export function useAdminOrderStatusStatistics() {
  return useQuery({
    queryKey: queryKeys.admin.orders.statusStatistics(),
    queryFn: async () => {
      const res = await api.get('/api/admin/orders/status-statistics');
      return res.data.data;
    },
  });
}

export function useAdminOrderStatusHistory(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.orders.statusHistory(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/orders/${id}/status-history`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCompleteFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/orders/${id}/complete-follow-up`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.needingFollowUp() });
    },
  });
}

export function useAdminSetFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: SetFollowUpPayload }) => {
      const res = await api.post(`/api/admin/orders/${id}/set-follow-up`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.needingFollowUp() });
    },
  });
}

// ─── Order Notes ──────────────────────────────────────────────────────────────

export function useAdminOrderNotes(orderId: number) {
  return useQuery({
    queryKey: queryKeys.admin.orders.notes(orderId),
    queryFn: async () => {
      const res = await api.get(`/api/admin/orders/${orderId}/notes`);
      return res.data.data;
    },
    enabled: !!orderId,
  });
}

export function useAdminCreateOrderNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: OrderNotePayload;
    }) => {
      const res = await api.post(`/api/admin/orders/${orderId}/notes`, payload);
      return res.data.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.notes(orderId) });
    },
  });
}

export function useAdminUpdateOrderNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      noteId,
      payload,
    }: {
      orderId: number;
      noteId: number;
      payload: Partial<OrderNotePayload>;
    }) => {
      const res = await api.put(`/api/admin/orders/${orderId}/notes/${noteId}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.notes(orderId) });
    },
  });
}

export function useAdminDeleteOrderNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, noteId }: { orderId: number; noteId: number }) => {
      const res = await api.delete(`/api/admin/orders/${orderId}/notes/${noteId}`);
      return res.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.notes(orderId) });
    },
  });
}

// ─── Order Reminders ──────────────────────────────────────────────────────────

export function useAdminOrderReminders(orderId: number) {
  return useQuery({
    queryKey: queryKeys.admin.orders.reminders(orderId),
    queryFn: async () => {
      const res = await api.get(`/api/admin/orders/${orderId}/reminders`);
      return res.data.data;
    },
    enabled: !!orderId,
  });
}

export function useAdminPendingReminders() {
  return useQuery({
    queryKey: queryKeys.admin.reminders.pending(),
    queryFn: async () => {
      const res = await api.get('/api/admin/reminders/pending');
      return res.data.data;
    },
  });
}

export function useAdminUpcomingReminders() {
  return useQuery({
    queryKey: queryKeys.admin.reminders.upcoming(),
    queryFn: async () => {
      const res = await api.get('/api/admin/reminders/upcoming');
      return res.data.data;
    },
  });
}

export function useAdminCreateOrderReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      payload,
    }: {
      orderId: number;
      payload: OrderReminderPayload;
    }) => {
      const res = await api.post(`/api/admin/orders/${orderId}/reminders`, payload);
      return res.data.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.reminders(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reminders.pending() });
    },
  });
}

export function useAdminCompleteOrderReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reminderId,
    }: {
      orderId: number;
      reminderId: number;
    }) => {
      const res = await api.post(
        `/api/admin/orders/${orderId}/reminders/${reminderId}/complete`,
      );
      return res.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.reminders(orderId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.reminders.pending() });
    },
  });
}

export function useAdminDeleteOrderReminder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      reminderId,
    }: {
      orderId: number;
      reminderId: number;
    }) => {
      const res = await api.delete(
        `/api/admin/orders/${orderId}/reminders/${reminderId}`,
      );
      return res.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.orders.reminders(orderId) });
    },
  });
}
