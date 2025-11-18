'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { enqueueToast, setEditorDirty } from '@/features/ui/uiSlice';
import { useDebouncedSave } from '@/hooks/useDebouncedSave';
import { useAppDispatch } from '@/store/hooks';
import { useUpdateWebsiteMutation } from '@/services/websitesApi';

interface WebsiteEditorProps {
  websiteId: string;
  initialContent: string;
}

export default function WebsiteEditor({ websiteId, initialContent }: WebsiteEditorProps) {
  const dispatch = useAppDispatch();
  const [contentJson, setContentJson] = useState(initialContent);
  const [updateWebsite, { isLoading, isSuccess }] = useUpdateWebsiteMutation();

  useEffect(() => {
    setContentJson(initialContent);
  }, [initialContent]);

  useDebouncedSave(
    contentJson,
    async (content) => {
      if (!content || !websiteId) return;
      dispatch(setEditorDirty(true));
      try {
        await updateWebsite({ id: websiteId, payload: { contentJson: content } }).unwrap();
        dispatch(setEditorDirty(false));
        dispatch(
          enqueueToast({
            level: 'success',
            title: 'Cambios guardados',
            description: 'El contenido se actualizó correctamente.',
          }),
        );
      } catch (error) {
        dispatch(setEditorDirty(true));
        dispatch(
          enqueueToast({
            level: 'error',
            title: 'Error al guardar',
            description: (error as Error).message,
          }),
        );
      }
    },
    1000,
  );

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Editor visual (JSON)</h2>
          <p className="text-sm text-slate-500">
            Modifica el JSON de contentJson. Se guardará automáticamente.
          </p>
        </div>
        {isLoading && <Spinner size="sm" label="Guardando..." />}
        {isSuccess && !isLoading && <span className="text-xs text-emerald-600">Guardado</span>}
      </div>
      <textarea
        className="min-h-[300px] w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-xs text-slate-800 focus:border-brand-400 focus:outline-none"
        value={contentJson}
        onChange={(event) => setContentJson(event.target.value)}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => {
          setContentJson(initialContent);
          dispatch(setEditorDirty(false));
        }}
      >
        Revertir cambios
      </Button>
    </div>
  );
}
