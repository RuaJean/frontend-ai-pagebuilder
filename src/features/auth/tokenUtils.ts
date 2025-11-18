import type { AuthSessionPayload, AuthUser } from "./authSlice";

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const pickString = (value: unknown): string | undefined =>
    typeof value === "string" && value.length > 0 ? value : undefined;

export const extractAuthPayload = (data: unknown): AuthSessionPayload => {
    if (!isRecord(data)) {
        return {};
    }

    const record = data as Record<string, unknown>;
    const tokenKeys = ["accessToken", "token", "jwt"];
    let accessToken: string | null = null;

    for (const key of tokenKeys) {
        const candidate = record[key];
        if (typeof candidate === "string" && candidate.length > 0) {
            accessToken = candidate;
            break;
        }
    }

    let user: AuthUser | undefined;
    if (isRecord(record.user)) {
        const email = pickString(record.user.email);
        if (email) {
            user = {
                email,
                name: pickString(record.user.name) ?? null,
            };
        }
    } else {
        const email = pickString(record.email);
        if (email) {
            user = {
                email,
                name: pickString(record.name) ?? null,
            };
        }
    }

    return {
        accessToken,
        user,
    };
};

