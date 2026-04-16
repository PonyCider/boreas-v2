"use client";

import { SectionFrame } from "./boreas-landing-sections";

export function GuaranteeSection() {
  return (
    <SectionFrame className="py-20 sm:py-32">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="relative overflow-hidden rounded-[2.5rem] border border-[#d8ccb2]/15 bg-[linear-gradient(180deg,rgba(216,204,178,0.06)_0%,rgba(216,204,178,0.01)_100%)] px-8 py-16 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.3)] md:px-20 md:py-24 backdrop-blur-md">
          {/* Subtle Glows */}
          <div className="absolute left-1/2 top-0 h-56 w-[70%] -translate-x-1/2 rounded-full bg-[#d8ccb2]/10 blur-[80px] pointer-events-none" />
          
            <div className="relative z-10 flex flex-col items-center">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-[#d8ccb2]/10 shadow-[0_0_32px_rgba(216,204,178,0.15)] ring-1 ring-[#d8ccb2]/20">
                <span className="text-2xl text-[#d8ccb2]">✦</span>
              </div>

              <h2 className="max-w-2xl text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-[#f7f1ea]">
                Onboarding guiado, controlado y sin improvisar.
              </h2>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[#f7f1ea]/60">
                El negocio no tiene que inventar la lógica conversacional ni entrenar un bot desde
                cero. En v2.1 solo comparte sus datos operativos, y Boreas activa el playbook
                correcto para que Relevo arranque con estructura, supervisión y criterios medibles.
              </p>

              <a
                href="#diagnostico"
                className="mt-12 inline-flex min-w-[13rem] items-center justify-center rounded-full border border-[#d8ccb2]/20 bg-[linear-gradient(180deg,rgba(216,204,178,0.18)_0%,rgba(216,204,178,0.12)_100%)] px-6 py-4 text-base font-medium text-[#fbfcfd] shadow-[0_14px_34px_rgba(0,0,0,0.2)] transition-all hover:scale-[1.02] hover:border-[#d8ccb2]/30 hover:brightness-110"
              >
                Recibir diagnóstico
              </a>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
