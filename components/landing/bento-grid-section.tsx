"use client";

import { playbookCards } from "@/content/boreas-home";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function BentoGridSection() {
  const [primaryCard, sideCard, lowerLeftCard, lowerRightCard] = playbookCards;

  return (
    <SectionFrame>
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-4xl text-center lg:mx-0 lg:max-w-[48rem] lg:text-left">
          <SectionEyebrow>Qué hace diferente a Relevo</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            La ventaja no es solo responder.
            <br className="hidden sm:block" />
            Es responder con claridad y rumbo.
          </h2>
        </div>

        <div data-step-group className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-[auto_auto]">
          <div data-step-card className="group relative col-span-1 flex flex-col overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm md:col-span-2 md:row-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-1 flex-col justify-center">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-white/30">
                {primaryCard.accent === "main" ? "Núcleo" : "Sistema"}
              </p>
              <h3 className="mt-6 text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#f7f1ea]">
                {primaryCard.title}
              </h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/50">
                {primaryCard.description}
              </p>
            </div>
          </div>

          <div data-step-card className="group relative col-span-1 flex flex-col overflow-hidden rounded-[2rem] border border-[#d8ccb2]/10 bg-[linear-gradient(180deg,rgba(216,204,178,0.03)_0%,rgba(216,204,178,0.01)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.2)] md:row-span-2">
            <div className="absolute top-0 right-0 h-40 w-40 -translate-y-8 translate-x-8 rounded-full bg-[#d8ccb2]/10 blur-[60px]" />
    <div className="relative z-10 flex h-full flex-col justify-end min-h-[16rem]">
              <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[#d8ccb2]/60">
                Operación
              </p>
              <h3 className="mt-5 text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#d8ccb2]">
                {sideCard.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-[#d8ccb2]/70">
                {sideCard.description}
              </p>
            </div>
          </div>

          <div data-step-card className="group relative col-span-1 flex flex-col justify-center overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="text-xl font-medium tracking-tight text-[#f7f1ea]">
              {lowerLeftCard.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              {lowerLeftCard.description}
            </p>
          </div>

          <div data-step-card className="group relative col-span-1 flex flex-col justify-center overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 backdrop-blur-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_50%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <h3 className="text-xl font-medium tracking-tight text-[#f7f1ea]">
              {lowerRightCard.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              {lowerRightCard.description}
            </p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
