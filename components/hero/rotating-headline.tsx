"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type RotatingHeadlineProps = {
  words: string[];
};

export function RotatingHeadline({ words }: RotatingHeadlineProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const widestWord = words.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    words[0] ?? "",
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      setIndex((currentIndex) => (currentIndex + 1) % words.length);
    }, 2200);

    return () => window.clearInterval(interval);
  }, [words.length]);

  return (
    <span className="relative inline-grid place-items-center px-[0.08em] py-[0.16em] text-center align-baseline leading-[1.08]">
      <span aria-hidden className="invisible whitespace-nowrap">
        {widestWord}
      </span>
      <AnimatePresence initial={false} mode="sync">
        <motion.span
          key={words[index]}
          initial={reduceMotion ? false : { y: "-34%", opacity: 0 }}
          animate={reduceMotion ? { opacity: 1 } : { y: "0%", opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: "34%", opacity: 0 }}
          transition={{
            duration: reduceMotion ? 0.15 : 0.5,
            ease: [0.32, 0.72, 0, 1],
          }}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap text-[#dde3e8] will-change-transform"
          style={{
            textShadow: "0 1px 10px rgba(0, 0, 0, 0.12)",
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
