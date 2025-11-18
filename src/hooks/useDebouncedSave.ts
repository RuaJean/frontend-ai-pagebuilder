'use client';

import { useEffect, useRef } from 'react';

export function useDebouncedSave<T>(value: T, callback: (value: T) => void, delay = 800) {
  const latestValue = useRef<T>(value);
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    latestValue.current = value;
  }, [value]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      callbackRef.current(latestValue.current);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay, value]);
}
