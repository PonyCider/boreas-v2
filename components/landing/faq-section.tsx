"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { faqs } from "@/content/boreas-home";

import { SectionEyebrow, SectionFrame } from "./boreas-landing-sections";

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
        <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
          <div data-reveal className="mb-14 text-center lg:max-w-[48rem] lg:text-left">
            <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-6 text-balance text-[clamp(2.1rem,4.6vw,4rem)] font-medium leading-[1.06] tracking-[-0.052em] text-[#f7f1ea]">
            Lo importante está claro desde el inicio.
          </h2>
        </div>

        <div data-reveal className="mx-auto flex w-full max-w-[52rem] flex-col gap-4 lg:mr-0 lg:ml-auto">
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
