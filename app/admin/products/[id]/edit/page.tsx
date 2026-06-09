'use client';

import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ChevronRight, Loader2 } from 'lucide-react';

import ProductForm, { type LocalImage, type LocalVariation } from '../../_components/ProductForm';
import type { LocalProductService } from '../../_components/ProductServicesPanel';
import {
  useAdminProduct,
  useAdminUpdateProduct,
  useAdminAddProductImages,
  useAdminDeleteProductImage,
  useAdminSetPrimaryImage,
} from '@/lib/hooks/admin/useAdminProducts';
import { useAdminCategories } from '@/lib/hooks/admin/useAdminCategories';
import { useAdminBrands, useAdminProductModels } from '@/lib/hooks/admin/useAdminBrands';
import { useAdminShippingClasses } from '@/lib/hooks/admin/useAdminShipping';
import { useAdminVariations } from '@/lib/hooks/admin/useAdminVariations';
import { useAdminServices, useAdminProductServices } from '@/lib/hooks/admin/useAdminServices';
import api from '@/lib/api/axios';
import type { CreateProductPayload, UpdateProductPayload } from '@/lib/types/admin';
import type { Category } from '@/lib/types/catalog';

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);
  const router = useRouter();

  const { data: product, isLoading } = useAdminProduct(productId);
  const updateProduct = useAdminUpdateProduct();
  const addImages = useAdminAddProductImages();
  const deleteImage = useAdminDeleteProductImage();
  const setPrimary = useAdminSetPrimaryImage();

  // Dropdown data
  const { data: categoriesData } = useAdminCategories({ per_page: 200 });
  const { data: brandsData } = useAdminBrands({ per_page: 200 });
  const { data: modelsData } = useAdminProductModels();
  const { data: shippingData } = useAdminShippingClasses();
  const { data: variationTypesRaw } = useAdminVariations();

  const categories: Category[] = Array.isArray(categoriesData?.data)
    ? categoriesData.data
    : (categoriesData?.data?.data ?? []);
  const brands = Array.isArray(brandsData?.data)
    ? brandsData.data
    : (brandsData?.data?.data ?? []);
  const models = Array.isArray(modelsData?.data)
    ? modelsData.data
    : (modelsData?.data?.data ?? []);
  const shippingClasses = Array.isArray(shippingData?.data)
    ? shippingData.data
    : (shippingData?.data?.data ?? []);
  const variationTypes = Array.isArray(variationTypesRaw) ? variationTypesRaw : [];

  // Services
  const { data: allServices = [] } = useAdminServices();
  const { data: existingProductServices = [] } = useAdminProductServices(productId);

  // Map existing product services to LocalProductService shape
  const initialServices: LocalProductService[] = existingProductServices.map((s) => ({
    service_id:  s.id,
    name:        s.name,
    type:        s.type,
    price:       String(s.price ?? 0),
    is_required: s.is_required ?? false,
    is_active:   s.is_active ?? true,
    conditions:  s.conditions ?? '',
  }));

  async function handleSubmit(
    payload: CreateProductPayload,
    images: LocalImage[],
    _variations: LocalVariation[],
    services: LocalProductService[]
  ) {
    // Build update payload (omit images — handled separately)
    const updatePayload: UpdateProductPayload = {
      ...payload,
      images: undefined,
      deleted_variation_ids: _variations
        .filter((v) => v._delete && v.id)
        .map((v) => v.id as number),
    };

    try {
      await updateProduct.mutateAsync({ id: productId, payload: updatePayload });

      // Handle image deletions
      const toDelete = images.filter((img) => img._delete && img.id);
      await Promise.all(
        toDelete.map((img) => deleteImage.mutateAsync({ productId, imageId: img.id as number }))
      );

      // Handle new image uploads
      const newImages = images.filter((img) => !img._delete && img.file);
      if (newImages.length > 0) {
        await addImages.mutateAsync({
          productId,
          images: newImages.map((img) => ({
            file: img.file as File,
            alt_text: img.alt_text,
            is_primary: img.is_primary,
            sort_order: img.sort_order,
          })),
        });
      }

      // Handle primary image change (existing images only)
      const primaryExisting = images.find((img) => img.is_primary && img.id && !img._delete);
      if (primaryExisting?.id) {
        const originalPrimary = product?.images?.find((img) => img.is_primary);
        if (originalPrimary?.id !== primaryExisting.id) {
          await setPrimary.mutateAsync({ productId, imageId: primaryExisting.id });
        }
      }

      // Sync services (full replace)
      await api.post(`/api/admin/products/${productId}/services/sync`, {
        services: services.map((s) => ({
          service_id:  s.service_id,
          price:       Number(s.price),
          is_required: s.is_required,
          is_active:   s.is_active,
          conditions:  s.conditions || undefined,
        })),
      });

      toast.success('Product updated successfully');
      router.push('/admin/products');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to update product';
      toast.error(msg);
    }
  }

  const isSaving = updateProduct.isPending || addImages.isPending || deleteImage.isPending || setPrimary.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-24 text-gray-500">
        Product not found.{' '}
        <Link href="/admin/products" className="text-amber-600 hover:underline">Back to products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/products" className="hover:text-gray-700 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/admin/products/${productId}`} className="hover:text-gray-700 transition-colors truncate max-w-[200px]">
          {product.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium">Edit</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
        <Link
          href={`/admin/products/${productId}`}
          className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
        >
          View Details
        </Link>
      </div>

      <ProductForm
        initialProduct={product}
        categories={categories}
        brands={brands}
        models={models}
        shippingClasses={shippingClasses}
        variationTypes={variationTypes}
        availableServices={allServices}
        initialServices={initialServices}
        onSubmit={handleSubmit}
        loading={isSaving}
        submitLabel="Save Changes"
      />
    </div>
  );
}
