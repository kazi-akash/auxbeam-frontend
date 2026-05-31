'use client';

import { usePathname } from 'next/navigation';
import { Bell, PanelLeft } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

const PAGE_META: Record<string, { title: string; subtitle: (name: string) => string }> = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: (name) => `Welcome back, ${name}.`,
  },
  '/dashboard/orders': {
    title: 'Orders',
    subtitle: () => 'View and track your orders.',
  },
  '/dashboard/addresses': {
    title: 'Addresses',
    subtitle: () => 'Manage your saved addresses.',
  },
  '/dashboard/wishlist': {
    title: 'Wishlist',
    subtitle: () => 'Your saved products.',
  },
  '/dashboard/reviews': {
    title: 'Reviews',
    subtitle: () => 'Your product reviews.',
  },
  '/dashboard/notifications': {
    title: 'Notifications',
    subtitle: () => 'Your latest alerts and updates.',
  },
  '/dashboard/profile': {
    title: 'Profile',
    subtitle: () => 'Manage your personal information.',
  },
  '/dashboard/settings': {
    title: 'Settings',
    subtitle: () => 'Account preferences.',
  },
};

export default function UserTopbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'there';

  const meta =
    PAGE_META[pathname] ??
    Object.entries(PAGE_META)
      .filter(([key]) => key !== '/dashboard' && pathname.startsWith(key))
      .map(([, v]) => v)[0] ??
    PAGE_META['/dashboard'];

  return (
    <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-gray-100 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="text-gray-400 hover:text-gray-700 transition-colors lg:hidden"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-gray-900 leading-tight">{meta.title}</h1>
          <p className="text-xs text-gray-400 leading-tight">{meta.subtitle(firstName)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
