'use client';

import { use } from 'react';
import ProductBreadcrumb from '../../_components/product/ProductBreadcrumb';
import AddToCompareButton from '../../_components/product/AddToCompareButton';
import ProductImageGallery from '../../_components/product/ProductImageGallery';
import ProductInfo from '../../_components/product/ProductInfo';
import ProductDetails from '../../_components/product/ProductDetails';
import YouMayAlsoLike from '../../_components/shop/YouMayAlsoLike';
import { useProduct } from '@/lib/hooks/public/useProducts';

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const { data: product, isLoading } = useProduct(slug);

  // Build image array from API data, fall back to placeholder
  const productImages: string[] =
    product?.images?.length
      ? product.images
          .slice()
          .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
          .map((img: { full_url: string }) => img.full_url)
      : ['/images/product-page/e289c177b94614ad421b2a48e6ed78c26793555a.png'];

  const primaryImage =
    product?.images?.find((img: { is_primary: boolean }) => img.is_primary)?.full_url ??
    product?.images?.[0]?.full_url ??
    '';

  const productInfoData = product
    ? {
        id: product.id,
        slug: product.slug,
        brand: product.brand?.name ?? '',
        name: product.name,
        rating: product.average_rating,
        reviews: product.review_count,
        sku: product.sku,
        price: parseFloat(product.price),
        compare_price: product.compare_price ? parseFloat(product.compare_price) : undefined,
        originalPrice: product.compare_price ? parseFloat(product.compare_price) : undefined,
        discount: product.compare_price
          ? Math.round(
              ((parseFloat(product.compare_price) - parseFloat(product.price)) /
                parseFloat(product.compare_price)) *
                100
            )
          : undefined,
        inStock: product.stock_status
          ? product.stock_status !== 'out_of_stock'
          : product.quantity > 0,
        image: primaryImage,
      }
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen pb-16 font-sans bg-[#F9FAFB]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="flex flex-col lg:flex-row gap-10 mb-[100px] animate-pulse">
            <div className="w-full lg:w-[700px] lg:h-[682px] bg-gray-200 rounded-xl" />
            <div className="w-full space-y-4">
              <div className="h-6 w-32 bg-gray-200 rounded" />
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
              <div className="h-10 w-40 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product || !productInfoData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <p className="text-gray-500">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 font-sans bg-[#F9FAFB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <ProductBreadcrumb productName={product.name} />
          <AddToCompareButton />
        </div>

        <div className="flex flex-col lg:flex-row gap-10 mb-[100px]">
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-[700px] lg:h-[682px]">
            <ProductImageGallery images={productImages} />
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:h-[783px]">
            <ProductInfo product={productInfoData} />
          </div>
        </div>

        {/* Product Details Tabs — pass real product ID for reviews */}
        <ProductDetails
          productId={product.id}
          reviewCount={product.review_count}
        />
      </div>

      {/* You May Also Like Section */}
      <YouMayAlsoLike />
    </div>
  );
}
