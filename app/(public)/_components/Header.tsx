'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { 
  ShoppingBag, 
  User, 
  LogOut, 
  Phone, 
  Mail, 
  Search, 
  ChevronDown,
  GitCompare,
  Package,
  Menu,
  X
} from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      {/* Topbar - Dark Brown */}
      <div className="bg-[#411C09] text-white font-[family-name:var(--font-geist-sans)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-[13.5px] text-sm font-normal">
            {/* Left: Contact Info - Hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center gap-6">
              <a href="tel:+8809647245931" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <Phone className="w-3 h-3" />
                <span>+8809647245931</span>
              </a>
              <a href="mailto:auxbeambangladesh@gmail.com" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <Mail className="w-3 h-3" />
                <span>auxbeambangladesh@gmail.com</span>
              </a>
            </div>

            {/* Center: Promo Message - Full width on mobile, centered on all devices */}
            <div className="flex-1 text-center">
              <span className="text-[14px] font-normal lg:text-sm">Free Shipping Inside the Dhaka !</span>
            </div>

            {/* Right: Utility Links - Hidden on mobile and tablet */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/compare" className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
                <GitCompare className="w-5 h-5" />
                <span>Compare</span>
              </Link>
              <div className="w-px h-4 bg-white"></div>
              <Link href="/track-order" className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
                <Package className="w-5 h-5" />
                <span>Track Order</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar - White */}
      <div className="bg-[#F9FAFB] font-[family-name:var(--font-geist-sans)]" style={{ fontSize: '16px', fontWeight: 400, color: '#12100E' }}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Left Section - Menu & Search Icon */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:text-primary-600 transition-colors"
                style={{ color: '#12100E' }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              {/* Mobile Search Icon */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="hover:text-primary-600 transition-colors"
                style={{ color: '#12100E' }}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Logo - Centered on mobile, left on desktop */}
            <Link href="/" className="flex items-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <div className="w-14 h-[49px] lg:w-20 lg:h-16 relative">
                <Image 
                  src="/auxbeam-logo.png" 
                  alt="AuxBeam Bangladesh" 
                  fill 
                  className="object-contain" 
                  priority
                  quality={100}
                  unoptimized
                />
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link 
                href="/shop" 
                className="flex items-center gap-1 hover:text-primary-600 transition-colors group"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                Shop
              </Link>
              <Link 
                href="/off-road-lights" 
                className="flex items-center gap-1 hover:text-primary-600 transition-colors group"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                Off Road Lights
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>
              <Link 
                href="/led-light-bulbs" 
                className="flex items-center gap-1 hover:text-primary-600 transition-colors group"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                Led Light Bulbs
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>
              <Link 
                href="/pre-order" 
                className="flex items-center gap-1 hover:text-primary-600 transition-colors group"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                Pre-Order
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>
            </nav>

            {/* Desktop Actions - Right side */}
            <div className="hidden lg:flex items-center gap-6">
              {/* Desktop Search Bar */}
              <div className="flex items-center">
                <div className="relative w-full max-w-xs">
                  <input
                    type="text"
                    placeholder="Search Products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-5 pr-12 py-2.5 bg-[#F3F4F6] border-none rounded-full focus:ring-2 focus:ring-primary-500 placeholder:text-[#6B7280] outline-none"
                    style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                  />
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-primary-600 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Cart */}
              <Link 
                href="/cart" 
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-text-primary text-caption-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </Link>

              {/* User */}
              {mounted && user ? (
                <div className="flex items-center gap-3">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                    style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                  >
                    <User className="w-5 h-5" />
                    <span>Account</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    className="text-text-secondary hover:text-error transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                  style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Actions - Right side */}
            <div className="flex lg:hidden items-center gap-4">
              {/* Cart */}
              <Link 
                href="/cart" 
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-500 text-text-primary text-caption-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>

              {/* User */}
              {mounted && user ? (
                <Link 
                  href="/dashboard" 
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                  style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                >
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                  style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                >
                  <User className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Search Bar - Toggleable */}
          {mobileSearchOpen && (
            <div className="lg:hidden pb-4 pt-2">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search Products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-5 pr-12 py-2.5 bg-[#F3F4F6] border-none rounded-full focus:ring-2 focus:ring-primary-500 placeholder:text-[#6B7280] outline-none"
                  style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                  autoFocus
                />
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-primary-600 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg font-[family-name:var(--font-geist-sans)]" style={{ fontSize: '16px', fontWeight: 400, color: '#12100E' }}>
          <nav className="container mx-auto py-4 flex flex-col gap-4">
            <Link 
              href="/shop" 
              className="flex items-center justify-between hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>
            <Link 
              href="/off-road-lights" 
              className="flex items-center justify-between hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Off Road Lights
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link 
              href="/led-light-bulbs" 
              className="flex items-center justify-between hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Led Light Bulbs
              <ChevronDown className="w-4 h-4" />
            </Link>
            <Link 
              href="/pre-order" 
              className="flex items-center justify-between hover:text-primary-600 transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pre-Order
              <ChevronDown className="w-4 h-4" />
            </Link>
            
            {/* Mobile Utility Links */}
            <div className="border-t border-gray-200 pt-4 mt-2 flex flex-col gap-4">
              <Link 
                href="/compare" 
                className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GitCompare className="w-4 h-4" />
                Compare
              </Link>
              <Link 
                href="/track-order" 
                className="flex items-center gap-2 text-text-secondary hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Package className="w-4 h-4" />
                Track Order
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
