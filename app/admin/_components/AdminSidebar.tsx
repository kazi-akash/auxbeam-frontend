'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Tag,
  Layers,
  Cpu,
  Sliders,
  Warehouse,
  ShoppingCart,
  RotateCcw,
  CreditCard,
  Truck,
  Star,
  Megaphone,
  Share2,
  BadgePercent,
  Ticket,
  Users,
  Tags,
  PieChart,
  BarChart2,
  Settings,
  LogOut,
  Zap,
  ConciergeBell,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import { useAdminUnreadNotificationCount } from '@/lib/hooks/admin/useAdminNotifications';

// ─── Menu structure ────────────────────────────────────────────────

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Catalog',
    items: [
      { label: 'Products',   href: '/admin/products',   icon: Package   },
      { label: 'Inventory',  href: '/admin/inventory',  icon: Warehouse },
      { label: 'Categories', href: '/admin/categories', icon: Tag       },
      { label: 'Brands',     href: '/admin/brands',     icon: Layers    },
      { label: 'Models',     href: '/admin/models',     icon: Cpu       },
      { label: 'Variations', href: '/admin/variations', icon: Sliders   },
    ],
  },
  {
    title: 'Orders & Fulfillment',
    items: [
      { label: 'Orders',   href: '/admin/orders',   icon: ShoppingCart  },
      { label: 'Returns',  href: '/admin/returns',  icon: RotateCcw     },
      { label: 'Refunds',  href: '/admin/refunds',  icon: CreditCard    },
      { label: 'Shipping', href: '/admin/shipping', icon: Truck         },
      { label: 'Services', href: '/admin/services', icon: ConciergeBell },
      { label: 'Reviews',  href: '/admin/reviews',  icon: Star          },
    ],
  },
  {
    title: 'Marketing',
    items: [
      { label: 'Campaigns',    href: '/admin/campaigns',  icon: Megaphone    },
      { label: 'Meta Ads',     href: '/admin/marketing',  icon: Share2       },
      { label: 'Promotions',   href: '/admin/promotions', icon: BadgePercent },
      { label: 'Coupons',      href: '/admin/coupons',    icon: Ticket       },
    ],
  },
  {
    title: 'Customers',
    items: [
      { label: 'All Customers', href: '/admin/customers',          icon: Users    },
      { label: 'Segments',      href: '/admin/customer-segments',  icon: Tags     },
      { label: 'Tags',          href: '/admin/customer-tags',      icon: Tag      },
      { label: 'Analytics',     href: '/admin/customer-analytics', icon: PieChart },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { label: 'Reports', href: '/admin/analytics', icon: BarChart2 },
    ],
  },
];

const SYSTEM_ITEMS: MenuItem[] = [
  { label: 'Notifications', href: '/admin/notifications', icon: Bell     },
  { label: 'Settings',      href: '/admin/settings',      icon: Settings },
];

// ─── Helpers ───────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// ─── Sub-components ────────────────────────────────────────────────

function NavItem({
  href,
  icon: Icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <li>
      <Link
        href={href}
        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          active
            ? 'bg-[#1F2937] text-white'
            : 'text-gray-400 hover:bg-[#1F2937] hover:text-white'
        }`}
      >
        <Icon className="w-[17px] h-[17px] shrink-0" />
        <span className="truncate">{label}</span>
        {badge != null && badge > 0 ? (
          <span className="ml-auto min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-amber-400 text-black text-[9px] font-bold rounded-full shrink-0">
            {badge > 99 ? '99+' : badge}
          </span>
        ) : active ? (
          <span className="ml-auto w-1 h-4 rounded-full bg-amber-400 shrink-0" />
        ) : null}
      </Link>
    </li>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="px-3 mb-1 mt-5 first:mt-0 text-[10px] font-semibold tracking-widest text-gray-500 uppercase select-none">
      {title}
    </p>
  );
}

// ─── Main component ────────────────────────────────────────────────

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { data: countData } = useAdminUnreadNotificationCount();
  const unreadCount = countData?.unread_count ?? 0;

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const displayName = user?.full_name || user?.name || user?.email || 'Admin';

  return (
    <aside className="flex flex-col w-64 h-screen bg-[#111827] text-white shrink-0">
      {/* ── Logo ── */}
      <div className="flex items-center gap-3 px-5 py-5 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shrink-0">
          <Zap className="w-4.5 h-4.5 text-white" fill="white" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-wide text-white">AUXBEAM</p>
          <p className="text-[11px] text-gray-400">Admin Panel</p>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-[#1F2937] shrink-0" />

      {/* ── Scrollable nav ── */}
      <nav className="flex-1 overflow-y-auto sidebar-scroll px-3 py-3">
        {MENU_GROUPS.map((group) => (
          <div key={group.title}>
            <SectionLabel title={group.title} />
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon }) => (
                <NavItem
                  key={href}
                  href={href}
                  icon={icon}
                  label={label}
                  active={isActive(href)}
                />
              ))}
            </ul>
          </div>
        ))}

        {/* System section */}
        <div>
          <SectionLabel title="System" />
          <ul className="space-y-0.5">
            {SYSTEM_ITEMS.map(({ label, href, icon }) => (
              <NavItem
                key={href}
                href={href}
                icon={icon}
                label={label}
                active={isActive(href)}
                badge={href === '/admin/notifications' ? unreadCount : undefined}
              />
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Divider ── */}
      <div className="mx-4 border-t border-[#1F2937] shrink-0" />

      {/* ── User footer ── */}
      <div className="px-3 py-4 shrink-0">
        <div className="flex items-center gap-3 px-2">
          {/* Avatar + Name (links to admin home) */}
          <Link href="/admin/" className="flex items-center gap-3 flex-1 min-w-0 group">
            <div className="w-8 h-8 rounded-full bg-[#374151] flex items-center justify-center shrink-0 group-hover:bg-[#4B5563] transition-colors">
              <span className="text-xs font-semibold text-gray-300">
                {getInitials(displayName)}
              </span>
            </div>
            <div className="flex-1 min-w-0 leading-tight">
              <p className="text-sm font-medium text-white truncate group-hover:text-amber-400 transition-colors">{displayName}</p>
              <p className="text-xs text-gray-400 capitalize">
                {user?.user_type ?? 'Admin'}
              </p>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={() => logout()}
            title="Logout"
            className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
