"use client";

import { useReducedMotion } from "motion/react";
import { SectionFrame } from "./landing-sections";
import SplitText from "./split-text";
import { AgendaCalMotor } from "./motors/agenda-cal";
import { sectionIds } from "@/content/site";
import { motorsHeading, motorsPrivacyNote, specialties } from "@/content/motors";

/**
 * Los chips son etiquetas, no tabs: hoy solo un motor está vivo. Cuando haya dos o
 * más se convierten en un tablist real (role=tab + navegación con flechas).
 */
function SpecialtyChips() {
  return (
    <ul className="mt-10 flex flex-wrap gap-2">
      {specialties.map((specialty) => {
        const live = specialty.status === "live";
        return (
          <li key={specialty.id}>
            <span
              aria-current={live ? "true" : undefined}
              className={`inline-flex items-baseline gap-2 rounded-[999px] border px-4 py-2 text-sm ${
                live
                  ? "border-accent bg-accent-soft text-foreground"
                  : "border-line text-clinical"
              }`}
            >
              {specialty.label}
              <span className="text-xs text-clinical">
                {live ? specialty.motor : "Pronto"}
              </span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

export function MotorsSection() {
  const reducedMotion = !!useReducedMotion();

  return (
    <SectionFrame id={sectionIds.motores} theme="dark" className="border-t border-line bg-background">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{motorsHeading.eyebrow}</p>

        {reducedMotion ? (
          <h2 className="mt-4 max-w-3xl text-left text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
            {motorsHeading.heading}
          </h2>
        ) : (
          <SplitText
            text={motorsHeading.heading}
            tag="h2"
            splitType="words"
            textAlign="left"
            className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
          />
        )}

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">{motorsHeading.body}</p>

        <SpecialtyChips />

        <AgendaCalMotor />

        <p className="mt-6 text-xs text-clinical">{motorsPrivacyNote}</p>
      </div>
    </SectionFrame>
  );
}
