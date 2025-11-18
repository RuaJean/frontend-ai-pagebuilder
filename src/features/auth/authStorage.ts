'use client';

import type { AuthSessionPayload } from "./authSlice";

const STORAGE_KEY = "apb.auth.session";

const safeWindow = () =>
    typeof window === "undefined" ? undefined : window;

export const authStorage = {
    load(): AuthSessionPayload | null {
        const win = safeWindow();
        if (!win) {
            return null;
        }

        try {
            const raw = win.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }

            const parsed = JSON.parse(raw) as AuthSessionPayload;
            if (parsed && typeof parsed === "object" && parsed.accessToken) {
                return {
                    accessToken: parsed.accessToken,
                    user: parsed.user ?? null,
                };
            }
        } catch {
            return null;
        }

        return null;
    },
    save(session: AuthSessionPayload) {
        const win = safeWindow();
        if (!win || !session.accessToken) {
            return;
        }

        win.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                accessToken: session.accessToken,
                user: session.user ?? null,
            }),
        );
    },
    clear() {
        const win = safeWindow();
        if (!win) {
            return;
        }

        win.localStorage.removeItem(STORAGE_KEY);
    },
};

