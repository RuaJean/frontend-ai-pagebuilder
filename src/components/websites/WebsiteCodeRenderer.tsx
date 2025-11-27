'use client';

import { useEffect, useState } from "react";
import * as React from "react";

type WebsiteCodeRendererProps = {
    code: string;
    showCodePanel?: boolean;
};

type ProcessStatus = "formatting" | "compiling" | "ready" | "error";

const LOADING_MESSAGES: Record<ProcessStatus, string> = {
    formatting: "Formateando código generado...",
    compiling: "Compilando componentes...",
    ready: "Render listo",
    error: "No se pudo renderizar el sitio.",
};

const DEFAULT_COMPONENT_FALLBACK = "WebsitePage";

const useFormattedCode = (source: string) => {
    const [formatted, setFormatted] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let cancelled = false;

        const format = async () => {
            setReady(false);
            try {
                const prettier = await import("prettier/standalone");
                const parserTypescript = await import("prettier/plugins/typescript");
                const pluginEstree = await import("prettier/plugins/estree");
                const pretty = await prettier.format(source, {
                    parser: "typescript",
                    plugins: [parserTypescript, pluginEstree],
                    singleQuote: true,
                    semi: true,
                    trailingComma: "all",
                });
                if (!cancelled) {
                    setFormatted(pretty);
                    setError(null);
                    setReady(true);
                }
            } catch (err) {
                if (!cancelled) {
                    console.error("No se pudo formatear el código TSX", err);
                    setFormatted(source);
                    setError(
                        "No se pudo formatear el código generado. Se mostrará la versión original.",
                    );
                    setReady(true);
                }
            }
        };

        format();

        return () => {
            cancelled = true;
        };
    }, [source]);

    return { formatted, formatError: error, ready };
};

const WebsiteCodeRenderer = ({ code, showCodePanel = false }: WebsiteCodeRendererProps) => {
    const { formatted, formatError, ready: formatReady } = useFormattedCode(code);
    const [status, setStatus] = useState<ProcessStatus>("formatting");
    const [runtimeError, setRuntimeError] = useState<string | null>(null);
    const [Component, setComponent] = useState<React.ComponentType | null>(null);

    useEffect(() => {
        if (!formatReady) {
            setStatus("formatting");
            setComponent(null);
            return;
        }

        let cancelled = false;

        const compile = async () => {
            setStatus("compiling");
            setRuntimeError(null);

            try {
                const babel = await import("@babel/standalone");
                const { cleaned, exportName } = sanitizeSource(formatted);
                const executable = `
const React = __ReactRuntime;
const { Fragment, useState, useEffect, useMemo, useCallback, useRef, useReducer, useId } = React;
${cleaned}
if (typeof ${exportName} === "undefined") {
    throw new Error("No se detectó un componente predeterminado para renderizar.");
}
return ${exportName};
`;
                const transformed = babel.transform(executable, {
                    presets: [
                        ["react", { runtime: "classic", development: false }],
                        ["typescript", { isTSX: true, allExtensions: true }],
                    ],
                    sourceType: "script",
                    parserOpts: { allowReturnOutsideFunction: true },
                    configFile: false,
                    babelrc: false,
                    generatorOpts: { compact: false },
                });

                const factory = new Function(
                    "__ReactRuntime",
                    transformed.code ?? "return null;",
                ) as (runtime: typeof React) => React.ComponentType | null;

                const result = factory(React);
                if (!result || typeof result !== "function") {
                    throw new Error("El código no exporta un componente React válido.");
                }

                if (!cancelled) {
                    setComponent(() => result);
                    setStatus("ready");
                }
            } catch (err) {
                console.error("No se pudo compilar el código del sitio", err);
                if (!cancelled) {
                    setStatus("error");
                    setRuntimeError(
                        err instanceof Error
                            ? err.message
                            : "No se pudo renderizar el sitio generado.",
                    );
                }
            }
        };

        compile();

        return () => {
            cancelled = true;
        };
    }, [formatReady, formatted]);

    const loadingLabel = LOADING_MESSAGES[status];

    return (
        <div className="relative min-h-screen bg-black text-white">
            {status !== "ready" && (
                <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center text-sm text-slate-300">
                    <div className="animate-pulse text-base font-medium text-white">
                        {loadingLabel}
                    </div>
                    {runtimeError && (
                        <p className="max-w-lg text-xs text-rose-300">{runtimeError}</p>
                    )}
                    {formatError && (
                        <p className="max-w-lg text-xs text-amber-300">{formatError}</p>
                    )}
                </div>
            )}

            {status === "ready" && Component && (
                <div className="bg-white text-slate-900">
                    <Component />
                </div>
            )}

            {status === "error" && !Component && (
                <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center text-sm text-slate-300">
                    <p className="text-base font-semibold text-rose-200">
                        No pudimos renderizar el contenido generado.
                    </p>
                    {runtimeError && (
                        <p className="mt-2 max-w-xl text-xs text-slate-400">{runtimeError}</p>
                    )}
                </div>
            )}

            {showCodePanel && formatted && (
                <details className="fixed bottom-6 right-6 w-[min(90vw,32rem)] overflow-hidden rounded-2xl border border-white/20 bg-slate-900/80 backdrop-blur">
                    <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-white">
                        Ver código formateado
                    </summary>
                    <pre className="max-h-[60vh] overflow-auto bg-slate-950 p-4 text-[11px] leading-relaxed text-emerald-200">
                        {formatted}
                    </pre>
                </details>
            )}
        </div>
    );
};

