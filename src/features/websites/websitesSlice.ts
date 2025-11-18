import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { WebsiteFilters } from "@/types/websites";

const defaultFilters: WebsiteFilters = {
    limit: 12,
};

interface WebsitesState {
    filters: WebsiteFilters;
    selectedWebsiteId: string | null;
}

const initialState: WebsitesState = {
    filters: { ...defaultFilters },
    selectedWebsiteId: null,
};

const websitesSlice = createSlice({
    name: "websites",
    initialState,
    reducers: {
        setSearch(state, action: PayloadAction<string>) {
            state.filters.search = action.payload.trim() || undefined;
        },
        setIsPublishedFilter(state, action: PayloadAction<boolean | undefined>) {
            state.filters.isPublished = action.payload;
        },
        setLimit(state, action: PayloadAction<number | undefined>) {
            state.filters.limit = action.payload;
        },
        resetFilters(state) {
            state.filters = { ...defaultFilters };
        },
        setSelectedWebsiteId(state, action: PayloadAction<string | null>) {
            state.selectedWebsiteId = action.payload;
        },
    },
});

export const {
    setSearch,
    setIsPublishedFilter,
    setLimit,
    resetFilters,
    setSelectedWebsiteId,
} = websitesSlice.actions;

export default websitesSlice.reducer;

