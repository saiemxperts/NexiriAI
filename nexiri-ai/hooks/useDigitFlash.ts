"use client";

import { useEffect, useRef, useState } from "react";

type FlashDirection = "up" | "down";

export function useDigitFlash(value: number) {
  const formatted = String(value);
  const prevRef = useRef(formatted);
  const [flashMap, setFlashMap] = useState<Record<number, FlashDirection>>({});
  const [offset, setOffset] = useState(0);
  const timeoutsRef = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    const prev = prevRef.current;

    if (prev !== formatted) {
      const direction: FlashDirection | null =
        value > parseFloat(prev) ? "up" : value < parseFloat(prev) ? "down" : null;

      if (direction) {
        const maxLen = Math.max(prev.length, formatted.length);
        const prevPadded = prev.padStart(maxLen);
        const currPadded = formatted.padStart(maxLen);
        const newOffset = maxLen - formatted.length;

        const changedIndexes: number[] = [];
        for (let i = 0; i < maxLen; i++) {
          if (prevPadded[i] !== currPadded[i]) changedIndexes.push(i);
        }

        setOffset(newOffset);
        setFlashMap((old) => {
          const next = { ...old };
          changedIndexes.forEach((i) => (next[i] = direction));
          return next;
        });

        changedIndexes.forEach((i) => {
          if (timeoutsRef.current[i]) clearTimeout(timeoutsRef.current[i]);
          timeoutsRef.current[i] = setTimeout(() => {
            setFlashMap((old) => {
              const next = { ...old };
              delete next[i];
              return next;
            });
          }, 2000);
        });
      }

      prevRef.current = formatted;
    }
  }, [formatted, value]);

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  return { formatted, flashMap, offset };
}