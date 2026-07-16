// components/motion/text-reveal.tsx
"use client";

import { useEffect, useState } from "react";
import type { MotionValue } from "framer-motion";
import { useScrub } from "@/lib/motion/use-scrub";

/**
 * Reveals text via an opacity ramp from 0.2 to 1 — never 0, so content stays
 * legible from the first frame (DESIGN.md Motion Rules: content is never
 * gated behind animation). Two trigger modes: tied to a scroll-linked
 * MotionValue's progress range, or a fixed mount-time delay.
 */
export function TextReveal({
  children,
  reduceMotion,
  trigger,
  className,
}: {
  children: React.ReactNode;
  reduceMotion: boolean;
  trigger:
    | { mode: "progress"; value: MotionValue<number>; range: [number, number] }
    | { mode: "delay"; ms?: number };
  className?: string;
}) {
  if (trigger.mode === "progress") {
    return (
      <TextRevealProgress value={trigger.value} range={trigger.range} reduceMotion={reduceMotion} className={className}>
        {children}
      </TextRevealProgress>
    );
  }
  return (
    <TextRevealDelay ms={trigger.ms ?? 0} reduceMotion={reduceMotion} className={className}>
      {children}
    </TextRevealDelay>
  );
}

function TextRevealProgress({
  value,
  range,
  reduceMotion,
  className,
  children,
}: {
  value: MotionValue<number>;
  range: [number, number];
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useScrub(value, range, [0.2, 1]);
  return (
    <div className={className} style={{ opacity: reduceMotion ? 1 : opacity }}>
      {children}
    </div>
  );
}

function TextRevealDelay({
  ms,
  reduceMotion,
  className,
  children,
}: {
  ms: number;
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [opacity, setOpacity] = useState(reduceMotion ? 1 : 0.2);
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setOpacity(1), ms);
    return () => window.clearTimeout(timer);
  }, [ms, reduceMotion]);
  return (
    <div
      className={className}
      style={{ opacity, transition: reduceMotion ? undefined : "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </div>
  );
}
