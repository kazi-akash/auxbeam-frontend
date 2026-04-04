'use client';

import { useState } from 'react';
import { Search, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  brand: string;
  series: string;
  bulbSize: string;
  warranty: string;
  ledType: string;
  efficacy: string;
  ledQuantity: string;
  effectiveLumen: string;
  currentDraw: string;
  operatingVoltage: string;
  color: string;
  material: string;
  heatDissipation: string;
  ledLifetime: string;
}

export default function ComparePage() {
  const [generalInfoOpen, setGeneralInfoOpen] = useState(true);
  const [specificationsOpen, setSpecificationsOpen] = useState(true);

  const [products, setProducts] = useState<(Product | null)[]>([
    {
      id: '1',
      name: 'Mini Size F2 Series 10000LM 52W LED Headlight',
      price: '23000.99 BDT',
      image: '/images/compare-products/product-1.png',
      brand: 'Auxbeam Bangladesh',
      series: 'GX-ULTRA Series 40000LM',
      bulbSize: '(2pcs) H11/H9/H8',
      warranty: '2 Years',
      ledType: 'MAX 7545 CSP LED(77 mil larger LED)',
      efficacy: '240W',
      ledQuantity: '12pcs   (Single beam socket)\n24pcs  (Hi&Lo  beam socket)',
      effectiveLumen: '40000 LM',
      currentDraw: '10A (±0.2A)',
      operatingVoltage: '9-13V',
      color: '6500K Cool White',
      material: 'Aviation 6063 Aluminum',
      heatDissipation: 'Fan Dissipation',
      ledLifetime: '55000 hours'
    },
    {
      id: '2',
      name: 'GX Bi-Color Series 25000LM 110W LED Headlight',
      price: '16000.99 BDT',
      image: '/images/compare-products/product-2.png',
      brand: 'Auxbeam Bangladesh',
      series: 'GX Bi-Color Series 6500K & 3000K',
      bulbSize: '(2pcs) H11/H9/H8',
      warranty: '2 Years',
      ledType: '6075CSP (75 mil larger LED)',
      efficacy: '110W',
      ledQuantity: '12pcs   (Single beam socket)',
      effectiveLumen: '25000 LM',
      currentDraw: '4.5A (±0.2A)',
      operatingVoltage: '9-13V',
      color: '6500 Cool White & 3000K Golden Yellow',
      material: 'Aviation 6063 Aluminum',
      heatDissipation: 'Fan Dissipation',
      ledLifetime: '50,000 hours'
    },
    null
  ]);

  const removeProduct = (index: number) => {
    const newProducts = [...products];
    newProducts[index] = null;
    setProducts(newProducts);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Single Comparison Card */}
        <div className="bg-white rounded-lg border border-[#E5E7EB]">
          {/* Product Headers */}
          <div className="grid grid-cols-4 border-b border-gray-200">
            <div className="col-span-1 flex flex-col justify-start px-6 border-r border-[#E5E7EB] px-[20px] py-[22px]">
              <h2 className="text-[24px] font-[600] text-[#101114] mb-2">Compare Products</h2>
              <p className="text-[#4D4C44] text-[14px] font-[400] leading-relaxed">
                Select up to 3 products to compare specifications side by side.
              </p>
            </div>
            {products.map((product, index) => (
              <div key={index} className="col-span-1 border-r border-[#E5E7EB] px-[20px] last:border-r-0">
                {product ? (
                  <div className='py-[22px]'>
                    {/* Search Bar */}
                    <div className="relative mb-[20px]">
                      <input
                        type="text"
                        placeholder="Search Products"
                        className="w-full h-10 pl-4 pr-12 rounded-full text-base font-normal focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#F3F4F6] placeholder:text-base placeholder:font-normal"
                      />
                      <Search className="absolute right-3 top-2 w-6 h-6 text-[#6A7282]" />
                    </div>

                    {/* Product Image */}
                    <div className="relative h-48 mb-6 flex items-center justify-center">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-[16px] font-[400] text-[#181910] text-center mb-[12px] min-h-[40px] leading-tight">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-[20px] font-[600] text-[#12100E] text-center mb-[24px]">
                      {product.price}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => removeProduct(index)}
                        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFEDEC] text-[#FF3B30] rounded-[4px] text-[14px] font-[400] hover:bg-red-100 transition-colors flex-1"
                      >
                        <Trash2 className="w-[16px] h-[16px]" />
                        Remove
                      </button>
                      <button className="px-6 py-2.5 bg-[#FDDE35] text-[#12100E] rounded-[4px] text-[14px] font-[600] hover:bg-[#FFC700] transition-colors flex-1">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className='py-[22px]'>
                    {/* Empty State */}
                    <div className="relative mb-6">
                      <input
                        type="text"
                        placeholder="Search Products"
                        className="w-full h-10 pl-4 pr-12  rounded-full text-base font-normal focus:outline-none focus:ring-2 focus:ring-gray-300 bg-[#F3F4F6] placeholder:text-base placeholder:font-normal"
                      />
                      <Search className="absolute right-3 top-2 w-6 h-6 text-[#6A7282]" />
                    </div>
                    <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
                      Find and select product to compare
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* General Information Section */}
          <div>
            <button
              onClick={() => setGeneralInfoOpen(!generalInfoOpen)}
              className="w-full flex items-center justify-between py-4 px-5 text-left border-b border-gray-200 bg-[#F3F4F6]"
            >
              <h2 className="text-[20px] font-[600] text-[#101114]">General Information</h2>
              {generalInfoOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {generalInfoOpen && (
              <div>
                <ComparisonRow
                  label="Brand"
                  values={products.map(p => p?.brand || '')}
                />
                <ComparisonRow
                  label="Series"
                  values={products.map(p => p?.series || '')}
                  isEven
                />
                <ComparisonRow
                  label="Bulb Size"
                  values={products.map(p => p?.bulbSize || '')}
                />
                <ComparisonRow
                  label="Warranty"
                  values={products.map(p => p?.warranty || '')}
                  isEven
                />
              </div>
            )}
          </div>

          {/* Specifications Section */}
          <div>
            <button
              onClick={() => setSpecificationsOpen(!specificationsOpen)}
              className="w-full flex items-center justify-between py-4 px-5 text-left border-b border-gray-200 bg-[#F3F4F6]"
            >
              <h2 className="text-[20px] font-[600] text-[#101114]">Specifications</h2>
              {specificationsOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {specificationsOpen && (
              <div>
                <ComparisonRow
                  label="LED Type"
                  values={products.map(p => p?.ledType || '')}
                />
                <ComparisonRow
                  label="Efficacy(2/pcs)"
                  values={products.map(p => p?.efficacy || '')}
                  isEven
                />
                <ComparisonRow
                  label="LED Quantity(per bulb)"
                  values={products.map(p => p?.ledQuantity || '')}
                />
                <ComparisonRow
                  label="Effective Lumen(2/pcs)"
                  values={products.map(p => p?.effectiveLumen || '')}
                  isEven
                />
                <ComparisonRow
                  label="Current Draw"
                  values={products.map(p => p?.currentDraw || '')}
                />
                <ComparisonRow
                  label="Operating Voltage"
                  values={products.map(p => p?.operatingVoltage || '')}
                  isEven
                />
                <ComparisonRow
                  label="Color"
                  values={products.map(p => p?.color || '')}
                />
                <ComparisonRow
                  label="Material"
                  values={products.map(p => p?.material || '')}
                  isEven
                />
                <ComparisonRow
                  label="Heat Dissipation Mode"
                  values={products.map(p => p?.heatDissipation || '')}
                />
                <ComparisonRow
                  label="LED Lifetime"
                  values={products.map(p => p?.ledLifetime || '')}
                  isEven
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ComparisonRow({ label, values, isEven = false }: { label: string; values: string[]; isEven?: boolean }) {
  return (
    <div className="grid grid-cols-4 border-b border-[#E5E7EB] bg-white">
      <div className="col-span-1 text-[16px] font-[500] text-[#6B7280] px-5 py-4 border-r border-[#E5E7EB] flex items-center">
        {label}
      </div>
      {values.map((value, index) => (
        <div key={index} className="col-span-1 text-[16px] font-[500] text-[#101114] whitespace-pre-line px-5 py-4 border-r border-[#E5E7EB] last:border-r-0 flex items-center">
          {value}
        </div>
      ))}
    </div>
  );
}
