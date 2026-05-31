import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { CreateAddressPayload, UpdateAddressPayload } from '@/lib/types';

/** Fetch all saved addresses for the authenticated customer. */
export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses.all(),
    queryFn: async () => {
      const res = await api.get('/api/addresses');
      return res.data.data;
    },
  });
}

/** Fetch a single address by ID. */
export function useAddress(id: number) {
  return useQuery({
    queryKey: queryKeys.addresses.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/addresses/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

/** Create a new address. */
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateAddressPayload) => {
      const res = await api.post('/api/addresses', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
  });
}

/** Update an existing address. */
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateAddressPayload }) => {
      const res = await api.put(`/api/addresses/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.single(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
  });
}

/** Delete an address. */
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/addresses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
  });
}

/** Set an address as the default. */
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/addresses/${id}/set-default`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.customer.profile() });
    },
  });
}
