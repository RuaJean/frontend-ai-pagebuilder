'use client';

import { useMemo } from 'react';

import { AuthState } from '@/types/auth';
import { useAppSelector } from '@/store/hooks';

export function useAuth(): AuthState {
  return useAppSelector((state) => state.auth);
}

export function useIsAuthenticated() {
  const { status } = useAuth();
  return useMemo(() => status === 'authenticated', [status]);
}
