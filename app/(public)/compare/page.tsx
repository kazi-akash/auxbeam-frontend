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
      image: '/images/compare-products/Mini Size F2 Series 10000LM 52W LED Headlight.png',
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
      image: '/images/compare-products/GX Bi-Color Series 25000LM 110W LED Headlight .png',
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
    <div className="min-h-screen bg-[#F5F5F5] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Compare Products</h1>
          <p className="text-sm text-gray-600">
            Select up to 3 products to compare specifications side by side.
          </p>
        </div>

        {/* Single Comparison Card */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Product Headers */}
          <div className="grid grid-cols-4 gap-6 p-6 border-b border-gray-200">
            <div className="col-span-1"></div>
            {products.map((product, index) => (
              <div key={index} className="col-span-1">
                {product ? (
                  <div>
                    {/* Search Bar */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Search Products"
                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                      <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>

                    {/* Product Image */}
                    <div className="relative h-40 mb-4 flex items-center justify-center bg-gray-50 rounded-lg">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={200}
                        height={160}
                        className="object-contain"
                      />
                    </div>

                    {/* Product Name */}
                    <h3 className="text-sm font-medium text-gray-900 text-center mb-3 min-h-[40px]">
                      {product.name}
                    </h3>

                    {/* Price */}
                    <p className="text-lg font-bold text-gray-900 text-center mb-4">
                      {product.price}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => removeProduct(index)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                      <button className="px-6 py-2 bg-[#FFD700] text-gray-900 rounded-lg text-sm font-bold hover:bg-[#FFC700] transition-colors flex-1">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Empty State */}
                    <div className="relative mb-4">
                      <input
                        type="text"
                        placeholder="Search Products"
                        className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      />
                      <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm bg-gray-50 rounded-lg">
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
              className="w-full flex items-center justify-between p-6 text-left border-b border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-900">General Information</h2>
              {generalInfoOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {generalInfoOpen && (
              <div className="px-6 pb-6">
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
              className="w-full flex items-center justify-between p-6 text-left border-b border-gray-200"
            >
              <h2 className="text-lg font-bold text-gray-900">Specifications</h2>
              {specificationsOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </button>

            {specificationsOpen && (
              <div className="px-6 pb-6">
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
    <div className={`grid grid-cols-4 gap-6 py-4 ${isEven ? 'bg-gray-50' : ''}`}>
      <div className="col-span-1 text-sm font-medium text-gray-700">
        {label}
      </div>
      {values.map((value, index) => (
        <div key={index} className="col-span-1 text-sm text-gray-900 whitespace-pre-line">
          {value}
        </div>
      ))}
    </div>
  );
}
