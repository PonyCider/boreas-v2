"use client";

import { motion, useReducedMotion } from "framer-motion";
import { SectionFrame } from "./boreas-landing-sections";
import { processSteps } from "@/content/boreas-home";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const STEP_DURATION = 0.5;
// Steps chain: each one waits for roughly the previous to finish before starting.
const STEP_GAP = 0.42;

const stepStyles = [
  {
    bg: "rgba(210,103,74,.12)",
    color: "var(--accent)",
    badgeBg: "rgba(210,103,74,.10)",
    badgeColor: "var(--accent)",
    badgeBorder: "rgba(210,103,74,.20)",
  },
  {
    bg: "rgba(79,179,154,.12)",
    color: "#2a8068",
    badgeBg: "rgba(79,179,154,.10)",
    badgeColor: "#2a8068",
    badgeBorder: "rgba(79,179,154,.20)",
  },
  {
    bg: "rgba(226,163,60,.12)",
    color: "#8a6010",
    badgeBg: "rgba(226,163,60,.10)",
    badgeColor: "#8a6010",
    badgeBorder: "rgba(226,163,60,.20)",
  },
];

export function ProcessSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionFrame id="proceso" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div
            className="max-w-md"
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h2
              className="leading-tight text-foreground"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
                letterSpacing: "-0.010em",
                lineHeight: 1.12,
              }}
            >
              Tu esfuerzo se reduce a un audio.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              La velocidad de entrega funciona porque el proceso evita formularios largos, juntas innecesarias y textos escritos por el médico.
            </p>

            {/* Badges */}
            <div className="mt-8 flex flex-col gap-2">
              {processSteps.map((step, i) => (
                <span
                  key={step.badge}
                  className="inline-flex w-fit items-center rounded-[var(--radius-pill)] px-3 py-1.5 text-xs font-medium"
                  style={{
                    background: stepStyles[i].badgeBg,
                    color: stepStyles[i].badgeColor,
                    border: `1px solid ${stepStyles[i].badgeBorder}`,
                  }}
                >
                  {step.badge}
                </span>
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--border)" }}>
            {processSteps.map((step, index) => {
              const baseDelay = reduceMotion ? 0 : index * STEP_GAP;
              return (
                <div
                  key={index}
                  className="grid gap-5 py-7 sm:grid-cols-[44px_1fr]"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  {/* Step marker — pops in first */}
                  <motion.div
                    initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.75 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.35, ease: EASE, delay: baseDelay }}
                    className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] font-mono text-sm font-bold shrink-0"
                    style={{
                      background: stepStyles[index].bg,
                      color: stepStyles[index].color,
                    }}
                  >
                    0{index + 1}
                  </motion.div>

                  {/* Text follows right after the marker settles */}
                  <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: STEP_DURATION, ease: EASE, delay: baseDelay + (reduceMotion ? 0 : 0.15) }}
                    className="pt-1"
                  >
                    <h3 className="text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
