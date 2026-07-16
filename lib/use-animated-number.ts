"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate as fmAnimate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

const DEFAULT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type MarginValue = `${number}${"px" | "%"}`;
export type NumberTrigger =
  | { mode: "inView"; margin?: MarginValue }
  | { mode: "delay"; ms?: number }
  | { mode: "progress"; value: MotionValue<number>; threshold: number };

/**
 * Animates a number from 0 to `target` once, via framer-motion's `animate()`.
 * Three trigger modes: "inView" (starts when scrolled into view, e.g. below-the-fold
 * stats), "delay" (starts a fixed time after mount, e.g. an above-the-fold hero
 * that's visible immediately), or "progress" (starts once a scroll-linked
 * MotionValue crosses `threshold`, e.g. a pinned scroll sequence). Respects
 * reduced motion by jumping straight to `target`.
 */
export function useAnimatedNumber<T extends HTMLElement = HTMLDivElement>(
  target: number,
  {
    reduceMotion,
    decimals = 0,
    duration = 1.5,
    ease = DEFAULT_EASE,
    trigger = { mode: "inView" },
  }: {
    reduceMotion: boolean | null;
    decimals?: number;
    duration?: number;
    ease?: [number, number, number, number];
    trigger?: NumberTrigger;
  }
) {
  const ref = useRef<T>(null);
  const inViewMargin: MarginValue = trigger.mode === "inView" ? trigger.margin ?? "-80px" : "0px";
  const inView = useInView(ref, { once: true, margin: inViewMargin });

  const [progressFired, setProgressFired] = useState(
    () => trigger.mode === "progress" && trigger.value.get() >= trigger.threshold
  );
  const fallbackProgress = useMotionValue(0);
  const watchedProgress = trigger.mode === "progress" ? trigger.value : fallbackProgress;
  useMotionValueEvent(watchedProgress, "change", (latest) => {
    if (trigger.mode === "progress" && !progressFired && latest >= trigger.threshold) {
      setProgressFired(true);
    }
  });

  const shouldStart =
    trigger.mode === "inView" ? inView : trigger.mode === "progress" ? progressFired : true;
  const count = useMotionValue(reduceMotion ? target : 0);
  const value = useTransform(count, (v) => Number(v.toFixed(decimals)));
  const delaySeconds = trigger.mode === "delay" ? (trigger.ms ?? 0) / 1000 : 0;

  useEffect(() => {
    if (reduceMotion) {
      count.set(target);
      return;
    }
    if (!shouldStart) return;
    const controls = fmAnimate(count, target, { duration, ease, delay: delaySeconds });
    return controls.stop;
  }, [shouldStart, reduceMotion, target, count, duration, ease, delaySeconds]);

  return { ref, value };
}
