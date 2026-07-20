"use client";

import { useEffect, useRef, useState } from "react";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GradualBlur from "./gradual-blur";
import { InteractiveHoverButton } from "./interactive-hover-button";
import { compareSlider } from "@/content/problem";

gsap.registerPlugin(ScrollTrigger);

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
      <div className="flex items-center gap-1.5 border-b border-border bg-elevated px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-clinical/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-clinical/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-clinical/40" />
      </div>
      <div className="h-[calc(100%-33px)] w-full">{children}</div>
    </div>
  );
}

function GenericMock() {
  const { eyebrow, heading, body, ctaLabel } = compareSlider.generic;
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-3 bg-[#EDEDED] px-6 py-8">
      <p className="text-xs text-[#8A8A8A]">{eyebrow}</p>
      <h3 className="text-2xl font-bold leading-tight text-[#3A3A3A]">{heading}</h3>
      <p className="max-w-xs text-sm text-[#6B6B6B]">{body}</p>
      <span className="mt-2 inline-flex items-center rounded-sm bg-[#3A3A3A] px-4 py-2 text-xs font-bold uppercase text-white">
        {ctaLabel}
      </span>
    </div>
  );
}

function BoreasMock() {
  const { eyebrow, heading, body, ctaLabel } = compareSlider.boreas;
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-3 bg-background px-6 py-8">
      <p className="text-xs font-medium text-accent">{eyebrow}</p>
      <h3 className="font-display text-2xl font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
        {heading}
      </h3>
      <p className="max-w-xs text-sm leading-relaxed text-muted">{body}</p>
      <InteractiveHoverButton
        tabIndex={-1}
        aria-hidden="true"
        className="mt-2 min-h-9 px-4 text-xs"
      >
        {ctaLabel}
      </InteractiveHoverButton>
    </div>
  );
}

export function ProblemCompareSlider() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion || !wrapperRef.current) return;

      // Pins the slider at whatever screen position its bottom edge occupies
      // the moment that edge touches the viewport bottom — the standard GSAP
      // recipe for "lock to where it already is" rather than "lock to the
      // top", which is what makes it read as glued to the bottom of the
      // screen instead of sticking under a nav bar. `end` controls how much
      // scroll distance it stays pinned for before releasing into its
      // resting position in the section layout below — tuned visually in
      // Task 9, this starting value is a reasonable first pass.
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      return () => trigger.kill();
    },
    { dependencies: [reducedMotion] }
  );

  return (
    <div className={reducedMotion ? "" : "-mt-24 sm:-mt-32"}>
      <div ref={wrapperRef} className="relative mx-auto max-w-[900px] px-4 sm:px-6">
        {!reducedMotion && (
          <GradualBlur position="top" height="3rem" strength={2.5} />
        )}
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-xl)] border border-border shadow-[var(--shadow)] sm:aspect-[16/8]">
          <ImgComparisonSlider className="h-full w-full">
            <div slot="first" className="h-full w-full">
              <BrowserFrame>
                <GenericMock />
              </BrowserFrame>
            </div>
            <div slot="second" className="h-full w-full">
              <BrowserFrame>
                <BoreasMock />
              </BrowserFrame>
            </div>
          </ImgComparisonSlider>
        </div>
        <p className="mt-3 text-center text-xs text-clinical">{compareSlider.label}</p>
      </div>
    </div>
  );
}
