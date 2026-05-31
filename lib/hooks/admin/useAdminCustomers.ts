import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { AdminUserFilters } from '@/lib/types';

export function useAdminCustomers(filters?: AdminUserFilters) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/users', { params: filters });
      return res.data;
    },
  });
}

export function useAdminCustomer(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.users.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminToggleCustomerStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/users/${id}/toggle-status`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.single(id) });
    },
  });
}

export function useAdminUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Record<string, unknown> }) => {
      const res = await api.put(`/api/admin/users/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.single(id) });
    },
  });
}
