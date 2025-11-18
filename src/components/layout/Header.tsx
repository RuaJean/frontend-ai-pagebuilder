'use client';

import Link from "next/link";

const Header = () => (
    <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-slate-900">
                AiPageBuilder
            </Link>
            <div className="flex items-center gap-4">
                <nav className="flex items-center gap-4 text-sm text-slate-600">
                    <Link href="/websites" className="font-medium hover:text-slate-900">
                        Sitios
                    </Link>
                    <Link href="/websites/create" className="font-medium hover:text-slate-900">
                        Crear sitio
                    </Link>
                </nav>
                <Link
                    href="/websites/create"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    + Nuevo sitio
                </Link>
            </div>
        </div>
    </header>
);

export default Header;

