import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  CreateCustomerSegmentPayload,
  UpdateCustomerSegmentPayload,
  AssignCustomersToSegmentPayload,
  RemoveCustomersFromSegmentPayload,
} from '@/lib/types/admin';

export function useAdminCustomerSegments(filters?: { active?: boolean }) {
  return useQuery({
    queryKey: queryKeys.admin.customerSegments.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-segments', { params: filters });
      return res.data.data;
    },
  });
}

export function useAdminCustomerSegment(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.customerSegments.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/customer-segments/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminSegmentCustomers(id: number, filters?: { search?: string; per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.customerSegments.customers(id, filters),
    queryFn: async () => {
      const res = await api.get(`/api/admin/customer-segments/${id}/customers`, { params: filters });
      return res.data;
    },
    enabled: !!id,
  });
}

export function useAdminVipCustomers(filters?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.customerSegments.vip(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-segments/vip/customers', { params: filters });
      return res.data;
    },
  });
}

export function useAdminCodRiskCustomers(filters?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.customerSegments.codRisk(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-segments/cod-risk/customers', { params: filters });
      return res.data;
    },
  });
}

export function useAdminRepeatCustomers(filters?: { per_page?: number; page?: number }) {
  return useQuery({
    queryKey: queryKeys.admin.customerSegments.repeat(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/customer-segments/repeat/customers', { params: filters });
      return res.data;
    },
  });
}

export function useAdminCreateCustomerSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateCustomerSegmentPayload) => {
      const res = await api.post('/api/admin/customer-segments', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-segments'] });
    },
  });
}

export function useAdminUpdateCustomerSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateCustomerSegmentPayload }) => {
      const res = await api.put(`/api/admin/customer-segments/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-segments'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerSegments.single(id) });
    },
  });
}

export function useAdminDeleteCustomerSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/customer-segments/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-segments'] });
    },
  });
}

export function useAdminAssignCustomersToSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: AssignCustomersToSegmentPayload }) => {
      const res = await api.post(`/api/admin/customer-segments/${id}/assign-customers`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerSegments.customers(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerSegments.single(id) });
    },
  });
}

export function useAdminRemoveCustomersFromSegment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: RemoveCustomersFromSegmentPayload }) => {
      const res = await api.post(`/api/admin/customer-segments/${id}/remove-customers`, payload);
      return res.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerSegments.customers(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.customerSegments.single(id) });
    },
  });
}

export function useAdminAutoAssignSegments() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await api.post('/api/admin/customer-segments/auto-assign-all');
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-segments'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'customer-analytics'] });
    },
  });
}
