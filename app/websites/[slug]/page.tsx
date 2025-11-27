'use client';

import { FormEvent, useMemo, useState } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";

import JsonRenderer from "@/components/editor/JsonRenderer";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import WebsiteCodeRenderer from "@/components/websites/WebsiteCodeRenderer";
import {
    useApplyPromptMutation,
    useGetWebsiteBySlugQuery,
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
            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
                Cargando contenido del sitio...
            </div>
        );
    }

    if (!data.isPublished && !editMode) {
        notFound();
    }

    const codeSource = !content && isLikelyCustomCode(contentJson) ? contentJson : null;

    return (
        <div className="relative min-h-screen bg-black">
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
    <main className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-6xl px-6 py-16">
            <JsonRenderer content={content} />
        </div>
    </main>
);

const EmptyContentState = ({ editMode }: { editMode: boolean }) => (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center text-sm text-slate-200">
        <p className="text-base font-semibold">El contenido aún no está disponible.</p>
        <p className="mt-2 max-w-xl text-xs text-slate-400">
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
    const [applyPrompt, { isLoading }] = useApplyPromptMutation();

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
            const apiMessage =
                error &&
                typeof error === "object" &&
                "data" in error &&
                error.data &&
                typeof error.data === "object" &&
                "message" in error.data
                    ? String((error.data as { message?: string }).message)
                    : "No se pudo aplicar el prompt. Intenta nuevamente.";
            setFeedback({
                type: "error",
                message: apiMessage,
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="pointer-events-auto fixed bottom-6 left-6 z-50 flex w-[min(90vw,22rem)] flex-col gap-2 rounded-2xl border border-white/20 bg-slate-900/85 p-3 text-white shadow-2xl backdrop-blur"
        >
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/60">
                <span>Editar página</span>
                <span>{website.isPublished ? "Publicado" : "Borrador"}</span>
            </div>
            <textarea
                className="h-20 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none"
                placeholder="Describe el cambio visual o de contenido que necesitas..."
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                disabled={isLoading}
            />
            <div className="flex items-center gap-3">
                <button
                    type="submit"
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-40"
                    disabled={isLoading || !prompt.trim()}
                >
                    {isLoading ? "Aplicando..." : "Aplicar prompt"}
                </button>
                <p className="text-[11px] text-white/60">
                    {website.clientName ?? website.slug ?? "Proyecto sin nombre"}
                </p>
            </div>
            {feedback && (
                <p
                    className={`text-xs ${
                        feedback.type === "success" ? "text-emerald-300" : "text-rose-300"
                    }`}
                >
                    {feedback.message}
                </p>
            )}
        </form>
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
