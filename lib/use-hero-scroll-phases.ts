"use client";

import { useRef } from "react";
import { useScroll, type MotionValue } from "framer-motion";

export interface HeroScrollPhases {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Drives the hero's pinned scroll sequence. `containerRef` must be attached
 * to the tall (N vh) scroll-driver div; `scrollYProgress` goes 0→1 across
 * that div's full scrollable height, independent of the sticky child inside it.
 */
export function useHeroScrollPhases(): HeroScrollPhases {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  return { containerRef, scrollYProgress };
}
