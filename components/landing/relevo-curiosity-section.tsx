"use client";

import { motion, useReducedMotion } from "framer-motion";
import { relevoContent } from "@/content/relevo";
import { RelevoExampleCarousel } from "./relevo-example-carousel";
import { RelevoFlowVisual } from "./relevo-flow-visual";

export function RelevoCuriositySection() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10"
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
    >
      <div>
        <div className="flex max-w-[1320px] flex-col items-start text-left">
          <p className="mb-4 text-sm font-medium text-accent">
            {relevoContent.eyebrow}
          </p>
          <h2 className="max-w-[1280px] text-balance font-display text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
            {relevoContent.heading}
          </h2>
          <p className="mt-4 text-lg text-clinical">
            {relevoContent.subheading}
          </p>
          <p className="mt-6 max-w-6xl text-base leading-relaxed text-muted sm:text-lg">
            {relevoContent.body}
          </p>

          <a
            href={relevoContent.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex min-h-12 min-w-48 items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-border px-6 py-3 text-base font-semibold text-foreground transition-[border-color,color,transform] duration-300 hover:border-accent hover:text-accent active:translate-y-px"
          >
            {relevoContent.ctaLabel}
            <svg
              className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H8m9 0v9" />
            </svg>
          </a>
        </div>

        <RelevoFlowVisual />

        <div className="mt-12 w-full min-w-0 lg:mt-16">
          <RelevoExampleCarousel />
        </div>
      </div>
    </motion.div>
  );
}
