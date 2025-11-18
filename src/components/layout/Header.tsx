'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useLogoutMutation } from '@/services/authApi';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', private: true },
  { href: '/websites', label: 'Websites', private: true },
  { href: '/websites/create', label: 'Crear sitio', private: true },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status } = useAuth();
  const [logout, { isLoading }] = useLogoutMutation();

  const isAuthenticated = status === 'authenticated';

  const filteredItems = useMemo(
    () => NAV_ITEMS.filter((item) => (item.private ? isAuthenticated : true)),
    [isAuthenticated],
  );

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          AiPageBuilder
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
          {filteredItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition hover:text-slate-900 ${pathname === item.href ? 'text-slate-900' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {(status === 'checking' || status === 'idle') && (
            <Spinner size="sm" label="Cargando" />
          )}
          {isAuthenticated && user ? (
            <>
              <span className="hidden text-sm font-medium text-slate-700 md:inline">
                {user.name ?? user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout} isLoading={isLoading}>
                Cerrar sesión
              </Button>
            </>
          ) : (
            <Button variant="primary" size="sm" onClick={() => router.push('/login')}>
              Iniciar sesión
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
