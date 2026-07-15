"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { faqs } from "@/content/boreas-home";
import { SectionFrame } from "./boreas-landing-sections";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Deliberately the calmest section: FAQ is read, not performed. A quick,
// low-amplitude stagger — restraint is the point here, not a technique.
const grid: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

export function FaqSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionFrame id="faq">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <motion.div
          className="mb-14 lg:max-w-[48rem]"
          initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <h2 className="text-balance text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
            Lo importante está claro desde el inicio.
          </h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={reduceMotion ? undefined : grid}
          className="grid gap-x-12 gap-y-8 border-t border-line pt-8 md:grid-cols-2"
        >
          {faqs.map((faq) => (
            <motion.article key={faq.question} variants={reduceMotion ? undefined : item} className="border-b border-line pb-8">
              <h3 className="text-lg font-semibold text-foreground">
                {faq.question}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {faq.answer}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </SectionFrame>
  );
}
