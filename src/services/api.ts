import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { sessionCleared, sessionEstablished } from "@/features/auth/authSlice";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5244",
    credentials: "include",
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
                { url: "/api/auth/refresh", method: "POST" },
                api,
                extraOptions,
            );

            if (refreshResult.error) {
                api.dispatch(sessionCleared());
                return result;
            }

            api.dispatch(sessionEstablished(null));
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

