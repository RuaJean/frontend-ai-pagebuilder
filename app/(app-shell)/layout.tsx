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
        <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
            <Header />
            <AuthStatusBar />
            <main className="flex-1 bg-slate-50">
                <div className="mx-auto w-full max-w-6xl px-6 py-10">{children}</div>
            </main>
            <Footer />
            <ToastHub />
        </div>
    );
}

