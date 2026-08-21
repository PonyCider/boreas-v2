import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { MotorsSection } from "./motors-section";
import { SocialProofSection } from "./social-proof-section";
import { PricingSection } from "./pricing-section";
import { RelevoSection } from "./relevo-section";

export function LandingSections() {
  return (
    <div className="relative text-foreground">
      <HeroSection />
      <ProblemSection />
      <MotorsSection />
      <PricingSection />
      <SocialProofSection />
      <RelevoSection />
    </div>
  );
}
