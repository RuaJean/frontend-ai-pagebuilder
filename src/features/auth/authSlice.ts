import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserInfo {
  id: string;
  email: string;
}

export interface AuthState {
  user: UserInfo | null;
  token: string | null;
  status: "idle" | "loading" | "authenticated";
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startAuth(state) {
      state.status = "loading";
    },
    setCredentials(state, action: PayloadAction<{ user: UserInfo; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.status = "authenticated";
    },
    logout() {
      return initialState;
    },
  },
});

export const { startAuth, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
