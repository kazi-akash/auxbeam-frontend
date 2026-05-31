import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';

/** Fetch all store policies. */
export function usePolicies() {
  return useQuery({
    queryKey: queryKeys.content.policies(),
    queryFn: async () => {
      const res = await api.get('/api/policies');
      return res.data.data;
    },
    staleTime: 30 * 60 * 1000,
  });
}

/** Fetch a single policy by type (e.g. "privacy_policy"). */
export function usePolicy(type: string) {
  return useQuery({
    queryKey: queryKeys.content.policy(type),
    queryFn: async () => {
      const res = await api.get(`/api/policies/${type}`);
      return res.data.data;
    },
    enabled: !!type,
    staleTime: 30 * 60 * 1000,
  });
}

/** Fetch a CMS page by slug. */
export function usePage(slug: string) {
  return useQuery({
    queryKey: queryKeys.content.page(slug),
    queryFn: async () => {
      const res = await api.get(`/api/pages/${slug}`);
      return res.data.data;
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000,
  });
}

/** Fetch all pages of a given type. */
export function usePagesByType(type: string) {
  return useQuery({
    queryKey: queryKeys.content.pagesByType(type),
    queryFn: async () => {
      const res = await api.get(`/api/pages/type/${type}`);
      return res.data.data;
    },
    enabled: !!type,
    staleTime: 30 * 60 * 1000,
  });
}

/** Fetch banners, optionally filtered by position (e.g. "hero"). */
export function useBanners(position?: string) {
  return useQuery({
    queryKey: queryKeys.content.banners(position),
    queryFn: async () => {
      const url = position ? `/api/banners/${position}` : '/api/banners';
      const res = await api.get(url);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Fetch structured page content by key (e.g. "homepage"). */
export function usePageContent(pageKey: string) {
  return useQuery({
    queryKey: queryKeys.content.pageContent(pageKey),
    queryFn: async () => {
      const res = await api.get(`/api/page-content/${pageKey}`);
      return res.data.data;
    },
    enabled: !!pageKey,
    staleTime: 10 * 60 * 1000,
  });
}

/** Fetch page content associated with a brand slug. */
export function useBrandPageContent(brandSlug: string) {
  return useQuery({
    queryKey: queryKeys.content.brandPageContent(brandSlug),
    queryFn: async () => {
      const res = await api.get(`/api/page-content/brand/${brandSlug}`);
      return res.data.data;
    },
    enabled: !!brandSlug,
    staleTime: 10 * 60 * 1000,
  });
}
