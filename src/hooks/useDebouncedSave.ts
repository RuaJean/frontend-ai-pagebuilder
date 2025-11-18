"use client";

import { useEffect, useRef } from "react";

export default function useDebouncedSave<T>(value: T, delay = 800, onSave?: (value: T) => void) {
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!onSave) return;

    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onSave(value), delay);

    return () => timeoutRef.current && clearTimeout(timeoutRef.current);
  }, [value, delay, onSave]);
}
