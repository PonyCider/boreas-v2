"use client";

import type { MotionValue } from "framer-motion";
import { ParallaxLayer } from "@/components/motion/parallax-layer";

const ACCENT_COLORS = ["var(--c-amber)", "var(--c-mint)", "var(--c-lav)", "var(--c-rose)"] as const;

interface Orb {
  color: string;
  size: number;
  top: string;
  left: string;
  speed: number;
  blur: number;
  opacity: number;
}

function buildOrbs(count: number): Orb[] {
  return Array.from({ length: count }, (_, i) => {
    const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
    return {
      color,
      size: 80 + (i % 3) * 40,
      top: `${(i * 37) % 90}%`,
      left: `${(i * 53) % 90}%`,
      speed: 0.08 + (i % 4) * 0.05,
      blur: 20 + (i % 3) * 8,
      opacity: 0.15 + (i % 3) * 0.05,
    };
  });
}

export interface AccentOrbFieldProps {
  progress: MotionValue<number>;
  count?: number;
  reduceMotion: boolean;
  className?: string;
}

export function AccentOrbField({ progress, count = 5, reduceMotion, className = "" }: AccentOrbFieldProps) {
  const orbs = buildOrbs(count);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {orbs.map((orb, i) =>
        reduceMotion ? (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
            }}
          />
        ) : (
          <ParallaxLayer key={i} progress={progress} speed={orb.speed} reduceMotion={false} className="absolute" style={{ top: orb.top, left: orb.left }}>
            <div
              className="rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                background: orb.color,
                filter: `blur(${orb.blur}px)`,
                opacity: orb.opacity,
              }}
            />
          </ParallaxLayer>
        )
      )}
    </div>
  );
}
