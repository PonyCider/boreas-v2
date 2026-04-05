"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMemo, useRef } from "react";

gsap.registerPlugin(useGSAP);

type RotatingHeadlineProps = {
  words: string[];
};

export function RotatingHeadline({ words }: RotatingHeadlineProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const indexRef = useRef(0);

  const widestWord = useMemo(
    () =>
      words.reduce(
        (longest, current) =>
          current.length > longest.length ? current : longest,
        words[0] ?? "",
      ),
    [words],
  );

  useGSAP(
    () => {
      const wordElement = wordRef.current;

      if (!wordElement || words.length === 0) {
        return;
      }

      indexRef.current = 0;
      wordElement.textContent = words[0];

      gsap.set(wordElement, {
        y: 0,
        autoAlpha: 1,
        filter: "blur(0px)",
      });

      const timeline = gsap.timeline({
        repeat: -1,
        repeatDelay: 2,
        defaults: {
          overwrite: "auto",
        },
      });

      timeline
        .to(wordElement, {
          y: 40,
          autoAlpha: 0,
          filter: "blur(4px)",
          duration: 0.5,
          ease: "power3.in",
        })
        .call(() => {
          indexRef.current = (indexRef.current + 1) % words.length;
          wordElement.textContent = words[indexRef.current];
        })
        .fromTo(
          wordElement,
          {
            y: -40,
            autoAlpha: 0,
            filter: "blur(4px)",
          },
          {
            y: 0,
            autoAlpha: 1,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power3.out",
            immediateRender: false,
          },
          ">",
        );
    },
    { scope: containerRef, dependencies: [words], revertOnUpdate: true },
  );

  return (
    <span
      ref={containerRef}
      className="relative inline-grid place-items-center px-[0.08em] py-[0.16em] text-center align-baseline leading-[1.08]"
    >
      <span aria-hidden className="invisible whitespace-nowrap">
        {widestWord}
      </span>
      <span
        ref={wordRef}
        className="absolute inset-0 flex items-center justify-center whitespace-nowrap bg-[linear-gradient(180deg,#ebe2cf_0%,#d8ccb2_52%,#cec1a8_100%)] bg-clip-text text-center text-transparent [font-variation-settings:'wght'_610]"
        style={{
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.12)",
          willChange: "transform, opacity, filter",
        }}
      />
    </span>
  );
}
