import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<{ token: string }, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    profile: build.query<{ id: string; email: string }, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: ["Auth"],
    }),
  }),
})

export const { useLoginMutation, useProfileQuery } = authApi;
