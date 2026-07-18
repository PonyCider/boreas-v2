"use client";

import { useId } from "react";
import type { MotionValue } from "framer-motion";
import { useScrub } from "@/lib/motion/use-scrub";

export interface DrawnPathAccentProps {
  progress: MotionValue<number>;
  /** [start, end] of `progress` over which the line draws in. */
  range?: [number, number];
  /** Static SVG path data — computed by the caller, never measured via JS. */
  d: string;
  viewBox: string;
  color?: string;
  strokeWidth?: number;
  reduceMotion: boolean;
  className?: string;
}

export function DrawnPathAccent({
  progress,
  range = [0, 1],
  d,
  viewBox,
  color = "var(--accent)",
  strokeWidth = 1.5,
  reduceMotion,
  className = "",
}: DrawnPathAccentProps) {
  const id = useId();
  const drawProgress = useScrub(progress, range, [0, 1]);
  const dashOffset = reduceMotion ? 0 : 1000 * (1 - drawProgress);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      viewBox={viewBox}
      fill="none"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray={1000}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}
