"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WordmarkLetterReveal } from "@/components/motion/wordmark-letter-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { useSkipOnScroll } from "@/lib/motion/use-skip-on-scroll";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HOLD_MS = 400;

export interface WordmarkIntroProps {
  wordmark: string;
  headline: string;
  onSettled?: () => void;
}

export function WordmarkIntro({ wordmark, headline, onSettled }: WordmarkIntroProps) {
  const skip = useSkipOnScroll();
  const [lettersDone, setLettersDone] = useState(false);
  const [holdDone, setHoldDone] = useState(false);

  useEffect(() => {
    if (!lettersDone) return;
    // Skip mode resolves on the next tick instead of calling setState
    // synchronously in the effect body (react-hooks/set-state-in-effect).
    const timer = setTimeout(() => setHoldDone(true), skip ? 0 : HOLD_MS);
    return () => clearTimeout(timer);
  }, [lettersDone, skip]);

  useEffect(() => {
    if (holdDone) onSettled?.();
  }, [holdDone, onSettled]);

  const moveUpDuration = skip ? 0.16 : 0.5;

  return (
    <div className="relative">
      <motion.div
        animate={{ transform: holdDone ? "translate3d(0, -8px, 0)" : "translate3d(0, 0, 0)" }}
        transition={{ duration: moveUpDuration, ease: EASE }}
        className="font-display italic font-medium leading-[0.88] tracking-[-0.03em] text-foreground"
        style={{ fontSize: "clamp(5rem, 13vw, 10.5rem)" }}
      >
        <WordmarkLetterReveal text={wordmark} skip={skip} onComplete={() => setLettersDone(true)} />
      </motion.div>
      {holdDone && (
        <TextReveal reduceMotion={false} trigger={{ mode: "delay", ms: 0 }}>
          <h1
            className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
          >
            {headline}
          </h1>
        </TextReveal>
      )}
    </div>
  );
}
