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

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(
          ".hero-subhead, .hero-ctas > *",
          {
            opacity: 0,
            y: prefersReduced ? 0 : 16,
            duration: prefersReduced ? 0.01 : 0.7,
            stagger: prefersReduced ? 0 : 0.08,
          },
          prefersReduced ? 0 : 0.9
        )
        .from(
          ".hero-proof-card",
          {
            opacity: 0,
            y: prefersReduced ? 0 : 24,
            duration: prefersReduced ? 0.01 : 0.7,
            stagger: prefersReduced ? 0 : 0.12,
          },
          prefersReduced ? 0 : 1.1
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

          <p className="hero-subhead mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {heroContent.subheadline}
          </p>

          <div className="hero-ctas mt-8 flex flex-wrap items-center gap-4">
            <a href={`#${sectionIds.pricing}`} className="btn btn-p">
              {primaryCta}
            </a>
            <a
              href={heroContent.ctaSecondaryHref}
              className="flex min-h-11 items-center text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {heroContent.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div className="hidden flex-col gap-4 lg:flex">
          {heroContent.proofStats.map((stat) => (
            <div
              key={stat.label}
              className="hero-proof-card rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow)]"
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
