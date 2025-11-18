"use client";

interface JsonRendererProps {
  content: Record<string, unknown>;
}

export default function JsonRenderer({ content }: JsonRendererProps) {
  return (
    <pre className="max-h-80 overflow-auto rounded-2xl bg-slate-950 p-4 text-xs text-slate-100">
      {JSON.stringify(content, null, 2)}
    </pre>
  );
}
