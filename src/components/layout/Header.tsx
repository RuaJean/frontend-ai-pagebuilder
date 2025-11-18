import Link from "next/link";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Sitios", href: "/websites" },
  { label: "Crear", href: "/websites/create" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          AI Page Builder
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate-600">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/login"
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
