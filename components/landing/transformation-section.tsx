"use client";

import { SectionFrame } from "./boreas-landing-sections";
import { transformations } from "@/content/boreas-home";

export function TransformationSection() {
  return (
    <SectionFrame id="transformacion" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-md">
            <h2 className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground">
              Deja de vender una página. Vende el siguiente paso.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Boreas convierte términos técnicos en decisiones claras para el paciente.
            </p>
          </div>

          <div className="flex flex-col border-t border-line">
            {transformations.map((item, index) => (
              <div
                key={index}
                className="grid gap-5 border-b border-line py-7 sm:grid-cols-[0.36fr_0.64fr]"
              >
                <span className="text-sm text-muted line-through">
                  {item.technical}
                </span>
                <p className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  {item.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
