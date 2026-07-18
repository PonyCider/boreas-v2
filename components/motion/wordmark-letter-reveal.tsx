"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, useGSAP);

export interface WordmarkLetterRevealProps {
  text: string;
  /** When true, whatever's left of the reveal resolves to its final state
   *  over 160ms instead of continuing the full stagger timeline. */
  skip: boolean;
  onComplete: () => void;
  className?: string;
}

// gsap-only leaf component — do not import framer-motion here (architecture
// discipline: keep the two animation engines in separate files, see
// DESIGN.md § "Animation library policy").
export function WordmarkLetterReveal({ text, skip, onComplete, className = "" }: WordmarkLetterRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const completedRef = useRef(false);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      splitRef.current = new SplitText(containerRef.current, { type: "chars" });
      tweenRef.current = gsap.from(splitRef.current.chars, {
        yPercent: 100,
        opacity: 0,
        duration: 0.4,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.25,
        onComplete: () => {
          if (completedRef.current) return;
          completedRef.current = true;
          onComplete();
        },
      });
      return () => {
        splitRef.current?.revert();
      };
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      if (!skip || !splitRef.current) return;
      tweenRef.current?.kill();
      gsap.to(splitRef.current.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.16,
        ease: "expo.out",
        stagger: 0,
        onComplete: () => {
          if (completedRef.current) return;
          completedRef.current = true;
          onComplete();
        },
      });
    },
    { dependencies: [skip], scope: containerRef }
  );

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {text}
    </span>
  );
}
