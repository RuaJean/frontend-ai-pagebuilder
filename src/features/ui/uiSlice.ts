import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';

import { ModalState, ToastMessage, UIState } from '@/types/ui';

const initialState: UIState = {
  toasts: [],
  modals: [],
  activeModalId: null,
  isEditorDirty: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    enqueueToast: {
      reducer(state, action: PayloadAction<ToastMessage>) {
        state.toasts.push(action.payload);
      },
      prepare(toast: Omit<ToastMessage, 'id'> & { id?: string }) {
        return {
          payload: {
            ...toast,
            id: toast.id ?? nanoid(),
            duration: toast.duration ?? 4500,
          },
        };
      },
    },
    dismissToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    openModal(state, action: PayloadAction<ModalState>) {
      const existing = state.modals.find((modal) => modal.id === action.payload.id);
      if (existing) {
        existing.isOpen = true;
        existing.payload = action.payload.payload;
      } else {
        state.modals.push(action.payload);
      }
      state.activeModalId = action.payload.id;
    },
    closeModal(state, action: PayloadAction<string>) {
      const modal = state.modals.find((m) => m.id === action.payload);
      if (modal) {
        modal.isOpen = false;
      }
      if (state.activeModalId === action.payload) {
        state.activeModalId = null;
      }
    },
    setEditorDirty(state, action: PayloadAction<boolean>) {
      state.isEditorDirty = action.payload;
    },
  },
});

export const { enqueueToast, dismissToast, openModal, closeModal, setEditorDirty } =
  uiSlice.actions;
export default uiSlice.reducer;
