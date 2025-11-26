'use client';

import { useMemo } from "react";
import { notFound, useParams, useSearchParams } from "next/navigation";

import JsonRenderer from "@/components/editor/JsonRenderer";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import WebsiteCodeRenderer from "@/components/websites/WebsiteCodeRenderer";
import { useGetWebsiteBySlugQuery } from "@/services/websitesApi";
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
            {editMode && <EditOverlay data={data} slug={slug} />}
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

const EditOverlay = ({ data, slug }: { data: WebsiteDetail; slug: string }) => (
    <div className="pointer-events-none fixed bottom-32 right-6 z-50 w-[min(90vw,32rem)] rounded-xl border border-white/30 bg-slate-900/75 px-4 py-3 text-xs text-white shadow-2xl backdrop-blur">
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/60">
                <span>Modo edición</span>
                <span>{data.isPublished ? "Publicado" : "Borrador"}</span>
            </div>
            <div className="flex flex-col gap-1">
                {/* <p className="text-sm font-semibold leading-tight text-white">
                    {data.clientName ?? slug}
                </p> */}
                <p className="text-[11px] text-white/70">{slug}</p>
            </div>
            {/* <div className="flex items-center justify-between text-[11px] text-white/70">
                <span>{data.clientEmail}</span>
                {data.clientWhatsapp && <span>{data.clientWhatsapp}</span>}
            </div> */}
        </div>
    </div>
);

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
