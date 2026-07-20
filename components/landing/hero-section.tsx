"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { SectionFrame } from "./landing-sections";
import LightRays from "./light-rays";
import { GsapCounter } from "./gsap-counter";
import { sectionIds, primaryCta } from "@/content/site";
import { heroContent } from "@/content/hero";

gsap.registerPlugin(GSAPSplitText);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      if (
        !logoRef.current ||
        !eyebrowRef.current ||
        !headlineRef.current ||
        !subheadRef.current ||
        !primaryCtaRef.current ||
        !secondaryCtaRef.current
      ) {
        return;
      }

      // .btn carries `transition: all .18s ease` for its hover/active lift,
      // which fights GSAP's per-frame inline writes on the same element
      // (see Epic 1 pass 1). Suspend it for the entrance, restore on completion.
      gsap.set(primaryCtaRef.current, { transition: "none" });

      const split = new GSAPSplitText(headlineRef.current, {
        type: "words",
        wordsClass: "split-word",
      });
      gsap.set(split.words, { opacity: 0, y: 24 });

      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(logoRef.current, { opacity: 0, y: 20, scale: 0.94, duration: 0.8 }, 0)
        .from(eyebrowRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.55)
        .to(split.words, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04 }, 0.75)
        .from(subheadRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.5)
        .from(
          primaryCtaRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.7,
            onComplete: () => {
              if (primaryCtaRef.current) primaryCtaRef.current.style.transition = "";
            },
          },
          1.58
        )
        .from(secondaryCtaRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.66)
        .from(cards, { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 }, 1.85);

      return () => {
        split.revert();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <SectionFrame
      id={sectionIds.hero}
      theme="dark"
      className="relative overflow-hidden bg-background"
    >
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-left"
            raysColor="#FBF8F3"
            raysSpeed={0.6}
            lightSpread={0.85}
            rayLength={1.3}
            fadeDistance={1.1}
            saturation={1}
            followMouse
            mouseInfluence={0.08}
            noiseAmount={0.06}
            distortion={0.05}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="relative z-10 mx-auto grid max-w-[1460px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10"
      >
        <div className="flex flex-col items-start text-left">
          <Image
            ref={logoRef}
            src="/brand/boreas-lockup.png"
            alt="Boreas"
            width={1186}
            height={735}
            priority
            className="w-full max-w-[280px] brightness-0 invert sm:max-w-[340px]"
          />

          <p ref={eyebrowRef} className="mt-6 text-sm font-medium text-accent">
            {heroContent.eyebrow}
          </p>

          <h1
            ref={headlineRef}
            className="mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
          >
            {heroContent.headline}
          </h1>

          <p
            ref={subheadRef}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {heroContent.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a ref={primaryCtaRef} href={`#${sectionIds.pricing}`} className="btn btn-p">
              {primaryCta}
            </a>
            <a
              ref={secondaryCtaRef}
              href={heroContent.ctaSecondaryHref}
              className="flex min-h-11 items-center text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {heroContent.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div className="hidden flex-col gap-4 lg:flex">
          {heroContent.proofStats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow)]"
            >
              <p className="text-2xl font-display text-foreground">
                {stat.animated ? (
                  <GsapCounter to={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                ) : (
                  stat.staticValue
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
          <p className="text-xs text-clinical">{heroContent.proofBadge}</p>
        </div>
      </div>
    </SectionFrame>
  );
}
