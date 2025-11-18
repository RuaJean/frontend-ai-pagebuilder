'use client';

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
            <section className="space-y-6">
                <header className="space-y-2">
                    <p className="text-xs uppercase tracking-wide text-slate-500">
                        Generación asistida por IA
                    </p>
                    <h1 className="text-3xl font-semibold text-slate-900">
                        Crear nuevo sitio
                    </h1>
                    <p className="text-sm text-slate-600">
                        Completa la información del cliente. Primero se generará el contenido
                        vía IA y después se registrará un borrador editable.
                    </p>
                </header>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <WebsiteForm
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        backendErrors={backendError}
                    />
                </div>
            </section>
        </ProtectedRoute>
    );
}

