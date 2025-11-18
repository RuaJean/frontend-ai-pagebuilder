import { api } from './api';

import { ApiListResponse } from '@/types/api';
import {
  ApplyPromptRequest,
  CreateWebsiteRequest,
  GenerateWebsiteRequest,
  PublishWebsiteRequest,
  RevertWebsiteRequest,
  UpdateWebsiteRequest,
  WebsiteDetails,
  WebsiteSummary,
} from '@/types/websites';

type ListWebsitesRequest = {
  search?: string;
  isPublished?: boolean;
  limit?: number;
};

export const websitesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getWebsites: builder.query<ApiListResponse<WebsiteSummary>, ListWebsitesRequest>({
      query: (params) => ({
        url: '/api/websites',
        params,
      }),
      providesTags: (result) =>
        result?.items
          ? [
              ...result.items.map(({ id }) => ({ type: 'Website' as const, id })),
              { type: 'Website' as const, id: 'LIST' },
            ]
          : [{ type: 'Website' as const, id: 'LIST' }],
    }),
    getWebsiteBySlug: builder.query<WebsiteDetails, string>({
      query: (slug) => ({
        url: `/api/websites/${slug}`,
      }),
      providesTags: (_result, _error, slug) => [{ type: 'Website', id: slug }],
    }),
    createWebsite: builder.mutation<WebsiteDetails, CreateWebsiteRequest>({
      query: (body) => ({
        url: '/api/websites',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Website', id: 'LIST' }],
    }),
    generateWebsite: builder.mutation<WebsiteDetails, GenerateWebsiteRequest>({
      query: (body) => ({
        url: '/api/websites/generate',
        method: 'POST',
        body,
      }),
    }),
    applyPrompt: builder.mutation<
      WebsiteDetails,
      { id: string; payload: ApplyPromptRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/api/websites/${id}/apply-prompt`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Website', id },
        { type: 'Website', id: 'LIST' },
      ],
    }),
    revertWebsite: builder.mutation<
      WebsiteDetails,
      { id: string; payload: RevertWebsiteRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/api/websites/${id}/revert`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Website', id },
        { type: 'Website', id: 'LIST' },
      ],
    }),
    updateWebsite: builder.mutation<
      WebsiteDetails,
      { id: string; payload: UpdateWebsiteRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/api/websites/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Website', id },
        { type: 'Website', id: 'LIST' },
      ],
    }),
    publishWebsite: builder.mutation<
      WebsiteDetails,
      { id: string; payload: PublishWebsiteRequest }
    >({
      query: ({ id, payload }) => ({
        url: `/api/websites/${id}/publish`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Website', id },
        { type: 'Website', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetWebsitesQuery,
  useGetWebsiteBySlugQuery,
  useCreateWebsiteMutation,
  useGenerateWebsiteMutation,
  useApplyPromptMutation,
  useRevertWebsiteMutation,
  useUpdateWebsiteMutation,
  usePublishWebsiteMutation,
} = websitesApi;
