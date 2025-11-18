import WebsiteForm from "@/components/websites/WebsiteForm";

export default function CreateWebsitePage() {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Nuevo</p>
        <h1 className="text-3xl font-semibold text-slate-900">Crea un sitio</h1>
        <p className="text-sm text-slate-500">
          Define título, slug y una descripción corta. Luego continúa en el editor para ajustar el contenido generado.
        </p>
      </div>
      <WebsiteForm />
    </section>
  );
}