export default WebsiteCodeRenderer;

const sanitizeSource = (raw: string) => {
    let working = raw.trim();
    working = working.replace(/^\s*['"]use client['"];?\s*/i, "");

    const fallbackRegistry = new Map<string, FallbackDescriptor>();

    working = working.replace(IMPORT_STATEMENT_REGEX, (statement) => {
        const parsed = parseImportStatement(statement);
        if (parsed) {
            registerImportFallbacks(parsed, fallbackRegistry);
        }
        return "";
    });

    working = working.replace(SIDE_EFFECT_IMPORT_REGEX, "");

    // Transform <style jsx> and <style jsx global> to regular <style> elements
    // styled-jsx doesn't work in runtime compilation, so we strip the jsx attribute
    working = working.replace(/<style\s+jsx(?:\s+global)?(?:\s*)>/gi, "<style>");

    const fallbackPrelude = buildFallbackPrelude(fallbackRegistry);
    if (fallbackPrelude) {
        working = `${fallbackPrelude}\n${working.trim()}`;
    }

    let exportName = extractExportName(working);
    if (!exportName) {
        const constMatch = working.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\(/);
        if (constMatch) {
            exportName = constMatch[1];
        }
    }

    if (!exportName) {
        const fnMatch = working.match(/function\s+([A-Za-z0-9_]+)\s*\(/);
        if (fnMatch) {
            exportName = fnMatch[1];
        }
    }

    if (!exportName) {
        exportName = DEFAULT_COMPONENT_FALLBACK;
        working = `${working}\nconst ${DEFAULT_COMPONENT_FALLBACK} = () => null;`;
    }

    working = working.replace(EXPORT_DEFAULT_FUNCTION_REGEX, (_, fnName: string) => {
        return `function ${fnName}`;
    });

    working = working.replace(EXPORT_DEFAULT_IDENTIFIER_REGEX, "");

    return {
        cleaned: working.trim(),
        exportName,
    };
};

const extractExportName = (code: string): string | null => {
    const fnMatch = code.match(EXPORT_DEFAULT_FUNCTION_REGEX);
    if (fnMatch) {
        return fnMatch[1];
    }

    const identifierMatch = code.match(EXPORT_DEFAULT_IDENTIFIER_REGEX);
    if (identifierMatch) {
        return identifierMatch[1];
    }

    return null;
};

const IMPORT_STATEMENT_REGEX =
    /^\s*import[\s\S]+?from\s+["'][^"']+["'];?\s*$/gm;

const SIDE_EFFECT_IMPORT_REGEX = /^\s*import\s+["'][^"']+["'];?\s*$/gm;

const EXPORT_DEFAULT_FUNCTION_REGEX =
    /export\s+default\s+function\s+([A-Za-z0-9_]+)/;

const EXPORT_DEFAULT_IDENTIFIER_REGEX =
    /export\s+default\s+([A-Za-z0-9_]+)\s*;?/;

type ImportSpecifier = {
    imported: string;
    local: string;
};

type ParsedImportStatement = {
    moduleName: string;
    defaultIdentifier?: string | null;
    namedSpecifiers: ImportSpecifier[];
    namespaceIdentifier?: string | null;
};

type FallbackDescriptor =
    | { kind: "component"; name: string }
    | { kind: "hook"; name: string }
    | { kind: "icon"; name: string }
    | { kind: "image" }
    | { kind: "link" }
    | { kind: "namespace"; name: string }
    | { kind: "utility"; name: string }
    | { kind: "value"; name: string };

const parseImportStatement = (statement: string): ParsedImportStatement | null => {
    const normalized = statement.trim().replace(/;$/, "");
    if (/^\s*import\s+type\s+/i.test(normalized)) {
        return null;
    }

    const sideEffectMatch = normalized.match(/^\s*import\s+["']([^"']+)["']/);
    if (sideEffectMatch) {
        return {
            moduleName: sideEffectMatch[1],
            namedSpecifiers: [],
        };
    }

    const fromMatch = normalized.match(/^\s*import\s+([\s\S]+?)\s+from\s+["']([^"']+)["']/);
    if (!fromMatch) {
        return null;
    }

    const clause = fromMatch[1].trim();
    const moduleName = fromMatch[2].trim();

    if (!clause) {
        return {
            moduleName,
            namedSpecifiers: [],
        };
    }

    if (/^\*\s+as\s+/.test(clause)) {
        return {
            moduleName,
            namedSpecifiers: [],
            namespaceIdentifier: clause.replace(/^\*\s+as\s+/, "").trim(),
        };
    }

    const descriptor: ParsedImportStatement = {
        moduleName,
        namedSpecifiers: [],
    };

    let namedPart = "";
    let defaultPart = clause;

    const braceStart = clause.indexOf("{");
    if (braceStart >= 0) {
        namedPart = clause.slice(braceStart).trim();
        defaultPart = clause.slice(0, braceStart).trim().replace(/,$/, "");
    }

    if (defaultPart) {
        descriptor.defaultIdentifier = defaultPart.trim();
    }

    if (namedPart) {
        const cleaned = namedPart.replace(/^{|}$/g, "").trim();
        if (cleaned) {
            cleaned.split(",").forEach((chunk) => {
                const raw = chunk.trim();
                if (!raw) {
                    return;
                }
                const sanitized = raw.replace(/^type\s+/, "");
                const [imported, local] = sanitized
                    .split(/\s+as\s+/)
                    .map((token) => token.trim())
                    .filter(Boolean);
                if (!imported) {
                    return;
                }
                descriptor.namedSpecifiers.push({
                    imported,
                    local: local ?? imported,
                });
            });
        }
    }

    return descriptor;
};

const ICON_LIBRARY_MODULES = new Set([
    "lucide-react",
    "react-icons",
    "react-icons/fa",
    "react-icons/fi",
    "react-icons/hi",
    "react-icons/io",
    "react-icons/md",
    "@heroicons/react/solid",
    "@heroicons/react/outline",
    "@heroicons/react/24/solid",
    "@heroicons/react/24/outline",
]);

const registerImportFallbacks = (
    parsed: ParsedImportStatement,
    registry: Map<string, FallbackDescriptor>,
) => {
    if (parsed.moduleName === "react") {
        return;
    }

    const isIconLibrary = ICON_LIBRARY_MODULES.has(parsed.moduleName);

    const registerIdentifier = (identifier: string | null | undefined) => {
        if (!identifier) {
            return;
        }

        const normalized = identifier.trim();
        if (!normalized || registry.has(normalized)) {
            return;
        }

        if (normalized === "Image") {
            registry.set(normalized, { kind: "image" });
            return;
        }

        if (normalized === "Link") {
            registry.set(normalized, { kind: "link" });
            return;
        }

        if (/^use[A-Z]/.test(normalized)) {
            registry.set(normalized, { kind: "hook", name: normalized });
            return;
        }

        // Icons from icon libraries get special handling
        if (isIconLibrary && /^[A-Z]/.test(normalized)) {
            registry.set(normalized, { kind: "icon", name: normalized });
            return;
        }

        if (/^[A-Z]/.test(normalized)) {
            registry.set(normalized, { kind: "component", name: normalized });
            return;
        }

        if (normalized === "cn") {
            registry.set(normalized, { kind: "utility", name: normalized });
            return;
        }

        registry.set(normalized, { kind: "value", name: normalized });
    };

    registerIdentifier(parsed.defaultIdentifier);
    parsed.namedSpecifiers.forEach((specifier) => registerIdentifier(specifier.local));

    if (parsed.namespaceIdentifier && !registry.has(parsed.namespaceIdentifier)) {
        registry.set(parsed.namespaceIdentifier, {
            kind: "namespace",
            name: parsed.namespaceIdentifier,
        });
    }
};

const buildFallbackPrelude = (registry: Map<string, FallbackDescriptor>) => {
    if (!registry.size) {
        return "";
    }

    let needsComponentFactory = false;
    let needsHookFactory = false;
    let needsIconFactory = false;
    let needsImageStub = false;
    let needsLinkStub = false;
    let needsNamespaceFactory = false;

    const declarations: string[] = [];

    registry.forEach((descriptor) => {
        switch (descriptor.kind) {
            case "component":
                needsComponentFactory = true;
                declarations.push(
                    `const ${descriptor.name} = __createStubComponent('${descriptor.name}');`,
                );
                break;
            case "hook":
                needsHookFactory = true;
                declarations.push(
                    `const ${descriptor.name} = __createStubHook('${descriptor.name}');`,
                );
                break;
            case "icon":
                needsIconFactory = true;
                declarations.push(
                    `const ${descriptor.name} = __createIconStub('${descriptor.name}');`,
                );
                break;
            case "namespace":
                needsNamespaceFactory = true;
                declarations.push(
                    `const ${descriptor.name} = __createNamespaceStub('${descriptor.name}');`,
                );
                break;
            case "image":
                needsImageStub = true;
                declarations.push("const Image = __ImageStub;");
                break;
            case "link":
                needsLinkStub = true;
                declarations.push("const Link = __LinkStub;");
                break;
            case "utility":
                declarations.push(
                    "const cn = (...args) => args.filter(Boolean).join(' ');",
                );
                break;
            case "value":
            default:
                declarations.push("const " + descriptor.name + " = (..._args) => null;");
                break;
        }
    });

    const helpers: string[] = [];

    if (needsComponentFactory || needsNamespaceFactory) {
        helpers.push(`
const __createStubComponent = (displayName: string) => {
    const Stub = (props: Record<string, unknown> = {}) => {
        const { children, ...rest } = props;
        return React.createElement(
            'div',
            {
                ...rest,
                'data-ai-stub': displayName,
            },
            children,
        );
    };
    return Stub;
};
        `.trim());
    }

    if (needsHookFactory) {
        helpers.push(`
const __noop = () => {};
const __createStubHook = (_displayName: string) => () => ({
    push: __noop,
    replace: __noop,
    back: __noop,
    prefetch: __noop,
});
        `.trim());
    }

    if (needsIconFactory) {
        helpers.push(`
const __createIconStub = (iconName: string) => {
    const IconStub = (props: Record<string, any> = {}) => {
        const { size = 24, color, className, strokeWidth = 2, ...rest } = props;
        const sizeNum = typeof size === 'number' ? size : parseInt(size, 10) || 24;
        const strokeColor = color || 'currentColor';
        
        // Common icon paths for frequently used icons
        const iconPaths: Record<string, string> = {
            'X': 'M18 6L6 18M6 6l12 12',
            'ChevronLeft': 'M15 18l-6-6 6-6',
            'ChevronRight': 'M9 18l6-6-6-6',
            'ChevronUp': 'M18 15l-6-6-6 6',
            'ChevronDown': 'M6 9l6 6 6-6',
            'Play': 'M5 3l14 9-14 9V3z',
            'Pause': 'M6 4h4v16H6V4zm8 0h4v16h-4V4z',
            'Music': 'M9 18V5l12-2v13M9 18c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zM21 16c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z',
            'Heart': 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
            'Star': 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
            'Mail': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
            'Phone': 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.61.69 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.75.33 1.55.56 2.36.69a2 2 0 0 1 1.72 2.01z',
            'Instagram': 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
            'ShoppingBag': 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
            'Users': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
            'Calendar': 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18',
            'ArrowRight': 'M5 12h14M12 5l7 7-7 7',
            'ArrowLeft': 'M19 12H5M12 19l-7-7 7-7',
            'Menu': 'M3 12h18M3 6h18M3 18h18',
            'Search': 'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
            'Home': 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
            'Settings': 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z',
            'Volume2': 'M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07',
        };
        
        // Get the path for this icon, or use a generic placeholder circle
        const pathD = iconPaths[iconName] || 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z';
        
        return React.createElement('svg', {
            xmlns: 'http://www.w3.org/2000/svg',
            width: sizeNum,
            height: sizeNum,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeLinecap: 'round',
            strokeLinejoin: 'round',
            className: className,
            'data-icon': iconName,
            ...rest,
        }, React.createElement('path', { d: pathD }));
    };
    return IconStub;
};
        `.trim());
    }

    if (needsNamespaceFactory) {
        helpers.push(`
const __createNamespaceStub = (namespaceLabel: string) =>
    new Proxy(
        {},
        {
            get: (_target, prop) => {
                if (prop === '__esModule') {
                    return true;
                }
                return __createStubComponent(\`\${namespaceLabel}.\${String(prop)}\`);
            },
        },
    );
        `.trim());
    }

    if (needsImageStub) {
        helpers.push(`
const __IMAGE_FALLBACK = 'https://cdn.aipagebuilder.local/placeholder-image.jpg';
const __ImageStub = (props: Record<string, any> = {}) => {
    const {
        src,
        alt = '',
        style,
        fill,
        children,
        // Next.js Image props that are NOT valid HTML attributes - filter them out
        priority,
        placeholder,
        blurDataURL,
        loader,
        quality,
        sizes,
        loading,
        unoptimized,
        overrideSrc,
        onLoadingComplete,
        layout,
        objectFit,
        objectPosition,
        lazyBoundary,
        lazyRoot,
        ...rest
    } = props;
    const safeSrc =
        typeof src === 'string' && src.trim().length > 0 ? src : __IMAGE_FALLBACK;
    const computedStyle = fill
        ? {
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: objectFit ?? style?.objectFit ?? 'cover',
              objectPosition: objectPosition ?? style?.objectPosition,
              ...style,
          }
        : style;

    return React.createElement('img', {
        ...rest,
        alt,
        src: safeSrc,
        style: computedStyle,
        loading: loading === 'eager' || priority ? 'eager' : 'lazy',
    });
};
        `.trim());
    }

    if (needsLinkStub) {
        helpers.push(`
const __LinkStub = (props: Record<string, any> = {}) => {
    const { href = '#', children, ...rest } = props;
    return React.createElement('a', { href, ...rest }, children);
};
        `.trim());
    }

    return `${helpers.join("\n")}\n${declarations.join("\n")}`.trim();
};

