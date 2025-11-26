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

    // Transform <style jsx> to regular <style> with injected CSS
    working = transformStyledJsx(working);

    const fallbackRegistry = new Map<string, FallbackDescriptor>();

    working = working.replace(IMPORT_STATEMENT_REGEX, (statement) => {
        const parsed = parseImportStatement(statement);
        if (parsed) {
            registerImportFallbacks(parsed, fallbackRegistry);
        }
        return "";
    });

    working = working.replace(SIDE_EFFECT_IMPORT_REGEX, "");

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

const registerImportFallbacks = (
    parsed: ParsedImportStatement,
    registry: Map<string, FallbackDescriptor>,
) => {
    if (parsed.moduleName === "react") {
        return;
    }

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
        // Next.js Image specific props - filter these out
        priority,
        placeholder,
        blurDataURL,
        loader,
        quality,
        unoptimized,
        onLoadingComplete,
        lazyBoundary,
        lazyRoot,
        loading,
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
              objectFit: style?.objectFit ?? 'cover',
              ...style,
          }
        : style;

    return React.createElement('img', {
        ...rest,
        alt,
        src: safeSrc,
        style: computedStyle,
        loading: loading === 'eager' ? 'eager' : 'lazy',
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

/**
 * Transform styled-jsx (<style jsx>) to regular inline <style> elements.
 * styled-jsx requires special Babel compilation that we don't have in runtime,
 * so we convert it to regular CSS injection using dangerouslySetInnerHTML.
 */
const transformStyledJsx = (code: string): string => {
    // Match <style jsx>{`...`}</style> or <style jsx global>{`...`}</style>
    const styledJsxRegex = /<style\s+jsx(?:\s+global)?>\s*\{`([\s\S]*?)`\}\s*<\/style>/g;
    
    return code.replace(styledJsxRegex, (_match, cssContent: string) => {
        // Escape backticks and ${} in the CSS content for safe embedding
        const escapedCss = cssContent
            .replace(/\\/g, '\\\\')
            .replace(/`/g, '\\`')
            .replace(/\$\{/g, '\\${');
        
        // Return a regular <style> element with dangerouslySetInnerHTML
        return `<style dangerouslySetInnerHTML={{ __html: \`${escapedCss}\` }} />`;
    });
};

