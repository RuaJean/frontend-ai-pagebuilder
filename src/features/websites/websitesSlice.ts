import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Website {
  id: string;
  name: string;
  status: "draft" | "published";
}

interface WebsitesState {
  items: Website[];
}

const initialState: WebsitesState = {
  items: [],
};

const websitesSlice = createSlice({
  name: "websites",
  initialState,
  reducers: {
    setWebsites(state, action: PayloadAction<Website[]>) {
      state.items = action.payload;
    },
    upsertWebsite(state, action: PayloadAction<Website>) {
      const index = state.items.findIndex((site) => site.id === action.payload.id);
      if (index >= 0) {
        state.items[index] = action.payload;
      } else {
        state.items.push(action.payload);
      }
    },
  },
});

export const { setWebsites, upsertWebsite } = websitesSlice.actions;
export default websitesSlice.reducer;
