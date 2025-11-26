import type { Metadata } from 'next';
import { ReactNode } from 'react';

import AppProviders from '@/providers/AppProviders';

import './globals.css';

export const metadata: Metadata = {
  title: 'AiPageBuilder',
  description: 'Genera y edita sitios web con IA usando Next.js y Clean Architecture',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-slate-50 font-sans text-slate-900 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
