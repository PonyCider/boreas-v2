"use client";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function TrustAndProofSection() {
  return (
    <SectionFrame>
      <div
        data-parallax
        data-depth="14"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div
            data-reveal
            className="flex flex-col justify-center rounded-[2.5rem] border border-white/8 bg-white/[0.02] px-8 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.16)] backdrop-blur-sm"
          >
            <p className="text-[0.68rem] uppercase tracking-[0.34em] text-[#d8ccb2]/60">
              Impacto en Métricas
            </p>
            <p className="mt-6 text-[clamp(4.8rem,10vw,7.5rem)] font-medium leading-none tracking-[-0.08em] text-[#d8ccb2]">
              3x
            </p>
            <p className="mt-4 max-w-[14rem] text-sm leading-relaxed text-white/50">
              Aumento comprobado en conversión cuando respondes a una solicitud en menos de 2 minutos.
            </p>
            
            <div className="my-8 h-px bg-gradient-to-r from-[#d8ccb2]/20 to-transparent" />
            
            <p className="text-[clamp(3.2rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.06em] text-white/90">
              100%
            </p>
             <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-white/50">
              Cobertura continua sin brechas operativas. Noches, domingos y días festivos.
            </p>

            <div className="my-8 h-px bg-gradient-to-r from-white/10 to-transparent" />

            <p className="text-[clamp(3.2rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.06em] text-white/90">
              &lt; 5s
            </p>
             <p className="mt-4 max-w-[15rem] text-sm leading-relaxed text-white/50">
              Latencia promedio de respuesta. Atención inmediata e ininterrumpida.
            </p>
          </div>

          <div data-reveal className="max-w-4xl py-6 lg:py-12">
            <SectionEyebrow>El valor estratégico</SectionEyebrow>
            <h2 className="mt-6 text-balance text-[clamp(2.2rem,4.7vw,4.2rem)] font-medium leading-[1.06] tracking-[-0.055em] text-[#f7f1ea]">
              El cliente moderno no espera. Tu negocio tampoco debería.
            </h2>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
              Muchas empresas y profesionales subestiman la <i>&quot;fuga invisible&quot;</i>: ese prospecto que envió un mensaje a las 9 PM interesándose por un servicio, no recibió respuesta, y a la mañana siguiente ya cerró trato con la competencia directa que sí le atendió de inmediato.
            </p>
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-white/[0.015] p-6 transition-colors hover:bg-white/[0.03]">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-[#d8ccb2]/60">Volumen Masivo</h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/70">Atiende flujos agresivos de tráfico publicitario sin saturar el ancho de banda mental de tus recepcionistas.</p>
               </div>
               <div className="rounded-[1.5rem] border border-[rgba(255,255,255,0.06)] bg-white/[0.015] p-6 transition-colors hover:bg-white/[0.03]">
                  <h4 className="text-sm uppercase tracking-[0.2em] text-[#d8ccb2]/60">Decisión Lógica</h4>
                  <p className="mt-3 text-[15px] leading-relaxed text-white/70">Maneja a los clientes difíciles basándose puramente en instrucciones lógicas, sin sesgos emocionales ni frustraciones.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
