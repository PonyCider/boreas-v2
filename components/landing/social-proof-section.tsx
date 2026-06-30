"use client";

import { useState, useRef, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useInView,
  useMotionValue,
  useTransform,
  animate as fmAnimate,
  type Variants,
} from "framer-motion";
import { socialProof } from "@/content/boreas-home";
import { SectionFrame } from "./boreas-landing-sections";

// Decorative timestamps — purely visual chrome, aria-hidden
const FRICTION_TIMES = ["11:47 pm", "8:30 am", "3:15 pm"] as const;
const APPOINTMENT_SLOTS = ["10:00", "11:30", "14:00"] as const;

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── Counter hook ─────────────────────────────────────────────────────────────

function useCounter(target: number, reduceMotion: boolean | null) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(reduceMotion ? target : 0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (reduceMotion) {
      count.set(target);
      return;
    }
    if (!inView) return;
    const ctrl = fmAnimate(count, target, {
      duration: 1.5,
      ease: EASE_EXPO,
    });
    return ctrl.stop;
  }, [inView, reduceMotion, target, count]);

  return { ref, rounded };
}

// ─── Animated percent stat value ───────────────────────────────────────────────

function AnimatedPercent({
  num,
  suffix,
  reduceMotion,
}: {
  num: number;
  suffix: string;
  reduceMotion: boolean | null;
}) {
  const { ref, rounded } = useCounter(num, reduceMotion);
  return (
    <span ref={ref}>
      <motion.span className="tabular-nums">{rounded}</motion.span>
      {suffix}
    </span>
  );
}

// ─── Variants ─────────────────────────────────────────────────────────────────

const chipVariants: Variants = {
  hidden: { scale: 0.72, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: EASE_QUINT },
  },
};

const textVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_QUINT },
  },
};

const rowContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// ─── Root section ─────────────────────────────────────────────────────────────

export function SocialProofSection() {
  const reduceMotion = useReducedMotion();
  const ease = EASE_QUINT;

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <SectionFrame id="prueba" className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">

        {/* Full-width heading */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          transition={{ duration: 0.65, ease }}
          className="text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-tight text-foreground [text-wrap:balance]"
        >
          {socialProof.heading}
        </motion.h2>

        {/* 2-col grid: scroll left / sticky right */}
        <div className="mt-16 sm:mt-20 lg:grid lg:grid-cols-[1fr_minmax(0,500px)] lg:items-start lg:gap-20 xl:gap-28">

          {/* LEFT: frictions then stats */}
          <div>
            <FrictionRows reduceMotion={reduceMotion} />
            <StatsBlock reduceMotion={reduceMotion} ease={ease} fadeUp={fadeUp} />
          </div>

          {/* RIGHT: sticky mockup */}
          <div className="mt-16 lg:sticky lg:top-10 lg:mt-0">
            <MockupBlock reduceMotion={reduceMotion} ease={ease} />
          </div>

        </div>
      </div>
    </SectionFrame>
  );
}

// ─── Friction rows ─────────────────────────────────────────────────────────────

