"use client";

import { motion, useReducedMotion } from "framer-motion";
import { relevoContent } from "@/content/relevo";
import { RelevoExampleCarousel } from "./relevo-example-carousel";
import { RelevoFlowVisual } from "./relevo-flow-visual";
import Particles from "@/components/ui/particles";

export function RelevoCuriositySection() {
  const reduceMotion = useReducedMotion();
  const headingAccent = "Relevo responde por ti.";
  const headingLead = relevoContent.heading.replace(headingAccent, "").trim();
  const revealTransition = {
    duration: reduceMotion ? 0 : 0.72,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <motion.div
      className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10 overflow-hidden py-4"
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: reduceMotion ? 0 : 0.9, ease: "easeOut" }}
    >
      {/* Fondo de Partículas Visibles de IA */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-75">
        <Particles
          particleColors={["#E27F62", "#4FB39A", "#D4AF37", "#A8A192"]}
          particleCount={220}
          particleSpread={12}
          speed={0.2}
          particleBaseSize={130}
          moveParticlesOnHover={true}
          alphaParticles={true}
        />
      </div>

      <div>
        <div className="flex max-w-[1320px] flex-col items-start text-left">
          <motion.div
            className="mb-5"
            initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={revealTransition}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent-soft px-3.5 py-1.5 text-[12px] font-semibold text-foreground shadow-[0_8px_24px_rgba(80,48,37,0.08)]">
              <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_0_4px_var(--accent-soft)]" aria-hidden="true" />
              {relevoContent.eyebrow}
            </span>
          </motion.div>

          <motion.h2
            className="max-w-[1280px] text-balance font-display text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-[1.08] tracking-[-0.025em] text-foreground"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 30, filter: "blur(12px)", clipPath: "inset(0 0 55% 0)" }
            }
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.08 }}
          >
            {headingLead}{" "}
            <span className="text-accent">
              {headingAccent}
            </span>
          </motion.h2>

          <motion.p
            className="mt-4 text-lg font-medium text-clinical sm:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.18 }}
          >
            {relevoContent.subheading}
          </motion.p>

          <motion.p
            className="mt-5 max-w-6xl text-base leading-relaxed text-muted sm:text-lg"
            initial={reduceMotion ? false : { opacity: 0, y: 20, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.27 }}
          >
            {relevoContent.body}
          </motion.p>

          <motion.div
            className="mt-8"
            initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...revealTransition, delay: reduceMotion ? 0 : 0.36 }}
          >
            <motion.a
              href={relevoContent.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-[#F5F1E8] shadow-[0_12px_30px_rgba(35,30,26,0.2)] outline-none transition-[background-color,box-shadow] duration-300 hover:bg-accent hover:shadow-[0_16px_36px_rgba(140,65,45,0.24)] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              style={{ color: "#F5F1E8" }}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            >
              <span className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" aria-hidden="true" />
              <span>{relevoContent.ctaLabel}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true">
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H8m9 0v9" />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </div>

        {/* Visual de Flujo con Orbs e Interacción de Línea Continua */}
        <RelevoFlowVisual />

        {/* Carrusel Interactivo de Ejemplos con Física 3D Tilt */}
        <div className="mt-12 w-full min-w-0 lg:mt-16">
          <RelevoExampleCarousel />
        </div>
      </div>
    </motion.div>
  );
}
