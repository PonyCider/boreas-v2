"use client";

import { SectionFrame } from "./boreas-landing-sections";

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
          <h2 className="mt-8 text-balance text-[clamp(2.5rem,5.2vw,5rem)] font-medium leading-[1.04] tracking-[-0.05em] text-foreground">
            Deja de perseguir mensajes.
            <br />
            Empieza a <span className="text-accent">cerrar clientes</span>.
          </h2>

          <p className="mt-6 text-lg text-muted">Automatiza la calificación y las reservas desde hoy. Desplegable en 24h.</p>

          <a
            href="#diagnostico"
            className="mt-12 inline-flex items-center justify-center rounded-full border border-line bg-surface/20 px-10 py-5 text-[1.1rem] font-medium text-foreground backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-accent/30"
          >
            Recibir diagnóstico
          </a>
        </div>
      </div>
    </SectionFrame>
  );
}
