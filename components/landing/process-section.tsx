"use client";

import { SectionFrame } from "./boreas-landing-sections";
import { processSteps } from "@/content/boreas-home";

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
  return (
    <SectionFrame id="proceso" className="border-t border-line">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div className="max-w-md">
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
          </div>

          <div className="flex flex-col" style={{ borderTop: "1px solid var(--border)" }}>
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="grid gap-5 py-7 sm:grid-cols-[44px_1fr]"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* Step marker */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-sm)] font-mono text-sm font-bold shrink-0"
                  style={{
                    background: stepStyles[index].bg,
                    color: stepStyles[index].color,
                  }}
                >
                  0{index + 1}
                </div>

                <div className="pt-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
