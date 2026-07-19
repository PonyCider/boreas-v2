"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionFrame } from "./landing-sections";
import SplitText from "./split-text";
import { GsapCounter } from "./gsap-counter";
import { sectionIds, primaryCta } from "@/content/site";
import { heroContent } from "@/content/hero";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = prefersReduced ? 0.01 : 0.7;
      const stagger = prefersReduced ? 0 : 0.08;
      const introStart = prefersReduced ? 0 : 0.9;
      const cardStart = prefersReduced ? 0 : 1.1;
      const cardStagger = prefersReduced ? 0 : 0.12;

      // `.btn` carries `transition: all .18s ease` for its hover/active lift.
      // Left in place, that CSS transition fights GSAP's own per-frame inline
      // opacity/transform updates on the same element (the two systems chase
      // different targets every frame), which can leave the button stuck
      // mid-tween. Suspend it for the entrance, restore it once settled so
      // hover/active still transitions smoothly afterward.
      if (primaryCtaRef.current) {
        gsap.set(primaryCtaRef.current, { transition: "none" });
      }

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(subheadRef.current, { opacity: 0, y: prefersReduced ? 0 : 16, duration }, introStart)
        .from(
          primaryCtaRef.current,
          {
            opacity: 0,
            y: prefersReduced ? 0 : 16,
            duration,
            onComplete: () => {
              if (primaryCtaRef.current) primaryCtaRef.current.style.transition = "";
            },
          },
          introStart + stagger
        )
        .from(
          secondaryCtaRef.current,
          { opacity: 0, y: prefersReduced ? 0 : 16, duration },
          introStart + stagger * 2
        )
        .from(
          cardRefs.current.filter((el): el is HTMLDivElement => el !== null),
          { opacity: 0, y: prefersReduced ? 0 : 24, duration, stagger: cardStagger },
          cardStart
        );
    },
    { scope: containerRef }
  );

  return (
    <SectionFrame id={sectionIds.hero} className="bg-hero-glow">
      <div
        ref={containerRef}
        className="mx-auto grid max-w-[1460px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10"
      >
        <div className="flex flex-col items-start text-left">
          <p className="text-sm font-medium text-accent">{heroContent.eyebrow}</p>

          <SplitText
            text={heroContent.headline}
            tag="h1"
            splitType="words"
            textAlign="left"
            delay={40}
            duration={0.9}
            from={{ opacity: 0, y: 24 }}
            to={{ opacity: 1, y: 0 }}
            className="mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
          />

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
