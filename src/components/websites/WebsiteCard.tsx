import Link from 'next/link';

import { WebsiteSummary } from '@/types/websites';

interface WebsiteCardProps {
  website: WebsiteSummary;
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <Link
      href={`/websites/${website.slug}`}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card"
    >
      <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-brand-600">
            {website.title ?? website.slug}
          </h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              website.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {website.isPublished ? 'Publicado' : 'Borrador'}
          </span>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          {website.description ?? 'Sin descripción'}
        </p>
        <div className="mt-4 text-xs text-slate-400">
          Actualizado {new Date(website.updatedAt).toLocaleString()}
        </div>
    </Link>
  );
}
