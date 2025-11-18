import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import mediaReducer from "@/features/media/mediaSlice";
import websitesReducer from "@/features/websites/websitesSlice";
import { api } from "@/services/api";

const rootReducer = combineReducers({
  auth: authReducer,
  websites: websitesReducer,
  media: mediaReducer,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
