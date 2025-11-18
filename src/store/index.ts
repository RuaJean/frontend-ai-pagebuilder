import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import rootReducer from "./rootReducer";
import { api } from "@/services/api";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware),
});

setupListeners(store.dispatch);

export type AppStore = typeof store;
export type AppDispatch = AppStore["dispatch"];
export type AppState = ReturnType<typeof store.getState>;
