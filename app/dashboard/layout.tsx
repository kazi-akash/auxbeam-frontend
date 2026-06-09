'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import Header from '@/app/(public)/_components/Header';
import Footer from '@/app/(public)/_components/Footer';
import UserSidebar from './_components/UserSidebar';
import { PanelLeft } from 'lucide-react';
import { useNotificationChannel } from '@/lib/hooks/customer/useNotifications';

function NotificationChannelMount() {
  useNotificationChannel();
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.user_type === 'admin') router.replace('/admin');
  }, [user, loading, router]);

  if (loading || !user || user.user_type === 'admin') {
    return <div className="flex h-screen items-center justify-center bg-gray-50" />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NotificationChannelMount />
      <Header />

      <div className="flex flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 gap-5">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          className="fixed bottom-6 right-6 z-30 lg:hidden w-12 h-12 bg-[#FCE32D] text-black rounded-full flex items-center justify-center shadow-lg"
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-30 lg:static lg:z-auto lg:block transition-transform duration-200 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="lg:sticky lg:top-8">
            <UserSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
