'use client';

import { useEffect } from "react";

import { authStorage } from "@/features/auth/authStorage";
import type { AuthSessionPayload } from "@/features/auth/authSlice";
import { useAppSelector } from "@/store/hooks";

const AuthHydrator = () => {
    const { isAuthenticated, accessToken, user } = useAppSelector(
        (state) => state.auth,
    );

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            const payload: AuthSessionPayload = {
                accessToken,
                user,
            };
            authStorage.save(payload);
        } else {
            authStorage.clear();
        }
    }, [accessToken, isAuthenticated, user]);

    return null;
};

export default AuthHydrator;

