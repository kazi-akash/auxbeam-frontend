'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { useCategories } from '@/lib/hooks/public/useCategories';
import type { Category } from '@/lib/types/catalog';
import {
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Phone,
  Mail,
  Search,
  ChevronDown,
  GitCompare,
  Package,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import { useWishlist } from '@/lib/hooks/customer/useWishlist';

gsap.registerPlugin(ScrollTrigger);

// ─── Desktop megamenu ─────────────────────────────────────────────────────────
// Two-panel layout: left sidebar = mid-level categories (hover to select),
// right panel = sub-categories of the active mid-level item as a card grid.

function MegaMenuDropdown({
  category,
  containerRef,
}: {
  category: Category;
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasChildren = (category.children?.length ?? 0) > 0;

  // Reset active index when panel opens
  useEffect(() => {
    if (open) setActiveIdx(0);
  }, [open]);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      )
        return;
      setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [open]);

  if (!hasChildren) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className="flex items-center gap-1 hover:text-primary-600 transition-colors whitespace-nowrap"
        style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
      >
        {category.name}
      </Link>
    );
  }

  function getPanelStyle(): React.CSSProperties {
    if (!containerRef.current || !triggerRef.current) return {};
    const navRect = containerRef.current.getBoundingClientRect();
    const trigRect = triggerRef.current.getBoundingClientRect();
    return { left: navRect.left - trigRect.left, width: navRect.width };
  }

  const midCategories = category.children ?? [];
  const activeMid = midCategories[activeIdx] ?? midCategories[0];
  const subCategories = activeMid?.children ?? [];

  function handleOpen() {
    setOpen(true);
    if (panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.22, ease: 'power2.out' }
      );
    }
  }

  function handleClose(related: Node | null) {
    if (panelRef.current?.contains(related)) return;
    if (panelRef.current) {
      gsap.to(panelRef.current, {
        opacity: 0,
        y: -6,
        duration: 0.16,
        ease: 'power2.in',
        onComplete: () => setOpen(false),
      });
    } else {
      setOpen(false);
    }
  }

  return (
    <div
      ref={triggerRef}
      className="relative"
      onMouseEnter={handleOpen}
      onMouseLeave={(e) => handleClose(e.relatedTarget as Node)}
    >
      {/* Nav trigger */}
      <button
        onClick={() => (open ? setOpen(false) : handleOpen())}
        aria-expanded={open}
        aria-haspopup="true"
        className={`relative flex items-center gap-1.5 whitespace-nowrap text-[15px] font-normal transition-colors duration-150 ${
          open ? 'text-primary-600' : 'text-[#12100E] hover:text-primary-600'
        }`}
      >
        {category.name}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        {/* underline indicator */}
        <span className={`absolute -bottom-[22px] left-0 right-0 h-[3px] bg-primary-500 rounded-t transition-opacity duration-150 ${open ? 'opacity-100' : 'opacity-0'}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          style={{ ...getPanelStyle(), opacity: 0 }}
          className="absolute top-full z-[9999] bg-white shadow-[0_16px_48px_-8px_rgba(0,0,0,0.18)]"
          onMouseLeave={(e) => {
            if (triggerRef.current?.contains(e.relatedTarget as Node)) return;
            if (panelRef.current) {
              gsap.to(panelRef.current, {
                opacity: 0,
                y: -6,
                duration: 0.16,
                ease: 'power2.in',
                onComplete: () => setOpen(false),
              });
            } else {
              setOpen(false);
            }
          }}
        >
          {/* 3px brand top border */}
          <div className="h-[3px] bg-primary-500 w-full" />

          <div className="flex" style={{ minHeight: '340px' }}>

            {/* ── LEFT SIDEBAR: mid-level category list ── */}
            <div className="w-[260px] flex-shrink-0 bg-[#FAFAFA] border-r border-gray-100 py-3">
              {/* "Shop All" row at top */}
              <Link
                href={`/category/${category.slug}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between px-5 py-2.5 mx-3 mb-1 rounded-lg text-[13px] font-semibold text-primary-600 hover:bg-primary-50 transition-colors group"
              >
                <span>Shop All {category.name}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>

              <div className="mx-3 my-2 h-px bg-gray-200" />

              {/* Mid-level items */}
              <ul className="flex flex-col gap-0.5 px-3">
                {midCategories.map((mid, idx) => {
                  const isActive = idx === activeIdx;
                  return (
                    <li key={mid.id}>
                      <button
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-100 text-left ${
                          isActive
                            ? 'bg-white shadow-sm text-gray-900 font-semibold border border-gray-100'
                            : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm hover:border hover:border-gray-100'
                        }`}
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => setActiveIdx(idx)}
                      >
                        <span>{mid.name}</span>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-colors ${isActive ? 'text-primary-500' : 'text-gray-300'}`} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ── RIGHT PANEL: sub-categories of active mid-level ── */}
            <div className="flex-1 bg-white py-6 px-8 flex flex-col">

              {/* Panel header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <span className="w-[3px] h-5 bg-primary-500 rounded-full" />
                  <span className="text-[15px] font-bold text-gray-900">{activeMid?.name}</span>
                </div>
                <Link
                  href={`/category/${activeMid?.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex items-center gap-1.5 text-[13px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  View all
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>

              {subCategories.length > 0 ? (
                /* Sub-category card grid */
                <div className="grid grid-cols-4 gap-3">
                  {subCategories.map((sub) => (
                    <Link
                      key={sub.id}
                      href={`/category/${sub.slug}`}
                      onClick={() => setOpen(false)}
                      className="group flex flex-col items-start gap-2 p-3 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/40 transition-all duration-150"
                    >
                      {/* Icon placeholder — square with first letter */}
                      <div className="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors flex items-center justify-center flex-shrink-0">
                        <span className="text-[13px] font-bold text-gray-400 group-hover:text-primary-600 transition-colors uppercase">
                          {sub.name.charAt(0)}
                        </span>
                      </div>
                      <span className="text-[13px] font-medium text-gray-700 group-hover:text-primary-600 transition-colors leading-snug">
                        {sub.name}
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                /* No sub-categories: plain CTA */
                <div className="flex items-center justify-center flex-1">
                  <Link
                    href={`/category/${activeMid?.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
                  >
                    Browse {activeMid?.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile accordion — 3 levels ─────────────────────────────────────────────

function MobileSubItem({ category, onClose }: { category: Category; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const hasSubs = (category.children?.length ?? 0) > 0;

  return (
    <div className="pl-3 border-l border-gray-100">
      {hasSubs ? (
        <>
          <button
            className="w-full flex items-center justify-between py-2 text-sm text-gray-700 hover:text-primary-600 transition-colors"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{category.name}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>
          {open && (
            <div className="pl-3 flex flex-col border-l border-gray-100 mb-1">
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className="py-1.5 text-xs font-medium text-primary-600 hover:underline"
              >
                All {category.name}
              </Link>
              {category.children!.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/category/${sub.slug}`}
                  onClick={onClose}
                  className="py-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={`/category/${category.slug}`}
          onClick={onClose}
          className="block py-2 text-sm text-gray-700 hover:text-primary-600 transition-colors"
        >
          {category.name}
        </Link>
      )}
    </div>
  );
}

function MobileNavItem({ category, onClose }: { category: Category; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const hasChildren = (category.children?.length ?? 0) > 0;

  if (!hasChildren) {
    return (
      <Link
        href={`/category/${category.slug}`}
        className="flex items-center justify-between hover:text-primary-600 transition-colors py-2.5"
        onClick={onClose}
      >
        {category.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        className="w-full flex items-center justify-between hover:text-primary-600 transition-colors py-2.5 font-medium"
        onClick={() => setOpen((v) => !v)}
      >
        <span>{category.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="flex flex-col gap-0.5 mb-2">
          <Link
            href={`/category/${category.slug}`}
            onClick={onClose}
            className="pl-3 py-1.5 text-sm font-medium text-primary-600 hover:underline"
          >
            All {category.name}
          </Link>
          {category.children!.map((mid) => (
            <MobileSubItem key={mid.id} category={mid} onClose={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const { user, logout } = useAuth();
  const { items, itemCount, total, removeItem } = useCart();
  const { data: wishlistItems } = useWishlist({ enabled: !!user });
  const [cartOpen, setCartOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const { data: categories } = useCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  // Ref passed to megamenu so it can anchor its panel to the navbar width
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll-driven header shadow / background lift
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const mainNav = el.querySelector<HTMLDivElement>('[data-main-nav]');
    if (!mainNav) return;

    const onScroll = () => {
      const scrolled = window.scrollY > 10;
      gsap.to(mainNav, {
        boxShadow: scrolled
          ? '0 4px 24px -4px rgba(0,0,0,0.12)'
          : '0 0 0 0 rgba(0,0,0,0)',
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animate mobile menu open/close
  useEffect(() => {
    const el = mobileMenuRef.current;
    if (!el) return;

    if (mobileMenuOpen) {
      gsap.fromTo(
        el,
        { opacity: 0, y: -12 },
        { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
      );
    }
  }, [mobileMenuOpen]);

  const topLevelCategories: Category[] = Array.isArray(categories)
    ? categories.filter((c: Category) => c.parent_id === null && c.is_active)
    : [];

  return (
    <header ref={headerRef} className="sticky top-0 z-50">
      {/* Topbar */}
      <div className="bg-[#411C09] text-white font-[family-name:var(--font-geist-sans)]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-[13.5px] text-sm font-normal">
            <div className="hidden lg:flex items-center gap-6">
              <a
                href="tel:+8809647245931"
                className="flex items-center gap-2 hover:text-primary-500 transition-colors"
              >
                <Phone className="w-3 h-3" />
                <span>+8809647245931</span>
              </a>
              <a
                href="mailto:auxbeambangladesh@gmail.com"
                className="flex items-center gap-2 hover:text-primary-500 transition-colors"
              >
                <Mail className="w-3 h-3" />
                <span>auxbeambangladesh@gmail.com</span>
              </a>
            </div>

            <div className="flex-1 text-center">
              <span className="text-[14px] font-normal lg:text-sm">
                Free Shipping Inside the Dhaka !
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/compare"
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <GitCompare className="w-5 h-5" />
                <span>Compare</span>
              </Link>
              <div className="w-px h-4 bg-white" />
              <Link
                href="/track-order"
                className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
              >
                <Package className="w-5 h-5" />
                <span>Track Order</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        data-main-nav
        className="bg-[#F9FAFB] font-[family-name:var(--font-geist-sans)]"
        style={{ fontSize: '16px', fontWeight: 400, color: '#12100E' }}
      >
        <div ref={navContainerRef} className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile: menu + search toggle */}
            <div className="flex lg:hidden items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="hover:text-primary-600 transition-colors"
                style={{ color: '#12100E' }}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="hover:text-primary-600 transition-colors"
                style={{ color: '#12100E' }}
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0"
            >
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

            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/shop"
                className="flex items-center gap-1 hover:text-primary-600 transition-colors whitespace-nowrap"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                Shop
              </Link>

              {topLevelCategories.map((cat) => (
                <MegaMenuDropdown key={cat.id} category={cat} containerRef={navContainerRef} />
              ))}
            </nav>

            {/* Desktop right actions */}
            <div className="hidden lg:flex items-center gap-6">
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

              {/* Wishlist */}
              <Link
                href="/dashboard/wishlist"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {mounted && wishlistItems?.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FDDE35] text-[#12100E] text-[10px] font-[700] rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                      {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </Link>

              {/* Cart dropdown */}
              <div
                ref={cartRef}
                className="relative"
                onMouseEnter={() => setCartOpen(true)}
                onMouseLeave={() => setCartOpen(false)}
              >
                <Link
                  href="/cart"
                  className="flex items-center gap-2 hover:text-primary-600 transition-colors"
                  style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
                >
                  <div className="relative">
                    <ShoppingBag className="w-5 h-5" />
                    {mounted && itemCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-[#FDDE35] text-[#12100E] text-[10px] font-[700] rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                        {itemCount > 9 ? '9+' : itemCount}
                      </span>
                    )}
                  </div>
                  <span>Cart</span>
                </Link>

                {/* Dropdown panel */}
                {mounted && cartOpen && (
                  <div className="absolute right-0 top-full pt-3 w-[360px] z-[9999]">
                    <div className="bg-white rounded-xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-gray-100 overflow-hidden">
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-[13px] font-[600] text-[#12100E]">
                          My Cart
                        </span>
                        {itemCount > 0 && (
                          <span className="text-[12px] text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                        )}
                      </div>

                      {items.length === 0 ? (
                        <div className="flex flex-col items-center gap-3 py-10 px-4">
                          <ShoppingBag className="w-10 h-10 text-gray-200" />
                          <p className="text-[13px] text-gray-400 font-[500]">Your cart is empty</p>
                          <Link
                            href="/shop"
                            onClick={() => setCartOpen(false)}
                            className="text-[12px] font-[600] text-[#12100E] underline underline-offset-2 hover:text-primary-600 transition-colors"
                          >
                            Start Shopping
                          </Link>
                        </div>
                      ) : (
                        <>
                          {/* Items list */}
                          <ul className="max-h-[280px] overflow-y-auto divide-y divide-gray-50 px-4 py-2">
                            {items.map((item) => (
                              <li key={item.id} className="flex items-center gap-3 py-3">
                                {/* Image */}
                                <Link
                                  href={`/products/${item.product.slug}`}
                                  onClick={() => setCartOpen(false)}
                                  className="w-14 h-14 rounded-lg bg-[#F3F4F6] flex-shrink-0 relative overflow-hidden"
                                >
                                  <Image
                                    src={item.product.image || '/images/product-page/e289c177b94614ad421b2a48e6ed78c26793555a.png'}
                                    alt={item.product.name}
                                    fill
                                    unoptimized
                                    className="object-contain p-1"
                                  />
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/products/${item.product.slug}`}
                                    onClick={() => setCartOpen(false)}
                                    className="text-[13px] font-[500] text-[#12100E] line-clamp-2 leading-snug hover:text-primary-600 transition-colors"
                                  >
                                    {item.product.name}
                                  </Link>
                                  {item.service && (
                                    <p className="text-[11px] text-gray-400 mt-0.5">{item.service}</p>
                                  )}
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[13px] font-[600] text-[#12100E]">
                                      {item.product.price.toFixed(2)} BDT
                                    </span>
                                    <span className="text-[11px] text-gray-400">× {item.quantity}</span>
                                  </div>
                                </div>

                                {/* Remove */}
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="flex-shrink-0 w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center transition-colors group"
                                  aria-label="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-gray-300 group-hover:text-red-500 transition-colors" />
                                </button>
                              </li>
                            ))}
                          </ul>

                          {/* Footer */}
                          <div className="px-4 pt-3 pb-4 border-t border-gray-100 bg-gray-50 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] text-gray-500">Subtotal</span>
                              <span className="text-[15px] font-[700] text-[#12100E]">
                                {total.toFixed(2)} BDT
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href="/cart"
                                onClick={() => setCartOpen(false)}
                                className="text-center py-2.5 rounded-lg border border-gray-200 text-[13px] font-[600] text-[#12100E] hover:bg-gray-100 transition-colors"
                              >
                                View Cart
                              </Link>
                              <Link
                                href="/checkout"
                                onClick={() => setCartOpen(false)}
                                className="text-center py-2.5 rounded-lg bg-[#FDDE35] hover:bg-[#FACC15] text-[13px] font-[600] text-[#12100E] transition-colors"
                              >
                                Checkout
                              </Link>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3" suppressHydrationWarning>
                {mounted && user ? (
                  <>
                    <Link
                      href={user.user_type === 'admin' ? '/admin' : '/dashboard'}
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
                  </>
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
            </div>

            {/* Mobile right actions */}
            <div className="flex lg:hidden items-center gap-4">
              <Link
                href="/cart"
                className="flex items-center gap-2 hover:text-primary-600 transition-colors relative"
                style={{ fontSize: '15px', fontWeight: 400, color: '#12100E' }}
              >
                <ShoppingBag className="w-5 h-5" />
                {mounted && itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FDDE35] text-[#12100E] text-[10px] font-[700] rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-sm">
                    {itemCount > 9 ? '9+' : itemCount}
                  </span>
                )}
              </Link>

              <div suppressHydrationWarning>
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
          </div>

          {/* Mobile search bar */}
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg font-[family-name:var(--font-geist-sans)] max-h-[80vh] overflow-y-auto"
          style={{ fontSize: '16px', fontWeight: 400, color: '#12100E', opacity: 0 }}
        >
          <nav className="container mx-auto py-4 px-4 flex flex-col divide-y divide-gray-100">
            <Link
              href="/shop"
              className="flex items-center justify-between hover:text-primary-600 transition-colors py-2.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop
            </Link>

            {topLevelCategories.map((cat) => (
              <MobileNavItem
                key={cat.id}
                category={cat}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}

            {/* Utility links */}
            <div className="pt-4 pb-2 flex flex-col gap-4">
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
