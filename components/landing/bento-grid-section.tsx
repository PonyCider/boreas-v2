"use client";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function BentoGridSection() {
  return (
    <SectionFrame>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>Capacidades</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            Un consultor digital diseñado para que tú te enfoques en el servicio.
          </h2>
        </div>

        <div data-step-group className="mt-16 grid grid-cols-1 gap-5 md:grid-cols-3 md:grid-rows-[auto_auto]">
          {/* Main Card */}
          <div data-step-card className="group relative col-span-1 flex flex-col overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur-sm md:col-span-2 md:row-span-1">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <div className="relative z-10 flex flex-1 flex-col justify-center">
              <h3 className="text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#f7f1ea]">Respuesta Inteligente 24/7</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/50">
                Boreas no utiliza flujos de botones rígidos ni menús infinitos. Entiende la intención mediante lenguaje conversacional avanzado y responde de manera precisa y empática en segundos.
              </p>
            </div>
          </div>

          {/* Tall Card */}
          <div data-step-card className="group relative col-span-1 flex flex-col overflow-hidden rounded-[2rem] border border-[#d8ccb2]/10 bg-[linear-gradient(180deg,rgba(216,204,178,0.03)_0%,rgba(216,204,178,0.01)_100%)] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.2)] md:row-span-2">
            <div className="absolute top-0 right-0 h-40 w-40 -translate-y-8 translate-x-8 rounded-full bg-[#d8ccb2]/10 blur-[60px]" />
            <div className="relative z-10 flex h-full flex-col justify-end min-h-[16rem]">
              <h3 className="text-[1.7rem] font-medium leading-[1.08] tracking-[-0.04em] text-[#d8ccb2]">Cierre Integrado</h3>
              <p className="mt-4 text-base leading-relaxed text-[#d8ccb2]/70">
                 Identifica tu disponibilidad en tiempo real, cruza los datos con la agenda y cierra reservaciones en automático, inyectándolas en tu sistema sin duplicidades.
              </p>
            </div>
          </div>

          {/* Small Card 1 */}
          <div data-step-card className="group relative col-span-1 flex flex-col justify-center overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 backdrop-blur-sm">
             <div className="absolute inset-0 opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.06),transparent_50%)] group-hover:opacity-100" />
             <h3 className="text-xl font-medium tracking-tight text-[#f7f1ea]">Calificación Predictiva</h3>
             <p className="mt-3 text-sm leading-relaxed text-white/50">Filtra clientes fríos y pre-cualifica a los prospectos genuinos pidiéndoles los datos obligatorios.</p>
          </div>

          {/* Small Card 2 */}
          <div data-step-card className="group relative col-span-1 flex flex-col justify-center overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.02] p-8 backdrop-blur-sm">
             <div className="absolute inset-0 opacity-0 transition-opacity duration-500 bg-[radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_50%)] group-hover:opacity-100" />
             <h3 className="text-xl font-medium tracking-tight text-[#f7f1ea]">Reactiva Conversaciones</h3>
             <p className="mt-3 text-sm leading-relaxed text-white/50">Recupera leads olvidados con un seguimiento orgánico y sin fricciones diseñado para convertir.</p>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
