'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { enqueueToast } from '@/features/ui/uiSlice';
import { useAppDispatch } from '@/store/hooks';
import {
  useCreateWebsiteMutation,
  useGenerateWebsiteMutation,
} from '@/services/websitesApi';
import { CreateWebsiteRequest } from '@/types/websites';

const EMPTY_CONTENT = JSON.stringify(
  {
    lang: 'es',
    version: 1,
    blocks: [],
  },
  null,
  2,
);

export default function WebsiteForm() {
  const dispatch = useAppDispatch();
  const [createWebsite, { isLoading }] = useCreateWebsiteMutation();
  const [generateWebsite, { isLoading: isGenerating }] = useGenerateWebsiteMutation();

  const [formValues, setFormValues] = useState<CreateWebsiteRequest>({
    clientName: '',
    clientEmail: '',
    contentJson: EMPTY_CONTENT,
    description: '',
    industry: '',
  });

  const handleChange = (key: keyof CreateWebsiteRequest, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createWebsite(formValues).unwrap();
      dispatch(
        enqueueToast({
          level: 'success',
          title: 'Sitio creado',
          description: 'El sitio se creó correctamente.',
        }),
      );
    } catch (error) {
      dispatch(
        enqueueToast({
          level: 'error',
          title: 'Error',
          description: (error as Error).message,
        }),
      );
    }
  };

  const handleGenerate = async () => {
    try {
      const response = await generateWebsite({
        clientName: formValues.clientName,
        clientEmail: formValues.clientEmail,
        description: formValues.description,
        industry: formValues.industry,
      }).unwrap();
      if (response.contentJson) {
        handleChange('contentJson', response.contentJson);
      }
      dispatch(
        enqueueToast({
          level: 'success',
          title: 'Contenido generado',
          description: 'Se generó un nuevo contenido basado en IA.',
        }),
      );
    } catch (error) {
      dispatch(
        enqueueToast({
          level: 'error',
          title: 'Error al generar',
          description: (error as Error).message,
        }),
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
    >
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Crear sitio</h1>
        <p className="mt-1 text-sm text-slate-500">
          Completa la información del cliente y carga el contenido JSON.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Nombre del cliente"
          name="clientName"
          value={formValues.clientName}
          onChange={(event) => handleChange('clientName', event.target.value)}
          required
        />
        <Input
          label="Correo del cliente"
          name="clientEmail"
          type="email"
          value={formValues.clientEmail}
          onChange={(event) => handleChange('clientEmail', event.target.value)}
          required
        />
      </div>

      <Input
        label="Industria"
        name="industry"
        value={formValues.industry ?? ''}
        onChange={(event) => handleChange('industry', event.target.value)}
      />

      <label className="block text-sm font-medium text-slate-700">
        Descripción
        <textarea
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-brand-400 focus:outline-none"
          rows={3}
          value={formValues.description ?? ''}
          onChange={(event) => handleChange('description', event.target.value)}
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        contentJson
        <textarea
          className="mt-1 min-h-[240px] w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-xs focus:border-brand-400 focus:outline-none"
          value={formValues.contentJson}
          onChange={(event) => handleChange('contentJson', event.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" isLoading={isLoading}>
          Guardar
        </Button>
        <Button type="button" variant="secondary" onClick={handleGenerate} isLoading={isGenerating}>
          Generar con IA
        </Button>
      </div>
    </form>
  );
}
