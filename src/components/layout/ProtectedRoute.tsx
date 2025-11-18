'use client';

import { ReactNode, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAppSelector } from "@/store/hooks";

type Props = {
    children: ReactNode;
    requireAuth?: boolean;
};

const ProtectedRoute = ({ children, requireAuth = true }: Props) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const [checking, setChecking] = useState(true);

    const redirectTarget = useMemo(() => {
        const query = searchParams?.toString();
        return query ? `${pathname}?${query}` : pathname;
    }, [pathname, searchParams]);

    useEffect(() => {
        if (!requireAuth) {
            setChecking(false);
            return;
        }

        if (!isAuthenticated) {
            router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
        } else {
            setChecking(false);
        }
    }, [redirectTarget, isAuthenticated, requireAuth, router]);

    if (!requireAuth) {
        return <>{children}</>;
    }

    if (checking || !isAuthenticated) {
        return (
            <div className="rounded-md border border-slate-200 bg-white p-6 text-center text-sm text-slate-600">
                Validando sesión...
            </div>
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;

