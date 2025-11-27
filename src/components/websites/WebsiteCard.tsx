'use client';

import Link from "next/link";
import { Eye, Pencil, Rocket, Send, Calendar, Link2, Code2 } from "lucide-react";

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
        contentJson.length > 100
            ? `${contentJson.slice(0, 97)}...`
            : contentJson;

    return (
        <article
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                selected 
                    ? "border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-glow)]" 
                    : "border-[var(--border-subtle)] hover:border-[var(--border-strong)]"
            } bg-[var(--surface-glass)] backdrop-blur-xl cursor-pointer`}
            onClick={() => onSelect?.(id)}
        >
            {/* Glow effect on hover */}
            <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-r from-[var(--accent-primary)]/0 via-[var(--accent-primary)]/5 to-[var(--accent-alt)]/0 opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="relative p-5">
                {/* Header */}
                <header className="mb-4 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                            Cliente
                        </p>
                        <h3 className="truncate text-lg font-semibold text-[var(--text-primary)]">
                            {clientName}
                        </h3>
                        <p className="mt-0.5 truncate text-sm text-[var(--text-muted)]">
                            {clientEmail}
                        </p>
                    </div>
                    <span className={`badge flex-shrink-0 ${isPublished ? "badge-success" : "badge-warning"}`}>
                        {isPublished ? "Publicado" : "Borrador"}
                    </span>
                </header>

                {/* Description */}
                {description && (
                    <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {description}
                    </p>
                )}

                {/* Code Preview */}
                <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
                    <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] px-3 py-2">
                        <Code2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <span className="text-[10px] uppercase tracking-wide text-[var(--text-muted)]">
                            Preview
                        </span>
                    </div>
                    <pre className="max-h-24 overflow-auto p-3 text-xs leading-relaxed text-[var(--text-secondary)]">
                        {contentPreview}
                    </pre>
                </div>

                {/* Meta */}
                <footer className="mb-4 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <Link2 className="h-3.5 w-3.5" />
                        {slug ?? "sin slug"}
                    </span>
                    {updatedAt && (
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(updatedAt).toLocaleDateString('es-ES', { 
                                day: 'numeric', 
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    )}
                </footer>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={`/websites/${slug ?? id}`}
                        className="btn-ghost flex items-center gap-1.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Eye className="h-3.5 w-3.5" />
                        Ver
                    </Link>
                    <Link
                        href={`/websites/${slug ?? id}?edit=true`}
                        className="btn-ghost flex items-center gap-1.5 text-xs"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Editar
                    </Link>
                    <button
                        type="button"
                        className={`ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                            isPublished
                                ? "border border-[var(--border-strong)] text-[var(--text-secondary)] hover:border-[var(--warning)] hover:text-[var(--warning)]"
                                : "bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-[var(--bg-primary)] hover:shadow-lg hover:shadow-[var(--accent-glow)]"
                        } disabled:opacity-50`}
                        onClick={(event) => {
                            event.stopPropagation();
                            onTogglePublish(website);
                        }}
                        disabled={busy}
                    >
                        {busy ? (
                            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : isPublished ? (
                            <Send className="h-3.5 w-3.5" />
                        ) : (
                            <Rocket className="h-3.5 w-3.5" />
                        )}
                        {busy
                            ? "..."
                            : isPublished
                              ? "A borrador"
                              : "Publicar"}
                    </button>
                </div>
            </div>
        </article>
    );
};

export default WebsiteCard;
