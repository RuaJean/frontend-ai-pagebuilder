'use client';

import { ReactNode } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';
import AuthBootstrapper from '@/features/auth/AuthBootstrapper';

type AppProvidersProps = {
  children: ReactNode;
};

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <AuthBootstrapper />
      {children}
    </Provider>
  );
}

