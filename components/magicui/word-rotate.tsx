"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

export function WordRotate({
  words,
  duration = 2200,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const reduceMotion = !!useReducedMotion();

  useEffect(() => {
    if (reduceMotion || words.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      duration,
    );
    return () => window.clearInterval(timer);
  }, [duration, reduceMotion, words.length]);

  if (!words.length) return null;

  return (
    <span className={cn("relative inline-flex overflow-hidden", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
          initial={reduceMotion ? false : { opacity: 0, y: 10, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -10, filter: "blur(5px)" }}
          transition={{ duration: reduceMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
