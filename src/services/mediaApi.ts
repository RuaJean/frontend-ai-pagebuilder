import { api } from './api';

import { MediaAsset, UploadMediaRequest } from '@/types/media';

export const mediaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    uploadMedia: builder.mutation<MediaAsset, UploadMediaRequest>({
      query: ({ websiteId, file }) => {
        const formData = new FormData();
        formData.append('WebsiteId', websiteId);
        formData.append('File', file);
        return {
          url: '/api/media/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { websiteId }) => [
        { type: 'Media', id: websiteId },
      ],
    }),
    deleteMedia: builder.mutation<void, { websiteId: string; filename: string }>({
      query: ({ websiteId, filename }) => ({
        url: `/api/media/${websiteId}/${filename}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, { websiteId }) => [
        { type: 'Media', id: websiteId },
      ],
    }),
  }),
});

export const { useUploadMediaMutation, useDeleteMediaMutation } = mediaApi;
