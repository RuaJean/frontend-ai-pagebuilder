import { api } from "./api";
import type { components } from "../types/openapi";

type RegisterRequest = components["schemas"]["RegisterRequest"];
type LoginRequest = components["schemas"]["LoginRequest"];
type RefreshRequest = components["schemas"]["RefreshRequest"];

export const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        register: build.mutation<void, RegisterRequest>({
            query: (body) => ({
                url: "/api/auth/register",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auth"],
        }),
        login: build.mutation<void, LoginRequest>({
            query: (body) => ({
                url: "/api/auth/login",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Auth"],
        }),
        refresh: build.mutation<void, RefreshRequest | undefined>({
            query: (body) => ({
                url: "/api/auth/refresh",
                method: "POST",
                body,
            }),
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

