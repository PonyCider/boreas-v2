"use client";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function FinalCtaSection() {
  return (
    <SectionFrame className="pb-32 sm:pb-40">
      <div
        data-parallax
        data-depth="20"
        className="pointer-events-none absolute left-1/2 top-10 h-[28rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.12),transparent_72%)] blur-[135px]"
      />

      <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-4xl">
          <SectionEyebrow>El siguiente paso</SectionEyebrow>
          <h2 className="mt-8 text-balance text-[clamp(2.5rem,5.2vw,5rem)] font-medium leading-[1.04] tracking-[-0.05em] text-[#f7f1ea]">
            Deja de perseguir mensajes.
            <br />
            Empieza a <span className="text-[#d8ccb2]">cerrar clientes</span>.
          </h2>

          <p className="mt-6 text-lg text-white/50">Automatiza la calificación y las reservas desde hoy. Desplegable en 24h.</p>

          <a
            href="mailto:hola@boreas.ai"
            className="mt-12 inline-flex items-center justify-center rounded-full border border-white/14 bg-[linear-gradient(180deg,rgba(216,204,178,0.22)_0%,rgba(216,204,178,0.12)_100%)] px-10 py-5 text-[1.1rem] font-medium text-[#fbfcfd] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(0,0,0,0.08),0_18px_44px_rgba(0,0,0,0.25)] backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-[#d8ccb2]/30"
          >
            Agendar llamada
          </a>
        </div>
      </div>
    </SectionFrame>
  );
}
