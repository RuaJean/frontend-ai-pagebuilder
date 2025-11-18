'use client';

import { ReactNode, useEffect } from "react";

import { sessionCleared, sessionEstablished } from "@/features/auth/authSlice";
import { useRefreshMutation } from "@/services/authApi";
import { useAppDispatch } from "@/store/hooks";

type Props = {
    children: ReactNode;
};

const AuthBootstrapper = ({ children }: Props) => {
    const dispatch = useAppDispatch();
    const [refresh] = useRefreshMutation();

    useEffect(() => {
        let mounted = true;

        refresh(undefined)
            .unwrap()
            .then((payload) => {
                if (!mounted) {
                    return;
                }

                if (payload?.accessToken) {
                    dispatch(sessionEstablished(payload));
                } else {
                    dispatch(sessionCleared());
                }
            })
            .catch(() => {
                if (mounted) {
                    dispatch(sessionCleared());
                }
            });

        return () => {
            mounted = false;
        };
    }, [dispatch, refresh]);

    return <>{children}</>;
};

export default AuthBootstrapper;

