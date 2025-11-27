import { Zap, Github, Twitter } from "lucide-react";

const Footer = () => (
    <footer className="relative mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
        <div className="mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-tertiary)]">
                        <Zap className="h-4 w-4 text-[var(--bg-primary)]" />
                    </div>
                    <span className="text-sm font-semibold text-[var(--text-secondary)]">
                        AiPageBuilder
                    </span>
                </div>

                {/* Links */}
                <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
                    <a 
                        href="#" 
                        className="transition-colors hover:text-[var(--accent-primary)]"
                    >
                        Documentación
                    </a>
                    <a 
                        href="#" 
                        className="transition-colors hover:text-[var(--accent-primary)]"
                    >
                        API
                    </a>
                    <a 
                        href="#" 
                        className="transition-colors hover:text-[var(--accent-primary)]"
                    >
                        Soporte
                    </a>
                </div>

                {/* Social & Copyright */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <a 
                            href="#" 
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                        >
                            <Github className="h-4 w-4" />
                        </a>
                        <a 
                            href="#" 
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-subtle)] text-[var(--text-muted)] transition-all hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)]"
                        >
                            <Twitter className="h-4 w-4" />
                        </a>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">
                        © {new Date().getFullYear()} AiPageBuilder
                    </span>
                </div>
            </div>
        </div>
    </footer>
);

export default Footer;
