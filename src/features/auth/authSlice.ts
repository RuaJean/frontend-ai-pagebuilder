import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
    email: string;
    name?: string | null;
}

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    status: "idle",
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authRequestStarted(state) {
            state.status = "loading";
            state.error = null;
        },
        authRequestFailed(state, action: PayloadAction<string | null | undefined>) {
            state.status = "failed";
            state.error = action.payload ?? "Error de autenticación";
        },
        sessionEstablished(state, action: PayloadAction<AuthUser | null | undefined>) {
            state.status = "succeeded";
            state.isAuthenticated = true;
            state.error = null;
            if (action.payload) {
                state.user = action.payload;
            }
        },
        sessionCleared(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.status = "idle";
            state.error = null;
        },
    },
});

export const {
    authRequestStarted,
    authRequestFailed,
    sessionEstablished,
    sessionCleared,
} = authSlice.actions;

export default authSlice.reducer;

