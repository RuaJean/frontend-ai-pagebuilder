'use client';

import Link from 'next/link';

import WebsiteCard from '@/components/websites/WebsiteCard';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useGetWebsitesQuery } from '@/services/websitesApi';

export default function WebsitesList() {
  const { data, isLoading, isError, refetch } = useGetWebsitesQuery({});
  const websites = Array.isArray(data) ? data : data?.items ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner label="Cargando sitios..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
        <p className="font-semibold">No se pudieron cargar los sitios</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => refetch()}>
          Reintentar
        </Button>
      </div>
    );
  }

  if (!websites.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Aún no tienes sitios</p>
        <p className="mt-2 text-sm text-slate-500">Crea tu primer sitio en minutos.</p>
        <Button asChild className="mt-4">
          <Link href="/websites/create">Crear sitio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  );
}

