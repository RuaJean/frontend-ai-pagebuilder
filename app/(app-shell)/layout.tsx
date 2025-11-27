import { ReactNode } from "react";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AuthStatusBar from "@/features/auth/AuthStatusBar";
import { ToastHub } from "@/components/ui/Toast";

type AppShellLayoutProps = {
    children: ReactNode;
};

export default function AppShellLayout({ children }: AppShellLayoutProps) {
    return (
        <div className="relative flex min-h-screen flex-col bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Background effects */}
            <div className="pointer-events-none fixed inset-0 grid-pattern opacity-50" />
            <div className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2">
                <div className="h-full w-full bg-gradient-radial from-[var(--accent-glow)] to-transparent opacity-30 blur-3xl" />
            </div>
            
            {/* Content */}
            <div className="relative z-10 flex min-h-screen flex-col">
                <Header />
                <AuthStatusBar />
                <main className="flex-1">
                    <div className="mx-auto w-full max-w-7xl px-6 py-10">{children}</div>
                </main>
                <Footer />
            </div>
            
            <ToastHub />
        </div>
    );
}
