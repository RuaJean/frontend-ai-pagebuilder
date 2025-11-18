import { api } from "./api";
import type { components, paths } from "@/types/openapi";
import type { WebsiteListItem, WebsitesResponse } from "@/types/websites";

type ListWebsitesQuery = paths["/api/websites"]["get"]["parameters"]["query"];
type CreateWebsiteRequest = components["schemas"]["CreateWebsiteRequest"];
type GenerateWebsiteRequest = components["schemas"]["GenerateWebsiteRequest"];
type ApplyPromptRequest = components["schemas"]["ApplyPromptRequest"];
type RevertWebsiteRequest = components["schemas"]["RevertWebsiteRequest"];
type UpdateWebsiteRequest = components["schemas"]["UpdateWebsiteRequest"];
type PublishWebsiteRequest = components["schemas"]["PublishWebsiteRequest"];

type WebsiteIdParam = paths["/api/websites/{id}"]["put"]["parameters"]["path"];
type WebsiteSlugParam = paths["/api/websites/{slug}"]["get"]["parameters"]["path"];
type ApplyPromptPath = paths["/api/websites/{id}/apply-prompt"]["post"]["parameters"]["path"];
type RevertWebsitePath = paths["/api/websites/{id}/revert"]["post"]["parameters"]["path"];
type PublishWebsitePath = paths["/api/websites/{id}/publish"]["patch"]["parameters"]["path"];

export const websitesApi = api.injectEndpoints({
    endpoints: (build) => ({
        getWebsites: build.query<WebsitesResponse, ListWebsitesQuery>({
            query: (params) => {
                const baseRequest = {
                    url: "/api/websites",
                    method: "GET" as const,
                };

                return params ? { ...baseRequest, params } : baseRequest;
            },
            providesTags: ["Websites"],
        }),
        createWebsite: build.mutation<unknown, CreateWebsiteRequest>({
            query: (body) => ({
                url: "/api/websites",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Websites"],
        }),
        generateWebsite: build.mutation<unknown, GenerateWebsiteRequest>({
            query: (body) => ({
                url: "/api/websites/generate",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Websites"],
        }),
        applyPrompt: build.mutation<
            void,
            { id: ApplyPromptPath["id"]; body: ApplyPromptRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/websites/${id}/apply-prompt`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Websites"],
        }),
        revertWebsite: build.mutation<
            void,
            { id: RevertWebsitePath["id"]; body: RevertWebsiteRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/websites/${id}/revert`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["Websites"],
        }),
        getWebsiteBySlug: build.query<unknown, WebsiteSlugParam["slug"]>({
            query: (slug) => ({
                url: `/api/websites/${slug}`,
                method: "GET",
            }),
            providesTags: ["Websites"],
        }),
        updateWebsite: build.mutation<
            void,
            { id: WebsiteIdParam["id"]; body: UpdateWebsiteRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/websites/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Websites"],
        }),
        publishWebsite: build.mutation<
            void,
            { id: PublishWebsitePath["id"]; body: PublishWebsiteRequest }
        >({
            query: ({ id, body }) => ({
                url: `/api/websites/${id}/publish`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Websites"],
        }),
        migrate: build.query<void, void>({
            query: () => ({
                url: "/api/dev/migrate",
                method: "GET",
            }),
            providesTags: ["System"],
        }),
        health: build.query<void, void>({
            query: () => ({
                url: "/health",
                method: "GET",
            }),
            providesTags: ["System"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetWebsitesQuery,
    useCreateWebsiteMutation,
    useGenerateWebsiteMutation,
    useApplyPromptMutation,
    useRevertWebsiteMutation,
    useGetWebsiteBySlugQuery,
    useUpdateWebsiteMutation,
    usePublishWebsiteMutation,
    useMigrateQuery,
    useHealthQuery,
} = websitesApi;

