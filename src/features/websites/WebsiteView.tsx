interface WebsiteViewProps {
  slug: string;
}

export default function WebsiteView({ slug }: WebsiteViewProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900 capitalize">{slug}</h2>
      <p className="mt-2 text-sm text-slate-500">
        Vista pública simulada para validar el contenido generado.
      </p>
      <div className="mt-6 space-y-4 text-slate-700">
        <section>
          <h3 className="text-lg font-medium">Hero</h3>
          <p>Crea experiencias impactantes para tus usuarios.</p>
        </section>
        <section>
          <h3 className="text-lg font-medium">Características</h3>
          <ul className="list-disc pl-6">
            <li>Componentes accesibles</li>
            <li>Edición colaborativa</li>
            <li>Integración con tu CMS</li>
          </ul>
        </section>
      </div>
    </article>
  );
}
