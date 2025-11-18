'use client';

import { WebsiteDetails } from '@/types/websites';

interface WebsiteViewProps {
  website: WebsiteDetails;
}

export default function WebsiteView({ website }: WebsiteViewProps) {
  return (
    <section className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <header>
        <p className="text-sm uppercase tracking-wide text-slate-500">Vista pública</p>
        <h1 className="text-2xl font-semibold text-slate-900">{website.title ?? website.slug}</h1>
        <p className="mt-2 text-sm text-slate-600">{website.description}</p>
      </header>
      <div className="space-y-3 rounded-xl bg-slate-50 p-4 font-mono text-xs text-slate-800">
        <p className="text-[11px] uppercase tracking-wide text-slate-500">contentJson</p>
        <pre className="overflow-auto whitespace-pre-wrap">{website.contentJson}</pre>
      </div>
      <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-slate-500">Cliente</dt>
          <dd className="font-medium text-slate-900">{website.clientName ?? 'N/D'}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Estado</dt>
          <dd className="font-medium text-slate-900">
            {website.isPublished ? 'Publicado' : 'Borrador'}
          </dd>
        </div>
      </dl>
    </section>
  );
}
