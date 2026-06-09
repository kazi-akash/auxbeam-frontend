'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Bell, PanelLeft } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { useUnreadNotificationCount } from '@/lib/hooks/customer/useNotifications';

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
    title: 'Your wishlist',
    subtitle: () => "Curated pieces you've loved. Add to cart when you're ready.",
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
  const router = useRouter();
  const { user } = useAuth();
  const { data: countData } = useUnreadNotificationCount();

  const firstName = user?.first_name || user?.name?.split(' ')[0] || 'there';
  const unreadCount = countData?.unread_count ?? 0;

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
          onClick={() => router.push('/dashboard/notifications')}
          className="relative p-2 text-gray-400 hover:text-gray-700 transition-colors"
          aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full leading-none">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
