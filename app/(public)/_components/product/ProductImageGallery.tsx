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
    <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-[700px] h-auto lg:h-[682px]">
      {/* Main Image */}
      <div className="relative w-full lg:flex-1 aspect-square lg:aspect-auto bg-white rounded-[8px] overflow-hidden border border-gray-200 flex items-center justify-center lg:order-2">
        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-white rounded-[8px] shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
        >
          <ChevronLeft className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] text-[#000000]" />
        </button>

        <button
          onClick={nextImage}
          className="absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-[#FDDE35] rounded-lg shadow-md flex items-center justify-center hover:bg-[#FACC15] transition-colors z-10"
        >
          <ChevronRight className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] text-[#000000]" />
        </button>

        {/* Favorite Button */}
        <button className="absolute top-2 lg:top-4 right-2 lg:right-4 w-10 h-10 bg-[#F3F4F6] rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors z-10">
          <Heart className="w-5 h-5 text-gray-400" />
        </button>

        <div className="relative w-full h-full p-4 lg:p-8 flex items-center justify-center">
          <Image
            src={images[currentIndex]}
            alt="Product Main Image"
            fill
            className="object-contain p-4 lg:p-8"
          />
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:overflow-x-visible w-full lg:w-24 flex-shrink-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:order-1">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-[91px] h-[87px] rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
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
    </div>
  );
}
