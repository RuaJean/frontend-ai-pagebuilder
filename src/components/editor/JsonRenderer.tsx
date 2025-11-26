'use client';

import type {
    LegacyContactElement,
    LegacyCtaElement,
    LegacyGalleryElement,
    LegacyHeroElement,
    LegacyRichTextElement,
    LegacyServicesElement,
    PageContent,
    PageElement,
    PageSection,
} from "@/types/pageContent";

type JsonRendererProps = {
    content: PageContent | null;
};

const JsonRenderer = ({ content }: JsonRendererProps) => {
    const sections = sortByOrder(content?.sections ?? []);

    if (!sections.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
                No hay contenido para mostrar todavía.
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {sections.map((section, index) => (
                <SectionRenderer key={section.id ?? `${section.type}-${index}`} section={section} />
            ))}
        </div>
    );
};

export default JsonRenderer;

const SectionRenderer = ({ section }: { section: PageSection }) => {
    const elements = sortByOrder(section.elements ?? []);
    const sectionType = section.type?.toLowerCase();

    if (sectionType === "hero") {
        return <HeroSection section={section} elements={elements} />;
    }

    return (
        <section id={section.id} className="space-y-6">
            <SectionHeading section={section} />
            {elements.length ? (
                <div className="space-y-6">
                    {elements.map((element, index) => (
                        <ElementRenderer
                            key={getElementKey(element, index)}
                            element={element}
                            sectionType={section.type}
                        />
                    ))}
                </div>
            ) : (
                <EmptyState message="Sin elementos configurados para esta sección." />
            )}
        </section>
    );
};

