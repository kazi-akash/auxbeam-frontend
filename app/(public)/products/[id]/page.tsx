'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  
  return (
    <div className="min-h-screen py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <Link 
          href="/shop"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image Placeholder */}
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              <span className="text-lg">Product Image (ID: {resolvedParams.id})</span>
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-h3 md:text-h2 mb-4">Sample Product Name</h1>
              <p className="text-2xl font-bold text-primary-600 mb-6">$99.99</p>
              
              <div className="prose text-text-secondary mb-8">
                <p>
                  This is a placeholder description for the product details page. 
                  It will eventually be populated with real data from the backend API 
                  based on the product ID ({resolvedParams.id}).
                </p>
                <ul>
                  <li>High quality materials</li>
                  <li>Durable and long-lasting</li>
                  <li>Perfect for everyday use</li>
                </ul>
              </div>
              
              <div className="mt-auto pt-6 border-t border-gray-100">
                <div className="flex gap-4">
                  <div className="w-32">
                    <label htmlFor="quantity" className="sr-only">Quantity</label>
                    <input 
                      type="number" 
                      id="quantity" 
                      defaultValue={1}
                      min={1}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-center"
                    />
                  </div>
                  <button className="flex-1 bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
