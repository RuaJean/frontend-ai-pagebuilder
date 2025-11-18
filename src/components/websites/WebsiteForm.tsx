'use client';

import { useMemo, useState } from "react";

import type { components } from "@/types/openapi";

type GenerateWebsiteRequest = components["schemas"]["GenerateWebsiteRequest"];

type FormState = GenerateWebsiteRequest & {
    additionalNotes?: string;
};

const initialState: FormState = {
    clientName: "",
    clientEmail: "",
    clientWhatsapp: "",
    clientSocials: "",
    industry: "",
    description: "",
    targetAudience: "",
    brandColors: "",
    style: "",
    tone: "",
    additionalContext: "",
    additionalNotes: "",
};

type FieldKey = keyof GenerateWebsiteRequest | "additionalNotes";

const serializeClientSocials = (rawValue?: string | null): string | null => {
    if (!rawValue) {
        return null;
    }

    const trimmed = rawValue.trim();
    if (!trimmed) {
        return null;
    }

    try {
        JSON.parse(trimmed);
        return trimmed;
    } catch {
        const values = trimmed
            .split(/[\n,;]/)
            .map((entry) => entry.trim())
            .filter(Boolean);

        if (values.length === 0) {
            return null;
        }

        return JSON.stringify(values);
    }
};

type WebsiteFormProps = {
    isSubmitting?: boolean;
    backendErrors?: string | null;
    onSubmit: (data: GenerateWebsiteRequest) => Promise<void>;
};

const WebsiteForm = ({ isSubmitting = false, backendErrors, onSubmit }: WebsiteFormProps) => {
    const [form, setForm] = useState<FormState>(initialState);

    const canSubmit = useMemo(
        () => form.clientName.trim().length > 0 && form.clientEmail.trim().length > 0,
        [form.clientEmail, form.clientName],
    );

    const handleChange =
        (field: FieldKey) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({
                ...prev,
                [field]: event.target.value,
            }));
        };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!canSubmit) {
            return;
        }

        const payload: GenerateWebsiteRequest = {
            clientName: form.clientName,
            clientEmail: form.clientEmail,
            clientWhatsapp: form.clientWhatsapp || null,
            clientSocials: serializeClientSocials(form.clientSocials),
            industry: form.industry || null,
            description: form.description || null,
            targetAudience: form.targetAudience || null,
            brandColors: form.brandColors || null,
            style: form.style || null,
            tone: form.tone || null,
            additionalContext: form.additionalContext || null,
        };

        await onSubmit(payload);
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    Nombre del cliente *
                    <input
                        type="text"
                        required
                        value={form.clientName}
                        onChange={handleChange("clientName")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Email del cliente *
                    <input
                        type="email"
                        required
                        value={form.clientEmail}
                        onChange={handleChange("clientEmail")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    WhatsApp
                    <input
                        type="tel"
                        value={form.clientWhatsapp ?? ""}
                        onChange={handleChange("clientWhatsapp")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Redes sociales
                    <input
                        type="text"
                        value={form.clientSocials ?? ""}
                        onChange={handleChange("clientSocials")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    Industria
                    <input
                        type="text"
                        value={form.industry ?? ""}
                        onChange={handleChange("industry")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Público objetivo
                    <input
                        type="text"
                        value={form.targetAudience ?? ""}
                        onChange={handleChange("targetAudience")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>
            </div>

            <label className="text-sm font-medium text-slate-700">
                Descripción del proyecto
                <textarea
                    rows={3}
                    value={form.description ?? ""}
                    onChange={handleChange("description")}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    Colores de marca
                    <input
                        type="text"
                        value={form.brandColors ?? ""}
                        onChange={handleChange("brandColors")}
                        placeholder="#000000, #FFFFFF"
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Estilo visual
                    <input
                        type="text"
                        value={form.style ?? ""}
                        onChange={handleChange("style")}
                        placeholder="Minimalista, corporativo..."
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                    Tono de voz
                    <input
                        type="text"
                        value={form.tone ?? ""}
                        onChange={handleChange("tone")}
                        placeholder="Profesional, cercano, disruptivo..."
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>

                <label className="text-sm font-medium text-slate-700">
                    Contexto adicional
                    <input
                        type="text"
                        value={form.additionalContext ?? ""}
                        onChange={handleChange("additionalContext")}
                        placeholder="Objetivos específicos, restricciones..."
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                    />
                </label>
            </div>

            <label className="text-sm font-medium text-slate-700">
                Notas internas
                <textarea
                    rows={3}
                    value={form.additionalNotes ?? ""}
                    onChange={handleChange("additionalNotes")}
                    placeholder="Solo visible para tu equipo (no se envía al backend)"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                />
            </label>

            {backendErrors && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                    {backendErrors}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="rounded-lg bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                    {isSubmitting ? "Generando..." : "Generar sitio con IA"}
                </button>
                <button
                    type="button"
                    onClick={() => setForm(initialState)}
                    className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-semibold text-slate-600 hover:border-slate-900"
                >
                    Limpiar
                </button>
                <p className="text-xs text-slate-500">
                    Se usará el endpoint oficial `POST /api/websites/generate`.
                </p>
            </div>
        </form>
    );
};

export default WebsiteForm;
