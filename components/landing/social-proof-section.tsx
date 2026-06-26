"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { socialProof } from "@/content/boreas-home";
import { SectionFrame } from "./boreas-landing-sections";

export function SocialProofSection() {
  const reduceMotion = useReducedMotion();
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <SectionFrame id="prueba" className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        {/* Heading */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.65, ease }}
          className="text-[clamp(2rem,4.5vw,3.8rem)] font-semibold leading-tight text-foreground"
        >
          {socialProof.heading}
        </motion.h2>

        {/* Block 1: Friction rows */}
        <FrictionRows reduceMotion={reduceMotion} ease={ease} fadeUp={fadeUp} />

        {/* Block 2: Stats */}
        <StatsBlock reduceMotion={reduceMotion} ease={ease} fadeUp={fadeUp} />

        {/* Block 3: Mockup */}
        <MockupBlock reduceMotion={reduceMotion} ease={ease} fadeUp={fadeUp} />
      </div>
    </SectionFrame>
  );
}

function FrictionRows({
  reduceMotion,
  ease,
  fadeUp,
}: {
  reduceMotion: boolean | null;
  ease: [number, number, number, number];
  fadeUp: Variants;
}) {
  return (
    <div className="mt-14 grid gap-0 divide-y divide-line sm:mt-16">
      {socialProof.frictions.map((item, i) => (
        <motion.div
          key={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : i * 0.08 }}
          className="py-7 sm:py-8"
        >
          <p className="max-w-2xl text-base leading-relaxed text-clinical sm:text-lg">
            {item.body}{" "}
            <span className="font-semibold text-foreground">{item.closer}</span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function StatsBlock({
  reduceMotion,
  ease,
  fadeUp,
}: {
  reduceMotion: boolean | null;
  ease: [number, number, number, number];
  fadeUp: Variants;
}) {
  return (
    <div className="mt-16 sm:mt-20">
      <div className="grid gap-8 sm:gap-10">
        {socialProof.stats.map((stat, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : i * 0.1 }}
            className="max-w-2xl"
          >
            <p className="text-base leading-relaxed text-clinical sm:text-lg">
              {stat.connector && (
                <span className="text-muted">{stat.connector} </span>
              )}
              <span className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-semibold text-accent">
                {stat.value}
              </span>{" "}
              {stat.label}{" "}
              <span className="font-semibold text-foreground">{stat.closer}</span>
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mt-8 text-xs text-muted/70">
        {socialProof.statsSources}
      </p>
    </div>
  );
}

function MockupBlock({
  reduceMotion,
  ease,
  fadeUp,
}: {
  reduceMotion: boolean | null;
  ease: [number, number, number, number];
  fadeUp: Variants;
}) {
  const { mockupCaption, mockupDoctor } = socialProof;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ duration: 0.7, ease }}
      className="mt-16 sm:mt-20"
    >
      <p className="mb-6 text-base font-medium text-clinical sm:text-lg">
        {mockupCaption}
      </p>

      {/* Desktop: browser frame */}
      <div className="hidden overflow-hidden rounded-xl border border-line shadow-[0_24px_80px_oklch(0.06_0.018_245/0.4)] lg:block">
        {/* Browser chrome */}
        <div className="browser-frame-chrome relative flex h-10 items-center border-b border-line bg-surface px-4">
          <div className="absolute left-14 right-4 h-5 rounded-full border border-line bg-elevated px-3">
            <span className="flex h-full items-center text-[0.65rem] text-muted/60">
              boreas.com/{mockupDoctor.name.toLowerCase().replace(/\s/g, "-").replace(".", "")}
            </span>
          </div>
        </div>

        {/* Mockup content */}
        <MockupContent doctor={mockupDoctor} />
      </div>

      {/* Mobile: phone frame */}
      <div className="mx-auto max-w-xs overflow-hidden rounded-[2rem] border border-line shadow-[0_16px_60px_oklch(0.06_0.018_245/0.36)] lg:hidden">
        {/* Status bar */}
        <div className="flex h-8 items-center justify-between bg-surface px-5">
          <span className="text-[0.6rem] font-medium text-muted/60">9:41</span>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-3.5 rounded-full bg-muted/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted/40" />
          </div>
        </div>

        {/* Mockup content */}
        <MockupContent doctor={mockupDoctor} compact />
      </div>
    </motion.div>
  );
}

function MockupContent({
  doctor,
  compact = false,
}: {
  doctor: typeof socialProof.mockupDoctor;
  compact?: boolean;
}) {
  return (
    <div className="bg-[oklch(0.13_0.009_245)] p-6 sm:p-8">
      {/* Doctor header */}
      <div className={compact ? "mb-5" : "mb-6 flex items-start justify-between"}>
        <div>
          <p className={`font-semibold text-foreground ${compact ? "text-base" : "text-xl"}`}>
            {doctor.name}
          </p>
          <p className="mt-0.5 text-sm text-clinical">{doctor.specialty}</p>
        </div>
        {!compact && (
          <span className="rounded-md border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            Disponible
          </span>
        )}
      </div>

      {/* Rating */}
      <div className="mb-5 flex items-center gap-2">
        <span className="text-sm text-[oklch(0.82_0.1_95)]">
          {"★".repeat(5)}
        </span>
        <span className="text-sm font-semibold text-foreground">{doctor.rating}</span>
        <span className="text-sm text-muted">({doctor.reviewCount} reseñas)</span>
      </div>

      {/* Testimonial */}
      <div className="mb-6 rounded-lg border border-line bg-surface p-4">
        <p className="text-sm leading-relaxed text-clinical">
          &ldquo;{doctor.testimonial}&rdquo;
        </p>
        <p className="mt-2 text-xs text-muted/70">{doctor.reviewerName}</p>
      </div>

      {/* WhatsApp CTA */}
      <button
        type="button"
        className="flex w-full items-center justify-center gap-2 rounded-md bg-[oklch(0.62_0.18_145)] py-3 text-sm font-semibold text-white"
        aria-label="Agendar cita por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Agendar cita por WhatsApp
      </button>
    </div>
  );
}
