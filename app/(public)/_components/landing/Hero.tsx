import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full h-[400px] sm:h-[600px] md:h-[650px] lg:h-[700px] flex flex-col justify-center bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/images/landing/hero-section/71ef64f0a132ffbfab7877b54277bf12903f24b2.jpg"
          alt="Auxbeam Automotive Lighting"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Dark Overlay for Text Readability - Enhanced for mobile */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/50 to-black/30 md:from-black/20 md:via-black/40 md:to-transparent"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto z-10 pt-12 sm:pt-16 md:pt-20 px-4 sm:px-6 md:px-8">
        <div className="max-w-2xl">
          <h1 className="font-sans text-2xl xs:text-[32px] sm:text-[40px] md:text-[48px] lg:text-[56px] font-semibold leading-tight tracking-[-0.01em] text-white mb-4 sm:mb-5 md:mb-6 break-words">
            Next-Level <br />
            Automotive Lighting <br />
            Starts Here
          </h1>
          <p className="font-sans text-sm sm:text-[15px] md:text-[16px] font-normal leading-relaxed tracking-[-0.01em] text-gray-200 mb-6 sm:mb-8 md:mb-10 max-w-lg break-words">
            Upgrade your ride with powerful, durable Auxbeam <br className="hidden lg:block" />Led snow available across Bangladesh.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 sm:gap-3 bg-[#FCE32D] text-black py-2 sm:py-[8px] px-2 sm:px-[8px] pl-4 sm:pl-5 rounded-[4px] font-bold hover:bg-[#e6cc28] transition-colors text-sm sm:text-base sm:w-auto justify-center"
          >
            <span>Explore Our Lights</span>
            <div className="bg-black p-1 rounded-sm flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
          </Link>
        </div>
      </div>

      {/* Floating Vehicle Filter Card */}
      {/* <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 px-4">
        <div className="container mx-auto">
          <div className="bg-white rounded-[8px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] p-4 md:p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full flex-grow">
          
                <div className="relative w-full">
                  <select defaultValue="" className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-600 rounded-md px-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                    <option value="" disabled>Select Year</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative w-full">
                  <select defaultValue="" className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-600 rounded-md px-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                    <option value="" disabled>Select Make</option>
                    <option value="toyota">Toyota</option>
                    <option value="ford">Ford</option>
                    <option value="jeep">Jeep</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative w-full">
                  <select defaultValue="" className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-600 rounded-md px-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                    <option value="" disabled>Select Model</option>
                    <option value="tacoma">Tacoma</option>
                    <option value="f150">F-150</option>
                    <option value="wrangler">Wrangler</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative w-full">
                  <select defaultValue="" className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-600 rounded-md px-4 py-3.5 outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer">
                    <option value="" disabled>Select Position</option>
                    <option value="front">Front Bumper</option>
                    <option value="roof">Roof</option>
                    <option value="rear">Rear</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <button className="w-full md:w-auto min-w-[160px] flex items-center justify-center gap-2 bg-[#FCE32D] text-black font-semibold px-8 py-3.5 rounded-md hover:bg-[#e6cc28] transition-colors shrink-0">
                <Search className="w-5 h-5" />
                Search
              </button>
            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
}
