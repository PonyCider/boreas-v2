import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function PricingSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.pricing];

  return (
    <SectionFrame id={sectionIds.pricing} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h2>
      </div>
    </SectionFrame>
  );
}
