'use client';

import { FormEvent, useMemo, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";
import { Rocket, Sparkles, Send, X, CheckCircle, AlertCircle } from "lucide-react";

import JsonRenderer from "@/components/editor/JsonRenderer";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import WebsiteCodeRenderer from "@/components/websites/WebsiteCodeRenderer";
import {
    useApplyPromptMutation,
    useGetWebsiteBySlugQuery,
    usePublishWebsiteMutation,
} from "@/services/websitesApi";
import type { PageContent } from "@/types/pageContent";
import type { WebsiteDetail } from "@/types/websites";

const parsePageContent = (raw: string | null | undefined): PageContent | null => {
    if (!raw) {
        return null;
    }

    try {
        const parsed = JSON.parse(raw) as PageContent;
        if (parsed && typeof parsed === "object") {
            return parsed;
        }
    } catch {
        return null;
    }

    return null;
};

const WebsitePageInner = ({
    slug,
    editMode,
}: {
    slug: string;
    editMode: boolean;
}) => {
    const {
        data,
        error,
        isFetching,
        isLoading,
        refetch,
    } = useGetWebsiteBySlugQuery(slug, {
        skip: !slug,
    });

    const is404 =
        error && "status" in error && typeof error.status === "number"
            ? error.status === 404
            : false;

    if (is404) {
        notFound();
    }

    const contentJson = data?.contentJson ?? null;
    const content = useMemo(() => parsePageContent(contentJson), [contentJson]);

    if (!data || isLoading || isFetching) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)]">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent-primary)] border-t-transparent" />
                    <p className="text-sm text-[var(--text-muted)]">
                        Cargando contenido del sitio...
                    </p>
                </div>
            </div>
        );
    }

    if (!data.isPublished && !editMode) {
        notFound();
    }

    const codeSource = !content && isLikelyCustomCode(contentJson) ? contentJson : null;

    return (
        <div className="relative min-h-screen bg-[var(--bg-primary)]">
            {editMode && data && (
                <EditPromptBar website={data} onRefresh={refetch} />
            )}
            {codeSource ? (
                <WebsiteCodeRenderer code={codeSource} showCodePanel={editMode} />
            ) : content ? (
                <JsonContentCanvas content={content} />
            ) : (
                <EmptyContentState editMode={editMode} />
            )}
        </div>
    );
};

export default function WebsiteDetailPage() {
    const params = useParams<{ slug: string }>();
    const searchParams = useSearchParams();
    const slugParam = params?.slug;
    const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
    const editMode = searchParams?.get("edit") === "true";

    if (!slug) {
        notFound();
    }

    const page = <WebsitePageInner slug={slug} editMode={!!editMode} />;

    return <ProtectedRoute>{page}</ProtectedRoute>;
}
 
const JsonContentCanvas = ({ content }: { content: PageContent }) => (
    <main className="min-h-screen bg-[var(--text-primary)] text-[var(--bg-primary)]">
        <div className="mx-auto max-w-6xl px-6 py-16">
            <JsonRenderer content={content} />
        </div>
    </main>
);

const EmptyContentState = ({ editMode }: { editMode: boolean }) => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--bg-primary)] px-6 text-center">
        <div className="relative">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-alt)]/20">
                <Sparkles className="h-10 w-10 text-[var(--accent-primary)]" />
            </div>
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent blur-2xl" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
            El contenido aún no está disponible
        </h2>
        <p className="mt-3 max-w-md text-sm text-[var(--text-muted)]">
            {editMode
                ? "Verifica que la generación haya devuelto un TSX válido o JSON estructurado."
                : "Vuelve más tarde mientras generamos esta página con IA."}
        </p>
    </div>
);

