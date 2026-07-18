// components/motion/hero-scroll-progress.tsx
"use client";

import { motion, useMotionTemplate, type MotionValue } from "framer-motion";

export interface HeroScrollProgressProps {
  progress: MotionValue<number>;
  className?: string;
}

export function HeroScrollProgress({ progress, className = "" }: HeroScrollProgressProps) {
  // useMotionTemplate composes a real `transform: scaleX(...)` string from the
  // MotionValue — this is the actual "full transform string, never the x/y/
  // scale shorthand" rule from Global Constraints, not `style={{ scaleX }}`
  // (which IS the shorthand prop framer-motion special-cases; an earlier
  // draft of this plan justified `scaleX` as an exception, which was wrong —
  // this version needs no exception because it doesn't use the shorthand).
  const transform = useMotionTemplate`scaleX(${progress})`;
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 h-[2px] origin-left bg-accent ${className}`}
      style={{ transform }}
    />
  );
}
