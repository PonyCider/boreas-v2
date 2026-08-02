"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

/**
 * Crossfade entre motores. Vive en su propio archivo porque `motors-section` ya usa
 * GSAP para el heading y la regla de V4 es no mezclar dos librerías de animación en un
 * mismo componente.
 *
 * `mode="wait"` para que el motor saliente termine antes de que entre el nuevo: los
 * motores tienen alturas muy distintas (el calendario mide 720px, el tamizaje la mitad)
 * y solaparlos produce un salto peor que la espera.
 */
export function MotorTransition({
  motorKey,
  children,
}: {
  motorKey: string;
  children: ReactNode;
}) {
  const reduceMotion = !!useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={motorKey}
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
        // Ease-out exponencial, la casa de V4: sin bounce, sin elastic.
        transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
