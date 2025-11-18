import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthUser {
    email: string;
    name?: string | null;
}

export interface AuthSessionPayload {
    user?: AuthUser | null;
    accessToken?: string | null;
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    accessToken: null,
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
            state.accessToken = null;
        },
        sessionEstablished(state, action: PayloadAction<AuthSessionPayload | undefined>) {
            state.status = "succeeded";
            state.isAuthenticated = true;
            state.error = null;

            const payload = action.payload;
            if (payload?.user) {
                state.user = payload.user;
            }
            if (typeof payload?.accessToken === "string") {
                state.accessToken = payload.accessToken;
            }
        },
        sessionCleared(state) {
            state.user = null;
            state.accessToken = null;
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

