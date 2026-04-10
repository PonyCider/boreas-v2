"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

const faqs = [
  {
    question: "¿En qué canales funciona Boreas?",
    answer: "Principalmente en WhatsApp e Instagram, que son los canales de mayor intención y comunicación directa. Boreas interviene sin entorpecer el flujo humano, de tal forma que tú o tu equipo siempre pueden visualizar la conversación y tomar el control si lo desean."
  },
  {
    question: "¿Se conecta con mi sistema de agenda, CRM o historia clïnica?",
    answer: "Traspasa de forma nativa los datos acordados y puede sincronizarse con las agendas más modernas del mercado. Nos aseguramos de mantener un mapeo bidireccional para que en tu calendario humano nunca haya choques ni sobreocupación."
  },
  {
    question: "¿Suena a bot robotizado o con menús inflexibles?",
    answer: "Absolutamente no. Está entrenado para entender el contexto humano, interpretar notas de voz, empatizar con objeciones y responder con fluidez conversacional idéntica a la del mejor ejecutivo de cuenta de tu negocio."
  },
  {
    question: "¿Boreas está diseñado para empresas Enterprise o sirve para Pymes?",
    answer: "Es apto para cualquier negocio (Clínicas, Consultorios, Corredores inmobiliarios, Pymes, Agencias) que pierda ingresos, clientes o reservas debido a la demora natural de un equipo humano que no puede responder 24/7."
  },
  {
    question: "¿Qué pasa si un cliente tiene un problema muy complejo y requiere un humano?",
    answer: "Boreas identifica automáticamente los límites de su alcance y el estado emocional del cliente. Captura todo el contexto, lo unifica en un perfil y notifica a tu equipo silenciosamente para que un humano experto lo retome sin interrupciones."
  }
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        ScrollTrigger.refresh();
      }
    }, 400);
  };

  return (
    <SectionFrame>
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
        <div data-reveal className="mb-14 text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            Transparencia total.
          </h2>
        </div>

        <div data-reveal className="mx-auto flex w-full flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`overflow-hidden rounded-2xl border transition-colors duration-500 ${isOpen ? 'border-[#d8ccb2]/10 bg-white/[0.03]' : 'border-white/5 bg-white/[0.015] hover:bg-white/[0.025]'}`}
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(index)}
                  className="flex w-full items-center justify-between px-6 py-6 text-left"
                >
                  <span className={`text-[1.1rem] tracking-tight transition-colors duration-300 ${isOpen ? 'font-medium text-[#d8ccb2]' : 'text-white/80'}`}>
                    {faq.question}
                  </span>
                  <span className={`ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${isOpen ? 'border-[#d8ccb2]/30 text-[#d8ccb2]' : 'border-white/10 text-white/40'}`}>
                    <motion.div
                       animate={{ rotate: isOpen ? 45 : 0 }}
                       transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      +
                    </motion.div>
                  </span>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="px-6 pb-6 pr-12">
                        <p className="text-base leading-relaxed text-white/50">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </SectionFrame>
  );
}
