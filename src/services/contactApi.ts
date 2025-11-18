import { api } from './api';

import { ContactFormRequest } from '@/types/contact';

export const contactApi = api.injectEndpoints({
  endpoints: (builder) => ({
    submitContactForm: builder.mutation<void, { websiteId: string; payload: ContactFormRequest }>({
      query: ({ websiteId, payload }) => ({
        url: `/api/contact/${websiteId}`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
    }),
  }),
});

export const { useSubmitContactFormMutation } = contactApi;
