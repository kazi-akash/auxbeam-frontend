'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search, PanelLeft } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

interface PageMeta {
  title: string;
  subtitle: (name: string) => string;
}

const PAGE_META: Record<string, PageMeta> = {
  '/admin': {
    title: 'Dashboard',
    subtitle: (name) => `Welcome back, ${name}. Here's what's happening today.`,
  },
  '/admin/products': {
    title: 'Products',
    subtitle: () => 'Manage your product catalog.',
  },
  '/admin/categories': {
    title: 'Categories',
    subtitle: () => 'Manage product categories and subcategories.',
  },
  '/admin/brands': {
    title: 'Brands',
    subtitle: () => 'Manage product brands.',
  },
  '/admin/models': {
    title: 'Product Models',
    subtitle: () => 'Manage product models and series.',
  },
  '/admin/orders': {
    title: 'Orders',
    subtitle: () => 'Track and manage customer orders.',
  },
  '/admin/customers': {
    title: 'Customers',
    subtitle: () => 'View and manage your customers.',
  },
  '/admin/analytics': {
    title: 'Analytics',
    subtitle: () => 'Insights and performance metrics.',
  },
  '/admin/settings': {
    title: 'Settings',
    subtitle: () => 'Configure your admin preferences.',
  },
};

interface AdminTopbarProps {
  onToggleSidebar?: () => void;
}

export default function AdminTopbar({ onToggleSidebar }: AdminTopbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'Admin';

  // Exact match first, then prefix match (skip root /admin for prefix)
  const meta =
    PAGE_META[pathname] ??
    Object.entries(PAGE_META)
      .filter(([key]) => key !== '/admin' && pathname.startsWith(key))
      .map(([, v]) => v)[0] ??
    PAGE_META['/admin'];

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 shrink-0">
      {/* Left: sidebar toggle + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-gray-700 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:block text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base font-bold text-gray-900 leading-tight">
            {meta.title}
          </h1>
          <p className="text-xs text-gray-500 leading-tight">
            {meta.subtitle(firstName)}
          </p>
        </div>
      </div>

      {/* Right: search + notifications */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg border-none outline-none focus:ring-2 focus:ring-gray-200 w-52 placeholder:text-gray-400"
          />
        </div>

        {/* Notifications */}
        <button
          className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full" />
        </button>
      </div>
    </header>
  );
}
