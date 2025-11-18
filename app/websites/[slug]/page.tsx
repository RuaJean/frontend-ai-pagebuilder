import WebsiteEditor from "@/features/websites/WebsiteEditor";
import WebsiteView from "@/features/websites/WebsiteView";

interface PageProps {
  params: { slug: string };
  searchParams?: { edit?: string };
}

export default function WebsiteDetailPage({ params, searchParams }: PageProps) {
  const isEditMode = searchParams?.edit === "true";

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <header>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{params.slug}</p>
        <h1 className="text-3xl font-semibold text-slate-900">
          {isEditMode ? "Modo edición" : "Vista pública"}
        </h1>
      </header>

      {isEditMode ? <WebsiteEditor slug={params.slug} /> : <WebsiteView slug={params.slug} />}
    </section>
  );
}
