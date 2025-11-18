import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WebsiteDetails, WebsiteSummary } from '@/types/websites';

interface WebsitesState {
  items: WebsiteSummary[];
  selectedWebsite: WebsiteDetails | null;
  isSaving: boolean;
  lastUpdatedAt: string | null;
}

const initialState: WebsitesState = {
  items: [],
  selectedWebsite: null,
  isSaving: false,
  lastUpdatedAt: null,
};

const websitesSlice = createSlice({
  name: 'websites',
  initialState,
  reducers: {
    setWebsites(state, action: PayloadAction<WebsiteSummary[]>) {
      state.items = action.payload;
    },
    upsertWebsite(state, action: PayloadAction<WebsiteSummary>) {
      const idx = state.items.findIndex((site) => site.id === action.payload.id);
      if (idx >= 0) {
        state.items[idx] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
    setCurrentWebsite(state, action: PayloadAction<WebsiteDetails | null>) {
      state.selectedWebsite = action.payload;
      state.lastUpdatedAt = action.payload?.updatedAt ?? null;
    },
    setSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },
  },
});

export const { setWebsites, upsertWebsite, setCurrentWebsite, setSaving } = websitesSlice.actions;
export default websitesSlice.reducer;
