'use client';

import { useCallback } from "react";
import { RefreshCw, LogOut, User, Circle } from "lucide-react";

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

    // Only show when authenticated
    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-2.5 text-sm">
                {/* User info */}
                <div className="flex items-center gap-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-alt)]/20">
                        <User className="h-4 w-4 text-[var(--accent-primary)]" />
                    </div>
                    <span className="text-[var(--text-secondary)]">
                        {user?.email ?? "Usuario autenticado"}
                    </span>
                    <div className="flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
                        <Circle className={`h-1.5 w-1.5 ${
                            status === "authenticated" 
                                ? "fill-[var(--success)] text-[var(--success)]" 
                                : "fill-[var(--warning)] text-[var(--warning)]"
                        }`} />
                        <span className="capitalize">{status}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
                        <span className="hidden sm:inline">
                            {isRefreshing ? "Refrescando..." : "Refrescar"}
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--error)] hover:text-[var(--error)] disabled:opacity-50"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                            {isLoggingOut ? "Saliendo..." : "Cerrar sesión"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthStatusBar;
