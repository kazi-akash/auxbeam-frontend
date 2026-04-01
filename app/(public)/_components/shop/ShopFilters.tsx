'use client';

import { Minus } from 'lucide-react';
import { useState } from 'react';

interface Category {
  id: number;
  name: string;
  count?: number;
}

interface Series {
  id: string;
  name: string;
  count?: number;
}

interface BulbSize {
  id: string;
  name: string;
  count?: number;
}

interface ShopFiltersProps {
  categories?: Category[];
  selectedCategory?: number;
  onCategoryChange: (categoryId?: number) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedSeries: string[];
  onSeriesChange: (series: string[]) => void;
  selectedBulbSizes: string[];
  onBulbSizeChange: (sizes: string[]) => void;
}

const seriesOptions: Series[] = [
  { id: 'gx', name: 'GX Series' },
  { id: 'gx-plug-play', name: 'GX Plug&Play Series' },
  { id: 'gx-ultra', name: 'GX-Ultra Series' },
  { id: 'gx-bi-color', name: 'GX Bi-Color Series' },
  { id: 'gx-bi-color-smart', name: 'GX Bi-Color Smart Series App Control' },
];

const bulbSizeOptions: BulbSize[] = [
  { id: 'h11-h8-h9', name: '(2pcs) H11/H9/H8' },
  { id: '9005-hb3-h10', name: '(2pcs) 9005/HB3/H10' },
  { id: '9006-hb4', name: '(2pcs) 9006/HB4' },
  { id: '9012-hir2', name: '(2pcs) 9012/HIR2' },
  { id: 'h7', name: '(2pcs) H7' },
  { id: 'h4', name: '(2pcs) H4' },
  { id: 'h1', name: '(2pcs) H1' },
];

const lightBarShapeOptions = [
  { id: 'straight', name: 'Straight' },
  { id: 'curved', name: 'Curved' },
];

export default function ShopFilters({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedSeries,
  onSeriesChange,
  selectedBulbSizes,
  onBulbSizeChange,
}: ShopFiltersProps) {
  const [selectedLightBarShapes, setSelectedLightBarShapes] = useState<string[]>([]);

  const handleSeriesToggle = (seriesId: string) => {
    if (selectedSeries.includes(seriesId)) {
      onSeriesChange(selectedSeries.filter(s => s !== seriesId));
    } else {
      onSeriesChange([...selectedSeries, seriesId]);
    }
  };

  const handleBulbSizeToggle = (sizeId: string) => {
    if (selectedBulbSizes.includes(sizeId)) {
      onBulbSizeChange(selectedBulbSizes.filter(s => s !== sizeId));
    } else {
      onBulbSizeChange([...selectedBulbSizes, sizeId]);
    }
  };

  const handleLightBarShapeToggle = (shapeId: string) => {
    if (selectedLightBarShapes.includes(shapeId)) {
      setSelectedLightBarShapes(selectedLightBarShapes.filter(s => s !== shapeId));
    } else {
      setSelectedLightBarShapes([...selectedLightBarShapes, shapeId]);
    }
  };

  return (
    <aside className="w-full bg-white rounded-lg border border-gray-200 p-6 space-y-8">
      {/* Search Section */}
      <div>
        <h3 className="text-[20px] font-semibold text-gray-900 mb-4">Search</h3>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Availability Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-semibold text-gray-900">Availability</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Minus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="ml-3 text-[15px] text-gray-600 group-hover:text-gray-900">
                In Stock
              </span>
            </div>
            <span className="text-[15px] text-gray-400">(55)</span>
          </label>
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="ml-3 text-[15px] text-gray-600 group-hover:text-gray-900">
                Out of Stock
              </span>
            </div>
            <span className="text-[15px] text-gray-400">(08)</span>
          </label>
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-semibold text-gray-900">Price Range</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Minus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100000"
              value={priceRange[1]}
              onChange={(e) => onPriceRangeChange([priceRange[0], parseInt(e.target.value)])}
              className="w-full h-1 bg-gray-900 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-gray-900 [&::-webkit-slider-thumb]:cursor-pointer"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded px-3 py-2 text-center">
              <span className="text-[13px] text-gray-600">BDT {priceRange[0].toFixed(2)}</span>
            </div>
            <div className="border border-gray-200 rounded px-3 py-2 text-center">
              <span className="text-[13px] text-gray-600">BDT {priceRange[1].toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Series Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-semibold text-gray-900">Series</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Minus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {seriesOptions.map((series) => (
            <label key={series.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedSeries.includes(series.id)}
                onChange={() => handleSeriesToggle(series.id)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="ml-3 text-[15px] text-gray-600 group-hover:text-gray-900">
                {series.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Bulb Size Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-semibold text-gray-900">Bulb Size</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Minus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {bulbSizeOptions.map((size) => (
            <label key={size.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedBulbSizes.includes(size.id)}
                onChange={() => handleBulbSizeToggle(size.id)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="ml-3 text-[15px] text-gray-600 group-hover:text-gray-900">
                {size.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Light Bar Shape Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[20px] font-semibold text-gray-900">Light Bar Shape</h3>
          <button className="text-gray-400 hover:text-gray-600">
            <Minus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {lightBarShapeOptions.map((shape) => (
            <label key={shape.id} className="flex items-center cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedLightBarShapes.includes(shape.id)}
                onChange={() => handleLightBarShapeToggle(shape.id)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
              <span className="ml-3 text-[15px] text-gray-600 group-hover:text-gray-900">
                {shape.name}
              </span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
