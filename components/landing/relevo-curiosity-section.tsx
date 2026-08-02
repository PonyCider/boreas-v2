"use client";

import { motion, useReducedMotion } from "framer-motion";
import { relevoContent } from "@/content/relevo";
import { RelevoExampleCarousel } from "./relevo-example-carousel";
import { RelevoFlowVisual } from "./relevo-flow-visual";
import Particles from "@/components/ui/particles";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import SpecularButton from "./specular-button";

export function RelevoCuriositySection() {
  const reduceMotion = useReducedMotion();

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
          <div className="mb-5">
            <AnimatedShinyText className="border-accent/30 bg-surface/80 text-foreground">
              {relevoContent.eyebrow}
            </AnimatedShinyText>
          </div>

          <h2 className="max-w-[1280px] text-balance font-display text-[clamp(2rem,4.5vw,3.8rem)] font-normal leading-[1.12] tracking-[-0.010em]">
            <span className="bg-gradient-to-r from-foreground via-foreground to-accent bg-clip-text text-transparent">
              {relevoContent.heading}
            </span>
          </h2>

          <p className="mt-4 text-lg font-medium text-clinical sm:text-xl">
            {relevoContent.subheading}
          </p>

          <p className="mt-6 max-w-6xl text-base leading-relaxed text-muted sm:text-lg">
            {relevoContent.body}
          </p>

          <div className="mt-8">
            <a
              href={relevoContent.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <SpecularButton
                size="md"
                lineColor="var(--accent)"
                baseColor="var(--c-surface)"
                intensity={1.8}
                shineSize={1.2}
                autoAnimate={true}
                followMouse={true}
                className="font-semibold"
              >
                <span className="flex items-center gap-2.5">
                  {relevoContent.ctaLabel}
                  <svg
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2.2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M17 7H8m9 0v9" />
                  </svg>
                </span>
              </SpecularButton>
            </a>
          </div>
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

