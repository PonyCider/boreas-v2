"use client";

import { useEffect, useState } from "react";
import { WordmarkLetterReveal } from "@/components/motion/wordmark-letter-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { HighlighterAccent } from "@/components/motion/highlighter-accent";
import { GradientAccentWord } from "@/components/motion/gradient-accent-word";
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
      <div
        className="font-display italic font-medium leading-[0.88] tracking-[-0.03em] text-foreground"
        style={{
          fontSize: "clamp(5rem, 13vw, 10.5rem)",
          transform: holdDone ? "translate3d(0, -8px, 0)" : "translate3d(0, 0, 0)",
          transition: `transform ${moveUpDuration}s cubic-bezier(${EASE.join(", ")})`,
        }}
      >
        <WordmarkLetterReveal text={wordmark} skip={skip} onComplete={() => setLettersDone(true)} />
      </div>
      {holdDone && (
        <TextReveal reduceMotion={false} trigger={{ mode: "delay", ms: 0 }}>
          <h1
            aria-label={headline}
            className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
          >
            {/* Hardcoded to match content/boreas-home.ts's heroHeadline
                ("Tu consultorio digital, abierto las 24 horas.") so the
                gradient/underline land on the right words — if heroHeadline
                changes, update this split too (and the fallback render in
                HeroStatic, which uses heroHeadline directly). */}
            Tu consultorio <GradientAccentWord reduceMotion={false}>digital</GradientAccentWord>,{" "}
            <HighlighterAccent active={holdDone} reduceMotion={false}>
              abierto las 24 horas
            </HighlighterAccent>
            .
          </h1>
        </TextReveal>
      )}
    </div>
  );
}
