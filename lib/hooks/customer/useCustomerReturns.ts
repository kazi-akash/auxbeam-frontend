import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type { SubmitReturnPayload } from '@/lib/types';

/** Fetch all return requests for the authenticated customer. */
export function useMyReturns() {
  return useQuery({
    queryKey: queryKeys.returns.all(),
    queryFn: async () => {
      const res = await api.get('/api/returns');
      return res.data.data;
    },
  });
}

/** Fetch a single return request by ID. */
export function useMyReturn(id: number) {
  return useQuery({
    queryKey: queryKeys.returns.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/returns/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

/** Submit a new return request. */
export function useSubmitReturn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitReturnPayload) => {
      const formData = new FormData();
      formData.append('order_id', String(payload.order_id));
      formData.append('description', payload.description);
      payload.items.forEach((item, i) => {
        formData.append(`items[${i}][order_item_id]`, String(item.order_item_id));
        formData.append(`items[${i}][quantity]`, String(item.quantity));
        formData.append(`items[${i}][reason]`, item.reason);
      });
      payload.images?.forEach((file, i) => {
        formData.append(`images[${i}]`, file);
      });

      const res = await api.post('/api/returns', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.returns.all() });
    },
  });
}
