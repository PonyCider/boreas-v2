"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SectionFrame } from "./section-frame";
import LightRays from "./light-rays";
import SpecularButton from "./specular-button";
import { InteractiveHoverButton } from "./interactive-hover-button";
import { HeroVisual } from "./hero-visual";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { VariableProximity } from "@/components/ui/variable-proximity";
import { AvatarCircles } from "@/components/ui/avatar-circles";
import { sectionIds, primaryCta } from "@/content/site";
import { heroContent } from "@/content/hero";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLButtonElement>(null);
  const secondaryCtaRef = useRef<HTMLButtonElement>(null);
  const avatarsRef = useRef<HTMLDivElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  // Guards against the setup running twice while a previous run's timeline is still alive.
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
        !secondaryCtaRef.current ||
        !avatarsRef.current ||
        !visualRef.current
      ) {
        return;
      }

      isAnimatingRef.current = true;

      // SpecularButton's outer button carries `transition-transform duration-150`
      // (for its active:scale press feedback), which fights GSAP's own per-frame
      // transform writes. Suspend during animation.
      gsap.set(secondaryCtaRef.current, { transition: "none" });

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
        .from(avatarsRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.74)
        .from(visualRef.current, { opacity: 0, y: 24, duration: 0.7 }, 1.85);

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
      className="relative flex min-h-screen items-center overflow-hidden bg-background"
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
        className="relative z-10 mx-auto grid w-full max-w-[1460px] grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16 px-4 pt-20 sm:px-6 sm:pt-28 lg:px-10 lg:pt-16"
      >
        <div className="flex flex-col items-center text-center lg:max-w-xl lg:items-start lg:text-left">
          <h2
            ref={logoRef}
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            className="text-[clamp(3.2rem,16vw,5.5rem)] font-medium italic leading-none tracking-[-0.01em] text-foreground lg:text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            <span className="hidden sm:inline-block">
              <VariableProximity label="Boreas" radius={140} />
            </span>
            <span className="inline-block sm:hidden">
              Boreas
            </span>
          </h2>

          <div ref={eyebrowRef} className="mt-6">
            <AnimatedShinyText>
              {heroContent.eyebrow}
            </AnimatedShinyText>
          </div>

          <h1
            ref={headlineRef}
            className="mt-4 max-w-2xl text-balance text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
          >
            {heroContent.headline}
          </h1>

          <p
            ref={subheadRef}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {heroContent.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
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

          <div ref={avatarsRef} className="mt-8">
            <AvatarCircles />
          </div>
        </div>

        <HeroVisual ref={visualRef} />
      </div>
    </SectionFrame>
  );
}
