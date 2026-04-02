import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

export default function CallToAction() {
  return (
    <section className="pb-[100px] bg-white">
      <div className="container mx-auto px-4">
        <div className="relative h-[480px] rounded-[8px] overflow-hidden">
          {/* Background Image */}
          <Image
            src="/images/landing/call-to-action/c1acdb2bacb1d9c5c1dbfabccc9c76501bfa9f72.jpg"
            alt="Safer Roads Start with Better Lighting"
            fill
            sizes="100vw"
            className="object-cover"
            priority={false}
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/20" />
          
          {/* Content */}
          <div className="relative h-full flex items-center">
            <div className="max-w-2xl px-8 lg:px-16">
              {/* Heading */}
              <h2 className="text-[40px] lg:text-[56px] font-semibold text-white mb-4 leading-tight">
                Safer Roads Start with Better{' '}
                <span className="text-[#FCE32D]">Lighting</span>
              </h2>
              
              {/* Description */}
              <p className="text-white/90 text-[16px] leading-relaxed mb-6 max-w-[450px]">
                Protect yourself and your loved ones with powerful, precision engineered LED light bulbs designed for maximum visibility and long-term reliability.
              </p>
              
              {/* Button */}
              <Link 
                href="/shop"
                className="inline-flex items-center gap-2 p-2 bg-[#FCE32D] rounded hover:bg-[#e6cc28] transition-colors"
              >
                <span className="text-base font-semibold text-[#12100E] tracking-[-0.01em] leading-[150%] pl-3">Shop Now</span>
                <div className="w-8 h-8 bg-[#030712] rounded-[2px] flex items-center justify-center">
                  <ArrowUpRight className="w-[24] h-[24] text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
