"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";

export interface HighlighterAccentProps {
  children: React.ReactNode;
  active: boolean;
  color?: string;
  reduceMotion: boolean;
  className?: string;
}

export function HighlighterAccent({ children, active, color = "var(--accent)", reduceMotion, className = "" }: HighlighterAccentProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!active || !ref.current) return;
    // Create + remove the annotation within a single effect lifecycle so the
    // React StrictMode dev double-invoke (mount → cleanup → mount) re-creates
    // it instead of leaving a removed annotation behind. A `shownRef`-style
    // "run once" guard breaks here: the first cleanup removes the SVG, the
    // second mount short-circuits, and the underline never renders in dev.
    const annotation = annotate(ref.current, {
      type: "underline",
      color,
      strokeWidth: 2,
      animationDuration: reduceMotion ? 0 : 500,
    });
    annotation.show();
    return () => {
      annotation.remove();
    };
  }, [active, color, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
