import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CircleCheck } from 'lucide-react';

export default function ShapingTheFuture() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image */}
          <div className="relative">
            <div className="relative w-full max-w-[602px] h-[592px] rounded-[8px] overflow-hidden">
              <Image
                src="/images/about-us/automotive-light-img.jpg"
                alt="Toyota truck with Auxbeam lighting in desert terrain"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Right: Content */}
          <div className='max-w-[646px] h-[382px]'>
            {/* Heading */}
            <h2 className="text-[3xl] md:text-[32px] font-[600] text-[#12100E] mb-[16px]">
              Shaping The Future of Automotive Light.
            </h2>

            {/* Description */}
            <p className="text-[#4D4C44] text-[16px] font-[400] leading-relaxed mb-[40px]">
              We envision a Bangladesh where every vehicle on the road is equipped with reliable,
              energy-efficient lighting solutions. From city commuters to off-road adventurers — we aim
              to be the go-to brand for automotive illumination.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-[64px]">
              <div className="flex items-start gap-3">
                <CircleCheck className="w-[20px] h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[16px] font-[400]">
                  Become Bangladesh's automotive lighting brand
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CircleCheck className="w-[20px] h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[16px] font-[400]">
                  Expand product range to cover all vehicle categories
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CircleCheck className="w-[20px] h-[20px] text-gray-700 flex-shrink-0 mt-0.5" />
                <span className="text-[#4D4C44] text-[16px] font-[400]">
                  Innovate with smart lighting technology solutions
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 sm:gap-3 bg-[#FCE32D] text-black py-2 sm:py-[8px] px-2 sm:px-[8px] pl-4 sm:pl-5 rounded-[4px] font-[600] hover:bg-[#e6cc28] transition-colors text-[16px] sm:text-base"
            >
              <span>Explore Our Products</span>
              <div className="bg-black p-1 rounded-sm flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
