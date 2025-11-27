'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
    Mail, 
    Lock, 
    User, 
    ArrowRight, 
    Sparkles, 
    AlertCircle,
    Zap
} from "lucide-react";

import {
    authRequestFailed,
    authRequestStarted,
    sessionCleared,
    sessionEstablished,
    type AuthSessionPayload,
    type AuthUser,
} from "@/features/auth/authSlice";
import { useLoginMutation, useRegisterMutation } from "@/services/authApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { components } from "@/types/openapi";

type LoginRequest = components["schemas"]["LoginRequest"];
type RegisterRequest = components["schemas"]["RegisterRequest"];

const initialForm: LoginRequest & { name?: string } = {
    email: "",
    password: "",
    name: "",
};

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams?.get("redirect") ?? "/websites";

    const { status, error } = useAppSelector((state) => state.auth);
    const [form, setForm] = useState(initialForm);
    const [mode, setMode] = useState<"login" | "register">("login");

    const [login, { isLoading: isLoggingIn }] = useLoginMutation();
    const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();

    const handleChange =
        (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [field]: e.target.value }));

    const resetForm = () => setForm(initialForm);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const payload: LoginRequest | RegisterRequest =
            mode === "login"
                ? { email: form.email, password: form.password }
                : {
                      email: form.email,
                      password: form.password,
                      name: form.name || null,
                  };

        dispatch(authRequestStarted());

        const fallbackUser: AuthUser = {
            email: form.email,
            name: form.name ? form.name : null,
        };

        const ensureAuthPayload = (response: AuthSessionPayload | undefined) => {
            const accessToken = response?.accessToken ?? null;
            if (!accessToken) {
                throw new Error(
                    "El backend no retornó el token de acceso requerido para autenticar.",
                );
            }

            return {
                accessToken,
                user: response?.user ?? fallbackUser,
            };
        };

        try {
            const response =
                mode === "login"
                    ? await login(payload as LoginRequest).unwrap()
                    : await registerMutation(payload as RegisterRequest).unwrap();

            const normalizedPayload = ensureAuthPayload(response);

            dispatch(
                sessionEstablished({
                    accessToken: normalizedPayload.accessToken,
                    user: normalizedPayload.user,
                }),
            );
            resetForm();
            router.replace(redirectTo);
        } catch (err) {
            dispatch(
                authRequestFailed(
                    err instanceof Error ? err.message : "No se pudo autenticar",
                ),
            );
            dispatch(sessionCleared());
        }
    };

    const isSubmitting = isLoggingIn || isRegistering;

    return (
        <section className="relative mx-auto w-full max-w-md">
            {/* Background glow */}
            <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-r from-[var(--accent-primary)]/20 via-transparent to-[var(--accent-alt)]/20 blur-2xl" />
            
            <div className="card-glass relative overflow-hidden rounded-2xl p-8">
                {/* Decorative gradient */}
                <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-[var(--accent-primary)]/30 to-transparent blur-2xl" />
                
                {/* Header */}
                <header className="relative mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)]">
                        <Zap className="h-7 w-7 text-[var(--bg-primary)]" />
                    </div>
                    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-glass)] px-3 py-1 text-xs text-[var(--text-muted)]">
                        <Sparkles className="h-3 w-3 text-[var(--accent-primary)]" />
                        {mode === "login" ? "Ingreso seguro" : "Crear cuenta"}
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                        {mode === "login" ? "Bienvenido de vuelta" : "Registra tu cuenta"}
                    </h1>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Usa las credenciales emitidas por AiPageBuilder
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="relative space-y-5">
                    {mode === "register" && (
                        <div className="animate-fade-in-up group">
                            <label className="block">
                                <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                    <User className="h-4 w-4 text-[var(--accent-primary)]" />
                                    <span>Nombre</span>
                                </div>
                                <input
                                    type="text"
                                    className="input-modern"
                                    value={form.name ?? ""}
                                    onChange={handleChange("name")}
                                    placeholder="Ada Lovelace"
                                />
                            </label>
                        </div>
                    )}

                    <div className="group">
                        <label className="block">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Mail className="h-4 w-4 text-[var(--accent-primary)]" />
                                <span>Correo electrónico</span>
                                <span className="text-[var(--accent-alt)]">*</span>
                            </div>
                            <input
                                type="email"
                                required
                                className="input-modern"
                                value={form.email}
                                onChange={handleChange("email")}
                                placeholder="admin@empresa.com"
                            />
                        </label>
                    </div>

                    <div className="group">
                        <label className="block">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                                <Lock className="h-4 w-4 text-[var(--accent-primary)]" />
                                <span>Contraseña</span>
                                <span className="text-[var(--accent-alt)]">*</span>
                            </div>
                            <input
                                type="password"
                                required
                                className="input-modern"
                                value={form.password}
                                onChange={handleChange("password")}
                                placeholder="••••••••"
                            />
                        </label>
                    </div>

                    {error && (
                        <div className="animate-fade-in-up flex items-start gap-3 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 p-3">
                            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[var(--error)]" />
                            <p className="text-sm text-[var(--error)]">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="glow-button btn-primary flex w-full items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--bg-primary)] border-t-transparent" />
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <span>{mode === "login" ? "Ingresar" : "Registrar"}</span>
                                <ArrowRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <footer className="relative mt-8 text-center">
                    <div className="mb-4 h-px bg-gradient-to-r from-transparent via-[var(--border-subtle)] to-transparent" />
                    
                    <p className="text-sm text-[var(--text-muted)]">
                        {mode === "login" ? (
                            <>
                                ¿Necesitas una cuenta?{" "}
                                <button
                                    type="button"
                                    className="font-semibold text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
                                    onClick={() => {
                                        setMode("register");
                                        dispatch(sessionCleared());
                                    }}
                                >
                                    Regístrate
                                </button>
                            </>
                        ) : (
                            <>
                                ¿Ya tienes cuenta?{" "}
                                <button
                                    type="button"
                                    className="font-semibold text-[var(--accent-primary)] transition-colors hover:text-[var(--accent-secondary)]"
                                    onClick={() => {
                                        setMode("login");
                                        dispatch(sessionCleared());
                                    }}
                                >
                                    Inicia sesión
                                </button>
                            </>
                        )}
                    </p>
                    
                    <p className="mt-3 inline-flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className={`h-2 w-2 rounded-full ${
                            status === "authenticated" 
                                ? "bg-[var(--success)]" 
                                : status === "loading" 
                                    ? "animate-pulse bg-[var(--warning)]" 
                                    : "bg-[var(--text-muted)]"
                        }`} />
                        Estado: {status === "idle" ? "esperando" : status}
                    </p>
                </footer>
            </div>
        </section>
    );
};

export default LoginForm;
