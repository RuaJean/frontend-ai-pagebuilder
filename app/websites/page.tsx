import Link from "next/link";

import Button from "@/components/ui/Button";
import WebsiteCard from "@/components/websites/WebsiteCard";

const websites = [
  {
    id: "ai-landing",
    name: "AI Landing",
    status: "Publicado",
    updatedAt: "Hace 30 min",
  },
  {
    id: "fintech",
    name: "Fintech Banking",
    status: "Borrador",
    updatedAt: "Ayer",
  },
];

export default function WebsitesPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Colección</p>
          <h1 className="text-3xl font-semibold text-slate-900">Mis sitios</h1>
        </div>
        <Button asChild>
          <Link href="/websites/create">Nuevo sitio</Link>
        </Button>
      </header>

      <div className="space-y-4">
        {websites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>
    </section>
  );
}
