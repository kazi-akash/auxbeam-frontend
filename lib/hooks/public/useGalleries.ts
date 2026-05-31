import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Fetch all galleries. */
export function useGalleries() {
  return useQuery({
    queryKey: queryKeys.galleries.all(),
    queryFn: async () => {
      const res = await api.get('/api/galleries');
      return res.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch a single gallery by slug. */
export function useGallery(slug: string) {
  return useQuery({
    queryKey: queryKeys.galleries.single(slug),
    queryFn: async () => {
      const res = await api.get(`/api/galleries/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
}
