"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { SectionFrame } from "./landing-sections";
import SplitText from "./split-text";
import OptionWheel from "@/components/ui/option-wheel";
import { AgendaCalMotor } from "./motors/agenda-cal";
import { CalculadoraMetabolicaMotor } from "./motors/calculadora-metabolica";
import { EvaluadorDolorMotor } from "./motors/evaluador-dolor";
import { MotorTransition } from "./motors/motor-transition";
import { PreTriageMotor } from "./motors/pre-triage";
import { SimuladorSonrisaMotor } from "./motors/simulador-sonrisa";
import { TamizajeGad7Motor } from "./motors/tamizaje-gad7";
import { sectionIds } from "@/content/site";
import {
  motorsHeading,
  motorsPrivacyNote,
  specialties,
  type SpecialtyId,
} from "@/content/motors";

const wheelItems = specialties.map((specialty) => specialty.label);

const MOTORES: Record<SpecialtyId, () => React.JSX.Element> = {
  todas: AgendaCalMotor,
  "salud-mental": TamizajeGad7Motor,
  nutricion: CalculadoraMetabolicaMotor,
  fisioterapia: EvaluadorDolorMotor,
  "medicina-general": PreTriageMotor,
  dental: SimuladorSonrisaMotor,
};

export function MotorsSection() {
  const reducedMotion = !!useReducedMotion();
  const [activeId, setActiveId] = useState<SpecialtyId>(specialties[0].id);
  const ActiveMotor = MOTORES[activeId];

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

        <div className="mt-12 grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-12">
          {/* La rueda necesita `inset` para que la curva quepa: con valores chicos los
              ítems de los extremos se salen del contenedor y `overflow: hidden` los corta. */}
          <div className="h-[320px] lg:h-[440px]">
            <OptionWheel
              items={wheelItems}
              defaultSelected={0}
              onChange={(index) => setActiveId(specialties[index].id)}
              textColor="var(--ink-muted)"
              activeColor="var(--ink)"
              side="left"
              fontSize={2}
              spacing={1.4}
              inset={64}
              // Sin animación de inercia cuando el sistema pide movimiento reducido.
              smoothing={reducedMotion ? 0 : 200}
            />
          </div>

          <div className="min-w-0">
            {/* El motor va montado uno a la vez: cambiar de especialidad desmonta el
                anterior y su estado se reinicia solo. */}
            <MotorTransition motorKey={activeId}>
              <ActiveMotor />
            </MotorTransition>
          </div>
        </div>

        <p className="mt-6 text-xs text-clinical">{motorsPrivacyNote}</p>
      </div>
    </SectionFrame>
  );
}
