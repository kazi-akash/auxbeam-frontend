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
    // '(2pcs) H11/H9/H8',
    // '(2pcs) H11/H9/H8',
    '(2pcs) H1',
    '(2pcs) H13/9008',
    '(2pcs) H7'
  ];

  return (
    <div className="flex flex-col w-full font-sans">
      {/* Brand */}
      <div className="text-[#FF3B30] text-[14px] font-[500] mb-2">{product.brand}</div>
      
      {/* Title */}
      <h1 className="text-[24px] font-[500] text-[#181910] leading-tight mb-4">
        {product.name}
      </h1>

      {/* Ratings and SKU */}
      <div className="flex items-center gap-6 text-sm mb-3">
        <div className="flex items-center gap-2">
          <div className="flex text-[#FF8904]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-[16px] h-[16px] ${i < product.rating ? 'fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <span className="text-[#4D4C44] text-[14px] font-[400] underline decoration-gray-400 underline-offset-2 cursor-pointer hover:text-gray-700">
            ({product.reviews} Reviews)
          </span>
        </div>
        <div className="text-[#12100E] text-[16px] font-[400]">
          Sku: {product.sku}
        </div>
      </div>

      {/* Pricing */}
      <div className="flex items-center gap-4 pb-4 border-b border-[#E5E7EB] mb-5">
        <span className="text-[24px] font-[600] text-[#12100E]">{product.price.toFixed(2)} BDT</span>
        <span className="text-[#4D4C44] line-through text-[16px] font-[400]">BDT {product.originalPrice.toFixed(2)}</span>
        <span className="bg-[#FF3B30] text-white text-[12px] font-[600] px-2 py-1 rounded-[2px]">
          -{product.discount}% off
        </span>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-[#00A63E] font-medium mb-3">
        <div className="w-[16px] h-[16px] rounded-full bg-[#00A63E] border-2 border-[#E5E7EB]"></div>
        <span className="text-[160x] font-[600]">Available in stock</span>
      </div>

      {/* Series Selection */}
      <div className="flex flex-col gap-3 mb-[20px]">
        <span className="text-[#12100E] text-[16px] font-[500]">
          Series: <span className="text-[#4D4C44] text-[16px] font-[400] ml-1">{selectedSeries}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {seriesOptions.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                selectedSeries === series
                  ? 'border-[#030712] text-[#12100E] text-[16px] font-[500]'
                  : 'border-gray-200 text-[16px] font-[400] text-[#6A7282] hover:border-gray-500'
              }`}
            >
              {series}
            </button>
          ))}
        </div>
      </div>

      {/* Bulb Size Selection */}
      <div className="flex flex-col gap-3 mb-[20px]">
        <span className="text-[#12100E] text-[16px] font-[500]">
          Bulb Size: <span className="text-[#4D4C44] text-16px font-[400] ml-1">{selectedSeries}</span>
        </span>
        <div className="flex flex-wrap gap-2">
          {bulbSizes.map((size, index) => (
            <button
              key={index}
              onClick={() => setSelectedBulbSize(size)}
              className={`p-[8px] border rounded-md text-[16px] font-500 transition-colors ${
                selectedBulbSize === size
                  ? 'border-gray-900 text-[#181910]'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity and Service */}
      <div className="flex gap-6 mb-[20px]">
        <div className="flex flex-col gap-2 w-[206px]">
          <span className="text-[#12100E] text-[16px] font-[500]">Quantity:</span>
          <div className="flex items-center border border-gray-200 rounded-md h-12 w-full justify-between px-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="text-gray-400 hover:text-[#181910]"
            >
              <Minus className="w-[10px] h-[24px] text-[#6A7282]" />
            </button>
            <span className="text-[16px] font-[600]] text-[#12100E]">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-gray-400 hover:text-[#181910]"
            >
              <Plus className="w-[10px] h-[24px] text-[#161617] text-[16px] font-[600]" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-[206px]">
          <span className="text-[#181910] text-[16px] font-[500]">
            Service <span className="text-red-500">*</span>
          </span>
          <div className="relative">
            <select className="w-full h-12 border border-gray-200 rounded-md px-4 appearance-none text-[14px] font-[400] text-[#6A7282] bg-white focus:outline-none focus:ring-1 focus:ring-gray-900 cursor-pointer">
              <option>Home Installation</option>
              <option>Store Installation</option>
              <option>No Installation</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Payment Options */}
      <div className="flex flex-col gap-3 mb-[20px]">
        <span className="text-[#12100E] text-[16px] font-[500]">Payment Options</span>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Full Payment */}
          <button
            onClick={() => setPaymentOption('full')}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-colors ${
              paymentOption === 'full' ? 'border-[#FACD15]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentOption === 'full' ? 'border-[#FACD15]' : 'border-gray-300'
            }`}>
              {paymentOption === 'full' && <div className="w-2.5 h-2.5 bg-[#FACD15] rounded-full" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[16px] font-[500] text-[#12100E] text-base">{product.price.toFixed(2)} BDT</div>
              <div className="text-[12px] text-[#4D4C44] font-[400]">Online / Cash Payment</div>
            </div>
          </button>

          {/* EMI Option */}
          <button
            onClick={() => setPaymentOption('emi')}
            className={`flex items-center gap-3 p-4 border-2 rounded-lg text-left transition-colors ${
              paymentOption === 'emi' ? 'border-[#FACD15]' : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              paymentOption === 'emi' ? 'border-[#FACD15]' : 'border-gray-300'
            }`}>
              {paymentOption === 'emi' && <div className="w-2.5 h-2.5 bg-[#FACD15] rounded-full" />}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[16px] font-[500] text-[#12100E] text-base">
                499.99 BDT <span className="text-[#4D4C44] font-[500] text-[16px]">/month</span>
              </div>
              <div className="text-[12px] font-[400] text-[#12100E]">Regular Price {product.price.toFixed(2)} BDT</div>
              <div className="text-[12px] font-[400] text-[#4D4C44]">0% EMI for up to 12 Months</div>
            </div>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button className="h-12 bg-[#FDDE35] hover:bg-[#FACC15] text-[#181910] text-[14px] font-[600] rounded-md flex items-center justify-center gap-2 transition-colors">
          <ShoppingBag className="w-[16px] h-[16px]" />
          Add to Cart
        </button>
        <button className="h-12 border border-gray-900 text-[#181910] text-[14px] font-[600] rounded-md flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <ShoppingBag className="w-[16px] h-[16px]" />
          Buy It Now
        </button>
      </div>
    </div>
  );
}
