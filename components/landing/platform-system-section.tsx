"use client";

import { platformLayers } from "@/content/boreas-home";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function PlatformSystemSection() {
  return (
    <SectionFrame className="pt-8 sm:pt-14">
      <div
        data-parallax
        data-depth="12"
        className="pointer-events-none absolute right-[10%] top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.08),transparent_70%)] blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-4xl text-center">
          <SectionEyebrow>Arquitectura Boreas</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.2rem,4.8vw,4.25rem)] font-medium leading-[1.06] tracking-[-0.055em] text-[#f7f1ea]">
            Boreas organiza revenue como sistema.
            <br className="hidden sm:block" />
            Relevo es la capa activa hoy.
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-white/56 sm:text-lg">
            No vendemos piezas sueltas. Boreas ordena adquisición, conversión y retención como un
            sistema operativo. En v2.1 el foco absoluto está en conversión, porque esa es la capa
            que hoy genera resultados medibles más rápido.
          </p>
        </div>

        <div data-step-group className="mt-14 grid gap-4 lg:grid-cols-3 lg:gap-5">
          {platformLayers.map((layer) => (
            <article
              key={layer.title}
              data-step-card
              className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.03] p-7 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/16 to-transparent" />
              <div className="flex items-center justify-between gap-3">
                <p className="text-[1.45rem] font-medium tracking-[-0.04em] text-[#f7f1ea]">
                  {layer.title}
                </p>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#d8ccb2]">
                  {layer.status}
                </span>
              </div>
              <p className="mt-5 text-base leading-7 text-white/56">{layer.description}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionFrame>
  );
}
