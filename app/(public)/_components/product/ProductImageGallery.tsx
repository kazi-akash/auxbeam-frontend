'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, Play } from 'lucide-react';

interface ProductImageGalleryProps {
  images: string[];
}

export default function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="flex gap-4 h-[600px]">
      {/* Thumbnails */}
      <div className="flex flex-col gap-3 overflow-y-auto w-24 flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
              idx === currentIndex ? 'border-yellow-400' : 'border-transparent hover:border-gray-200'
            }`}
          >
            <Image 
              src={img} 
              alt={`Thumbnail ${idx + 1}`} 
              fill 
              className="object-cover bg-black" 
            />
            {/* Optional Play Icon for the first thumbnail if we assume it's a video based on the screenshot */}
            {idx === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center shadow-sm">
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10 border border-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#FDE047] rounded-lg shadow-md flex items-center justify-center hover:bg-[#FACC15] transition-colors z-10"
        >
          <ChevronRight className="w-5 h-5 text-gray-900" />
        </button>

        {/* Favorite Button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>

        <div className="relative w-full h-full p-8 flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt="Product Main Image"
            fill
            className="object-contain p-8"
          />
        </div>
      </div>
    </div>
  );
}
