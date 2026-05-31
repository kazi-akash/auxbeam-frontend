import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  CreateCustomerTagPayload,
  UpdateCustomerTagPayload,
  AssignTagToCustomersPayload,
} from '@/lib/types/admin';

export function useAdminCustomerTags(filters?: { active?: boolean }) {
  return useQuery({
    queryKey: queryKeys.admin.customerTags.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-tags', { params: filters });
      return res.data.data;
    },
  });
}

export function useAdminCustomerTag(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.customerTags.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/customer-tags/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminTagCustomers(id: number, filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.customerTags.customers(id, filters),
    queryFn: async () => {
      const res = await api.get(`/api/admin/customer-tags/${id}/customers`, { params: filters });
      return res.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateCustomerTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCustomerTagPayload) => {
      const res = await api.post('/api/admin/customer-tags', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-tags'] });
    },
  });
}

export function useAdminUpdateCustomerTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCustomerTagPayload }) => {
      const res = await api.put(`/api/admin/customer-tags/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-tags'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerTags.single(id) });
    },
  });
}

export function useAdminDeleteCustomerTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/customer-tags/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-tags'] });
    },
  });
}

export function useAdminAssignTagToCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: AssignTagToCustomersPayload }) => {
      const res = await api.post(`/api/admin/customer-tags/${id}/assign-to-customers`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerTags.customers(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerTags.single(id) });
    },
  });
}

export function useAdminRemoveTagFromCustomers() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: AssignTagToCustomersPayload }) => {
      const res = await api.post(`/api/admin/customer-tags/${id}/remove-from-customers`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerTags.customers(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerTags.single(id) });
    },
  });
}
