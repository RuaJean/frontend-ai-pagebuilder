import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import {
    sessionCleared,
    sessionEstablished,
    type AuthState,
} from "@/features/auth/authSlice";
import { extractAuthPayload } from "@/features/auth/tokenUtils";

const DEFAULT_API_BASE_URL = "http://localhost:5244";
const apiBaseUrl =
    (process.env.NEXT_PUBLIC_API_URL &&
        process.env.NEXT_PUBLIC_API_URL.trim().length > 0
        ? process.env.NEXT_PUBLIC_API_URL
        : undefined) ?? DEFAULT_API_BASE_URL;

type WithAuthState = {
    auth: AuthState;
};

const rawBaseQuery = fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as WithAuthState | undefined;
        const token = state?.auth?.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const isRefreshCall =
            typeof args !== "string" && args.url === "/api/auth/refresh";

        if (!isRefreshCall) {
            const refreshResult = await rawBaseQuery(
                { url: "/api/auth/refresh", method: "POST", body: {} },
                api,
                extraOptions,
            );

            if (refreshResult.error) {
                api.dispatch(sessionCleared());
                return result;
            }

            const payload = extractAuthPayload(refreshResult.data);
            if (!payload.accessToken) {
                api.dispatch(sessionCleared());
                return result;
            }

            api.dispatch(sessionEstablished(payload));
            result = await rawBaseQuery(args, api, extraOptions);
        } else {
            api.dispatch(sessionCleared());
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Auth", "Websites", "Media", "Contact", "System"],
    endpoints: () => ({}),
});