const EditPromptBar = ({
    website,
    onRefresh,
}: {
    website: WebsiteDetail;
    onRefresh: () => Promise<unknown>;
}) => {
    const [prompt, setPrompt] = useState("");
    const [feedback, setFeedback] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);
    const [showPublishConfirm, setShowPublishConfirm] = useState(false);
    const [applyPrompt, { isLoading }] = useApplyPromptMutation();
    const [publishWebsite, { isLoading: isPublishing }] = usePublishWebsiteMutation();

    const extractApiMessage = (error: unknown, fallback: string) => {
        return error &&
            typeof error === "object" &&
            "data" in error &&
            error.data &&
            typeof error.data === "object" &&
            "message" in error.data
            ? String((error.data as { message?: string }).message)
            : fallback;
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedPrompt = prompt.trim();

        if (!trimmedPrompt) {
            return;
        }

        const expectedUpdatedAt = website.updatedAt;

        if (!expectedUpdatedAt) {
            setFeedback({
                type: "error",
                message: "No se puede editar porque falta la marca de actualización.",
            });
            return;
        }

        try {
            setFeedback(null);
            await applyPrompt({
                id: website.id,
                body: {
                    prompt: trimmedPrompt,
                    reasoningAdvanced: false,
                    targetElementId: null,
                    expectedUpdatedAt,
                },
            }).unwrap();
            setPrompt("");
            setFeedback({
                type: "success",
                message: "Cambios aplicados. Actualizando vista...",
            });
            await onRefresh();
        } catch (error) {
            setFeedback({
                type: "error",
                message: extractApiMessage(
                    error,
                    "No se pudo aplicar el prompt. Intenta nuevamente.",
                ),
            });
        }
    };

    const openPublishConfirm = () => {
        if (!website.id) {
            setFeedback({
                type: "error",
                message: "No se puede publicar porque falta el identificador.",
            });
            return;
        }

        setShowPublishConfirm(true);
    };

    const handlePublish = async () => {
        if (!website.id) {
            setFeedback({
                type: "error",
                message: "No se puede publicar porque falta el identificador.",
            });
            setShowPublishConfirm(false);
            return;
        }
        try {
            setFeedback(null);
            setShowPublishConfirm(false);
            await publishWebsite({
                id: website.id,
                body: {
                    isPublished: true,
                },
            }).unwrap();
            setFeedback({
                type: "success",
                message: "Sitio publicado correctamente. Actualizando vista...",
            });
            await onRefresh();
        } catch (error) {
            setFeedback({
                type: "error",
                message: extractApiMessage(
                    error,
                    "No se pudo publicar el sitio. Intenta nuevamente.",
                ),
            });
        }
    };

    return (
        <>
            {/* Publish Confirmation Modal */}
            {showPublishConfirm && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
                    <button
                        type="button"
                        aria-label="Cerrar confirmación de publicación"
                        className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm"
                        onClick={() => setShowPublishConfirm(false)}
                    />
                    <div className="card-glass relative z-[61] w-full max-w-sm rounded-2xl p-6">
                        <button
                            type="button"
                            onClick={() => setShowPublishConfirm(false)}
                            className="absolute right-4 top-4 text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)]">
                            <Rocket className="h-6 w-6 text-[var(--bg-primary)]" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            ¿Publicar este sitio?
                        </h3>
                        <p className="mt-2 text-sm text-[var(--text-muted)]">
                            El contenido quedará visible para tus clientes inmediatamente.
                        </p>
                        
                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowPublishConfirm(false)}
                                className="btn-secondary flex-1"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={isPublishing}
                                className="btn-primary flex flex-1 items-center justify-center gap-2"
                            >
                                {isPublishing ? (
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg-primary)] border-t-transparent" />
                                ) : (
                                    <Rocket className="h-4 w-4" />
                                )}
                                {isPublishing ? "Publicando..." : "Publicar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Bar */}
            <form
                onSubmit={handleSubmit}
                className="glass-surface-strong pointer-events-auto fixed bottom-6 left-6 z-50 flex w-[min(90vw,24rem)] flex-col gap-3 rounded-2xl p-4 shadow-2xl"
            >
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[var(--accent-primary)]" />
                        <span className="text-xs font-medium uppercase tracking-wide text-[var(--text-muted)]">
                            Editar página
                        </span>
                    </div>
                    <span className={`badge text-[10px] ${website.isPublished ? "badge-success" : "badge-warning"}`}>
                        {website.isPublished ? "Publicado" : "Borrador"}
                    </span>
                </div>

                {/* Textarea */}
                <textarea
                    className="input-modern h-24 resize-none text-sm"
                    placeholder="Describe el cambio visual o de contenido que necesitas..."
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    disabled={isLoading}
                />

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        type="submit"
                        className="glow-button btn-primary flex items-center gap-2 text-sm"
                        disabled={isLoading || !prompt.trim()}
                    >
                        {isLoading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg-primary)] border-t-transparent" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                        {isLoading ? "Aplicando..." : "Aplicar"}
                    </button>
                    
                    <div className="ml-auto flex items-center gap-2">
                        <span className="max-w-[100px] truncate text-xs text-[var(--text-muted)]">
                            {website.clientName ?? website.slug ?? "Proyecto"}
                        </span>
                        <button
                            type="button"
                            onClick={openPublishConfirm}
                            disabled={isPublishing || website.isPublished}
                            title={
                                website.isPublished
                                    ? "El sitio ya está publicado"
                                    : "Publicar sitio"
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-[var(--surface-glass)] text-[var(--text-muted)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-40"
                        >
                            <Rocket className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Feedback */}
                {feedback && (
                    <div className={`flex items-center gap-2 rounded-lg p-2 text-xs ${
                        feedback.type === "success" 
                            ? "bg-[var(--success)]/10 text-[var(--success)]" 
                            : "bg-[var(--error)]/10 text-[var(--error)]"
                    }`}>
                        {feedback.type === "success" ? (
                            <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                        <span>{feedback.message}</span>
                    </div>
                )}
            </form>
        </>
    );
};

const isLikelyCustomCode = (value: string | null): value is string => {
    if (!value) {
        return false;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        return false;
    }

    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
        return false;
    }

    return /export\s+default/.test(trimmed) || /import\s+.+from\s+['"][^'"]+['"]/.test(trimmed);
};
