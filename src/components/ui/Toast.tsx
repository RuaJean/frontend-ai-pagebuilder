'use client';

import { useEffect } from 'react';

import { dismissToast } from '@/features/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ToastMessage } from '@/types/ui';

const variantClasses: Record<ToastMessage['level'], string> = {
  info: 'border-slate-200 bg-white text-slate-900',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  error: 'border-red-200 bg-red-50 text-red-900',
};

function Toast({ toast, onClose }: { toast: ToastMessage; onClose: () => void }) {
  return (
    <div
      className={`w-full max-w-sm rounded-lg border px-4 py-3 shadow-lg ${variantClasses[toast.level]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description && <p className="mt-1 text-sm text-slate-600">{toast.description}</p>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-slate-500 transition hover:text-slate-800"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export function ToastHub() {
  const dispatch = useAppDispatch();
  const toasts = useAppSelector((state) => state.ui.toasts);

  useEffect(() => {
    const timers = toasts
      .filter((toast) => Boolean(toast.duration))
      .map((toast) =>
        setTimeout(() => dispatch(dismissToast(toast.id)), toast.duration),
      );

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [dispatch, toasts]);

  if (!toasts.length) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => dispatch(dismissToast(toast.id))} />
      ))}
    </div>
  );
}
