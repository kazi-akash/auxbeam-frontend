'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  LayoutDashboard,
  ShoppingBag,
  MapPin,
  Heart,
  Star,
  Bell,
  User,
  Settings,
  LogOut,
  type LucideIcon,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',     href: '/dashboard',               icon: LayoutDashboard },
  { label: 'Orders',        href: '/dashboard/orders',        icon: ShoppingBag     },
  { label: 'Addresses',     href: '/dashboard/addresses',     icon: MapPin          },
  { label: 'Wishlist',      href: '/dashboard/wishlist',      icon: Heart           },
  { label: 'Reviews',       href: '/dashboard/reviews',       icon: Star            },
  { label: 'Notifications', href: '/dashboard/notifications', icon: Bell            },
  { label: 'Profile',       href: '/dashboard/profile',       icon: User            },
  { label: 'Settings',      href: '/dashboard/settings',      icon: Settings        },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function UserSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const displayName = user?.full_name || user?.name || user?.email || 'User';
  const email = user?.email || '';

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside className="flex flex-col w-64 bg-white rounded-2xl border border-gray-100 shrink-0 overflow-hidden">
      {/* User profile header */}
      <div className="px-5 py-5 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-[#FCE32D] flex items-center justify-center shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={displayName}
                className="w-11 h-11 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-semibold text-black">
                {getInitials(displayName)}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0 leading-tight">
            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-xs text-gray-400 truncate">{email}</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100 shrink-0" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[#FCE32D] text-black'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-gray-100 shrink-0" />

      {/* Sign out */}
      <div className="px-3 py-4 shrink-0">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" strokeWidth={1.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
