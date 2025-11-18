'use client';

import { useEffect, useRef } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { useRefreshSessionMutation } from '@/services/authApi';

export default function AuthBootstrapper() {
  const { status } = useAuth();
  const [refreshSession] = useRefreshSessionMutation();
  const hasBootstrapped = useRef(false);

  useEffect(() => {
    if (hasBootstrapped.current) return;
    if (status === 'idle' || status === 'unauthenticated') {
      hasBootstrapped.current = true;
      refreshSession(undefined);
    }
  }, [refreshSession, status]);

  return null;
}
