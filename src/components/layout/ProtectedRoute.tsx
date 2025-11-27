'use client';

import { ReactNode, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Shield } from "lucide-react";

import { useAppSelector } from "@/store/hooks";

type Props = {
    children: ReactNode;
    requireAuth?: boolean;
};

const ProtectedRoute = ({ children, requireAuth = true }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { isAuthenticated, initialized } = useAppSelector((state) => state.auth);

    const redirectTarget = useMemo(() => {
        const query = searchParams?.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!requireAuth || !initialized) {
            return;
        }

        if (!isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
        }
    }, [initialized, redirectTarget, isAuthenticated, requireAuth, router]);

    if (!requireAuth) {
        return <>{children}</>;
    }

    if (!initialized || !isAuthenticated) {
        return (
            <div className="flex min-h-[40vh] items-center justify-center">
                <div className="text-center">
                    <div className="relative mx-auto mb-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--accent-primary)]/20 to-[var(--accent-alt)]/20">
                            <Shield className="h-7 w-7 text-[var(--accent-primary)]" />
                        </div>
                        <div className="absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-br from-[var(--accent-primary)]/10 to-transparent blur-xl" />
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">
                        Validando sesión...
                    </p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;
