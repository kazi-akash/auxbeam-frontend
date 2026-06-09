import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  AdminService,
  CreateServicePayload,
  UpdateServicePayload,
  AttachServicePayload,
  SyncServicesPayload,
} from '@/lib/types/admin';

// ─── Service CRUD ─────────────────────────────────────────────────────────────

export function useAdminServices(filters?: object) {
  return useQuery({
    queryKey: queryKeys.admin.services.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/services', { params: filters });
      return res.data.data as AdminService[];
    },
  });
}

export function useAdminService(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.services.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/services/${id}`);
      return res.data.data as AdminService;
    },
    enabled: !!id,
  });
}

export function useAdminCreateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateServicePayload) => {
      const res = await api.post('/api/admin/services', payload);
      return res.data.data as AdminService;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.services.list() });
    },
  });
}

export function useAdminUpdateService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateServicePayload }) => {
      const res = await api.put(`/api/admin/services/${id}`, payload);
      return res.data.data as AdminService;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.services.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.services.single(id) });
    },
  });
}

export function useAdminDeleteService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/services/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.services.list() });
    },
  });
}

export function useAdminToggleService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/services/${id}/toggle`);
      return res.data.data as { is_active: boolean };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.services.list() });
    },
  });
}

// ─── Product <-> Service ──────────────────────────────────────────────────────

export function useAdminProductServices(productId: number) {
  return useQuery({
    queryKey: queryKeys.admin.services.productServices(productId),
    queryFn: async () => {
      const res = await api.get(`/api/admin/products/${productId}/services`);
      return res.data.data as (AdminService & {
        price: number;
        is_required: boolean;
        is_active: boolean;
        conditions: string | null;
      })[];
    },
    enabled: !!productId,
  });
}

export function useAdminSyncProductServices(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SyncServicesPayload) => {
      const res = await api.post(`/api/admin/products/${productId}/services/sync`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.services.productServices(productId),
      });
    },
  });
}

export function useAdminAttachProductService(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AttachServicePayload) => {
      const res = await api.post(`/api/admin/products/${productId}/services`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.services.productServices(productId),
      });
    },
  });
}

export function useAdminDetachProductService(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (serviceId: number) => {
      const res = await api.delete(`/api/admin/products/${productId}/services/${serviceId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.services.productServices(productId),
      });
    },
  });
}

export function useAdminUpdateProductService(productId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      serviceId,
      payload,
    }: {
      serviceId: number;
      payload: Partial<AttachServicePayload>;
    }) => {
      const res = await api.put(
        `/api/admin/products/${productId}/services/${serviceId}`,
        payload,
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.services.productServices(productId),
      });
    },
  });
}
