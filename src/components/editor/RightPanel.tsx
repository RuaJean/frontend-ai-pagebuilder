"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import JsonRenderer from "@/components/editor/JsonRenderer";

const mockJson = {
  hero: {
    title: "Presenta tu producto en segundos",
    cta: "Probar demo",
  },
};

export default function RightPanel() {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">JSON</h3>
        <Button variant="secondary" onClick={() => setExpanded(!expanded)}>
          {expanded ? "Ocultar" : "Mostrar"}
        </Button>
      </div>
      {expanded && <JsonRenderer content={mockJson} />}
    </aside>
  );
}
