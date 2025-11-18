import ProtectedRoute from "@/components/layout/ProtectedRoute";

type PageProps = {
    params: { slug: string };
    searchParams?: { edit?: string };
};

export default function WebsiteDetailPage({ params, searchParams }: PageProps) {
    const requireAuth = searchParams?.edit === "true";

    return (
        <ProtectedRoute requireAuth={requireAuth}>
            <article className="space-y-4">
                <header>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        {requireAuth ? "Edición segura" : "Vista pública"}
                    </p>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Sitio: {params.slug}
                    </h1>
                </header>
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
                    {requireAuth ? (
                        <p>
                            Modo edición habilitado. Renderiza aquí el editor conectado a
                            RTK Query usando `useUpdateWebsiteMutation`.
                        </p>
                    ) : (
                        <p>
                            Esta es la vista pública del sitio. Puedes mostrar contenido
                            generado sin autenticación.
                        </p>
                    )}
                </div>
            </article>
        </ProtectedRoute>
    );
}

