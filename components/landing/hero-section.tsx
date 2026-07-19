import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function HeroSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.hero];

  return (
    <SectionFrame id={sectionIds.hero}>
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h1>
      </div>
    </SectionFrame>
  );
}
