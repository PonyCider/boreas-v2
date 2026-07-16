// components/motion/parallax-layer.tsx
"use client";

import type { MotionValue } from "framer-motion";
import { useScrub } from "@/lib/motion/use-scrub";

/**
 * Moves its children vertically at a fraction of scroll speed, creating a
 * depth illusion when two layers under the same `progress` use different
 * `speed` values. Pure transform:translate3d — no WebGL.
 */
export function ParallaxLayer({
  progress,
  speed,
  range = [0, 100],
  reduceMotion,
  className,
  children,
}: {
  progress: MotionValue<number>;
  /** 0 = fixed, 1 = moves 1:1 with scroll, 0.3 = moves at 30% speed. */
  speed: number;
  /** [min, max] px offset applied across progress 0→1, before the speed scale. */
  range?: [number, number];
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const offset = useScrub(progress, [0, 1], [range[0] * speed, range[1] * speed]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: "transform" }}>
      {children}
    </div>
  );
}
