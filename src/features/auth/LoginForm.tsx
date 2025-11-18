'use client';

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
        <section className="mx-auto w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
            <header className="mb-6">
                <p className="text-xs font-semibold uppercase text-slate-500">
                    {mode === "login" ? "Ingreso seguro" : "Crear cuenta"}
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                    {mode === "login" ? "Bienvenido de vuelta" : "Registra tu cuenta"}
                </h1>
                <p className="text-sm text-slate-600">
                    Usa las credenciales emitidas por el backend de AiPageBuilder.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                    <label className="block text-sm font-medium text-slate-700">
                        Nombre
                        <input
                            type="text"
                            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                            value={form.name ?? ""}
                            onChange={handleChange("name")}
                            placeholder="Ada Lovelace"
                        />
                    </label>
                )}

                <label className="block text-sm font-medium text-slate-700">
                    Correo
                    <input
                        type="email"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                        value={form.email}
                        onChange={handleChange("email")}
                        placeholder="admin@empresa.com"
                    />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                    Contraseña
                    <input
                        type="password"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-slate-900 focus:outline-none"
                        value={form.password}
                        onChange={handleChange("password")}
                        placeholder="••••••••"
                    />
                </label>

                {error && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-600">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                >
                    {isSubmitting
                        ? "Enviando..."
                        : mode === "login"
                          ? "Ingresar"
                          : "Registrar"}
                </button>
            </form>

            <footer className="mt-6 text-center text-sm text-slate-600">
                {mode === "login" ? (
                    <>
                        ¿Necesitas una cuenta?{" "}
                        <button
                            type="button"
                            className="font-semibold text-slate-900 underline"
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
                            className="font-semibold text-slate-900 underline"
                            onClick={() => {
                                setMode("login");
                                dispatch(sessionCleared());
                            }}
                        >
                            Inicia sesión
                        </button>
                    </>
                )}
                <p className="mt-2 text-xs text-slate-500">
                    Estado actual: {status === "idle" ? "a la espera" : status}
                </p>
            </footer>
        </section>
    );
};

export default LoginForm;

