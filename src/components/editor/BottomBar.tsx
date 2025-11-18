"use client";

import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface BottomBarProps {
  isSaving?: boolean;
  onSave?: () => void;
}

export default function BottomBar({ isSaving, onSave }: BottomBarProps) {
  return (
    <div className="sticky bottom-4 flex items-center justify-between rounded-full border border-slate-200 bg-white px-4 py-2 shadow-lg">
      <span className="text-sm text-slate-500">Los cambios se guardan automáticamente.</span>
      <Button onClick={onSave} disabled={isSaving}>
        {isSaving ? (
          <span className="flex items-center gap-2">
            <Spinner /> Guardando
          </span>
        ) : (
          "Guardar ahora"
        )}
      </Button>
    </div>
  );
}
