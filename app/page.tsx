import Link from 'next/link';

import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import WebsitesList from '@/features/websites/WebsitesList';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <section className="space-y-10">
        <div className="rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-8 text-white shadow-card">
          <p className="text-sm uppercase tracking-wide text-white/80">Dashboard</p>
          <h1 className="mt-2 text-3xl font-semibold">Bienvenido a AiPageBuilder</h1>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Gestiona tus sitios generados por IA, edita contenido y publícalos en segundos.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="secondary">
              <Link href="/websites/create">Crear sitio</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/websites">Ver todos</Link>
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Tus sitios</h2>
              <p className="text-sm text-slate-500">Últimos sitios generados o editados.</p>
            </div>
            <Button asChild size="sm">
              <Link href="/websites/create">Nuevo</Link>
            </Button>
          </div>
          <WebsitesList />
        </div>
      </section>
    </ProtectedRoute>
  );
}
