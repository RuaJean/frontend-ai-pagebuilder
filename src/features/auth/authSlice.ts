import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { authApi } from '@/services/authApi';
import { AuthState, AuthUser } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  status: 'idle',
  error: null,
  lastCheckedAt: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.status = action.payload ? 'authenticated' : 'unauthenticated';
      state.lastCheckedAt = new Date().toISOString();
    },
    setStatus(state, action: PayloadAction<AuthState['status']>) {
      state.status = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    resetAuth(state) {
      state.user = null;
      state.status = 'unauthenticated';
      state.error = null;
      state.lastCheckedAt = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.status = 'checking';
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.status = 'authenticated';
          state.error = null;
        } else {
          state.status = 'checking';
        }
        state.lastCheckedAt = new Date().toISOString();
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Error al iniciar sesión';
      })
      .addMatcher(authApi.endpoints.refreshSession.matchPending, (state) => {
        state.status = state.status === 'idle' ? 'checking' : state.status;
      })
      .addMatcher(authApi.endpoints.refreshSession.matchFulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.status = 'authenticated';
          state.error = null;
        } else {
          state.user = null;
          state.status = 'unauthenticated';
        }
        state.lastCheckedAt = new Date().toISOString();
      })
      .addMatcher(authApi.endpoints.refreshSession.matchRejected, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
        state.lastCheckedAt = new Date().toISOString();
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, (state) => {
        state.user = null;
        state.status = 'unauthenticated';
        state.error = null;
        state.lastCheckedAt = new Date().toISOString();
      });
  },
});

export const { setUser, setStatus, setError, resetAuth } = authSlice.actions;
export default authSlice.reducer;