function FrictionRows({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <div className="space-y-12 sm:space-y-14">
      {socialProof.frictions.map((item, i) => (
        <motion.div
          key={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          variants={rowContainerVariants}
          transition={{ delay: reduceMotion ? 0 : i * 0.12 }}
        >
          {/* Decorative time chip — pops in first */}
          <motion.div
            aria-hidden="true"
            variants={chipVariants}
            className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-accent/20 bg-accent/8 px-2.5 py-1"
          >
            <span className="h-1 w-1 rounded-full bg-accent/50" />
            <span className="font-mono text-[0.6rem] tracking-wider text-accent/60">
              {FRICTION_TIMES[i]}
            </span>
          </motion.div>

          {/* Body slides up after chip */}
          <motion.p
            variants={textVariants}
            className="text-lg leading-relaxed text-clinical sm:text-xl [text-wrap:pretty]"
          >
            {item.body}
          </motion.p>

          <motion.p
            variants={textVariants}
            className="mt-3 text-lg font-semibold text-foreground sm:text-xl"
          >
            {item.closer}
          </motion.p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── Stats block ───────────────────────────────────────────────────────────────

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
    <div className="mt-20 sm:mt-24">
      <div className="space-y-14 sm:space-y-16">
        {socialProof.stats.map((stat, i) => (
          <motion.div
            key={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            transition={{ duration: 0.6, ease, delay: reduceMotion ? 0 : i * 0.1 }}
          >
            {stat.connector && (
              <p className="mb-3 text-sm leading-snug text-muted/70">
                {stat.connector}
              </p>
            )}

            {/* Value — counter for %, plain for text */}
            <p className="text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-none tracking-tight text-accent">
              {(() => {
                const match = stat.value.match(/^(\d+)(%|×)?(.*)$/);
                if (match && !match[3] && match[1] && !reduceMotion) {
                  return (
                    <AnimatedPercent
                      num={parseInt(match[1])}
                      suffix={match[2] ?? ""}
                      reduceMotion={reduceMotion}
                    />
                  );
                }
                return stat.value;
              })()}
            </p>

            <p className="mt-4 max-w-sm text-base leading-relaxed text-clinical sm:text-lg [text-wrap:pretty]">
              {stat.label}
            </p>
            <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
              {stat.closer}
            </p>
          </motion.div>
        ))}
      </div>

      <p className="mt-14 text-[0.68rem] tracking-wide text-muted/80">
        {socialProof.statsSources}
      </p>
    </div>
  );
}

// ─── Mockup block ──────────────────────────────────────────────────────────────

function MockupBlock({
  reduceMotion,
  ease,
}: {
  reduceMotion: boolean | null;
  ease: [number, number, number, number];
}) {
  const { mockupCaption, mockupDoctor } = socialProof;
  const urlSlug = mockupDoctor.name.toLowerCase().replace(/\s/g, "-").replace(".", "");

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease }}
    >
      <p className="mb-6 text-sm font-medium text-clinical sm:text-base">
        {mockupCaption}
      </p>

      {/* Desktop: browser frame */}
      <div className="hidden overflow-hidden rounded-2xl border border-line shadow-[0_32px_100px_oklch(0.06_0.018_245/0.5)] lg:block">
        <div className="browser-frame-chrome relative flex h-10 items-center border-b border-line bg-surface">
          <div className="absolute left-16 right-4 h-6 rounded-full border border-line bg-elevated/60">
            <span className="flex h-full items-center px-3 text-[0.65rem] text-muted/50">
              boreas.com/{urlSlug}
            </span>
          </div>
        </div>
        <MockupContent doctor={mockupDoctor} />
      </div>

      {/* Mobile: phone frame */}
      <div className="mx-auto max-w-sm overflow-hidden rounded-[2.5rem] border border-line shadow-[0_20px_70px_oklch(0.06_0.018_245/0.4)] lg:hidden">
        <div className="flex h-8 items-center justify-between bg-surface px-6">
          <span className="text-[0.6rem] font-medium text-muted/50">9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-4 rounded-full bg-muted/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted/30" />
          </div>
        </div>
        <MockupContent doctor={mockupDoctor} compact />
      </div>
    </motion.div>
  );
}

// ─── Mockup content (inside frame) ────────────────────────────────────────────

function MockupContent({
  doctor,
  compact = false,
}: {
  doctor: typeof socialProof.mockupDoctor;
  compact?: boolean;
}) {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleSlotClick = (slot: string) => {
    if (selectedSlot) return;
    setSelectedSlot(slot);
    setTimeout(() => setShowToast(true), 280);
    setTimeout(() => {
      setSelectedSlot(null);
      setShowToast(false);
    }, 2800);
  };

  return (
    <div className="bg-void">
      {/* Mini site nav */}
      <div className="flex items-center justify-between border-b border-line/40 px-5 py-3 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-md border border-accent/25 bg-accent/10">
            <span className="h-2 w-2 rounded-sm bg-accent" />
          </span>
          <span className="text-xs font-semibold text-foreground/70 tracking-wide">
            Boreas
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-elevated px-3 py-1 text-[0.65rem] font-medium text-muted">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-whatsapp motion-reduce:animate-none" />
          Disponible esta semana
        </span>
      </div>

      {/* Doctor hero */}
      <div className={compact ? "px-5 py-6" : "px-8 py-10"}>
        <div className="flex items-start gap-5">
          {/* Avatar — specialty icon */}
          <div
            className={`shrink-0 flex items-center justify-center border border-accent/20 bg-accent/10 text-accent ${
              compact ? "h-14 w-14 rounded-xl" : "h-20 w-20 rounded-2xl"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={compact ? "h-6 w-6" : "h-9 w-9"}
              aria-hidden="true"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          </div>

          {/* Name + specialty + rating */}
          <div>
            <p
              className={`font-semibold text-foreground ${
                compact ? "text-base" : "text-2xl"
              }`}
            >
              {doctor.name}
            </p>
            <p
              className={`text-clinical ${
                compact ? "mt-0.5 text-sm" : "mt-1 text-base"
              }`}
            >
              {doctor.specialty}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-rating-gold" aria-hidden="true">
                {"★".repeat(5)}
              </span>
              <span
                className={`font-semibold text-foreground ${
                  compact ? "text-xs" : "text-sm"
                }`}
              >
                {doctor.rating}
              </span>
              <span className={`text-muted ${compact ? "text-xs" : "text-sm"}`}>
                · {doctor.reviewCount} reseñas
              </span>
            </div>
          </div>
        </div>

        {/* Appointment slots — desktop only */}
        {!compact && (
          <div className="mt-8">
            <p className="mb-3 text-xs font-medium text-muted/60">
              Próximas citas disponibles
            </p>
            <div className="flex gap-2">
              {APPOINTMENT_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  aria-pressed={selectedSlot === slot}
                  aria-disabled={!!selectedSlot && selectedSlot !== slot}
                  onClick={() => handleSlotClick(slot)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.97] ${
                    selectedSlot === slot
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : selectedSlot
                        ? "cursor-default border-line bg-surface text-foreground/40"
                        : "border-line bg-surface text-foreground/80 hover:scale-[1.02] hover:border-accent/30 hover:bg-elevated"
                  }`}
                >
                  {selectedSlot === slot ? (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="h-3 w-3"
                        viewBox="0 0 12 12"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M10.28 2.28L4 8.56 1.72 6.28a1 1 0 00-1.41 1.41l3 3a1 1 0 001.41 0l7-7a1 1 0 00-1.41-1.41z" />
                      </svg>
                      {slot}
                    </span>
                  ) : (
                    slot
                  )}
                </button>
              ))}
            </div>
            {showToast && (
              <div
                role="status"
                className="mt-3 flex items-center gap-2 rounded-lg border border-accent/20 bg-accent/10 px-3 py-2 text-xs text-accent"
              >
                <svg
                  className="h-3.5 w-3.5 shrink-0"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                </svg>
                Solicitud enviada — te confirmarán por WhatsApp
              </div>
            )}
          </div>
        )}

        {/* Testimonial */}
        <div
          className={`rounded-xl border border-line bg-surface/60 p-4 ${
            compact ? "mt-5" : "mt-8"
          }`}
        >
          <p
            className={`leading-relaxed text-clinical ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            &ldquo;{doctor.testimonial}&rdquo;
          </p>
          <p className="mt-2 text-[0.65rem] text-muted/70">{doctor.reviewerName}</p>
        </div>

        {/* WhatsApp CTA */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp font-semibold text-white shadow-lg transition-opacity hover:opacity-90 ${
            compact ? "py-3 text-sm" : "py-4 text-base"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={compact ? "h-4 w-4" : "h-5 w-5"}
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Agendar cita por WhatsApp
        </button>
      </div>
    </div>
  );
}
