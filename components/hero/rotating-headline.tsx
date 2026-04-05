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
          initial={
            reduceMotion
              ? false
              : { y: "-24%", opacity: 0.18, filter: "blur(5px)" }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { y: "0%", opacity: 1, filter: "blur(0px)" }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { y: "24%", opacity: 0.22, filter: "blur(5px)" }
          }
          transition={{
            duration: reduceMotion ? 0.15 : 0.72,
            ease: "easeInOut",
            opacity: { duration: reduceMotion ? 0.15 : 0.58, ease: "easeInOut" },
            filter: { duration: reduceMotion ? 0.15 : 0.62, ease: "easeInOut" },
          }}
          className="absolute inset-0 flex items-center justify-center whitespace-nowrap bg-[linear-gradient(180deg,#ebe2cf_0%,#d8ccb2_52%,#cec1a8_100%)] bg-clip-text text-center text-transparent [font-variation-settings:'wght'_610]"
          style={{
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.12)",
            willChange: "transform, opacity, filter",
          }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
