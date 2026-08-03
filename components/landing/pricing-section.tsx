"use client";

import { useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { Info } from "lucide-react";
import { SectionFrame } from "./landing-sections";
import { CheckoutModal } from "./pricing/checkout-modal";
import { OrganizationPlanCard, PlanCard } from "./pricing/plan-card";
import SplitText from "./split-text";
import { TextEffect } from "./text-effect";
import { FloatingTooltip } from "@/components/unlumen-ui/floating-tooltip";
import { sectionIds } from "@/content/site";
import { pricingFootnote, pricingHeading, tiers, type Tier } from "@/content/pricing";
import type { PlanConfig, Selection } from "@/lib/pricing";

const mainTiers = tiers.filter((tier) => tier.id !== "organizaciones");
const organizationTier = tiers.find((tier) => tier.id === "organizaciones");

export function PricingSection() {
  const [selection, setSelection] = useState<Selection | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const checkoutTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });
  const reducedMotion = !!useReducedMotion();

  function handleSelect(tier: Tier, config: PlanConfig, trigger: HTMLButtonElement) {
    checkoutTriggerRef.current = trigger;
    setSelection({ tier, config });
    setCheckoutOpen(true);
  }

  return (
    <SectionFrame id={sectionIds.pricing} className="border-t border-line">
      <FloatingTooltip.Provider variant="outline" size="lg">
        <div ref={sectionRef} className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-2">
            {inView && !reducedMotion ? (
              <TextEffect as="p" per="word" preset="fade" trigger className="text-xs font-semibold uppercase tracking-wider text-accent">
                {pricingHeading.eyebrow}
              </TextEffect>
            ) : (
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                {pricingHeading.eyebrow}
              </p>
            )}

            {reducedMotion ? (
              <h2 className="max-w-3xl font-display text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.015em] text-foreground">
                {pricingHeading.heading}
              </h2>
            ) : (
              <SplitText
                text={pricingHeading.heading}
                tag="h2"
                splitType="words"
                textAlign="left"
                className="max-w-3xl font-display text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1.1] tracking-[-0.015em] text-foreground"
              />
            )}

            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted">
              {pricingHeading.body}
            </p>
          </div>

          <div className="pricing-texture relative mt-12 rounded-[calc(var(--radius-xl)+0.5rem)] border border-line/70 p-4 sm:p-6 lg:p-8">
            <div className="relative z-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {mainTiers.map((tier) => (
                <PlanCard key={tier.id} tier={tier} onSelect={handleSelect} />
              ))}
            </div>

            {organizationTier && (
              <div className="relative z-10 mt-6">
                <OrganizationPlanCard tier={organizationTier} onSelect={handleSelect} />
              </div>
            )}

            <div className="relative z-10 mt-6 flex max-w-4xl items-start gap-2.5 text-xs leading-relaxed text-clinical">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p>{pricingFootnote}</p>
            </div>
          </div>

        </div>

        <CheckoutModal
          selection={selection}
          open={checkoutOpen}
          onOpenChange={setCheckoutOpen}
          returnFocusRef={checkoutTriggerRef}
        />
      </FloatingTooltip.Provider>
    </SectionFrame>
  );
}
