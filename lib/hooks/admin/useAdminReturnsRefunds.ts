import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  AdminReturnFilters,
  AdminRefundFilters,
  ApproveReturnPayload,
  RejectReturnPayload,
  CreateRefundPayload,
  CancelRefundPayload,
} from '@/lib/types/admin';

// ─── Returns ──────────────────────────────────────────────────────────────────

export function useAdminReturns(filters?: AdminReturnFilters) {
  return useQuery({
    queryKey: queryKeys.admin.returns.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/returns', { params: filters });
      return res.data;
    },
  });
}

export function useAdminReturn(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.returns.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/returns/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminApproveReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload?: ApproveReturnPayload }) => {
      const res = await api.post(`/api/admin/returns/${id}/approve`, payload ?? {});
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.returns.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.returns.single(id) });
    },
  });
}

export function useAdminRejectReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: RejectReturnPayload }) => {
      const res = await api.post(`/api/admin/returns/${id}/reject`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.returns.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.returns.single(id) });
    },
  });
}

export function useAdminProcessReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/returns/${id}/process`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.returns.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.returns.single(id) });
    },
  });
}

// ─── Refunds ──────────────────────────────────────────────────────────────────

export function useAdminRefunds(filters?: AdminRefundFilters) {
  return useQuery({
    queryKey: queryKeys.admin.refunds.list(),
    queryFn: async () => {
      const res = await api.get('/api/admin/refunds', { params: filters });
      return res.data;
    },
  });
}

export function useAdminRefund(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.refunds.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/refunds/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRefundPayload) => {
      const res = await api.post('/api/admin/refunds', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds.list() });
    },
  });
}

export function useAdminProcessRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/refunds/${id}/process`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds.single(id) });
    },
  });
}

export function useAdminCancelRefund() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: CancelRefundPayload }) => {
      const res = await api.post(`/api/admin/refunds/${id}/cancel`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.refunds.single(id) });
    },
  });
}
