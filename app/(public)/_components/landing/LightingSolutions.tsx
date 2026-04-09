import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function LightingSolutions() {
  return (
    <section className="py-10 md:py-16 lg:py-[100px] bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        {/* Top Section - Top-Rated Lighting Solutions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
          {/* Image Left */}
          <div className="relative h-[400px] sm:h-[480px] md:h-[530px] rounded-[8px] overflow-hidden">
            <Image
              src="/images/landing/lighting-solutions/ec666fa61d6b3d15f3de8eb76251e0feb4e1c1df.png"
              alt="Top-Rated Lighting Solutions"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          {/* Content Right */}
          <div className="flex flex-col justify-center">
            <h2 className="text-xl md:text-2xl lg:text-[32px] font-[600] text-[#12100E] mb-3 md:mb-4 leading-tight break-words">
              Top-Rated Lighting Solutions
            </h2>
            <p className="text-[#4D4C44] text-sm md:text-base leading-relaxed mb-4 md:mb-6 break-words">
              Our best-selling products are trusted by thousands of drivers for superior brightness, durability, and unmatched road visibility. Designed with advanced LED technology and engineered for extreme conditions, these products consistently deliver premium performance.
            </p>
            <div>
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 p-2 bg-[#FCE32D] rounded hover:bg-[#e6cc28] transition-colors sm:w-auto justify-center"
              >
                <span className="text-sm md:text-base lg:text-[16px] font-[600] text-[#12100E] tracking-[-0.01em] leading-relaxed pl-3">Shop Now</span>
                <div className="w-8 h-8 bg-[#030712] rounded-[2px] flex items-center justify-center">
                  <ArrowUpRight className="w-[24] h-[24] text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Section - Also Available in New Collection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Content Left */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <h2 className="text-xl md:text-2xl lg:text-[32px] font-[600] text-[#12100E] mb-3 md:mb-4 leading-tight break-words">
              Also Available in New Collection
            </h2>
            <p className="text-[#4D4C44] text-sm md:text-base leading-relaxed mb-4 md:mb-6 break-words">
              Built for adventure seekers and extreme environments, the 2026 Pro Edition light bar delivers powerful flood and spot beam combination lighting for maximum distance and wide coverage. Waterproof, dustproof, and shock-resistant, it's engineered to perform in rain, fog, mud, and rugged terrain.
            </p>
            <div>
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 p-2 bg-[#FCE32D] rounded hover:bg-[#e6cc28] transition-colors sm:w-auto justify-center"
              >
                <span className="text-sm md:text-base lg:text-[16px] font-[600] text-[#12100E] tracking-[-0.01em] leading-relaxed pl-3">Shop Now</span>
                <div className="w-8 h-8 bg-[#030712] rounded-[2px] flex items-center justify-center">
                  <ArrowUpRight className="w-[24] h-[24] text-white" />
                </div>
              </Link>
            </div>
          </div>

          {/* Image Right */}
          <div className="relative h-[400px] sm:h-[480px] md:h-[530px] rounded-[8px] overflow-hidden order-1 lg:order-2">
            <Image
              src="/images/landing/lighting-solutions/aaebc467105da8189f778b0040a0ab95ea8caac6.png"
              alt="Also Available in New Collection"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
