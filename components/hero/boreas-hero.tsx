"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import type { PointerEvent } from "react";
import {
  heroCredibility,
  heroHeadline,
  heroProofPoints,
  heroSubcopy,
} from "@/content/boreas-home";
import { ClinicBuilder } from "@/components/hero/clinic-builder";

export function BoreasHero() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.4 });
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.4 });
  const visualX = useTransform(smoothX, [-1, 1], reduceMotion ? [0, 0] : [-18, 18]);
  const visualY = useTransform(smoothY, [-1, 1], reduceMotion ? [0, 0] : [-12, 12]);
  const lightX = useTransform(smoothX, [-1, 1], reduceMotion ? [0, 0] : [-28, 28]);
  const lightY = useTransform(smoothY, [-1, 1], reduceMotion ? [0, 0] : [-20, 20]);

  const reveal = {
    hidden: { y: reduceMotion ? 0 : 22 },
    show: { y: 0 },
  };

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width - 0.5) * 2);
    pointerY.set(((event.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  return (
    <section
      onPointerMove={handlePointerMove}
      className="relative -mt-[84px] flex min-h-[100dvh] bg-background text-foreground"
    >
      <motion.div
        aria-hidden="true"
        style={{ x: lightX, y: lightY }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(119,168,139,0.18),transparent_32%),linear-gradient(135deg,rgba(17,25,34,0.96)_0%,rgba(10,16,23,1)_48%,rgba(8,13,19,1)_100%)]"
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgba(245,252,255,0.08),transparent)]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-[oklch(0.68_0.08_154/0.1)] blur-3xl" />

      <motion.div
        aria-hidden="true"
        style={{ x: visualX, y: visualY }}
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease }}
        className="absolute inset-y-16 right-0 hidden w-[58%] items-center lg:flex"
      >
        <ClinicBuilder />
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.18 }}
        className="relative z-10 mx-auto flex w-full max-w-[1460px] items-end px-4 pb-12 pt-36 sm:px-6 sm:pb-16 lg:px-10 lg:pb-20"
      >
        <div className="max-w-4xl">
          <motion.p
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mb-5 max-w-xl text-sm font-semibold text-[oklch(0.86_0.08_154)] sm:text-base"
          >
            {heroCredibility}
          </motion.p>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.7, ease }}
            className="text-[clamp(4.25rem,15vw,13.5rem)] font-black italic leading-[0.72] tracking-[-0.055em] text-foreground"
          >
            Boreas
          </motion.p>

          <motion.h1
            variants={reveal}
            transition={{ duration: 0.75, ease }}
            className="mt-7 max-w-4xl text-balance text-[clamp(2.15rem,5vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.04em] text-foreground"
          >
            {heroHeadline}
          </motion.h1>

          <motion.p
            variants={reveal}
            transition={{ duration: 0.7, ease }}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-clinical sm:text-xl"
          >
            {heroSubcopy}
          </motion.p>

          <motion.div
            variants={reveal}
            transition={{ duration: 0.7, ease }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              href="#contacto"
              className="hero-primary-cta inline-flex min-h-12 w-full items-center justify-center rounded-md bg-accent px-6 py-3 text-base font-semibold text-background transition-all duration-300 hover:brightness-110 active:translate-y-px sm:w-auto"
            >
              Quiero mi consultorio digital
            </a>
            <a
              href="#proceso"
              className="hero-secondary-cta inline-flex min-h-12 w-full items-center justify-center rounded-md border border-line px-6 py-3 text-base font-semibold text-clinical transition-all duration-300 hover:border-[oklch(0.68_0.08_154/0.5)] hover:text-foreground active:translate-y-px sm:w-auto"
            >
              Ver cómo funciona
            </a>
          </motion.div>

          <motion.ul
            variants={reveal}
            transition={{ duration: 0.7, ease }}
            className="mt-9 grid gap-3 text-sm text-clinical sm:grid-cols-2 lg:grid-cols-4"
          >
            {heroProofPoints.map((point, index) => (
              <li
                key={point}
                className="border-t border-line pt-3"
                style={{ transitionDelay: `${index * 70}ms` }}
              >
                {point}
              </li>
            ))}
          </motion.ul>

          <motion.div
            aria-hidden="true"
            variants={reveal}
            transition={{ duration: 0.8, ease }}
            className="relative mt-10 aspect-[4/3] w-full lg:hidden"
          >
            <ClinicBuilder />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
