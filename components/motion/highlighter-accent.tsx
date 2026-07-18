"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

export interface HighlighterAccentProps {
  children: React.ReactNode;
  active: boolean;
  color?: string;
  reduceMotion: boolean;
  className?: string;
}

export function HighlighterAccent({ children, active, color = "var(--accent)", reduceMotion, className = "" }: HighlighterAccentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!active || !ref.current || shownRef.current) return;
    shownRef.current = true;
    annotationRef.current = annotate(ref.current, {
      type: "underline",
      color,
      strokeWidth: 2,
      animationDuration: reduceMotion ? 0 : 500,
    });
    annotationRef.current.show();
    return () => {
      annotationRef.current?.remove();
    };
  }, [active, color, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
