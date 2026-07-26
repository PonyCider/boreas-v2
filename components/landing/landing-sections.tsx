"use client";

import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { MotorsSection } from "./motors-section";
import { SocialProofSection } from "./social-proof-section";
import { PricingSection } from "./pricing-section";
import { RelevoSection } from "./relevo-section";

export function SectionFrame({
  children,
  className = "",
  id,
  theme,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  theme?: "light" | "dark";
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={`relative scroll-mt-28 py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function LandingSections() {
  return (
    <div className="relative text-foreground">
      <HeroSection />
      <ProblemSection />
      <MotorsSection />
      <SocialProofSection />
      <PricingSection />
      <RelevoSection />
    </div>
  );
}
