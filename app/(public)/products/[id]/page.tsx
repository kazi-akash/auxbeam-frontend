'use client';

import { use } from 'react';
import ProductBreadcrumb from '../../_components/product/ProductBreadcrumb';
import AddToCompareButton from '../../_components/product/AddToCompareButton';
import ProductImageGallery from '../../_components/product/ProductImageGallery';
import ProductInfo from '../../_components/product/ProductInfo';
import ProductDetails from '../../_components/product/ProductDetails';

// Mock product data - replace with API call
const productImages = [
  '/images/product-page/0a36f9424ceea4dd8e2c5771a4fe667bf06b1c05.png',
  '/images/product-page/175cb2045d9eadebb9b3646538100cceec977f5b.png',
  '/images/product-page/601fefc1be330aa0950697206cca431407646b2c.png',
  '/images/product-page/970bcc58ca13f00990838ef6d3390b3dbfaf58a2.png',
  '/images/product-page/ac3cbd43533b64de853fe18576e1cbeea2508ce9.png',
  '/images/product-page/b6a4b256e3c6103db64e0d72fe0ec678c04ba54b.png',
  '/images/product-page/e289c177b94614ad421b2a48e6ed78c26793555a.png',
  '/images/product-page/e7aa12090fbb37ec36b731b528b68a0fd475cff2.png',
];

const mockProduct = {
  brand: 'Auxbeam',
  name: 'Mini Size F2 Series 10000LM 52W LED Headlight Bulbs 6500K Cool White',
  rating: 5,
  reviews: 132,
  sku: 'GD001212',
  price: 6000.99,
  originalPrice: 7000.99,
  discount: 10,
  inStock: true,
};

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  // Mock fetching product based on ID
  const product = mockProduct;
  
  return (
    <div className="min-h-screen pb-16 font-sans">
      <div className="container mx-auto px-4 pt-8">
        <div className="flex items-center justify-between mb-8">
          <ProductBreadcrumb productName={product.name} />
          <AddToCompareButton />
        </div>
        
        <div className="bg-white flex flex-col lg:flex-row gap-10 mb-12">
          {/* Left Column: Image Gallery */}
          <div className="w-full lg:w-1/2">
            <ProductImageGallery images={productImages} />
          </div>

          {/* Right Column: Product Info */}
          <div className="w-full lg:w-1/2">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Details Tabs */}
        <ProductDetails reviewCount={product.reviews} />

        {/* review section */}
      </div>
    </div>
  );
}
