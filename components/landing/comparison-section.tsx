"use client";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

const manualFlow = [
  "Notificación ignorada por horas",
  "Respuestas manuales e intermitentes",
  "El cliente pierde interés y cotiza en otro lado",
  "0% de Cierre, tiempo y dinero desperdiciado",
];

const boreasFlow = [
  "Respuesta instantánea (menos de 1 minuto)",
  "Calificación inteligente de la intención",
  "Aclaración de dudas y propuesta de opciones",
  "100% Atención, paciente o prospecto capturado",
];

export function ComparisonSection() {
  return (
    <SectionFrame>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mx-auto max-w-3xl text-center">
          <SectionEyebrow>El problema real</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            El verdadero costo de responder tarde.
          </h2>
          <p className="mt-6 text-lg text-white/50">
            Cada vez que un lead espera respuesta, la intención de compra se erosiona y tu CAC aumenta.
          </p>
        </div>

        <div data-reveal className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Manual Flow */}
          <div className="relative flex flex-col rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#1a1111]/80 to-[#0e1114] p-8 sm:p-12">
            <div className="absolute top-0 right-0 h-48 w-48 -translate-y-12 translate-x-12 rounded-full bg-red-500/5 blur-[80px] pointer-events-none" />
            <h3 className="text-xl font-medium tracking-tight text-white/40">El ciclo habitual (Manual)</h3>
            <div className="relative z-10 mt-10 flex flex-col gap-6">
              {manualFlow.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/[0.08] text-xs font-bold text-red-500/40">
                    ✕
                  </div>
                  <p className="text-base text-white/40">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Boreas Flow */}
          <div className="relative flex flex-col rounded-[2rem] border border-[#d8ccb2]/20 bg-gradient-to-b from-[#1a1814]/90 to-[#0e1114] p-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_24px_80px_rgba(0,0,0,0.12)] sm:p-12 backdrop-blur-md">
            <div className="absolute top-0 right-0 h-56 w-56 -translate-y-12 translate-x-12 rounded-full bg-[#d8ccb2]/10 blur-[90px] pointer-events-none" />
            <h3 className="relative z-10 text-xl font-medium tracking-tight text-[#d8ccb2]">El ciclo Boreas</h3>
            <div className="relative z-10 mt-10 flex flex-col gap-6">
              {boreasFlow.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d8ccb2]/10 text-xs font-bold text-[#d8ccb2] shadow-[0_0_12px_rgba(216,204,178,0.2)]">
                    ✓
                  </div>
                  <p className="text-base text-[#f7f1ea]">{step}</p>
                </div>
              ))}
            </div>
            
            <div className="relative z-10 mt-10 pt-8 border-t border-white/5">
               <a href="mailto:hola@boreas.ai" className="inline-flex w-max items-center text-sm font-medium text-[#d8ccb2] hover:text-white transition-colors">
                  Descubre la diferencia
                  <span className="ml-2">→</span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
