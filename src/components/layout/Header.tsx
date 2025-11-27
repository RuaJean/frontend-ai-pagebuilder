'use client';

import Link from "next/link";
import { Sparkles, LayoutGrid, Plus, Zap } from "lucide-react";

const Header = () => (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-[var(--bg-primary)]/60"
        style={{
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), 0 1px 0 rgba(255, 255, 255, 0.03) inset'
        }}
    >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)]">
                    <Zap className="h-5 w-5 text-[var(--bg-primary)]" />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)] opacity-0 blur-lg transition-opacity group-hover:opacity-60" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                    <span className="gradient-text">Ai</span>
                    <span className="text-[var(--text-primary)]">PageBuilder</span>
                </span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-2">
                <nav className="mr-4 hidden items-center gap-1 md:flex">
                    <Link 
                        href="/websites" 
                        className="btn-ghost flex items-center gap-2"
                    >
                        <LayoutGrid className="h-4 w-4" />
                        <span>Mis Sitios</span>
                    </Link>
                    <Link 
                        href="/websites/create" 
                        className="btn-ghost flex items-center gap-2"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Generar</span>
                    </Link>
                </nav>
                
                {/* CTA Button */}
                <Link
                    href="/websites/create"
                    className="glow-button btn-primary flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Nuevo sitio</span>
                </Link>
            </div>
        </div>
    </header>
);

export default Header;
