"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";

const initialItems = [
  { id: "1", name: "hero.png", size: "340KB" },
  { id: "2", name: "app-store.png", size: "120KB" },
];

export default function MediaManager() {
  const [items, setItems] = useState(initialItems);

  function handleUpload() {
    setItems((prev) => [...prev, { id: String(prev.length + 1), name: "nuevo.png", size: "80KB" }]);
  }

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Biblioteca de medios</h2>
        <Button onClick={handleUpload}>Subir archivo</Button>
      </div>
      <ul className="space-y-2 text-sm text-slate-600">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-2">
            <span>{item.name}</span>
            <span className="text-slate-400">{item.size}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
