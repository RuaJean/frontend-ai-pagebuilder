import WebsiteCard from "@/components/websites/WebsiteCard";
import WebsiteForm from "@/components/websites/WebsiteForm";

const demoWebsites = [
  { id: "1", name: "Landing SaaS", status: "Publicado", updatedAt: "Hace 2h" },
  { id: "2", name: "Portfolio Agencia", status: "Borrador", updatedAt: "Ayer" },
];

export default function HomePage() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
      <header className="flex flex-col gap-4">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Panel</p>
        <h1 className="text-4xl font-semibold text-slate-900">
          Diseña experiencias web con ayuda de IA
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl">
          Gestiona todos tus sitios, comparte borradores con tu equipo y publica
          cambios en minutos.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {demoWebsites.map((site) => (
            <WebsiteCard key={site.id} website={site} />
          ))}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Crea un nuevo sitio
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Configura la información básica y luego personaliza con el editor visual.
          </p>
          <WebsiteForm compact />
        </div>
      </div>
    </section>
  );
}
