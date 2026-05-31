import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { AdminUserFilters, CreateUserPayload } from '@/lib/types';

export function useAdminUsers(filters?: AdminUserFilters) {
  return useQuery({
    queryKey: queryKeys.admin.users.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/users', { params: filters });
      return res.data;
    },
  });
}

export function useAdminUser(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.users.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/users/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateUserPayload) => {
      const res = await api.post('/api/admin/users', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.list() });
    },
  });
}

export function useAdminUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<CreateUserPayload> }) => {
      const res = await api.put(`/api/admin/users/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.single(id) });
    },
  });
}

export function useAdminDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.list() });
    },
  });
}

export function useAdminToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/users/${id}/toggle-status`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.single(id) });
    },
  });
}
