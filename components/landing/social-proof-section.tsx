import { SectionFrame } from "./section-frame";
import { SocialProofMarquee } from "./social-proof-marquee";
import { sectionIds } from "@/content/site";

export function SocialProofSection() {
  return (
    <SectionFrame
      id={sectionIds.socialProof}
      theme="dark"
      className="overflow-x-clip border-t border-line bg-background"
    >
      <SocialProofMarquee />
    </SectionFrame>
  );
}
