"use client";

import { useMotionValueEvent, type MotionValue } from "framer-motion";
import { useState } from "react";

/**
 * Mirrors a framer-motion MotionValue into React state.
 *
 * Binding a `useTransform`-derived MotionValue directly via
 * `style={{ opacity: mv }}` on a `motion.*` element is the standard
 * framer-motion pattern, but in this app's stack (React 19 / Next 16 /
 * framer-motion 12.38.0) that direct-DOM-write path silently does not
 * update the DOM — confirmed live: the MotionValue computes and fires
 * "change" events correctly, but framer-motion's own subscription for
 * writing it into the element's style never fires (see the Task 6 commit
 * in docs/superpowers/plans/2026-07-14-hero-cinematic-scroll.md for the
 * full investigation). Mirroring into React state and binding a plain
 * number to a plain (non-motion) element's style sidesteps that broken
 * path entirely, reusing the ordinary React re-render path this app's
 * count-up chips already rely on (lib/use-animated-number.ts).
 */
export function useMotionValueState(mv: MotionValue<number>): number {
  const [value, setValue] = useState(mv.get());
  useMotionValueEvent(mv, "change", setValue);
  return value;
}
