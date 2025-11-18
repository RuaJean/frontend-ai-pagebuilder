'use client';

import { ReactNode } from "react";
import { Provider } from "react-redux";

import AuthBootstrapper from "@/features/auth/AuthBootstrapper";
import AuthHydrator from "@/features/auth/AuthHydrator";
import { store } from "@/store";

export default function AppProviders({ children }: { children: ReactNode }) {
    return (
        <Provider store={store}>
            <AuthBootstrapper>
                <AuthHydrator />
                {children}
            </AuthBootstrapper>
        </Provider>
    );
}

