import { api } from "./api";

export const mediaApi = api.injectEndpoints({
  endpoints: (build) => ({
    upload: build.mutation<{ id: string; url: string }, FormData>({
      query: (body) => ({
        url: "/media",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Media"],
    }),
    list: build.query<{ id: string; name: string; url: string }[], void>({
      query: () => ({ url: "/media" }),
      providesTags: ["Media"],
    }),
  }),
});

export const { useUploadMutation, useListQuery: useMediaQuery } = mediaApi;
