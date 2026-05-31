import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CreateRolePayload, AssignUsersToRolePayload } from '@/lib/types';

export function useAdminRoles() {
  return useQuery({
    queryKey: queryKeys.admin.roles.list(),
    queryFn: async () => {
      const res = await api.get('/api/admin/roles');
      return res.data.data;
    },
  });
}

export function useAdminRole(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.roles.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/roles/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminAllPermissions() {
  return useQuery({
    queryKey: queryKeys.admin.roles.permissions(),
    queryFn: async () => {
      const res = await api.get('/api/admin/roles/permissions/all');
      return res.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

export function useAdminCreateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateRolePayload) => {
      const res = await api.post('/api/admin/roles', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.list() });
    },
  });
}

export function useAdminUpdateRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<CreateRolePayload>;
    }) => {
      const res = await api.put(`/api/admin/roles/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.single(id) });
    },
  });
}

export function useAdminDeleteRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/roles/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.list() });
    },
  });
}

export function useAdminAssignUsersToRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      payload,
    }: {
      roleId: number;
      payload: AssignUsersToRolePayload;
    }) => {
      const res = await api.post(`/api/admin/roles/${roleId}/assign-users`, payload);
      return res.data;
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.single(roleId) });
    },
  });
}

export function useAdminRemoveUsersFromRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      payload,
    }: {
      roleId: number;
      payload: AssignUsersToRolePayload;
    }) => {
      const res = await api.post(`/api/admin/roles/${roleId}/remove-users`, payload);
      return res.data;
    },
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.roles.single(roleId) });
    },
  });
}
