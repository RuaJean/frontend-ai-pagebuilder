import Link from "next/link";

export interface WebsiteCardProps {
  website: {
    id: string;
    name: string;
    status: string;
    updatedAt: string;
  };
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <article className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-slate-900">{website.name}</h3>
        <span className="text-xs uppercase tracking-widest text-slate-400">{website.status}</span>
      </div>
      <p className="text-sm text-slate-500">Actualizado: {website.updatedAt}</p>
      <div className="flex gap-3 text-sm font-medium">
        <Link href={`/websites/${website.id}`} className="text-slate-900">
          Ver
        </Link>
        <Link href={`/websites/${website.id}?edit=true`} className="text-slate-500">
          Editar
        </Link>
      </div>
    </article>
  );
}
