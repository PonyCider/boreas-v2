"use client";

import { motion } from "framer-motion";

import { playbookPhases } from "@/content/boreas-home";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

export function MechanismSectionB() {
  return (
    <div className="relative bg-transparent">
      <SectionFrame className="border-b border-[#d8ccb2]/10 py-24 sm:py-36">
        <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
          <div data-reveal className="mx-auto max-w-4xl text-center lg:mx-0 lg:max-w-[50rem] lg:text-left">
            <SectionEyebrow>Cómo responde Relevo</SectionEyebrow>
            <h2 className="mt-8 text-balance text-[clamp(2.4rem,5vw,4.5rem)] font-medium leading-[1.04] tracking-[-0.05em] text-[#f7f1ea]">
              Relevo no responde al azar.
              <br className="hidden sm:block" />
              <span className="text-white/60">Sigue una guía clara para ayudar a avanzar.</span>
            </h2>
            <p className="mt-6 max-w-3xl text-base leading-7 text-white/56 sm:text-lg lg:mx-0">
              Detrás de cada respuesta hay una secuencia pensada para entender mejor, resolver dudas
              y proponer el siguiente paso en el momento correcto.
            </p>
          </div>

          <div className="relative mt-24">
            <div className="absolute left-0 top-[20px] hidden h-[1px] w-full bg-white/10 md:block" />

            <motion.div
              initial={{ width: "0%" }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 3.2, ease: "easeInOut" }}
              className="absolute left-0 top-[19px] hidden h-[3px] rounded-full bg-gradient-to-r from-transparent via-[#d8ccb2]/90 to-transparent shadow-[0_0_15px_rgba(216,204,178,0.5)] md:block"
              style={{ transformOrigin: "left center" }}
            />

            <div className="relative z-10 grid gap-10 px-2 md:grid-cols-5 md:gap-6">
              {playbookPhases.map((node, index) => {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.4 }}
                      className="flex flex-col items-center text-center md:items-start md:text-left"
                    >
                      <div className="hidden md:flex mb-6 h-10 w-10 items-center justify-center rounded-full border-[2px] border-[#0e1114] bg-[#1a1c1e] shadow-[0_0_0_1px_rgba(255,255,255,0.15)] transition-all">
                        <div className="h-2 w-2 rounded-full bg-[#d8ccb2] shadow-[0_0_12px_rgba(216,204,178,0.9)]" />
                      </div>

                      <div className="mb-4 flex h-3 w-3 md:hidden rounded-full bg-[#d8ccb2] shadow-[0_0_10px_rgba(216,204,178,0.8)]" />

                      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#d8ccb2]/60">
                        {node.number}
                      </p>
                      <h4 className="text-[1.3rem] font-medium tracking-tight text-[#f7f1ea]">
                        {node.title}
                      </h4>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/50">
                        {node.description}
                      </p>
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
