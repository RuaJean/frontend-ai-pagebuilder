"use client";

interface ElementHighlighterProps {
  elementId: string;
  active?: boolean;
}

export default function ElementHighlighter({ elementId, active }: ElementHighlighterProps) {
  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        active ? "border-slate-900 bg-slate-900/5" : "border-slate-200"
      }`}
    >
      Elemento {elementId}
    </div>
  );
}
