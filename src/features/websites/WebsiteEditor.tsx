"use client";

import { useState } from "react";

import BottomBar from "@/components/editor/BottomBar";
import ElementHighlighter from "@/components/editor/ElementHighlighter";
import RightPanel from "@/components/editor/RightPanel";

interface WebsiteEditorProps {
  slug: string;
}

export default function WebsiteEditor({ slug }: WebsiteEditorProps) {
  const [activeElement, setActiveElement] = useState("hero");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Editando: {slug}</p>
        {(["hero", "features", "cta"] as const).map((section) => (
          <button
            key={section}
            onClick={() => setActiveElement(section)}
            className="w-full text-left"
          >
            <ElementHighlighter elementId={section} active={activeElement === section} />
          </button>
        ))}
      </div>
      <RightPanel />
      <div className="lg:col-span-2">
        <BottomBar isSaving={isSaving} onSave={handleSave} />
      </div>
    </div>
  );
}
