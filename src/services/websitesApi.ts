import { api } from "./api";

export const websitesApi = api.injectEndpoints({
  endpoints: (build) => ({
    list: build.query<{ id: string; name: string }[], void>({
      query: () => ({ url: "/websites" }),
      providesTags: ["Websites"],
    }),
    create: build.mutation<{ id: string }, { name: string; slug: string }>({
      query: (body) => ({
        url: "/websites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Websites"],
    }),
  }),
});

export const { useListQuery: useWebsitesQuery, useCreateMutation: useCreateWebsiteMutation } = websitesApi;
