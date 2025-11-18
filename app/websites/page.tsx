'use client';

import { ChangeEvent, useMemo, useState } from "react";

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
            <header className="space-y-2">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                    Websites
                </p>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-semibold text-slate-900">
                            Panel de sitios
                        </h1>
                        <p className="text-sm text-slate-600">
                            Controla los sitios generados por la IA, busca por cliente y
                            cambia el estado de publicación en un clic.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => dispatch(resetFilters())}
                        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-slate-900"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </header>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <form className="grid gap-4 md:grid-cols-3">
                    <label className="text-sm font-medium text-slate-700">
                        Búsqueda
                        <input
                            type="search"
                            value={filters.search ?? ""}
                            onChange={handleSearchChange}
                            placeholder="Nombre del cliente o slug"
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                        />
                    </label>

                    <label className="text-sm font-medium text-slate-700">
                        Estado
                        <select
                            value={
                                typeof filters.isPublished === "boolean"
                                    ? filters.isPublished
                                        ? "published"
                                        : "draft"
                                    : "all"
                            }
                            onChange={handlePublishedChange}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                        >
                            <option value="all">Todos</option>
                            <option value="published">Solo publicados</option>
                            <option value="draft">Solo borradores</option>
                        </select>
                    </label>

                    <label className="text-sm font-medium text-slate-700">
                        Límite
                        <select
                            value={filters.limit ?? limitOptions[0]}
                            onChange={handleLimitChange}
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                        >
                            {limitOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option} resultados
                                </option>
                            ))}
                        </select>
                    </label>
                </form>
            </div>

            {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    Hubo un error al cargar los sitios.{" "}
                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="font-semibold underline"
                    >
                        Reintentar
                    </button>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
                {isFetching && (
                    <div className="col-span-full rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        Cargando sitios...
                    </div>
                )}

                {!isFetching && websites.length === 0 && (
                    <div className="col-span-full rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                        No se encontraron sitios para los filtros actuales.
                    </div>
                )}

                {websites.map((website) => (
                    <WebsiteCard
                        key={website.id}
                        website={website}
                        onTogglePublish={handleTogglePublish}
                        onSelect={(id) => dispatch(setSelectedWebsiteId(id))}
                        busy={currentToggleId === website.id}
                        selected={selectedWebsiteId === website.id}
                    />
                ))}
            </div>
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

