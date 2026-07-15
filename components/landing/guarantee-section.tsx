"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionFrame } from "./boreas-landing-sections";
import { guarantees } from "@/content/boreas-home";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function GuaranteeSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionFrame id="garantia" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h2 className="text-balance text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
              La certeza viene de lo que ya tienes.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              Boreas usa tus reseñas, tu reputación y tus tratamientos prioritarios para construir una decisión más fácil.
            </p>
          </motion.div>

          <div className="border-t border-line">
            {guarantees.map((guarantee, index) => {
              // Rows settle in from alternating sides — certainty converging.
              const fromX = reduceMotion ? 0 : index % 2 === 0 ? -18 : 18;
              return (
                <motion.div
                  key={guarantee.title}
                  initial={{ opacity: 0, x: fromX }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, ease: EASE, delay: reduceMotion ? 0 : index * 0.12 }}
                  className="grid gap-4 border-b border-line py-7 sm:grid-cols-[0.36fr_0.64fr]"
                >
                  <h3 className="text-lg font-semibold text-foreground">
                    {guarantee.title}
                  </h3>
                  <p className="text-base leading-relaxed text-muted">
                    {guarantee.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
