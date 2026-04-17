"use client";

import { metricCards } from "@/content/boreas-home";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function TrustAndProofSection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="14"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div
            data-reveal
            className="flex flex-col justify-center rounded-[2.5rem] border border-white/8 bg-white/[0.02] px-8 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-sm"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[#d8ccb2]/60">
              Métricas clave
            </p>
            <p className="mt-6 text-[clamp(3.8rem,8vw,6.5rem)] font-medium leading-none tracking-[-0.08em] text-[#d8ccb2]">
              4
            </p>
            <p className="mt-4 max-w-[18rem] text-sm leading-relaxed text-white/50">
              Señales principales para ver si Relevo está ayudando de verdad, no solo generando
              respuestas bonitas.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-[#d8ccb2]/20 to-transparent" />

            <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/32">
              Qué vamos a mirar
            </p>
            <p className="mt-4 text-base leading-7 text-white/58">
              En vez de prometer resultados inflados desde la página, Boreas te ayuda a medir
              rapidez, avance y acciones cerradas desde el inicio.
            </p>
          </div>

          <div data-reveal className="max-w-4xl py-6 lg:py-12">
            <SectionEyebrow>Medición útil</SectionEyebrow>
            <h2 className="mt-6 text-balance text-[clamp(2.2rem,4.7vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.055em] text-[#f7f1ea]">
              Primero claridad.
              <br className="hidden sm:block" />
              Luego resultados.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
              Boreas no se queda en una promesa abstracta. Se nota en tiempos de respuesta,
              conversaciones que sí avanzan y acciones concretas que el negocio puede ver.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {metricCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-white/[0.015] p-6 transition-colors hover:bg-white/[0.03]"
                >
                  <h4 className="text-sm uppercase tracking-[0.2em] text-[#d8ccb2]/60">
                    {card.label}
                  </h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                    {card.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
