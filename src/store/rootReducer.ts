import { combineReducers } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';
import websitesReducer from '@/features/websites/websitesSlice';
import { api } from '@/services/api';

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  websites: websitesReducer,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
