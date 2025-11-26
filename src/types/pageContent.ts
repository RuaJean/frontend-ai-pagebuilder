export interface PageContent {
    version?: string;
    metadata?: PageMetadata;
    sections?: PageSection[];
    navigation?: NavigationItem[];
}

export interface PageMetadata {
    title?: string;
    description?: string;
    tone?: string;
    industry?: string;
    targetAudience?: string;
    seo?: {
        title?: string;
        description?: string;
        keywords?: string[];
    };
}

export interface NavigationItem {
    label: string;
    sectionId: string;
    order?: number;
}

export interface PageSection {
    id?: string;
    type?: string;
    order?: number;
    title?: string;
    description?: string;
    elements?: PageElement[];
}

export interface PageElement {
    id?: string;
    order?: number;
    type?: string;
    component?: string;
    content?: Record<string, unknown> | null;
}

/**
 * Tipos heredados (legacy) para mantener compatibilidad con contenido antiguo
 * que todavía pueda almacenarse con la estructura original.
 */
export interface LegacyHeroElement extends PageElement {
    type: "hero";
    heading: string;
    subheading?: string;
    ctaLabel?: string;
    ctaHref?: string;
    backgroundImage?: string;
}

export interface LegacyServicesElement extends PageElement {
    type: "services";
    title?: string;
    items: LegacyServiceItem[];
}

export interface LegacyServiceItem {
    title: string;
    description?: string;
    icon?: string;
}

export interface LegacyTestimonialsElement extends PageElement {
    type: "testimonials";
    title?: string;
    quotes: Array<{
        quote: string;
        author?: string;
        role?: string;
    }>;
}

export interface LegacyContactElement extends PageElement {
    type: "contact";
    title?: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface LegacyCtaElement extends PageElement {
    type: "cta";
    title: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
}

export interface LegacyRichTextElement extends PageElement {
    type: "richText";
    html?: string;
    text?: string;
}

export interface LegacyGalleryElement extends PageElement {
    type: "gallery";
    title?: string;
    images: Array<{
        url: string;
        alt?: string;
        caption?: string;
    }>;
}

