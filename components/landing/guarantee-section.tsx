"use client";

import { SectionFrame } from "./boreas-landing-sections";
import { guarantees } from "@/content/boreas-home";

export function GuaranteeSection() {
  return (
    <SectionFrame id="garantia" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-md">
            <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground">
              La certeza viene de lo que ya tienes.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Boreas usa tus reseñas, tu reputación y tus tratamientos prioritarios para construir una decisión más fácil.
            </p>
          </div>

          <div className="border-t border-line">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.title}
                className="grid gap-4 border-b border-line py-7 sm:grid-cols-[0.36fr_0.64fr]"
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {guarantee.title}
                </h3>
                <p className="text-base leading-relaxed text-muted">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
