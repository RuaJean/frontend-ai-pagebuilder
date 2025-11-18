'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'checking' || status === 'idle';

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const nextParam = pathname === '/' ? '' : `?next=${encodeURIComponent(pathname)}`;
      router.replace(`/login${nextParam}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return fallback ?? (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner label="Verificando sesión" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
