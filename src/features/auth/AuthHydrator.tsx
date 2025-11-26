'use client';

import { useEffect } from "react";

import { authStorage } from "@/features/auth/authStorage";
import type { AuthSessionPayload } from "@/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

const AuthHydrator = () => {
    const { isAuthenticated, accessToken, user, initialized } = useAppSelector(
        (state) => state.auth,
    );

    useEffect(() => {
        if (!initialized) {
            return;
        }

        if (isAuthenticated && accessToken) {
            const payload: AuthSessionPayload = {
                accessToken,
                user,
            };
            authStorage.save(payload);
        } else {
            authStorage.clear();
        }
    }, [accessToken, initialized, isAuthenticated, user]);

    return null;
};

export default AuthHydrator;

