'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: string;
  redirectTo?: string;
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requireRole,
  redirectTo = '/login',
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    if (requireRole && user?.role !== requireRole) {
      router.push('/');
      return;
    }
  }, [user, loading, requireAuth, requireRole, redirectTo, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requireRole && user?.role !== requireRole) {
    return null;
  }

  return <>{children}</>;
}
