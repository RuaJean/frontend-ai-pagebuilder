'use client';

import Link from "next/link";

const Header = () => (
    <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold text-slate-900">
                AiPageBuilder
            </Link>
            <nav className="text-sm text-slate-600">
                <Link href="/websites" className="hover:text-slate-900">
                    Sitios
                </Link>
            </nav>
        </div>
    </header>
);

export default Header;

