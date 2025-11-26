'use client';

import { useCallback } from "react";

import { sessionCleared, sessionEstablished } from "@/features/auth/authSlice";
import { useLogoutMutation, useRefreshMutation } from "@/services/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const AuthStatusBar = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, status } = useAppSelector((state) => state.auth);
    const [logoutRequest, { isLoading: isLoggingOut }] = useLogoutMutation();
    const [refreshSession, { isLoading: isRefreshing }] = useRefreshMutation();

    const handleLogout = useCallback(async () => {
        try {
            await logoutRequest(undefined).unwrap();
        } finally {
            dispatch(sessionCleared());
        }
    }, [dispatch, logoutRequest]);

    const handleRefresh = useCallback(async () => {
        try {
            const payload = await refreshSession(undefined).unwrap();
            if (payload?.accessToken) {
                dispatch(sessionEstablished(payload));
            } else {
                dispatch(sessionCleared());
            }
        } catch {
            dispatch(sessionCleared());
        }
    }, [dispatch, refreshSession]);

    return (
        <>
             {/* <div className="bg-slate-900">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3 text-sm text-white">
                <span>
                    {isAuthenticated
                        ? `Sesión activa${user?.email ? `: ${user.email}` : ""}`
                        : "No has iniciado sesión"}
                </span>
                <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-wide text-slate-300">
                        Estado: {status}
                    </span>
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="rounded-md border border-white/30 px-3 py-1 text-xs font-semibold transition hover:bg-white/10 disabled:opacity-50"
                    >
                        {isRefreshing ? "Refrescando..." : "Refrescar token"}
                    </button>
                    {isAuthenticated && (
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="rounded-md border border-white/30 px-3 py-1 text-xs font-semibold transition hover:bg-white/10 disabled:opacity-50"
                        >
                            {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                        </button>
                    )}
                </div>
            </div>
        </div> */}
        </>
   
    );
};

export default AuthStatusBar;

