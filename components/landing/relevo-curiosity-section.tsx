"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionFrame } from "./boreas-landing-sections";
import {
  relevoBody,
  relevoCtaHref,
  relevoCtaLabel,
  relevoHeading,
  relevoKicker,
  relevoSubheading,
} from "@/content/boreas-home";
import { RelevoExampleCarousel } from "./relevo-example-carousel";

export function RelevoCuriositySection() {
  const reduceMotion = useReducedMotion();

  // Voz baja: this section never competes with the main CTA. Pure opacity,
  // no translate, slower than every other section — quiet by design.
  return (
    <SectionFrame id="relevo" className="border-t border-line pb-24 sm:pb-28">
      <motion.div
        className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: reduceMotion ? 0 : 1, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-16">
          <div className="flex flex-col items-start text-left">
            <p className="mb-4 text-sm font-medium text-accent">
              {relevoKicker}
            </p>
            <h2 className="text-balance text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
              {relevoHeading}
            </h2>
            <span className="mt-4 block text-lg text-clinical">
              {relevoSubheading}
            </span>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {relevoBody}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={relevoCtaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 min-w-[12rem] items-center justify-center rounded-md border border-line px-6 py-3 text-base font-semibold text-foreground transition-all duration-300 hover:border-accent hover:text-accent active:translate-y-px"
              >
                {relevoCtaLabel}
              </a>
            </div>
          </div>

          <div className="w-full">
            <RelevoExampleCarousel />
          </div>
        </div>
      </motion.div>
    </SectionFrame>
  );
}
