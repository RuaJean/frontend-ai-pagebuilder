import { api } from './api';

import {
  AuthResponse,
  LoginRequestPayload,
  RefreshRequestPayload,
  RegisterRequestPayload,
} from '@/types/auth';

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse | null, LoginRequestPayload>({
      query: (body) => ({
        url: '/api/auth/login',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<AuthResponse | null, RegisterRequestPayload>({
      query: (body) => ({
        url: '/api/auth/register',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshSession: builder.mutation<AuthResponse | null, RefreshRequestPayload | void>({
      query: (body) => ({
        url: '/api/auth/refresh',
        method: 'POST',
        body: body ?? {},
      }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/auth/logout',
        method: 'POST',
        body: {},
      }),
      invalidatesTags: ['Auth'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshSessionMutation,
  useLogoutMutation,
} = authApi;
