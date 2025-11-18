import { api } from "./api";

export const contactApi = api.injectEndpoints({
  endpoints: (build) => ({
    sendMessage: build.mutation<{ success: boolean }, { name: string; email: string; message: string }>({
      query: (body) => ({
        url: "/contact",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Contact"],
    }),
  }),
});

export const { useSendMessageMutation } = contactApi;
