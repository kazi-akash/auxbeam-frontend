'use client';

import { useState } from 'react';
import { Star, ChevronDown, Minus, Plus, ShoppingBag, ShoppingCart } from 'lucide-react';

interface ProductInfoProps {
  product: {
    brand: string;
    name: string;
    rating: number;
    reviews: number;
    sku: string;
    price: number;
    originalPrice: number;
    discount: number;
    inStock: boolean;
  };
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSeries, setSelectedSeries] = useState('F2 Series');
  const [selectedBulbSize, setSelectedBulbSize] = useState('(2pcs) 9005/HB3/H10');
  const [paymentOption, setPaymentOption] = useState('full');

  const seriesOptions = ['F2 Series', 'F-16 Plus Series'];
  const bulbSizes = [
    '(2pcs) 9005/HB3/H10',
    '(2pcs) 9006/HB4',
    '(2pcs) H11/H9/H8',
    '(2pcs) H11/H9/H8',
    '(2pcs) H1',
    '(2pcs) H13/9008',
    '(2pcs) H7'
  ];

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Brand */}
      <div className="text-red-500 text-sm font-medium mb-2">{product.brand}</div>
      
      {/* Title */}
      <h1 className="text-3xl font-medium text-gray-900 leading-tight mb-4">
        {product.name}
      </h1>

      {/* Ratings and SKU */}
      <div className="flex items-center gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="flex text-[#F59E0B]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-gray-500 underline decoration-gray-400 underline-offset-2 cursor-pointer hover:text-gray-700">
            ({product.reviews} Reviews)
          </span>
        </div>
        <div className="text-gray-500">
          Sku: {product.sku}
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-4 mb-3">
        <span className="text-[28px] font-bold text-gray-900">{product.price.toFixed(2)} BDT</span>
        <span className="text-gray-500 line-through text-base font-medium">BDT {product.originalPrice.toFixed(2)}</span>
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
          -{product.discount}% off
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-green-600 font-medium mb-3">
        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
        <span>Available in stock</span>
      </div>

      {/* Series Selection */}
      <div className="flex flex-col gap-3 mb-3">
        <span className="text-gray-900 font-medium">
          Series: <span className="text-gray-500 font-normal ml-1">{selectedSeries}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {seriesOptions.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                selectedSeries === series
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {series}
            </button>
          ))}
        </div>
      </div>

      {/* Bulb Size Selection */}
      <div className="flex flex-col gap-3 mb-3">
        <span className="text-gray-900 font-medium">
          Bulb Size: <span className="text-gray-500 font-normal ml-1">{selectedSeries}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {bulbSizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setSelectedBulbSize(size)}
              className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                selectedBulbSize === size
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity and Service */}
      <div className="grid grid-cols-2 gap-6 mb-3">
        <div className="flex flex-col gap-2">
          <span className="text-gray-900 font-medium">Quantity:</span>
          <div className="flex items-center border border-gray-200 rounded-md h-12 w-32 justify-between px-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-400 hover:text-gray-900"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="font-medium text-gray-900">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-gray-400 hover:text-gray-900"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-gray-900 font-medium">
            Service <span className="text-red-500">*</span>
          </span>
          <div className="relative">
            <select className="w-full h-12 border border-gray-200 rounded-md px-4 appearance-none text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer">
              <option>Home Installation</option>
              <option>Store Installation</option>
              <option>No Installation</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="flex flex-col gap-3 mb-3">
        <span className="text-gray-900 font-medium">Payment Options</span>
        <div className="grid grid-cols-2 gap-4">
          {/* Full Payment */}
          <button
            onClick={() => setPaymentOption('full')}
            className={`flex items-start gap-3 p-4 border rounded-lg text-left transition-colors ${
              paymentOption === 'full' ? 'border-yellow-400 bg-yellow-50/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
              paymentOption === 'full' ? 'border-yellow-400' : 'border-gray-300'
            }`}>
              {paymentOption === 'full' && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-bold text-gray-900 text-base">{product.price.toFixed(2)} BDT</div>
              <div className="text-xs text-gray-500">Online / Cash Payment</div>
            </div>
          </button>

          {/* EMI Option */}
          <button
            onClick={() => setPaymentOption('emi')}
            className={`flex items-start gap-3 p-4 border rounded-lg text-left transition-colors ${
              paymentOption === 'emi' ? 'border-yellow-400 bg-yellow-50/20' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`mt-1 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 ${
              paymentOption === 'emi' ? 'border-yellow-400' : 'border-gray-300'
            }`}>
              {paymentOption === 'emi' && <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="font-bold text-gray-900 text-base">
                499.99 BDT <span className="text-gray-500 font-normal text-xs">/month</span>
              </div>
              <div className="text-xs text-gray-900">Regular Price {product.price.toFixed(2)} BDT</div>
              <div className="text-xs text-gray-500">0% EMI for up to 12 Months</div>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button className="h-12 bg-[#FDE047] hover:bg-[#FACC15] text-gray-900 font-semibold rounded-md flex items-center justify-center gap-2 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          Add to Cart
        </button>
        <button className="h-12 border border-gray-900 text-gray-900 font-semibold rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <ShoppingBag className="w-5 h-5" />
          Buy It Now
        </button>
      </div>
    </div>
  );
}
