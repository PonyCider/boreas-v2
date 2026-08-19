import { SectionFrame } from "./section-frame";
import { RelevoCuriositySection } from "./relevo-curiosity-section";
import { sectionIds } from "@/content/site";

export function RelevoSection() {
  return (
    <SectionFrame id={sectionIds.relevo} theme="light" className="border-t border-line">
      <RelevoCuriositySection />
    </SectionFrame>
  );
}
