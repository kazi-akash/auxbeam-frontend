'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import ProductForm, { type LocalImage, type LocalVariation } from '../_components/ProductForm';
import { useAdminCreateProduct } from '@/lib/hooks/admin/useAdminProducts';
import { useAdminCategories } from '@/lib/hooks/admin/useAdminCategories';
import { useAdminBrands, useAdminProductModels } from '@/lib/hooks/admin/useAdminBrands';
import { useAdminShippingClasses } from '@/lib/hooks/admin/useAdminShipping';
import { useAdminVariations } from '@/lib/hooks/admin/useAdminVariations';
import type { CreateProductPayload } from '@/lib/types/admin';
import type { Category } from '@/lib/types/catalog';

export default function NewProductPage() {
  const router = useRouter();
  const createProduct = useAdminCreateProduct();

  // Dropdown data
  const { data: categoriesData } = useAdminCategories({ per_page: 200 });
  const { data: brandsData } = useAdminBrands({ per_page: 200 });
  const { data: modelsData } = useAdminProductModels();
  const { data: shippingData } = useAdminShippingClasses();
  const { data: variationTypesRaw } = useAdminVariations();

  // Normalize data shapes
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

  async function handleSubmit(
    payload: CreateProductPayload,
    images: LocalImage[],
    _variations: LocalVariation[]
  ) {
    // Attach new file images to payload
    const newImages = images.filter((img) => !img._delete && img.file);
    const payloadWithImages: CreateProductPayload = {
      ...payload,
      images: newImages.map((img, i) => ({
        file: img.file,
        alt_text: img.alt_text,
        is_primary: img.is_primary,
        sort_order: i,
      })),
    };

    createProduct.mutate(payloadWithImages, {
      onSuccess: () => {
        toast.success('Product created successfully');
        router.push('/admin/products');
      },
      onError: (err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? 'Failed to create product';
        toast.error(msg);
      },
    });
  }

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/admin/products" className="hover:text-gray-700 transition-colors">Products</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-800 font-medium">New Product</span>
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">Add New Product</h1>
      </div>

      <ProductForm
        categories={categories}
        brands={brands}
        models={models}
        shippingClasses={shippingClasses}
        variationTypes={variationTypes}
        onSubmit={handleSubmit}
        loading={createProduct.isPending}
        submitLabel="Create Product"
      />
    </div>
  );
}
