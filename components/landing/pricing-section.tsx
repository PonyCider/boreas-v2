"use client";

import { useState } from "react";
import { SectionFrame } from "./landing-sections";
import { PlanCard } from "./pricing/plan-card";
import { sectionIds } from "@/content/site";
import { pricingFootnote, pricingHeading, tiers, type Tier } from "@/content/pricing";
import type { PlanConfig, Selection } from "@/lib/pricing";

export function PricingSection() {
  const [selection, setSelection] = useState<Selection | null>(null);

  function handleSelect(tier: Tier, config: PlanConfig) {
    setSelection({ tier, config });
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SectionFrame id={sectionIds.pricing} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{pricingHeading.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {pricingHeading.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {pricingHeading.body}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <PlanCard key={tier.id} tier={tier} onSelect={handleSelect} />
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-clinical">{pricingFootnote}</p>

        <div id="contacto" className="mt-20 scroll-mt-28">
          {/* Task 6 monta aquí <LeadForm selection={selection} />. */}
          {selection && (
            <p className="text-sm text-muted">
              Elegiste {selection.tier.name}
              {selection.config.express ? " con Entrega Express" : ""}
              {selection.config.ia && selection.tier.allowsIa ? " y Chatbot IA" : ""}.
            </p>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}
