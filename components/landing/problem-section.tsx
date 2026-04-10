"use client";

import { motion } from "framer-motion";
import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

interface ChatBubbleProps {
  text: string;
  time: string;
  delay: number;
  opacity: number;
  yOffset: number;
  scale: number;
}

function GhostChatBubble({ text, time, delay, opacity, yOffset, scale }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset + 20, scale: scale * 0.95 }}
      whileInView={{ opacity, y: yOffset, scale }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative ml-auto flex w-max max-w-[85%] flex-col rounded-2xl rounded-tr-sm bg-white/[0.04] px-5 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/[0.05] backdrop-blur-md"
    >
      <p className="text-[15px] leading-snug text-white/90">{text}</p>
      <span className="mt-1.5 text-[11px] font-medium text-white/40 text-right">{time}</span>
    </motion.div>
  );
}

export function ProblemSection() {
  return (
    <SectionFrame className="pt-32 sm:pt-40">
      <div
        data-parallax
        data-depth="14"
        className="pointer-events-none absolute left-[20%] top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(216,204,178,0.08),transparent_70%)] blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div data-reveal className="max-w-2xl px-2">
            <SectionEyebrow>El Problema</SectionEyebrow>
            <h2 className="mt-8 text-balance text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.05em] text-[#f7f1ea]">
              Tu agenda no está vacía por falta de clientes.
            </h2>
            <div className="mt-8 flex items-center gap-4 pl-6 relative">
              <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500/30 to-transparent" />
              <p className="text-xl leading-relaxed text-white/50">
                Está vacía porque los clientes llegan,<br className="hidden sm:block" />
                <span className="text-white/80">preguntan y mueren esperando.</span>
              </p>
            </div>
          </div>

          <div className="relative flex min-h-[300px] flex-col justify-center gap-4 py-8 pl-4 sm:pl-10 lg:pl-0">
             <div className="absolute inset-0 bg-gradient-to-t from-[#0e1114] via-transparent to-transparent z-10 pointer-events-none h-full w-full" />
             <div className="flex flex-col gap-5 pr-8">
               <GhostChatBubble 
                 text="Hola, ¿tienen disponibilidad para mañana?" 
                 time="Hace 4 horas" 
                 delay={0.1} opacity={0.65} yOffset={-10} scale={1}
               />
               <GhostChatBubble 
                 text="Buenas tardes, quisiera cotizar el servicio por favor." 
                 time="Ayer" 
                 delay={0.3} opacity={0.35} yOffset={-5} scale={0.96}
               />
               <GhostChatBubble 
                 text="Dejen, ya reservé en otro lado. Gracias igual." 
                 time="Visto" 
                 delay={0.5} opacity={0.15} yOffset={0} scale={0.92}
               />
             </div>
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
