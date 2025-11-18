'use client';

import Link from "next/link";

import type { WebsiteListItem } from "@/types/websites";

type Props = {
    website: WebsiteListItem;
    onTogglePublish: (website: WebsiteListItem) => void;
    onSelect?: (websiteId: string) => void;
    busy?: boolean;
    selected?: boolean;
};

const WebsiteCard = ({
    website,
    onTogglePublish,
    onSelect,
    busy = false,
    selected = false,
}: Props) => {
    const {
        id,
        clientName,
        clientEmail,
        slug,
        description,
        contentJson,
        isPublished,
        updatedAt,
    } = website;

    const contentPreview =
        contentJson.length > 120
            ? `${contentJson.slice(0, 117)}...`
            : contentJson;

    return (
        <article
            className={`flex flex-col gap-4 rounded-xl border p-4 transition hover:border-slate-400 ${
                selected ? "border-slate-900 shadow-md" : "border-slate-200"
            }`}
            onClick={() => onSelect?.(id)}
        >
            <header className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Cliente
                    </p>
                    <h3 className="text-lg font-semibold text-slate-900">
                        {clientName}
                    </h3>
                    <p className="text-sm text-slate-500">{clientEmail}</p>
                </div>
                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isPublished
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                    }`}
                >
                    {isPublished ? "Publicado" : "Borrador"}
                </span>
            </header>

            {description && (
                <p className="text-sm text-slate-600">
                    {description.length > 140
                        ? `${description.slice(0, 137)}...`
                        : description}
                </p>
            )}

            <pre className="max-h-32 overflow-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-700">
                {contentPreview}
            </pre>

            <footer className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span>Slug: {slug ?? "sin definir"}</span>
                {updatedAt && <span>Actualizado: {new Date(updatedAt).toLocaleString()}</span>}
            </footer>

            <div className="flex flex-wrap items-center gap-3">
                <Link
                    href={`/websites/${slug ?? id}`}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900"
                >
                    Ver
                </Link>
                <Link
                    href={`/websites/${slug ?? id}?edit=true`}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-900"
                >
                    Editar
                </Link>
                <button
                    type="button"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                    onClick={(event) => {
                        event.stopPropagation();
                        onTogglePublish(website);
                    }}
                    disabled={busy}
                >
                    {busy
                        ? "Actualizando..."
                        : isPublished
                          ? "Enviar a borrador"
                          : "Publicar"}
                </button>
            </div>
        </article>
    );
};

export default WebsiteCard;

