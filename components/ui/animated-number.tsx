"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

type AnimatedNumberProps = {
  value: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
  /** When true, only starts once scrolled into view (first run). */
  startOnView?: boolean;
};

export function AnimatedNumber({
  value,
  format = (n) => Math.round(n).toString(),
  duration = 0.9,
  className,
  startOnView = false,
}: AnimatedNumberProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const current = React.useRef(startOnView ? 0 : value);
  const [display, setDisplay] = React.useState(() => format(startOnView ? 0 : value));

  React.useEffect(() => {
    if (startOnView && !inView) return;
    if (reduce) {
      current.current = value;
      setDisplay(format(value));
      return;
    }
    const controls = animate(current.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        current.current = v;
        setDisplay(format(v));
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduce, startOnView, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
