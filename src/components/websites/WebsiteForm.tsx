'use client';

import { useMemo, useState } from "react";
import { 
    User, 
    Mail, 
    Phone, 
    Share2, 
    Building2, 
    Users, 
    FileText, 
    Palette, 
    Wand2, 
    MessageSquare, 
    Info, 
    StickyNote,
    Sparkles,
    RotateCcw,
    AlertCircle,
    Globe
} from "lucide-react";

import type { components } from "@/types/openapi";

type GenerateWebsiteRequest = components["schemas"]["GenerateWebsiteRequest"];

type FormState = GenerateWebsiteRequest & {
    additionalNotes?: string;
    referenceWebsiteUrl: string;
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
    referenceWebsiteUrl: "",
};

type FieldKey = keyof GenerateWebsiteRequest | "additionalNotes";

const serializeJsonArrayField = (rawValue?: string | null): string | null => {
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

type InputFieldProps = {
    label: string;
    icon: React.ReactNode;
    required?: boolean;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    delay?: number;
    error?: string | null;
    helperText?: string;
};

const InputField = ({ 
    label, 
    icon, 
    required, 
    type = "text", 
    value, 
    onChange, 
    placeholder,
    delay = 0,
    error,
    helperText,
}: InputFieldProps) => (
    <div 
        className="animate-fade-in-up opacity-0 group"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <label className="block">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                <span className="text-[var(--accent-primary)]">{icon}</span>
                <span>{label}</span>
                {required && <span className="text-[var(--accent-alt)]">*</span>}
            </div>
            <div className="relative">
                <input
                    type={type}
                    required={required}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    className={`input-modern pr-4 pl-4 ${error ? "border-[var(--error)] focus-visible:ring-[var(--error)]" : ""}`}
                />
                <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity group-focus-within:opacity-100"
                     style={{ boxShadow: '0 0 20px var(--accent-glow)' }} 
                />
            </div>
            {error ? (
                <p className="mt-2 text-xs text-[var(--error)]">{error}</p>
            ) : (
                helperText && (
                    <p className="mt-2 text-xs text-[var(--text-muted)]">{helperText}</p>
                )
            )}
        </label>
    </div>
);

type TextareaFieldProps = {
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    delay?: number;
};

const TextareaField = ({ 
    label, 
    icon, 
    value, 
    onChange, 
    placeholder, 
    rows = 3,
    delay = 0
}: TextareaFieldProps) => (
    <div 
        className="animate-fade-in-up opacity-0 group"
        style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
        <label className="block">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                <span className="text-[var(--accent-primary)]">{icon}</span>
                <span>{label}</span>
            </div>
            <textarea
                rows={rows}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="input-modern resize-none"
            />
        </label>
    </div>
);

const WebsiteForm = ({ isSubmitting = false, backendErrors, onSubmit }: WebsiteFormProps) => {
    const [form, setForm] = useState<FormState>(initialState);
    const trimmedReferenceWebsiteUrl = form.referenceWebsiteUrl.trim();
    const referenceWebsiteUrlError = useMemo(() => {
        if (!trimmedReferenceWebsiteUrl) {
            return null;
        }

        try {
            const parsed = new URL(trimmedReferenceWebsiteUrl);
            if (parsed.protocol !== "https:") {
                return "La URL debe iniciar con https://";
            }
            if (!parsed.hostname) {
                return "Proporciona un dominio válido.";
            }
        } catch {
            return "Ingresa una URL válida.";
        }

        return null;
    }, [trimmedReferenceWebsiteUrl]);

    const canSubmit = useMemo(
        () =>
            form.clientName.trim().length > 0 &&
            form.clientEmail.trim().length > 0 &&
            trimmedReferenceWebsiteUrl.length > 0 &&
            !referenceWebsiteUrlError,
        [form.clientEmail, form.clientName, referenceWebsiteUrlError, trimmedReferenceWebsiteUrl],
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

        if (!canSubmit || referenceWebsiteUrlError) {
            return;
        }

        const normalizedReferenceWebsiteUrl = trimmedReferenceWebsiteUrl;

        const payload: GenerateWebsiteRequest = {
            clientName: form.clientName,
            clientEmail: form.clientEmail,
            clientWhatsapp: form.clientWhatsapp || null,
            clientSocials: serializeJsonArrayField(form.clientSocials),
            industry: form.industry || null,
            description: form.description || null,
            targetAudience: form.targetAudience || null,
            brandColors: serializeJsonArrayField(form.brandColors),
            style: form.style || null,
            tone: form.tone || null,
            additionalContext: form.additionalContext || null,
            referenceWebsiteUrl: normalizedReferenceWebsiteUrl,
        };

        await onSubmit(payload);
    };

    return (
        <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Section: Client Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)]">
                        <User className="h-4 w-4 text-[var(--bg-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Información del Cliente
                    </h3>
                </div>
                
                <div className="grid gap-5 md:grid-cols-2">
                    <InputField
                        label="Nombre del cliente"
                        icon={<User className="h-4 w-4" />}
                        required
                        value={form.clientName}
                        onChange={handleChange("clientName")}
                        placeholder="Ej: Acme Corporation"
                        delay={0}
                    />
                    <InputField
                        label="Email del cliente"
                        icon={<Mail className="h-4 w-4" />}
                        required
                        type="email"
                        value={form.clientEmail}
                        onChange={handleChange("clientEmail")}
                        placeholder="cliente@empresa.com"
                        delay={50}
                    />
                    <InputField
                        label="WhatsApp"
                        icon={<Phone className="h-4 w-4" />}
                        type="tel"
                        value={form.clientWhatsapp ?? ""}
                        onChange={handleChange("clientWhatsapp")}
                        placeholder="+52 55 1234 5678"
                        delay={100}
                    />
                    <InputField
                        label="Redes sociales"
                        icon={<Share2 className="h-4 w-4" />}
                        value={form.clientSocials ?? ""}
                        onChange={handleChange("clientSocials")}
                        placeholder="@instagram, linkedin.com/company/..."
                        delay={150}
                    />
                    <InputField
                        label="Sitio web de referencia"
                        icon={<Globe className="h-4 w-4" />}
                        required
                        type="url"
                        value={form.referenceWebsiteUrl}
                        onChange={handleChange("referenceWebsiteUrl")}
                        placeholder="https://ejemplo.com"
                        delay={180}
                        helperText="Debe incluir el protocolo https://"
                        error={referenceWebsiteUrlError}
                    />
                </div>
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-subtle)]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[var(--bg-primary)] px-4 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                        Sobre el proyecto
                    </span>
                </div>
            </div>

            {/* Section: Project Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-tertiary)] to-[var(--accent-alt)]">
                        <Building2 className="h-4 w-4 text-[var(--text-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Detalles del Negocio
                    </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <InputField
                        label="Industria"
                        icon={<Building2 className="h-4 w-4" />}
                        value={form.industry ?? ""}
                        onChange={handleChange("industry")}
                        placeholder="Tecnología, Restaurantes, Retail..."
                        delay={200}
                    />
                    <InputField
                        label="Público objetivo"
                        icon={<Users className="h-4 w-4" />}
                        value={form.targetAudience ?? ""}
                        onChange={handleChange("targetAudience")}
                        placeholder="Millennials, empresarios, familias..."
                        delay={250}
                    />
                </div>

                <TextareaField
                    label="Descripción del proyecto"
                    icon={<FileText className="h-4 w-4" />}
                    value={form.description ?? ""}
                    onChange={handleChange("description")}
                    placeholder="Cuéntanos sobre el negocio, sus productos o servicios, y qué desea comunicar..."
                    rows={4}
                    delay={300}
                />
            </div>

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--border-subtle)]" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-[var(--bg-primary)] px-4 text-xs uppercase tracking-widest text-[var(--text-muted)]">
                        Estilo visual
                    </span>
                </div>
            </div>

            {/* Section: Visual Style */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-alt)] to-[var(--accent-primary)]">
                        <Palette className="h-4 w-4 text-[var(--text-primary)]" />
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                        Identidad Visual
                    </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                    <InputField
                        label="Colores de marca"
                        icon={<Palette className="h-4 w-4" />}
                        value={form.brandColors ?? ""}
                        onChange={handleChange("brandColors")}
                        placeholder="#000000, #FFFFFF, azul marino..."
                        delay={350}
                    />
                    <InputField
                        label="Estilo visual"
                        icon={<Wand2 className="h-4 w-4" />}
                        value={form.style ?? ""}
                        onChange={handleChange("style")}
                        placeholder="Minimalista, corporativo, moderno..."
                        delay={400}
                    />
                    <InputField
                        label="Tono de voz"
                        icon={<MessageSquare className="h-4 w-4" />}
                        value={form.tone ?? ""}
                        onChange={handleChange("tone")}
                        placeholder="Profesional, cercano, divertido..."
                        delay={450}
                    />
                    <InputField
                        label="Contexto adicional"
                        icon={<Info className="h-4 w-4" />}
                        value={form.additionalContext ?? ""}
                        onChange={handleChange("additionalContext")}
                        placeholder="Objetivos específicos, restricciones..."
                        delay={500}
                    />
                </div>
            </div>

            {/* Section: Internal Notes */}
            <div 
                className="animate-fade-in-up opacity-0"
                style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}
            >
                <div className="card-glass border-dashed">
                    <div className="mb-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <StickyNote className="h-4 w-4" />
                        <span>Notas internas (no se envían al backend)</span>
                    </div>
                    <textarea
                        rows={2}
                        value={form.additionalNotes ?? ""}
                        onChange={handleChange("additionalNotes")}
                        placeholder="Notas para tu equipo..."
                        className="input-modern resize-none"
                    />
                </div>
            </div>

            {/* Error message */}
            {backendErrors && (
                <div 
                    className="animate-fade-in-up flex items-start gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-4"
                >
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--error)]" />
                    <p className="text-sm text-[var(--error)]">{backendErrors}</p>
                </div>
            )}

            {/* Actions */}
            <div 
                className="animate-fade-in-up flex flex-wrap items-center gap-4 opacity-0 pt-2"
                style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
            >
                <button
                    type="submit"
                    disabled={!canSubmit || isSubmitting}
                    className="glow-button btn-primary flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg-primary)] border-t-transparent" />
                            <span>Generando con IA...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="h-4 w-4" />
                            <span>Generar sitio con IA</span>
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={() => setForm(initialState)}
                    className="btn-secondary flex items-center gap-2"
                >
                    <RotateCcw className="h-4 w-4" />
                    <span>Limpiar</span>
                </button>
            </div>
        </form>
    );
};

export default WebsiteForm;
