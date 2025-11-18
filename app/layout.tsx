import type { Metadata } from 'next';
import { ReactNode } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { ToastHub } from '@/components/ui/Toast';
import AppProviders from '@/providers/AppProviders';
import AuthStatusBar from '@/features/auth/AuthStatusBar';

import './globals.css';

export const metadata: Metadata = {
  title: 'AiPageBuilder',
  description: 'Genera y edita sitios web con IA usando Next.js y Clean Architecture',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <AppProviders>
          <div className="flex min-h-screen flex-col">
            <Header />
            <AuthStatusBar />
            <main className="flex-1 bg-slate-50">
              <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
            </main>
            <Footer />
          </div>
          <ToastHub />
        </AppProviders>
      </body>
    </html>
  );
}
