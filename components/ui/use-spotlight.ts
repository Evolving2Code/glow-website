"use client";

import * as React from "react";

/** Writes pointer coordinates into CSS variables consumed by the `.spotlight` class. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = React.useRef<T>(null);

  const onPointerMove = React.useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - r.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - r.top}px`);
    el.style.setProperty("--spot-o", "1");
  }, []);

  const onPointerLeave = React.useCallback(() => {
    ref.current?.style.setProperty("--spot-o", "0");
  }, []);

  return { ref, onPointerMove, onPointerLeave };
}
