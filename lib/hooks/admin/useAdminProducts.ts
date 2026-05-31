import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/axios';
import { queryKeys } from '@/lib/api/queryKeys';
import type {
  AdminProductFilters,
  CreateProductPayload,
  UpdateProductPayload,
  UpdateVariationPayload,
  ProductVariationPayload,
} from '@/lib/types';

// ─── Products ─────────────────────────────────────────────────────────────────

export function useAdminProducts(filters?: AdminProductFilters) {
  return useQuery({
    queryKey: queryKeys.admin.products.list(filters),
    queryFn: async () => {
      const res = await api.get('/api/admin/products', { params: filters });
      return res.data;
    },
  });
}

export function useAdminProduct(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.products.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/products/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const hasFileImages = payload.images?.some((img) => img.file instanceof File);

      if (hasFileImages) {
        const formData = buildProductFormData(payload);
        const res = await api.post('/api/admin/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return res.data.data;
      }

      const res = await api.post('/api/admin/products', payload);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.list() });
    },
  });
}

export function useAdminUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: UpdateProductPayload }) => {
      const res = await api.put(`/api/admin/products/${id}`, payload);
      return res.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.list() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(id) });
    },
  });
}

export function useAdminDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/products/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.list() });
    },
  });
}

// ─── Variations ───────────────────────────────────────────────────────────────

export function useAdminAddProductVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      payload,
    }: {
      productId: number;
      payload: ProductVariationPayload;
    }) => {
      const res = await api.post(`/api/admin/products/${productId}/variations`, payload);
      return res.data.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminUpdateProductVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variationId,
      payload,
    }: {
      productId: number;
      variationId: number;
      payload: UpdateVariationPayload;
    }) => {
      const res = await api.put(
        `/api/admin/products/${productId}/variations/${variationId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminDeleteProductVariation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      variationId,
    }: {
      productId: number;
      variationId: number;
    }) => {
      const res = await api.delete(
        `/api/admin/products/${productId}/variations/${variationId}`,
      );
      return res.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

// ─── Images ───────────────────────────────────────────────────────────────────

export function useAdminAddProductImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      images,
    }: {
      productId: number;
      images: { file: File; alt_text?: string; is_primary?: boolean; sort_order?: number }[];
    }) => {
      const formData = new FormData();
      images.forEach((img, i) => {
        formData.append(`images[${i}][file]`, img.file);
        if (img.alt_text) formData.append(`images[${i}][alt_text]`, img.alt_text);
        if (img.is_primary !== undefined)
          formData.append(`images[${i}][is_primary]`, img.is_primary ? '1' : '0');
        if (img.sort_order !== undefined)
          formData.append(`images[${i}][sort_order]`, String(img.sort_order));
      });

      const res = await api.post(`/api/admin/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminUpdateProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
      payload,
    }: {
      productId: number;
      imageId: number;
      payload: { alt_text?: string; is_primary?: boolean; sort_order?: number };
    }) => {
      const res = await api.put(
        `/api/admin/products/${productId}/images/${imageId}`,
        payload,
      );
      return res.data.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminDeleteProductImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: number;
      imageId: number;
    }) => {
      const res = await api.delete(`/api/admin/products/${productId}/images/${imageId}`);
      return res.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminSetPrimaryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageId,
    }: {
      productId: number;
      imageId: number;
    }) => {
      const res = await api.post(
        `/api/admin/products/${productId}/images/${imageId}/set-primary`,
      );
      return res.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

export function useAdminReorderImages() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      imageIds,
    }: {
      productId: number;
      imageIds: number[];
    }) => {
      const res = await api.post(`/api/admin/products/${productId}/images/reorder`, {
        image_ids: imageIds,
      });
      return res.data;
    },
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.single(productId) });
    },
  });
}

// ─── Product Import ────────────────────────────────────────────────────────────

export function useAdminProductImports() {
  return useQuery({
    queryKey: queryKeys.admin.products.imports.list(),
    queryFn: async () => {
      const res = await api.get('/api/admin/products/import');
      return res.data;
    },
  });
}

export function useAdminProductImport(id: number) {
  return useQuery({
    queryKey: queryKeys.admin.products.imports.single(id),
    queryFn: async () => {
      const res = await api.get(`/api/admin/products/import/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useAdminUploadProductImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/api/admin/products/import/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.imports.list() });
    },
  });
}

export function useAdminCancelProductImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.post(`/api/admin/products/import/${id}/cancel`);
      return res.data;
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.imports.single(id) });
    },
  });
}

export function useAdminDeleteProductImport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/products/import/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products.imports.list() });
    },
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildProductFormData(payload: CreateProductPayload): FormData {
  const formData = new FormData();

  const appendIfDefined = (key: string, value: unknown) => {
    if (value !== null && value !== undefined) {
      // Laravel boolean validation rejects "true"/"false" strings — use "1"/"0" instead
      formData.append(key, typeof value === 'boolean' ? (value ? '1' : '0') : String(value));
    }
  };

  const scalarKeys = [
    'name', 'category_id', 'brand_id', 'model_id', 'shipping_class_id', 'sku',
    'short_description', 'description', 'price', 'compare_price', 'cost_price',
    'quantity', 'low_stock_threshold', 'weight', 'weight_unit', 'length', 'width',
    'height', 'shipping_type', 'shipping_cost', 'requires_shipping', 'separate_shipping',
    'shipping_notes', 'is_featured', 'is_trending', 'status', 'meta_title',
    'meta_description', 'meta_keywords', 'is_preorder', 'preorder_release_date',
    'preorder_limit', 'preorder_deposit_amount', 'preorder_deposit_type',
  ] as const;

  scalarKeys.forEach((key) => appendIfDefined(key, payload[key]));

  payload.images?.forEach((img, i) => {
    if (img.file instanceof File) {
      formData.append(`images[${i}][file]`, img.file);
    } else if (img.path) {
      formData.append(`images[${i}][path]`, img.path);
    }
    if (img.alt_text) formData.append(`images[${i}][alt_text]`, img.alt_text);
    if (img.is_primary !== undefined)
      formData.append(`images[${i}][is_primary]`, img.is_primary ? '1' : '0');
    if (img.sort_order !== undefined)
      formData.append(`images[${i}][sort_order]`, String(img.sort_order));
  });

  payload.variations?.forEach((v, i) => {
    formData.append(`variations[${i}][sku]`, v.sku);
    formData.append(`variations[${i}][price]`, String(v.price));
    formData.append(`variations[${i}][quantity]`, String(v.quantity));
    if (v.is_default !== undefined)
      formData.append(`variations[${i}][is_default]`, v.is_default ? '1' : '0');
    v.variation_values.forEach((val, j) => {
      formData.append(`variations[${i}][variation_values][${j}]`, String(val));
    });
  });

  return formData;
}
