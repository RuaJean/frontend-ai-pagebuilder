import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CreateWebsitePage() {
    return (
        <ProtectedRoute>
            <section className="space-y-4">
                <header>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Crear nuevo sitio
                    </h1>
                    <p className="text-sm text-slate-600">
                        Acceso restringido. Completa el formulario con datos del cliente.
                    </p>
                </header>
                <div className="rounded-xl border border-dashed border-slate-300 p-6 text-sm text-slate-500">
                    Aquí irá el formulario que consuma `useCreateWebsiteMutation`.
                </div>
            </section>
        </ProtectedRoute>
    );
}

