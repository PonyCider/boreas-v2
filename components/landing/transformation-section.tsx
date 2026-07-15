"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SectionFrame } from "./boreas-landing-sections";
import { transformationHeading, transformationSubcopy, transformations } from "@/content/boreas-home";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const rowsContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// Each row reveals in two beats: label first, then the benefit right after.
const rowVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const labelVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

const benefitVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function TransformationSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionFrame id="transformacion" className="border-t border-line">
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
              {transformationHeading}
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {transformationSubcopy}
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={reduceMotion ? undefined : rowsContainer}
            className="flex flex-col border-t border-line"
          >
            {transformations.map((item, index) => (
              <motion.div
                key={index}
                variants={reduceMotion ? undefined : rowVariants}
                className="grid gap-5 border-b border-line py-7 sm:grid-cols-[0.36fr_0.64fr]"
              >
                <motion.span variants={reduceMotion ? undefined : labelVariants} className="text-sm font-medium text-muted">
                  {item.label}
                </motion.span>
                <motion.p variants={reduceMotion ? undefined : benefitVariants} className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  {item.benefit}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </SectionFrame>
  );
}
