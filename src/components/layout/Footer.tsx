export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} AiPageBuilder. Todos los derechos reservados.</p>
        <p className="font-medium text-slate-600">Construido con Next.js, Tailwind y Redux.</p>
      </div>
    </footer>
  );
}
