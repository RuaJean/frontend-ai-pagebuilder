import Link from 'next/link';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import WebsitesList from '@/features/websites/WebsitesList';

export default function WebsitesPage() {
  return (
    <ProtectedRoute>
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-wide text-slate-500">Websites</p>
            <h1 className="text-2xl font-semibold text-slate-900">Administrar sitios</h1>
            <p className="text-sm text-slate-500">Actualiza, publica y abre el editor visual.</p>
          </div>
          <Button asChild>
            <Link href="/websites/create">Nuevo sitio</Link>
          </Button>
        </div>
        <WebsitesList />
      </section>
    </ProtectedRoute>
  );
}
