 "use client";

import { ProblemSection } from "./problem-section";
import { SocialProofSection } from "./social-proof-section";
import { TransformationSection } from "./transformation-section";
import { ProcessSection } from "./process-section";
import { GuaranteeSection } from "./guarantee-section";
import { ContactFormSection } from "./contact-form-section";
import { FaqSection } from "./faq-section";
import { RelevoCuriositySection } from "./relevo-curiosity-section";

export function SectionFrame({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-28 py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function BoreasLandingSections() {
  return (
    <div className="relative text-foreground">
      <ProblemSection />
      <SocialProofSection />
      <TransformationSection />
      <ProcessSection />
      <GuaranteeSection />
      <FaqSection />
      <ContactFormSection />
      <RelevoCuriositySection />
    </div>
  );
}
