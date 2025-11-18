export type ToastLevel = 'info' | 'success' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  level: ToastLevel;
  duration?: number;
}

export interface ModalState<T = unknown> {
  id: string;
  isOpen: boolean;
  payload?: T;
}

export interface UIState {
  toasts: ToastMessage[];
  modals: ModalState[];
  activeModalId: string | null;
  isEditorDirty: boolean;
}
