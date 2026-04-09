import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';

// Custom Facebook icon matching lucide-react styling
const Facebook = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Custom Instagram icon matching lucide-react styling
const Instagram = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom Twitter icon matching lucide-react styling
const Twitter = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

// Custom Youtube icon matching lucide-react styling
const Youtube = ({ className = "" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="relative bg-[#000000] text-white mt-auto overflow-hidden font-[family-name:var(--font-geist-sans)]">
      {/* Background Glow Shapes */}
      {/* Top center glow */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '400px',
          height: '300px',
          top: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#c08232ff',
          filter: 'blur(100px)',
          opacity: 0.5,
          zIndex: 0
        }}
      />
      {/* Bottom center glow */}
      <div 
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '700px',
          height: '400px',
          bottom: '-100px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#c08232ff',
          filter: 'blur(100px)',
          opacity: 0.3,
          zIndex: 0
        }}
      />

      <div className="container mx-auto pt-12 md:pt-16 lg:pt-20 relative z-10 px-4 sm:px-6 md:px-8">
        {/* Newsletter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-[#333333] pb-8 md:pb-10 lg:pb-12 mb-8 md:mb-10 lg:mb-12 gap-6 md:gap-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight break-words">
            Sign Up For Our<br />Newsletter Today
          </h2>
          <div className="w-full lg:w-auto">
            <div className="flex w-full lg:w-[450px] bg-white rounded overflow-hidden h-12 sm:h-14">
              <input
                type="email"
                placeholder="Your Email Address"
                className="flex-1 px-4 sm:px-5 text-sm sm:text-base text-black outline-none placeholder:text-gray-500 min-w-0"
              />
              <button className="bg-[#FADE4B] text-black font-semibold px-4 sm:px-6 md:px-8 hover:bg-[#e5c93d] transition-colors whitespace-nowrap flex-shrink-0 text-sm sm:text-base">
                Subscribe
              </button>
            </div>
            <p className="text-gray-100 text-sm md:text-[16px] font-[400] mt-2 md:mt-3 break-words">
              Lighting tips and exclusive weekly ofers
            </p>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-10 lg:gap-8 mb-12 md:mb-14 lg:mb-16">
          {/* Brand Info */}
          <div>
            <div className="w-16 h-12 sm:w-20 sm:h-16 relative mb-4 md:mb-6">
              <Image
                src="/auxbeam-logo.png"
                alt="AuxBeam Bangladesh"
                fill
                className="object-contain object-left"
                priority
                quality={100}
                unoptimized
              />
            </div>
            <p className="text-[#D4D4D8] text-sm md:text-[16px] font-[400] leading-relaxed mb-6 md:mb-8 max-w-sm break-words">
              Auxbeam Bangladesh delivers premium automotive lighting and high-performance LED solutions built for Bangladesh roads.
            </p>
            <div className="space-y-3 md:space-y-4 text-sm text-[#D4D4D8]">
              <div className="flex items-center gap-2 md:gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="break-words">+8809647245931</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">auxbeambangladesh@gmail.com</span>
              </div>
              <div className="flex items-start gap-2 md:gap-3">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                <span className="break-words">House-127, Road-3, Block-A, Mirpur-12, Dhaka, 1216</span>
              </div>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg md:text-xl lg:text-[24px] font-[600] mb-4 md:mb-6">Company</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-[16px] font-[400]">
              <li><Link href="/about-us" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">About Us</Link></li>
              <li><Link href="/shop" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Shop</Link></li>
              <li><Link href="/faq" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Faq</Link></li>
              <li><Link href="/contact" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Contact Us</Link></li>
              <li><Link href="/store" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Our Store</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg md:text-xl lg:text-[24px] font-[600] mb-4 md:mb-6">Categories</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-[16px] font-[400]">
              <li><Link href="/led-light-bulbs" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Led Light Bulbs</Link></li>
              <li><Link href="/off-road-lights" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Off Road Lights</Link></li>
              <li><Link href="/led-light-bars" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Led Light Bars</Link></li>
              <li><Link href="/rgb-led-light" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">RGB Led Light</Link></li>
              <li><Link href="/switch-panel" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Switch Panel</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="lg:ml-auto">
            <h4 className="text-lg md:text-xl lg:text-[24px] font-[600] mb-4 md:mb-6">Help</h4>
            <ul className="space-y-3 md:space-y-4 text-sm md:text-[16px] font-[400]">
              <li><Link href="/track-order" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Track Order</Link></li>
              <li><Link href="/return-policy" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Return Policy</Link></li>
              <li><Link href="/shipping-policy" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Shipping & Delivery Policy</Link></li>
              <li><Link href="/terms" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/privacy" className="text-[#D4D4D8] hover:text-[#FADE4B] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between pt-6 md:pt-8 pb-8 md:pb-10 lg:pb-12 gap-4 md:gap-6 relative z-20">
          {/* Socials */}
          <div className="flex items-center gap-3 md:gap-4 order-1 lg:order-1">
            <a href="#" className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#FADE4B] flex items-center justify-center text-black hover:bg-white transition-colors">
              <Facebook className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
            </a>
            <a href="#" className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#FADE4B] flex items-center justify-center text-black hover:bg-white transition-colors">
              <Instagram className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
            </a>
            <a href="#" className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#FADE4B] flex items-center justify-center text-black hover:bg-white transition-colors">
              <Twitter className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
            </a>
            <a href="#" className="w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] rounded-full bg-[#FADE4B] flex items-center justify-center text-black hover:bg-white transition-colors">
              <Youtube className="w-[20px] h-[20px] sm:w-[22px] sm:h-[22px]" />
            </a>
          </div>

          {/* Payments Mockup */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap justify-center order-2 lg:order-3">
            <div className="bg-white h-7 w-11 sm:h-8 sm:w-12 rounded-sm flex items-center justify-center px-1">
              <span className="text-[8px] sm:text-[9px] font-bold text-[#142C8E] italic">PayPal</span>
            </div>
            <div className="bg-white h-7 w-11 sm:h-8 sm:w-12 rounded-sm flex items-center justify-center">
              <div className="flex -space-x-1.5">
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#EB001B] opacity-90"></div>
                <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div>
              </div>
            </div>
            <div className="bg-white h-7 w-11 sm:h-8 sm:w-12 rounded-sm flex items-center justify-center px-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#1A1F71] italic">VISA</span>
            </div>
            <div className="bg-white h-7 w-12 sm:h-8 sm:w-14 rounded-sm flex items-center justify-center px-1">
              <span className="text-[7px] sm:text-[8px] font-bold text-black tracking-tighter">DISCOVER</span>
            </div>
            <div className="bg-white h-7 w-11 sm:h-8 sm:w-12 rounded-sm flex items-center justify-center">
              <span className="text-[#E60050] font-bold text-base sm:text-lg leading-none transform -skew-x-12">bkash</span>
            </div>
            <div className="bg-white h-7 w-11 sm:h-8 sm:w-12 rounded-sm flex items-center justify-center">
               <span className="text-[#E2136E] font-bold text-[9px] sm:text-[10px]">Nagad</span>
            </div>
            <div className="bg-white h-7 w-11 sm:h-8 sm:w-12 rounded-sm flex items-center justify-center">
               <span className="text-[#006A4E] font-bold text-[9px] sm:text-[10px]">Upay</span>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-sm md:text-[15px] text-[#D4D4D8] text-center lg:text-left break-words order-3 lg:order-2">
            {new Date().getFullYear()} <span className="font-semibold text-white">Auxbeam Bangladesh</span> All Rights Reserved.
          </div>
        </div>

        {/* Divider above watermark */}
        <div className="w-full h-px bg-[#1A1A1A] relative z-20 mb-3 md:mb-4"></div>

        {/* Huge Watermark Background */}
        <div className="relative w-full overflow-hidden select-none pointer-events-none flex justify-center z-10 pt-3 md:pt-4 pb-0">
          <h1 className="text-[8vw] sm:text-[10vw] md:text-[9vw] lg:text-[110px] xl:text-[115px] font-bold whitespace-nowrap leading-none tracking-tight text-[#6A7282] opacity-[0.27]">
            Auxbeam Bangladesh
          </h1>
        </div>
      </div>
    </footer>
  );
}