const HeroSection = ({ section, elements }: { section: PageSection; elements: PageElement[] }) => {
    const headingElement = elements.find((el) => getElementKind(el) === "heading");
    const subheadingElement = elements.find((el) => getElementKind(el) === "subheading");
    const ctaElement = elements.find((el) => getElementKind(el) === "cta");

    const heading =
        getTextFromElement(headingElement) ?? section.title ?? "Título pendiente de configurar";
    const subheading = getTextFromElement(subheadingElement) ?? section.description;
    const cta = getCtaFromElement(ctaElement);
    const remaining = elements.filter((element) =>
        !["heading", "subheading", "cta"].includes(getElementKind(element))
    );

    return (
        <section
            id={section.id}
            className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl"
        >
            <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                    {section.description ?? "Presentación"}
                </p>
                {heading && <h1 className="text-4xl font-semibold leading-tight">{heading}</h1>}
                {subheading && <p className="text-lg text-white/80">{subheading}</p>}
                {cta && (
                    <a
                        href={cta.url ?? "#"}
                        className={`inline-flex rounded-full px-6 py-2 text-sm font-semibold text-slate-900 transition ${
                            CTA_STYLE_MAP[cta.style ?? "primary"] ?? CTA_STYLE_MAP.primary
                        }`}
                    >
                        {cta.label}
                    </a>
                )}
            </div>

            {remaining.length > 0 && (
                <div className="mt-8 space-y-4">
                    {remaining.map((element, index) => (
                        <ElementRenderer
                            key={getElementKey(element, index)}
                            element={element}
                            sectionType={section.type}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

const SectionHeading = ({ section }: { section: PageSection }) => {
    if (!section.title && !section.description) {
        return null;
    }

    return (
        <header className="space-y-2">
            {section.title && (
                <h2 className="text-2xl font-semibold text-slate-900">{section.title}</h2>
            )}
            {section.description && <p className="text-sm text-slate-600">{section.description}</p>}
        </header>
    );
};

const ElementRenderer = ({
    element,
    sectionType,
}: {
    element: PageElement;
    sectionType?: string;
}) => {
    const kind = getElementKind(element);
    const level = sectionType?.toLowerCase() === "hero" ? 1 : 2;

    switch (kind) {
        case "heading":
            return <HeadingBlock text={getTextFromElement(element)} level={level} />;
        case "subheading":
            return <ParagraphBlock text={getTextFromElement(element)} muted />;
        case "paragraph":
        case "text":
            return <ParagraphBlock text={getTextFromElement(element)} />;
        case "richtext":
        case "rich-text":
            return <LegacyRichText element={element as LegacyRichTextElement} />;
        case "cta":
            return hasLegacyCtaLayout(element) ? (
                <LegacyCta element={element as LegacyCtaElement} />
            ) : (
                <CtaBlock element={element} />
            );
        case "list":
        case "features":
            return <ListBlock items={getListItems(element)} />;
        case "testimonial":
        case "testimonials":
            return <TestimonialsBlock testimonials={getTestimonials(element)} />;
        case "form":
            return <FormBlock form={getFormData(element)} />;
        case "contact": {
            const form = getFormData(element);
            return form ? <FormBlock form={form} /> : <LegacyContact element={element as LegacyContactElement} />;
        }
        case "gallery":
            return <LegacyGallery element={element as LegacyGalleryElement} />;
        case "services":
            return <LegacyServices element={element as LegacyServicesElement} />;
        case "hero":
            return <LegacyHero element={element as LegacyHeroElement} />;
        case "":
            return (
                <UnsupportedElement label="Elemento sin tipo definido. Verifica la estructura del contenido." />
            );
        default:
            return <UnsupportedElement label={`Elemento no soportado: ${kind}`} />;
    }
};

const HeadingBlock = ({ text, level = 2 }: { text?: string; level?: 1 | 2 | 3 }) => {
    if (!text) return null;

    if (level === 1) {
        return <h1 className="text-3xl font-semibold text-slate-900">{text}</h1>;
    }

    if (level === 2) {
        return <h2 className="text-2xl font-semibold text-slate-900">{text}</h2>;
    }

    return <h3 className="text-xl font-semibold text-slate-900">{text}</h3>;
};

const ParagraphBlock = ({ text, muted = false }: { text?: string; muted?: boolean }) => {
    if (!text) return null;
    return <p className={`text-base ${muted ? "text-slate-500" : "text-slate-700"}`}>{text}</p>;
};

const CtaBlock = ({ element }: { element: PageElement }) => {
    const cta = getCtaFromElement(element);

    if (!cta) {
        return <UnsupportedElement label="CTA sin información disponible." />;
    }

    return (
        <div>
            <a
                href={cta.url ?? "#"}
                className={`inline-flex rounded-full px-5 py-2 text-sm font-semibold transition ${
                    CTA_STYLE_MAP[cta.style ?? "primary"] ?? CTA_STYLE_MAP.primary
                }`}
            >
                {cta.label}
            </a>
        </div>
    );
};

const ListBlock = ({ items }: { items: NormalizedListItem[] }) => {
    if (!items.length) {
        return <EmptyState message="No hay elementos para mostrar en esta lista." />;
    }

    return (
        <div className="grid gap-4 md:grid-cols-2">
            {items.map((item, index) => (
                <article
                    key={item.title ?? `item-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    {item.title && (
                        <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                    )}
                    {item.description && (
                        <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    )}
                </article>
            ))}
        </div>
    );
};

const TestimonialsBlock = ({ testimonials }: { testimonials: NormalizedTestimonial[] }) => {
    if (!testimonials.length) {
        return <EmptyState message="Aún no hay testimonios disponibles." />;
    }

    return (
        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 md:grid-cols-2">
                {testimonials.map((testimonial, index) => (
                    <figure
                        key={testimonial.quote ?? `testimonial-${index}`}
                        className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                    >
                        {testimonial.quote && (
                            <blockquote className="text-sm text-slate-700">“{testimonial.quote}”</blockquote>
                        )}
                        {(testimonial.author || testimonial.role) && (
                            <figcaption className="mt-2 text-xs uppercase tracking-wide text-slate-500">
                                {testimonial.author}
                                {testimonial.role ? ` · ${testimonial.role}` : ""}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </div>
    );
};

const FormBlock = ({ form }: { form: NormalizedForm | null }) => {
    if (!form) {
        return <EmptyState message="El formulario aún no ha sido configurado." />;
    }

    if (!form.fields.length) {
        return <EmptyState message="No hay campos configurados para este formulario." />;
    }

    return (
        <form
            action={form.action}
            method={form.method ?? "POST"}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
            {form.fields.map((field) => (
                <label key={field.id} className="block space-y-1 text-sm text-slate-700">
                    <span className="font-medium">{field.label}</span>
                    {field.fieldType === "textarea" ? (
                        <textarea
                            id={field.id}
                            name={field.id}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                            rows={4}
                        />
                    ) : (
                        <input
                            id={field.id}
                            name={field.id}
                            type={field.fieldType ?? "text"}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                        />
                    )}
                </label>
            ))}

            <button
                type="submit"
                className="inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
                {form.submitLabel ?? "Enviar mensaje"}
            </button>
        </form>
    );
};

const LegacyHero = ({ element }: { element: LegacyHeroElement }) => (
    <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-10 text-white shadow-xl">
        <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                {element.subheading || "Presentación"}
            </p>
            <h1 className="text-4xl font-semibold leading-tight">{element.heading}</h1>
            {element.subheading && (
                <p className="text-lg text-white/80">{element.subheading}</p>
            )}
            {element.ctaLabel && element.ctaHref && (
                <a
                    href={element.ctaHref}
                    className="inline-flex rounded-full bg-white px-6 py-2 text-sm font-semibold text-slate-900 transition hover:bg-white/90"
                >
                    {element.ctaLabel}
                </a>
            )}
        </div>
    </div>
);

const LegacyServices = ({ element }: { element: LegacyServicesElement }) => (
    <div className="space-y-4">
        {element.title && (
            <h3 className="text-xl font-semibold text-slate-900">{element.title}</h3>
        )}
        <div className="grid gap-4 md:grid-cols-3">
            {(element.items ?? []).map((service, index) => (
                <article
                    key={service.title ?? `service-${index}`}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <h4 className="text-lg font-semibold text-slate-900">
                        {service.title}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600">
                        {service.description ?? "Pronto tendremos más información."}
                    </p>
                </article>
            ))}
        </div>
    </div>
);

const LegacyContact = ({ element }: { element: LegacyContactElement }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        {element.title && (
            <h3 className="text-xl font-semibold text-slate-900">{element.title}</h3>
        )}
        {element.description && (
            <p className="mt-2 text-sm text-slate-600">{element.description}</p>
        )}
        <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {element.email && (
                <li>
                    <span className="font-semibold">Email:</span> {element.email}
                </li>
            )}
            {element.phone && (
                <li>
                    <span className="font-semibold">Teléfono:</span> {element.phone}
                </li>
            )}
            {element.address && (
                <li>
                    <span className="font-semibold">Dirección:</span> {element.address}
                </li>
            )}
        </ul>
    </div>
);

const LegacyCta = ({ element }: { element: LegacyCtaElement }) => (
    <div className="rounded-3xl bg-slate-900 px-8 py-10 text-white">
        <h3 className="text-2xl font-semibold">{element.title}</h3>
        {element.description && (
            <p className="mt-2 text-sm text-white/80">{element.description}</p>
        )}
        {element.ctaHref && element.ctaLabel && (
            <a
                href={element.ctaHref}
                className="mt-6 inline-flex rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-900"
            >
                {element.ctaLabel}
            </a>
        )}
    </div>
);

const LegacyRichText = ({ element }: { element: LegacyRichTextElement }) => {
    const content = getContentRecord(element);
    const html = pickString(content, ["html"]) ?? element.html;
    const text = pickString(content, ["text"]) ?? element.text;

    if (html) {
        return (
            <div
                className="prose prose-slate max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        );
    }

    if (text) {
        return <p className="text-base text-slate-700">{text}</p>;
    }

    return null;
};

const LegacyGallery = ({ element }: { element: LegacyGalleryElement }) => {
    const content = getContentRecord(element);
    const contentImages = toRecordArray(content?.images)
        .map((image) => normalizeImageRecord(image))
        .filter((image): image is NormalizedImage => image !== null);
    const legacyImages: NormalizedImage[] = Array.isArray(element.images)
        ? element.images.map((image) => ({
              url: image.url,
              alt: image.alt,
              caption: image.caption,
          }))
        : [];
    const images = contentImages.length ? contentImages : legacyImages;

    if (!images.length) {
        return <EmptyState message="No hay imágenes disponibles para la galería." />;
    }

    return (
        <div className="space-y-4">
            {element.title && (
                <h3 className="text-xl font-semibold text-slate-900">{element.title}</h3>
            )}
            <div className="grid gap-4 md:grid-cols-3">
                {images.map((image, index) => (
                    <figure
                        key={image.url ?? `image-${index}`}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={image.url}
                            alt={image.alt ?? ""}
                            className="h-48 w-full object-cover"
                        />
                        {image.caption && (
                            <figcaption className="p-3 text-xs text-slate-500">
                                {image.caption}
                            </figcaption>
                        )}
                    </figure>
                ))}
            </div>
        </div>
    );
};

const UnsupportedElement = ({ label }: { label: string }) => (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-500">
        {label}
    </div>
);

const EmptyState = ({ message }: { message: string }) => (
    <div className="rounded-lg border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500">
        {message}
    </div>
);

const sortByOrder = <T extends { order?: number }>(items: T[]): T[] =>
    [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

const getElementKind = (element: PageElement): string => {
    const kind = element.component ?? element.type;
    return typeof kind === "string" ? kind.toLowerCase() : "";
};

const getElementKey = (element: PageElement, index: number) =>
    element.id ?? `${getElementKind(element) || "element"}-${index}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const getContentRecord = (element?: PageElement): Record<string, unknown> | null => {
    if (!element) return null;
    return isRecord(element.content) ? (element.content as Record<string, unknown>) : null;
};

const pickString = (
    source: Record<string, unknown> | null,
    keys: string[],
): string | undefined => {
    if (!source) return undefined;
    for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.trim().length > 0) {
            return value;
        }
    }
    return undefined;
};

const toRecordArray = (value: unknown): Record<string, unknown>[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => (isRecord(item) ? item : null))
        .filter((item): item is Record<string, unknown> => item !== null);
};

const getTextFromElement = (element?: PageElement): string | undefined => {
    if (!element) return undefined;

    const content = getContentRecord(element);
    const fromContent = pickString(content, ["text", "title", "value", "heading", "subheading"]);
    if (fromContent) {
        return fromContent;
    }

    const elementRecord = element as Record<string, unknown>;
    return pickString(elementRecord, ["text", "title", "heading", "subheading", "description"]);
};

type NormalizedCta = {
    label: string;
    url?: string;
    style?: string;
};

const CTA_STYLE_MAP: Record<string, string> = {
    primary: "bg-white text-slate-900 hover:bg-white/90",
    secondary: "bg-transparent text-white ring-1 ring-white/40 hover:bg-white/10",
    outline: "border border-white text-white hover:bg-white/10",
};

const getCtaFromElement = (element?: PageElement): NormalizedCta | null => {
    if (!element) return null;
    const content = getContentRecord(element);
    const ctaRecord =
        content && isRecord((content as Record<string, unknown>)["cta"])
            ? ((content as Record<string, unknown>)["cta"] as Record<string, unknown>)
            : null;

    const label =
        pickString(ctaRecord, ["label"]) ??
        pickString(content, ["ctaLabel", "label"]) ??
        pickString(element as Record<string, unknown>, ["ctaLabel", "label"]);

    if (!label) {
        return null;
    }

    const url =
        pickString(ctaRecord, ["url", "href"]) ??
        pickString(content, ["ctaHref", "url", "href"]) ??
        pickString(element as Record<string, unknown>, ["ctaHref", "url", "href"]);

    const style =
        pickString(ctaRecord, ["style", "variant"]) ??
        pickString(content, ["style", "variant"]) ??
        pickString(element as Record<string, unknown>, ["style", "variant"]);

    return { label, url, style };
};

type NormalizedListItem = {
    title: string;
    description?: string;
};

const getListItems = (element: PageElement): NormalizedListItem[] => {
    const content = getContentRecord(element);
    const elementRecord = element as Record<string, unknown>;
    const rawItems = content?.items ?? elementRecord.items;
    const sources = Array.isArray(rawItems) ? rawItems : [];

    return sources
        .map((item, index): NormalizedListItem | null => {
            if (!isRecord(item)) {
                return null;
            }

            return {
                title: pickString(item, ["title", "label", "name"]) ?? `Elemento ${index + 1}`,
                description: pickString(item, ["description", "text", "details"]),
            };
        })
        .filter((item): item is NormalizedListItem => item !== null);
};

const normalizeImageRecord = (record: Record<string, unknown>): NormalizedImage | null => {
    const url = pickString(record, ["url", "src"]);
    if (!url) {
        return null;
    }

    return {
        url,
        alt: pickString(record, ["alt", "label", "title"]),
        caption: pickString(record, ["caption", "description", "text"]),
    };
};

type NormalizedTestimonial = {
    quote: string;
    author?: string;
    role?: string;
    avatar?: string;
};

const getTestimonials = (element: PageElement): NormalizedTestimonial[] => {
    const content = getContentRecord(element);
    const elementRecord = element as Record<string, unknown>;
    const rawTestimonials =
        content?.testimonials ?? elementRecord.testimonials ?? elementRecord.quotes;
    const sources = Array.isArray(rawTestimonials) ? rawTestimonials : [];

    return sources
        .map(
            (item): NormalizedTestimonial | null => {
                if (!isRecord(item)) {
                    return null;
                }

                const quote = pickString(item, ["quote", "text"]);
                if (!quote) {
                    return null;
                }

                return {
                    quote,
                    author: pickString(item, ["author", "name"]),
                    role: pickString(item, ["role", "position"]),
                    avatar: pickString(item, ["avatar", "image"]),
                };
            },
        )
        .filter((item): item is NormalizedTestimonial => item !== null);
};

type NormalizedFormField = {
    id: string;
    label: string;
    fieldType?: string;
    required?: boolean;
    placeholder?: string;
};

type NormalizedForm = {
    action?: string;
    method?: string;
    submitLabel?: string;
    fields: NormalizedFormField[];
};

type NormalizedImage = {
    url: string;
    alt?: string;
    caption?: string;
};

const getFormData = (element: PageElement): NormalizedForm | null => {
    const content = getContentRecord(element);
    const elementRecord = element as Record<string, unknown>;
    const formRecord =
        (content && isRecord((content as Record<string, unknown>)["form"])
            ? ((content as Record<string, unknown>)["form"] as Record<string, unknown>)
            : null) ??
        (isRecord(elementRecord.form) ? (elementRecord.form as Record<string, unknown>) : null);

    if (!formRecord) {
        return null;
    }

    const action = pickString(formRecord, ["action"]);
    const method = pickString(formRecord, ["method"]);
    const submitLabel =
        pickString(formRecord, ["submitLabel", "ctaLabel"]) ??
        pickString(content, ["submitLabel", "ctaLabel"]);

    const rawFields = Array.isArray(formRecord.fields) ? formRecord.fields : [];
    const fields = rawFields
        .map(
            (field, index): NormalizedFormField | null => {
                if (!isRecord(field)) {
                    return null;
                }

                return {
                    id: pickString(field, ["id", "name"]) ?? `field-${index}`,
                    label: pickString(field, ["label", "title"]) ?? `Campo ${index + 1}`,
                    fieldType: pickString(field, ["fieldType", "type"]),
                    required: typeof field.required === "boolean" ? field.required : false,
                    placeholder: pickString(field, ["placeholder", "hint"]),
                };
            },
        )
        .filter((field): field is NormalizedFormField => field !== null);

    return {
        action,
        method,
        submitLabel,
        fields,
    };
};

const hasLegacyCtaLayout = (element: PageElement): boolean => {
    const content = getContentRecord(element);
    const elementRecord = element as Record<string, unknown>;

    return Boolean(
        pickString(content, ["title", "description"]) ??
            pickString(elementRecord, ["title", "description"]),
    );
};
