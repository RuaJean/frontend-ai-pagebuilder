'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Wand2, ArrowLeft } from "lucide-react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import WebsiteForm from "@/components/websites/WebsiteForm";
import { useGenerateWebsiteMutation, useCreateWebsiteMutation } from "@/services/websitesApi";
import type { components } from "@/types/openapi";

type GenerateWebsiteRequest = components["schemas"]["GenerateWebsiteRequest"];
type CreateWebsiteRequest = components["schemas"]["CreateWebsiteRequest"];

type RtqError = {
    status?: number;
    data?: unknown;
    error?: string;
};

const extractString = (value: unknown): string | undefined =>
    typeof value === "string" && value.length > 0 ? value : undefined;

const extractContentJson = (payload: unknown): string | undefined => {
    if (typeof payload === "string") {
        return payload;
    }

    if (payload && typeof payload === "object") {
        const record = payload as Record<string, unknown>;
        const candidates = [
            record.contentJson,
            record.content,
            record.website && typeof record.website === "object"
                ? (record.website as Record<string, unknown>).contentJson
                : undefined,
        ];

        for (const candidate of candidates) {
            const value = extractString(candidate);
            if (value) {
                return value;
            }
        }
    }

    return undefined;
};

const extractSlug = (payload: unknown): string | undefined => {
    if (!payload || typeof payload !== "object") {
        return undefined;
    }

    const record = payload as Record<string, unknown>;
    const directSlug = extractString(record.slug);
    if (directSlug) {
        return directSlug;
    }

    if (record.website && typeof record.website === "object") {
        const nestedSlug = extractString(
            (record.website as Record<string, unknown>).slug,
        );
        if (nestedSlug) {
            return nestedSlug;
        }
    }

    return undefined;
};

const resolveErrorMessage = (error: unknown): string => {
    if (!error) {
        return "No se pudo completar la generación.";
    }

    if (typeof error === "string") {
        return error;
    }

    if (typeof error === "object") {
        const rtqError = error as RtqError;
        const data = rtqError.data;
        if (typeof data === "string") {
            return data;
        }

        if (data && typeof data === "object") {
            const record = data as Record<string, unknown>;
            if (typeof record.message === "string") {
                return record.message;
            }
            if (Array.isArray(record.errors)) {
                return record.errors.map((err) => String(err)).join(", ");
            }
        }

        if (typeof rtqError.error === "string") {
            return rtqError.error;
        }
    }

    return "No se pudo completar la generación.";
};

export default function CreateWebsitePage() {
    const router = useRouter();
    const [backendError, setBackendError] = useState<string | null>(null);
    const [generateWebsite, { isLoading: isGenerating }] = useGenerateWebsiteMutation();
    const [createWebsite, { isLoading: isCreating }] = useCreateWebsiteMutation();

    const isSubmitting = useMemo(
        () => isGenerating || isCreating,
        [isCreating, isGenerating],
    );

    const handleSubmit = async (data: GenerateWebsiteRequest) => {
        setBackendError(null);

        try {
            const generationResult = await generateWebsite(data).unwrap();
            let slug = extractSlug(generationResult);
            const contentJson = extractContentJson(generationResult);
            let creationResult: unknown = null;

            if (contentJson) {
                const createPayload: CreateWebsiteRequest = {
                    clientName: data.clientName,
                    clientEmail: data.clientEmail,
                    clientWhatsapp: data.clientWhatsapp ?? null,
                    clientSocials: data.clientSocials ?? null,
                    industry: data.industry ?? null,
                    description: data.description ?? null,
                    targetAudience: data.targetAudience ?? null,
                    brandColors: data.brandColors ?? null,
                    style: data.style ?? null,
                    referenceWebsiteUrl: data.referenceWebsiteUrl ?? null,
                    contentJson,
                    seoMetadata: null,
                    slug: slug ?? null,
                };

                creationResult = await createWebsite(createPayload).unwrap();
                slug = extractSlug(creationResult) ?? slug;
            }

            if (slug) {
                router.replace(`/websites/${encodeURIComponent(slug)}?edit=true`);
                return;
            }

            setBackendError(
                "La generación no devolvió un slug para continuar con la edición.",
            );
        } catch (err) {
            setBackendError(resolveErrorMessage(err));
        }
    };

    return (
        <ProtectedRoute>
            <section className="relative space-y-8">
                {/* Back link */}
                <Link 
                    href="/websites"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Volver a mis sitios
                </Link>

                {/* Header */}
                <header className="relative">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="relative">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-alt)]">
                                <Wand2 className="h-7 w-7 text-[var(--bg-primary)]" />
                            </div>
                            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-alt)] opacity-30 blur-xl" />
                        </div>
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="badge badge-success">
                                    <Sparkles className="mr-1 h-3 w-3" />
                                    IA Generativa
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
                                Crear nuevo sitio
                            </h1>
                        </div>
                    </div>
                    <p className="max-w-2xl text-[var(--text-secondary)]">
                        Completa la información del cliente y nuestro sistema de inteligencia artificial 
                        generará un sitio web profesional. Después podrás editarlo y publicarlo.
                    </p>
                </header>

                {/* Form Container */}
                <div className="relative">
                    {/* Background glow effect */}
                    <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/5 via-transparent to-[var(--accent-alt)]/5 blur-2xl" />
                    
                    <div className="card-glass relative overflow-hidden rounded-2xl p-8">
                        {/* Decorative elements */}
                        <div className="pointer-events-none absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/20 to-transparent blur-2xl" />
                        <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 -translate-x-8 translate-y-8 rounded-full bg-gradient-to-tr from-[var(--accent-alt)]/20 to-transparent blur-2xl" />
                        
                        <WebsiteForm
                            onSubmit={handleSubmit}
                            isSubmitting={isSubmitting}
                            backendErrors={backendError}
                        />
                    </div>
                </div>

                {/* Info footer */}
                <div className="flex items-center justify-center gap-2 text-center text-xs text-[var(--text-muted)]">
                    <div className="h-1.5 w-1.5 rounded-full bg-[var(--accent-primary)]" />
                    <span>Se usará el endpoint oficial <code className="rounded bg-[var(--surface-glass)] px-1.5 py-0.5">POST /api/websites/generate</code></span>
                </div>
            </section>
        </ProtectedRoute>
    );
}
