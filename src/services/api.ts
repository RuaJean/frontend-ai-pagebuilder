import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';

import { AuthResponse } from '@/types/auth';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5244').replace(/\/$/, '');

const flexibleResponseHandler = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  credentials: 'include',
  responseHandler: flexibleResponseHandler,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});

const AUTH_SET_USER = 'auth/setUser';
const AUTH_RESET = 'auth/resetAuth';

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshResult = await rawBaseQuery(
      {
        url: '/api/auth/refresh',
        method: 'POST',
        body: {},
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const authPayload = refreshResult.data as AuthResponse;
      api.dispatch({ type: AUTH_SET_USER, payload: authPayload.user });
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch({ type: AUTH_RESET });
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'Website', 'Media', 'Contact'],
  endpoints: () => ({}),
});
