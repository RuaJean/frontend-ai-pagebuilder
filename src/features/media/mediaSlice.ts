import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
}

interface MediaState {
  items: MediaItem[];
}

const initialState: MediaState = {
  items: [],
};

const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMedia(state, action: PayloadAction<MediaItem[]>) {
      state.items = action.payload;
    },
    addMedia(state, action: PayloadAction<MediaItem>) {
      state.items.push(action.payload);
    },
  },
});

export const { setMedia, addMedia } = mediaSlice.actions;
export default mediaSlice.reducer;
