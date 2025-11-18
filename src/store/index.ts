import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/services/api";
import authReducer from "@/features/auth/authSlice";
import websitesReducer from "@/features/websites/websitesSlice";

export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        auth: authReducer,
        websites: websitesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(api.middleware),
    devTools: process.env.NODE_ENV !== "production",
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

