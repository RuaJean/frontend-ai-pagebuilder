'use client';

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import { 
    Search, 
    Filter, 
    LayoutGrid, 
    Plus, 
    RefreshCw, 
    AlertCircle,
    Sparkles,
    FolderOpen
} from "lucide-react";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import WebsiteCard from "@/components/websites/WebsiteCard";
import {
    resetFilters,
    setIsPublishedFilter,
    setLimit,
    setSearch,
    setSelectedWebsiteId,
} from "@/features/websites/websitesSlice";
import { usePublishWebsiteMutation, useGetWebsitesQuery } from "@/services/websitesApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { WebsiteListItem } from "@/types/websites";

const limitOptions = [6, 12, 24];

function WebsitesDashboard() {
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.websites.filters);
    const selectedWebsiteId = useAppSelector(
        (state) => state.websites.selectedWebsiteId,
    );
    const [currentToggleId, setCurrentToggleId] = useState<string | null>(null);

    const queryFilters = useMemo(() => ({ ...filters }), [filters]);
    const { data, isFetching, error, refetch } = useGetWebsitesQuery(queryFilters);

    const [publishWebsite] = usePublishWebsiteMutation();

    const websites: WebsiteListItem[] = Array.isArray(data) ? data : [];

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(event.target.value));
    };

    const handlePublishedChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value;
        if (value === "all") {
            dispatch(setIsPublishedFilter(undefined));
        } else {
            dispatch(setIsPublishedFilter(value === "published"));
        }
    };

    const handleLimitChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = Number(event.target.value);
        dispatch(setLimit(Number.isNaN(value) ? undefined : value));
    };

    const handleTogglePublish = async (website: WebsiteListItem) => {
        setCurrentToggleId(website.id);
        try {
            await publishWebsite({
                id: website.id,
                body: { isPublished: !website.isPublished },
            }).unwrap();
            dispatch(setSelectedWebsiteId(website.id));
            refetch();
        } catch (err) {
            console.error("No se pudo actualizar el estado de publicación", err);
        } finally {
            setCurrentToggleId(null);
        }
    };

    return (
        <section className="space-y-8">
            {/* Header */}
            <header className="relative">
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-tertiary)] to-[var(--accent-primary)]">
                                <LayoutGrid className="h-7 w-7 text-[var(--text-primary)]" />
                            </div>
                            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[var(--accent-tertiary)] to-[var(--accent-primary)] opacity-30 blur-xl" />
                        </div>
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="text-xs uppercase tracking-[0.2em] text-[var(--text-muted)]">
                                    Dashboard
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                                Mis Sitios Web
                            </h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Gestiona y publica tus sitios generados con IA
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => dispatch(resetFilters())}
                            className="btn-ghost flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Reset
                        </button>
                        <Link
                            href="/websites/create"
                            className="glow-button btn-primary flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Nuevo sitio
                        </Link>
                    </div>
                </div>
            </header>

            {/* Filters */}
            <div className="card-glass rounded-2xl p-5">
                <div className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <Filter className="h-4 w-4 text-[var(--accent-primary)]" />
                    <span className="uppercase tracking-wide">Filtros</span>
                </div>
                <form className="grid gap-4 md:grid-cols-3">
                    <div className="group">
                        <label className="block">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Search className="h-4 w-4 text-[var(--accent-primary)]" />
                                <span>Búsqueda</span>
                            </div>
                            <input
                                type="search"
                                value={filters.search ?? ""}
                                onChange={handleSearchChange}
                                placeholder="Nombre del cliente o slug..."
                                className="input-modern"
                            />
                        </label>
                    </div>

                    <div className="group">
                        <label className="block">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
                                <span>Estado</span>
                            </div>
                            <select
                                value={
                                    typeof filters.isPublished === "boolean"
                                        ? filters.isPublished
                                            ? "published"
                                            : "draft"
                                        : "all"
                                }
                                onChange={handlePublishedChange}
                                className="input-modern cursor-pointer"
                            >
                                <option value="all">Todos los estados</option>
                                <option value="published">Solo publicados</option>
                                <option value="draft">Solo borradores</option>
                            </select>
                        </label>
                    </div>

                    <div className="group">
                        <label className="block">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <LayoutGrid className="h-4 w-4 text-[var(--accent-primary)]" />
                                <span>Límite</span>
                            </div>
                            <select
                                value={filters.limit ?? limitOptions[0]}
                                onChange={handleLimitChange}
                                className="input-modern cursor-pointer"
                            >
                                {limitOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option} resultados
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>
                </form>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-start gap-4 rounded-2xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-5">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--error)]" />
                    <div>
                        <p className="font-medium text-[var(--error)]">
                            Error al cargar los sitios
                        </p>
                        <p className="mt-1 text-sm text-[var(--error)]/80">
                            Hubo un problema al obtener la lista de sitios web.
                        </p>
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="mt-3 btn-secondary text-xs"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {isFetching && (
                <div className="grid gap-4 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div 
                            key={i}
                            className="h-72 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface-glass)] shimmer"
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isFetching && websites.length === 0 && (
                <div className="relative overflow-hidden rounded-2xl border border-dashed border-[var(--border-strong)] p-12 text-center">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--accent-primary)]/5 to-[var(--accent-alt)]/5" />
                    <div className="relative">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--surface-glass)]">
                            <FolderOpen className="h-8 w-8 text-[var(--text-muted)]" />
                        </div>
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            No hay sitios
                        </h3>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">
                            No se encontraron sitios para los filtros actuales.
                        </p>
                        <Link
                            href="/websites/create"
                            className="mt-6 inline-flex btn-primary items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Crear mi primer sitio
                        </Link>
                    </div>
                </div>
            )}

            {/* Websites Grid */}
            {!isFetching && websites.length > 0 && (
                <div className="grid gap-5 md:grid-cols-2">
                    {websites.map((website, index) => (
                        <div 
                            key={website.id}
                            className="animate-fade-in-up opacity-0"
                            style={{ 
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: 'forwards'
                            }}
                        >
                            <WebsiteCard
                                website={website}
                                onTogglePublish={handleTogglePublish}
                                onSelect={(id) => dispatch(setSelectedWebsiteId(id))}
                                busy={currentToggleId === website.id}
                                selected={selectedWebsiteId === website.id}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Stats footer */}
            {!isFetching && websites.length > 0 && (
                <div className="flex items-center justify-center gap-4 text-xs text-[var(--text-muted)]">
                    <span>
                        Mostrando {websites.length} sitio{websites.length !== 1 && 's'}
                    </span>
                    <span className="h-1 w-1 rounded-full bg-[var(--text-muted)]" />
                    <span>
                        {websites.filter(w => w.isPublished).length} publicado{websites.filter(w => w.isPublished).length !== 1 && 's'}
                    </span>
                </div>
            )}
        </section>
    );
}

export default function WebsitesPage() {
    return (
        <ProtectedRoute>
            <WebsitesDashboard />
        </ProtectedRoute>
    );
}
