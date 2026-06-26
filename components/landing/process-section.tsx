"use client";

import { SectionFrame } from "./boreas-landing-sections";
import { processSteps } from "@/content/boreas-home";

export function ProcessSection() {
  return (
    <SectionFrame id="proceso" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-md">
            <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground">
              Tu esfuerzo se reduce a un audio.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              La velocidad de entrega funciona porque el proceso evita formularios largos, juntas innecesarias y textos escritos por el médico.
            </p>
          </div>

          <div className="relative pl-0">
            <div className="absolute bottom-10 left-4 top-8 w-px bg-accent/35 sm:left-8" />

            <div className="flex flex-col gap-12 sm:gap-20">
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className="relative min-h-[48px] pl-12 sm:pl-20"
                >
                  <div className="absolute left-0 sm:left-2 top-0">
                    <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-md border border-accent/40 bg-background p-2 font-mono text-base font-semibold text-accent sm:h-12 sm:w-12">
                      {index + 1}
                    </div>
                  </div>

                  <div className="pt-0.5 sm:pt-2">
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-muted leading-relaxed max-w-lg">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
