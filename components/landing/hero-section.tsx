"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionFrame } from "./landing-sections";
import LightRays from "./light-rays";
import SpecularButton from "./specular-button";
import { InteractiveHoverButton } from "./interactive-hover-button";
import { GsapCounter } from "./gsap-counter";
import { sectionIds, primaryCta } from "@/content/site";
import { heroContent } from "@/content/hero";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLButtonElement>(null);
  const secondaryCtaRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  // Guards against the setup running twice while a previous run's timeline is
  // still alive.
  const isAnimatingRef = useRef(false);
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
      if (isAnimatingRef.current) return;
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

      isAnimatingRef.current = true;

      // SpecularButton's outer button carries `transition-transform duration-150`
      // (for its active:scale press feedback), which fights GSAP's own per-frame
      // transform writes the same way `.btn`'s `transition: all` did in the
      // previous pass (see Epic 1 pass 1's Hero fix). InteractiveHoverButton's
      // outer button has no such transition, so only this one needs suspending.
      gsap.set(secondaryCtaRef.current, { transition: "none" });

      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

      const tl = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(logoRef.current, { opacity: 0, y: 20, scale: 0.94, duration: 0.8 }, 0)
        .from(eyebrowRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.55)
        .from(headlineRef.current, { opacity: 0, y: 20, duration: 0.8 }, 0.85)
        .from(subheadRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.5)
        .from(primaryCtaRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.58)
        .from(
          secondaryCtaRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.7,
            onComplete: () => {
              if (secondaryCtaRef.current) secondaryCtaRef.current.style.transition = "";
            },
          },
          1.66
        )
        .from(cards, { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 }, 1.85);

      return () => {
        tl.kill();
        isAnimatingRef.current = false;
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
            raysOrigin="top-center"
            raysColor="#FBF8F3"
            raysSpeed={1.1}
            lightSpread={0.4}
            rayLength={1.8}
            fadeDistance={1.4}
            saturation={1}
            followMouse
            mouseInfluence={0.15}
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
          <h2
            ref={logoRef}
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            className="text-[clamp(2.6rem,7vw,5.5rem)] font-medium italic leading-none tracking-[-0.01em] text-foreground"
          >
            Boreas
          </h2>

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
            <InteractiveHoverButton
              ref={primaryCtaRef}
              onClick={() => scrollToSection(sectionIds.pricing)}
            >
              {primaryCta}
            </InteractiveHoverButton>
            <SpecularButton
              ref={secondaryCtaRef}
              size="md"
              onClick={() => scrollToSection(sectionIds.motores)}
            >
              {heroContent.ctaSecondaryLabel}
            </SpecularButton>
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
