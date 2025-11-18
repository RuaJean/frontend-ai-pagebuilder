import type { AuthSessionPayload } from "@/features/auth/authSlice";
import { extractAuthPayload } from "@/features/auth/tokenUtils";
import type { components } from "@/types/openapi";

import { api } from "./api";

type RegisterRequest = components["schemas"]["RegisterRequest"];
type LoginRequest = components["schemas"]["LoginRequest"];
type RefreshRequest = components["schemas"]["RefreshRequest"];

export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation<AuthSessionPayload, RegisterRequest>({
            query: (body) => ({
                url: "/api/auth/register",
                method: "POST",
                body,
            }),
            transformResponse: extractAuthPayload,
            invalidatesTags: ["Auth"],
        }),
        login: build.mutation<AuthSessionPayload, LoginRequest>({
            query: (body) => ({
                url: "/api/auth/login",
                method: "POST",
                body,
            }),
            transformResponse: extractAuthPayload,
            invalidatesTags: ["Auth"],
        }),
        refresh: build.mutation<AuthSessionPayload, RefreshRequest | undefined>({
            query: (body) => ({
                url: "/api/auth/refresh",
                method: "POST",
                body,
            }),
            transformResponse: extractAuthPayload,
            invalidatesTags: ["Auth"],
        }),
        logout: build.mutation<void, RefreshRequest | undefined>({
            query: (body) => ({
                url: "/api/auth/logout",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auth"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshMutation,
    useLogoutMutation,
} = authApi;

