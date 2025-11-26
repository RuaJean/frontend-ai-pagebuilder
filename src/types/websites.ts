import type { components, paths } from "./openapi";

export type WebsiteFilters = NonNullable<
    paths["/api/websites"]["get"]["parameters"]["query"]
>;

type WebsiteBase = components["schemas"]["CreateWebsiteRequest"];

export interface WebsiteListItem extends WebsiteBase {
    id: string;
    /** Slug público generado por el backend. */
    slug?: string | null;
    /** Estado de publicación reportado por el backend. */
    isPublished: boolean;
    /** Marcas de tiempo ISO opcionales que pueda retornar el backend. */
    createdAt?: string;
    updatedAt?: string;
}

export type WebsitesResponse = WebsiteListItem[];

export interface WebsiteDetail extends WebsiteListItem {
    contentJson: string;
    isPublished: boolean;
    seoMetadata?: string | null;
}

