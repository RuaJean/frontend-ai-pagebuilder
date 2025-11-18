'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { enqueueToast } from '@/features/ui/uiSlice';
import { useAuth } from '@/hooks/useAuth';
import { useAppDispatch } from '@/store/hooks';
import { useLoginMutation, useRefreshSessionMutation } from '@/services/authApi';
import { extractErrorMessage } from '@/utils/errorHandler';

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { status, user } = useAuth();
  const [login, { isLoading }] = useLoginMutation();
  const [refreshSession] = useRefreshSessionMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    try {
      await login({ email, password }).unwrap();
      await refreshSession(undefined).unwrap();
      dispatch(
        enqueueToast({
          level: 'success',
          title: 'Sesión iniciada',
          description: 'Bienvenido de nuevo',
        }),
      );
    } catch (error) {
      setFormError(extractErrorMessage(error, 'No se pudo iniciar sesión'));
    }
  };

  if (status === 'authenticated' && user) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center text-emerald-900">
        <p className="text-lg font-semibold">Ya estás autenticado</p>
        <p className="mt-1 text-sm">Hola {user.name ?? user.email}, puedes volver al dashboard.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Bienvenido</h1>
        <p className="mt-1 text-sm text-slate-500">
          Usa tus credenciales para acceder al generador y editor de sitios.
        </p>
      </div>

      <div className="space-y-4">
        <Input
          name="email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@empresa.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <Input
          name="password"
          label="Contraseña"
          type="password"
          placeholder="********"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <Button type="submit" className="w-full" isLoading={isLoading}>
        Iniciar sesión
      </Button>

      {(status === 'checking' || status === 'idle') && <Spinner label="Verificando sesión..." />}
    </form>
  );
}
