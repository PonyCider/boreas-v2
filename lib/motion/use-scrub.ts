"use client";

import { useTransform, type MotionValue } from "framer-motion";
import { useMotionValueState } from "@/lib/use-motion-value-state";

/**
 * Scrubs a numeric value from a scroll-linked MotionValue's progress range
 * into a plain React number, re-rendering on every scroll frame. Wraps
 * useTransform + useMotionValueState — see use-motion-value-state.ts for why
 * the mirror-to-state step is required in this stack.
 */
export function useScrub(
  progress: MotionValue<number>,
  input: [number, number],
  output: [number, number]
): number {
  return useMotionValueState(useTransform(progress, input, output));
}
