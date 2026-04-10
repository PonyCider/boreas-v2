"use client";

import { motion } from "framer-motion";
import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

const nodes = [
  { step: "Responde", desc: "Contesta al instante usando el tono exacto de tu negocio." },
  { step: "Califica", desc: "Hace las preguntas clave para saber si es un prospecto real." },
  { step: "Sigue", desc: "Retoma a los que te dejaron en visto, sin parecer desesperado." },
  { step: "Cierra", desc: "Agenda la cita directo en tu calendario sin que tú muevas un dedo." },
];

export function MechanismSectionB() {
  return (
    <div className="relative bg-transparent">
       <SectionFrame className="py-24 sm:py-36 border-b border-[#d8ccb2]/10">
         <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
           <div data-reveal className="mx-auto max-w-4xl text-center">
             <SectionEyebrow>Mecanismo</SectionEyebrow>
             <h2 className="mt-8 text-balance text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.05em] text-[#f7f1ea]">
                No necesitas más mensajes,<br className="hidden sm:block"/>
                <span className="text-white/60">necesitas quien los responda.</span>
             </h2>
           </div>

           <div className="relative mt-24">
             {/* Progress Track Background Desktop */}
             <div className="absolute left-0 top-[20px] hidden h-[1px] w-full bg-white/10 md:block" />
             
             {/* Animated Progress Line */}
             <motion.div 
               initial={{ width: "0%" }}
               whileInView={{ width: "100%" }}
               viewport={{ once: true, margin: "-100px" }}
               transition={{ duration: 3.2, ease: "easeInOut" }}
               className="absolute left-0 top-[19px] hidden h-[3px] bg-gradient-to-r from-transparent via-[#d8ccb2]/90 to-transparent md:block shadow-[0_0_15px_rgba(216,204,178,0.5)] rounded-full" 
               style={{ transformOrigin: "left center" }}
             />

             <div className="relative z-10 grid gap-10 md:grid-cols-4 md:gap-6 px-2">
                {nodes.map((node, index) => {
                  return (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.4 + (index * 0.6) }} /* Synchronize with the slower line sweep */
                      className="flex flex-col items-center text-center md:items-start md:text-left"
                    >
                      {/* Node Dot Desktop */}
                      <div className="hidden md:flex mb-6 h-10 w-10 items-center justify-center rounded-full border-[2px] border-[#0e1114] bg-[#1a1c1e] shadow-[0_0_0_1px_rgba(255,255,255,0.15)] transition-all">
                        <div className="h-2 w-2 rounded-full bg-[#d8ccb2] shadow-[0_0_12px_rgba(216,204,178,0.9)]" />
                      </div>
                      
                      {/* Node Dot Mobile */}
                      <div className="mb-4 flex h-3 w-3 md:hidden rounded-full bg-[#d8ccb2] shadow-[0_0_10px_rgba(216,204,178,0.8)]" />

                      <p className="text-xs uppercase tracking-widest text-[#d8ccb2]/60 font-semibold mb-2">0{index + 1}</p>
                      <h4 className="text-[1.3rem] font-medium tracking-tight text-[#f7f1ea]">{node.step}</h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/50">{node.desc}</p>
                    </motion.div>
                  );
                })}
             </div>
           </div>
         </div>
       </SectionFrame>
    </div>
  );
}
