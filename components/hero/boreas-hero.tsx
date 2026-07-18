"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
import {
  exampleBadgeLabel,
  heroCardStats,
  heroCredibility,
  heroEyebrowProblem,
  heroHeadline,
  heroLocationLabel,
  heroProofPoints,
  heroSubcopy,
  heroVerifiedLabel,
  lastReplyProblemLabel,
  problemStatsSources,
  socialProof,
} from "@/content/boreas-home";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { useAnimatedNumber, type NumberTrigger } from "@/lib/use-animated-number";
import { useScrollPin, type ScrollPin } from "@/lib/motion/use-scroll-pin";
import { useScrub } from "@/lib/motion/use-scrub";
import { useMarkHeroIntroSettled } from "@/lib/motion/hero-intro-context";
import { StackedCards, type StackedCardLayer } from "@/components/motion/stacked-cards";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { WordmarkIntro } from "@/components/hero/wordmark-intro";
import { AccentOrbField } from "@/components/motion/accent-orb-field";
import { DrawnPathAccent } from "@/components/motion/drawn-path-accent";
import { GrainTexture } from "@/components/motion/grain-texture";
import { WordmarkOrbitAccent } from "@/components/motion/wordmark-orbit-accent";
import { HeroScrollProgress } from "@/components/motion/hero-scroll-progress";
import { CardBacklight } from "@/components/motion/card-backlight";

const doctor = socialProof.mockupDoctor;
const doctorInitials = initials(doctor.name);
const doctorRating = parseFloat(doctor.rating);
const doctorFilledStars = Math.round(doctorRating);
const searchPercentValue = parseInt(heroCardStats.searchPercent, 10);
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_PIN_VH_DESKTOP = 280;
const HERO_PIN_VH_MOBILE = 150;
const MOBILE_PHASE_END = 0.5; // "busca+encuentra" → "responde+agenda"
const INTRO_END = 0.16; // desktop-only: centered intro stack → two-column split
const PHASE_1_END = 0.3; // "Te busca" → "Te encuentra"
const PHASE_2_END = 0.65; // "Te encuentra" → "Te escribe y agenda"
const CARD_END = INTRO_END + 0.16; // doctor card fades in (opacity gate) after the intro-reflow settles
const PROOF_POINTS_START = CARD_END;
const PROOF_POINTS_STAGGER = 0.04;

// Desktop intro-reflow geometry, derived from the grid's own ratio
// (`lg:grid-cols-[1fr_0.88fr] lg:gap-[60px]`) so centering works via CSS
// container-query units alone (cqw), no JS measurement:
//   col1Fraction = 1 / (1 + 0.88) = 0.531915, col2Fraction = 0.88 / 1.88 = 0.468085
//   text block fills col1 (width auto = column track width), its resting
//   center = colWidth1/2; card fills col2, its resting center = col1 + gap + colWidth2/2.
//   Each translateX below = 50cqw (row center) minus that resting center,
//   algebraically reduced. Multiplying by introProgress (1→0) animates from
//   "fully centered" back to "resting position" (translateX 0).
const TEXT_INTRO_TRANSLATE_X = "(23.4043cqw + 15.96px)";
const CARD_INTRO_TRANSLATE_X = "(-26.5957cqw - 14.04px)";

function initials(name: string) {
  return name
    .replace(/^Dra?\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function RatingBlock({ trigger, reduceMotion, size = "md" }: { trigger: NumberTrigger; reduceMotion: boolean; size?: "md" | "sm" }) {
  const { ref, value } = useAnimatedNumber(doctorRating, {
    reduceMotion,
    decimals: 1,
    duration: 0.9,
    ease: EASE,
    trigger,
  });
  // Stars reflect the real rating (static) — only the number counts up.
  const starSize = size === "md" ? "text-[15px]" : "text-[13px]";
  const numberSize = size === "md" ? "text-[22px]" : "text-lg";

  const avatarInitials = ["MG", "LR", "AS"];
  const remainingCount = Number(doctor.reviewCount) - avatarInitials.length;

  return (
    <div ref={ref} className="flex flex-wrap items-baseline gap-2">
      <span className={`${starSize} tracking-tight`} aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < doctorFilledStars ? "text-rating-gold" : "text-border"}>
            ★
          </span>
        ))}
      </span>
      <motion.span className={`${numberSize} tabular-nums font-display font-medium leading-none text-foreground`}>
        {value}
      </motion.span>
      <span className="flex items-center -space-x-2" aria-hidden="true">
        {avatarInitials.map((label, i) => (
          <span
            key={label}
            className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface bg-accent-soft text-[8px] font-medium text-accent"
            style={{ zIndex: avatarInitials.length - i }}
          >
            {label}
          </span>
        ))}
      </span>
      <span className="text-[13px] text-muted">
        +{remainingCount} {heroCardStats.reviewCountLabel}
      </span>
    </div>
  );
}

function DoctorCard({
  trigger,
  reduceMotion,
  testimonialDelayMs = 500,
  instant = false,
}: {
  trigger: NumberTrigger;
  reduceMotion: boolean;
  testimonialDelayMs?: number;
  instant?: boolean;
}) {
  return (
    <>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-accent-soft font-display text-[17px] italic font-medium text-accent">
          {doctorInitials}
        </div>
        <div>
          <p className="text-[15.5px] font-semibold leading-tight text-foreground">{doctor.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <p className="text-[13px] text-muted">{doctor.specialty}</p>
            <span className="rounded-[var(--radius-pill)] border border-line bg-elevated px-2 py-0.5 text-[11px] text-muted">
              {heroLocationLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-3.5">
        <RatingBlock trigger={trigger} reduceMotion={reduceMotion} />
      </div>

      <motion.div
        initial={reduceMotion || instant ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: instant ? 0 : 0.5, delay: reduceMotion || instant ? 0 : testimonialDelayMs / 1000 }}
        className="mb-3.5 rounded-[var(--radius-md)] bg-elevated px-3.5 py-3"
      >
        <p className="text-[13px] italic leading-[1.55] text-muted">&ldquo;{doctor.testimonial}&rdquo;</p>
      </motion.div>

      <button
        tabIndex={-1}
        aria-hidden="true"
        className="flex h-[42px] w-full cursor-default items-center justify-center gap-2 rounded-[var(--radius-md)] bg-whatsapp text-[14px] font-semibold text-white"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Agendar por WhatsApp
      </button>
    </>
  );
}

function AppointmentsChip({ trigger, reduceMotion, compact = false }: { trigger: NumberTrigger; reduceMotion: boolean; compact?: boolean }) {
  const { ref, value } = useAnimatedNumber(heroCardStats.appointmentsToday, {
    reduceMotion,
    duration: 0.7,
    ease: EASE,
    trigger,
  });
  return (
    <div
      ref={ref}
      className={
        compact
          ? "flex flex-1 items-center gap-2 rounded-[var(--radius-md)] border border-mint/25 bg-mint/10 px-3.5 py-3"
          : "flex items-center gap-2 rounded-[var(--radius-pill)] border border-mint/25 bg-mint/10 px-4 py-[9px]"
      }
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-mint"
        style={reduceMotion ? undefined : { animation: "pulse-dot 1.8s ease-in-out infinite" }}
      />
      <motion.span className="tabular-nums text-[13px] font-semibold text-mint">
        {value}
      </motion.span>
      <span className="text-[13px] font-semibold text-mint">
        {heroCardStats.appointmentsToday === 1
          ? heroCardStats.appointmentsTodayLabelSingular
          : heroCardStats.appointmentsTodayLabelPlural}
      </span>
    </div>
  );
}

function SearchPercentChip({ trigger, reduceMotion, compact = false }: { trigger: NumberTrigger; reduceMotion: boolean; compact?: boolean }) {
  const { ref, value } = useAnimatedNumber(searchPercentValue, {
    reduceMotion,
    duration: 0.9,
    ease: EASE,
    trigger,
  });
  const percentValue = (
    <motion.span className="tabular-nums">{value}</motion.span>
  );
  if (compact) {
    return (
      <div ref={ref} title={problemStatsSources} className="flex flex-1 flex-col justify-center rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3">
        <p className="font-display text-2xl font-medium leading-none text-amber">{percentValue}%</p>
        <p className="mt-1 text-[11px] leading-tight text-muted">{heroCardStats.searchLabel}</p>
      </div>
    );
  }
  return (
    <div ref={ref} title={problemStatsSources} className="rounded-xl border border-border bg-surface px-[18px] py-3.5 shadow-[var(--shadow-sm)]">
      <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">{heroCardStats.searchStatTitle}</p>
      <p className="font-display text-[34px] font-medium leading-none text-amber">{percentValue}%</p>
      <p className="mt-1 text-[11px] text-muted">{heroCardStats.searchLabel}</p>
    </div>
  );
}

function ExampleBadge() {
  return (
    <span className="absolute -top-2.5 left-4 z-20 rounded-[var(--radius-pill)] border border-border bg-surface px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-clinical">
      {exampleBadgeLabel}
    </span>
  );
}

function VerifiedBadge() {
  // left-[168px]: sits immediately right of ExampleBadge's rendered width — hand-measured,
  // not computed, since this project has no i18n and both badges' copy is static.
  return (
    <span className="absolute -top-2.5 left-[168px] z-20 flex items-center gap-1 rounded-[var(--radius-pill)] border border-mint/30 bg-mint/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-mint">
      <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      {heroVerifiedLabel}
    </span>
  );
}

// StackedCards marks every layer aria-hidden (decorative depth effect), so
// the doctor card's real content is otherwise invisible to assistive tech —
// mirrors the transcript pattern in relevo-example-carousel.tsx.
function DoctorCardSrOnlyTranscript() {
  return (
    <p className="sr-only">
      {doctor.name} — {doctor.specialty}. Calificación {doctor.rating} de 5, {doctor.reviewCount} {heroCardStats.reviewCountLabel}.
      &ldquo;{doctor.testimonial}&rdquo;
    </p>
  );
}

function StackedCardsStaticDoctorCard({ reduceMotion }: { reduceMotion: boolean }) {
  const cardContent = (
    <div className="bg-surface p-[22px]">
      <DoctorCard trigger={{ mode: "delay", ms: 800 }} testimonialDelayMs={1300} reduceMotion={reduceMotion} />
    </div>
  );
  const layers: StackedCardLayer[] = [
    { key: "front", content: cardContent },
    { key: "echo", content: cardContent },
  ];
  return (
    <>
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCardSrOnlyTranscript />
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />
    </>
  );
}

function ClusterBackgroundTexture() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-10 -inset-y-16 -z-10"
      style={{
        background: "radial-gradient(circle at 30% 20%, color-mix(in oklch, var(--accent) 18%, transparent) 0%, transparent 60%)",
        filter: "blur(40px)",
      }}
    />
  );
}

// Mobile-only ambient glow — more pronounced than ClusterBackgroundTexture
// (30% color-mix / 48px blur vs desktop's 18% / 40px) since a small screen
// needs more visual weight to not read as empty. "top" decorates the area
// behind the headline (outside the pinned scroll zone, so no lg:hidden
// caller needs it scoped — added directly here); "card" decorates the area
// around the doctor card and is rendered inside each mobile card wrapper.
function MobileAmbientGlow({ variant }: { variant: "top" | "card" }) {
  const position = variant === "top" ? "-inset-x-6 -top-24 h-[70vw] lg:hidden" : "-inset-x-10 -inset-y-16";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -z-10 ${position}`}
      style={{
        background: "radial-gradient(circle at 40% 30%, color-mix(in oklch, var(--accent) 30%, transparent) 0%, transparent 65%)",
        filter: "blur(48px)",
      }}
    />
  );
}

function HeroCardCluster({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <ClusterBackgroundTexture />
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 1.4 }}
        className="absolute right-0 top-0 z-[2]"
      >
        <AppointmentsChip trigger={{ mode: "delay", ms: 1400 }} reduceMotion={reduceMotion} />
      </motion.div>

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 right-[50px] top-[30px] z-[1]"
        style={reduceMotion ? undefined : { animation: "float 5.2s ease-in-out infinite" }}
      >
        <StackedCardsStaticDoctorCard reduceMotion={reduceMotion} />
      </motion.div>

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 2 }}
        className="absolute bottom-5 right-0 z-[2]"
        style={reduceMotion ? undefined : { animation: "float 4.6s ease-in-out 0.7s infinite" }}
      >
        <SearchPercentChip trigger={{ mode: "delay", ms: 2000 }} reduceMotion={reduceMotion} />
      </motion.div>

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: reduceMotion ? 0 : 2.4 }}
        className="absolute bottom-4 left-0 z-[2] rounded-[var(--radius-pill)] border border-border bg-surface px-3.5 py-2"
        style={reduceMotion ? undefined : { animation: "float 5s ease-in-out 0.3s infinite" }}
      >
        <span className="text-xs text-muted">
          {heroCardStats.lastReplyTime} · {heroCardStats.lastReplyLabel}
        </span>
      </motion.div>
    </div>
  );
}

function HeroCardMobile({ reduceMotion }: { reduceMotion: boolean }) {
  const cardContent = (
    <div className="bg-surface p-5">
      <DoctorCard trigger={{ mode: "delay", ms: 400 }} testimonialDelayMs={900} reduceMotion={reduceMotion} />
      <div className="mt-4 flex gap-3">
        <AppointmentsChip trigger={{ mode: "delay", ms: 700 }} reduceMotion={reduceMotion} compact />
        <SearchPercentChip trigger={{ mode: "delay", ms: 900 }} reduceMotion={reduceMotion} compact />
      </div>
    </div>
  );
  const layers: StackedCardLayer[] = [
    { key: "front", content: cardContent },
    { key: "echo", content: cardContent },
  ];

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-10 block lg:hidden"
    >
      <MobileAmbientGlow variant="card" />
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCardSrOnlyTranscript />
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px -40px" />
    </motion.div>
  );
}

function HeroStatic() {
  const reduceMotion = !!useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  const reveal = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 22 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="min-h-[calc(100vh-64px)] py-20 bg-hero-glow transition-[background,colors] duration-[280ms]">
      <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
        <MobileAmbientGlow variant="top" />
        {/* Left column */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ staggerChildren: reduceMotion ? 0 : 0.09, delayChildren: 0.12 }}
        >
          {/* Eyebrow */}
          <motion.p
            variants={reveal}
            transition={{ duration: 0.6, ease }}
            className="mb-5 text-sm font-semibold text-mint"
          >
            {heroCredibility}
          </motion.p>

          {/* Wordmark */}
          <motion.p
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="font-display italic font-medium leading-[0.88] tracking-[-0.03em] text-foreground"
            style={{ fontSize: "clamp(5rem, 13vw, 10.5rem)" }}
          >
            Boreas
          </motion.p>

          {/* H1 */}
          <motion.h1
            variants={reveal}
            transition={{ duration: 0.7, ease }}
            className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
          >
            {heroHeadline}
          </motion.h1>

          {/* Subcopy */}
          <motion.p
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mt-6 max-w-[50ch] text-[17px] leading-[1.7] text-muted"
          >
            {heroSubcopy}
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <a
              id="hero-primary-cta"
              href="#contacto"
              className="btn btn-p w-full sm:w-auto"
              onClick={() => trackAnalyticsEvent({ name: "cta_click", surface: "hero" })}
            >
              Quiero mi consultorio digital
            </a>
            <a href="#proceso" className="btn btn-s w-full sm:w-auto">
              Ver cómo funciona
            </a>
          </motion.div>

          {/* Proof points */}
          <motion.ul
            variants={reveal}
            transition={{ duration: 0.65, ease }}
            className="mt-9 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {heroProofPoints.map((point) => (
              <li key={point} className="border-t border-line pt-3 text-[13px] text-muted">
                {point}
              </li>
            ))}
          </motion.ul>

          {/* Mobile card (in-flow, replaces the desktop floating cluster) */}
          <HeroCardMobile reduceMotion={reduceMotion} />
        </motion.div>

        {/* Right column — card cluster (desktop only) */}
        <HeroCardCluster reduceMotion={reduceMotion} />
      </div>
    </section>
  );
}

const PROOF_POINT_POSITIONS = [
  "absolute left-0 top-0 z-[2]",
  "absolute right-0 top-9 z-[2]",
  "absolute left-6 top-[72px] z-[2]",
  "absolute right-6 top-[104px] z-[2]",
];

function ProofPointChip({ label, className, scrollYProgress, start }: { label: string; className: string; scrollYProgress: MotionValue<number>; start: number }) {
  const opacity = useScrub(scrollYProgress, [start, start + 0.04], [0, 1]);
  const y = useScrub(scrollYProgress, [start, start + 0.04], [10, 0]);
  return (
    <div style={{ opacity, transform: `translate3d(0, ${y}px, 0)` }} className={className}>
      <span className="rounded-[var(--radius-pill)] border border-line bg-surface px-3 py-1.5 text-[12px] text-muted shadow-[var(--shadow-sm)]">
        {label}
      </span>
    </div>
  );
}

function ProofPointChips({ scrollYProgress, compact = false }: { scrollYProgress: MotionValue<number>; compact?: boolean }) {
  // Desktop: absolute-corner chips floating around the 460px cluster box.
  // Mobile (`compact`): a simple wrapped flex row below the card — the card's
  // own padding box is far narrower than 460px, so the desktop corner offsets
  // would collide with the card content.
  return (
    <div className={compact ? "relative mt-6 flex flex-wrap gap-2" : "relative mt-9 h-0"}>
      {heroProofPoints.map((point, i) => (
        <ProofPointChip
          key={point}
          label={point}
          className={compact ? "" : PROOF_POINT_POSITIONS[i]}
          scrollYProgress={scrollYProgress}
          start={PROOF_POINTS_START + i * PROOF_POINTS_STAGGER}
        />
      ))}
    </div>
  );
}

function HeroCinematicLeftColumn({
  scrollYProgress,
  ctaId,
  enableIntroReflow = false,
}: {
  scrollYProgress: MotionValue<number>;
  ctaId: string;
  enableIntroReflow?: boolean;
}) {
  const markIntroSettled = useMarkHeroIntroSettled();
  const problemEyebrowOpacity = useScrub(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0]);
  const solutionEyebrowOpacity = 1 - problemEyebrowOpacity;
  const introProgress = useScrub(scrollYProgress, [0, INTRO_END], [1, 0]);
  const reflowOpacity = useScrub(scrollYProgress, [0, INTRO_END], [0, 1]);
  const reflowY = useScrub(scrollYProgress, [0, INTRO_END], [10, 0]);

  return (
    <div
      style={
        enableIntroReflow
          ? { transform: `translate3d(calc(${introProgress} * ${TEXT_INTRO_TRANSLATE_X}), 0px, 0)` }
          : undefined
      }
    >
      <div className="relative mb-5 h-[20px]">
        <p aria-hidden={problemEyebrowOpacity < 0.5} style={{ opacity: problemEyebrowOpacity }} className="absolute inset-0 text-sm font-semibold text-amber">
          {heroEyebrowProblem}
        </p>
        <p aria-hidden={solutionEyebrowOpacity < 0.5} style={{ opacity: solutionEyebrowOpacity }} className="absolute inset-0 text-sm font-semibold text-mint">
          {heroCredibility}
        </p>
      </div>

      <div className="relative">
        <WordmarkOrbitAccent
          active={introProgress > 0}
          count={enableIntroReflow ? 3 : 2}
          radiusScale={enableIntroReflow ? 1 : 0.55}
          reduceMotion={false}
          className={enableIntroReflow ? "left-[-15%] top-[-8%] h-40 w-40" : "left-[-8%] top-[-6%] h-24 w-24"}
        />
        <WordmarkIntro wordmark="Boreas" headline={heroHeadline} onSettled={markIntroSettled} />
      </div>

      <div
        style={
          enableIntroReflow
            ? { opacity: reflowOpacity, transform: `translate3d(0, ${reflowY}px, 0)` }
            : undefined
        }
      >
        <p className="mt-6 max-w-[50ch] text-[17px] leading-[1.7] text-muted">{heroSubcopy}</p>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a id={ctaId} href="#contacto" className="btn btn-p w-full sm:w-auto" onClick={() => trackAnalyticsEvent({ name: "cta_click", surface: "hero" })}>
            Quiero mi consultorio digital
          </a>
          <a href="#proceso" className="btn btn-s w-full sm:w-auto">
            Ver cómo funciona
          </a>
        </div>
        <ProofPointChips scrollYProgress={scrollYProgress} />
      </div>
    </div>
  );
}

function TimeChip({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const problemOpacity = useScrub(scrollYProgress, [PHASE_2_END - 0.04, PHASE_2_END], [1, 0]);
  const solutionOpacity = 1 - problemOpacity;
  return (
    <div className="absolute bottom-4 left-3 z-[2] rounded-[var(--radius-pill)] border border-border bg-surface px-3.5 py-2">
      <div className="relative">
        <span aria-hidden={problemOpacity < 0.5} style={{ opacity: problemOpacity }} className="text-xs text-muted">
          {heroCardStats.lastReplyTime} · {lastReplyProblemLabel}
        </span>
        <span aria-hidden={solutionOpacity < 0.5} style={{ opacity: solutionOpacity }} className="absolute inset-0 whitespace-nowrap text-xs text-muted">
          {heroCardStats.lastReplyTime} · {heroCardStats.lastReplyLabel}
        </span>
      </div>
    </div>
  );
}

function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const introProgress = useScrub(scrollYProgress, [0, INTRO_END], [1, 0]);
  const settleScale = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);
  const introY = introProgress * 30;
  const cardOpacity = useScrub(scrollYProgress, [CARD_END, CARD_END + 0.08], [0, 1]);

  const cardContent = (
    <div className="bg-surface p-[22px]">
      <DoctorCard trigger={{ mode: "progress", value: scrollYProgress, threshold: CARD_END }} reduceMotion={false} instant />
    </div>
  );
  const layers: StackedCardLayer[] = [
    { key: "front", content: cardContent },
    { key: "echo", content: cardContent },
  ];

  return (
    <div
      style={{
        opacity: cardOpacity,
        transform: `translate3d(calc(${introProgress} * ${CARD_INTRO_TRANSLATE_X}), ${introY}vh, 0) scale(${settleScale})`,
      }}
      className="absolute left-0 right-[50px] top-[30px] z-[1]"
    >
      <CardBacklight />
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCardSrOnlyTranscript />
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />
    </div>
  );
}

function AppointmentsChipEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [0, 1]);
  return (
    <div style={{ opacity }} className="absolute right-3 top-3 z-[2]">
      <AppointmentsChip
        trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_2_END }}
        reduceMotion={false}
      />
    </div>
  );
}

function HeroCardClusterCinematic({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <GrainTexture className="rounded-[var(--radius-xl)]" />
      <AccentOrbField progress={scrollYProgress} count={3} reduceMotion={false} />
      <DrawnPathAccent
        progress={scrollYProgress}
        range={[0.1, 0.5]}
        d="M 280 20 Q 420 40 440 180"
        viewBox="0 0 460 460"
        className="inset-0 h-full w-full"
        reduceMotion={false}
      />
      <HeroScrollProgress progress={scrollYProgress} className="right-0" />

      <ParallaxLayer progress={scrollYProgress} speed={0.15} reduceMotion={false} className="absolute inset-0 -z-10">
        <ClusterBackgroundTexture />
      </ParallaxLayer>

      <AppointmentsChipEntrance scrollYProgress={scrollYProgress} />

      <DoctorCardEntrance scrollYProgress={scrollYProgress} />

      <div className="absolute bottom-5 right-3 z-[2]">
        <SearchPercentChip trigger={{ mode: "progress", value: scrollYProgress, threshold: 0 }} reduceMotion={false} />
      </div>

      <TimeChip scrollYProgress={scrollYProgress} />
    </div>
  );
}

function HeroCardMobilePinned({ containerRef, scrollYProgress }: ScrollPin) {
  const problemOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [1, 0]);
  const solutionOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [0, 1]);
  const appointmentsOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END, MOBILE_PHASE_END + 0.08], [0, 1]);

  const cardContent = (
    <div className="bg-surface p-5">
      <DoctorCard
        trigger={{ mode: "delay", ms: 400 }}
        reduceMotion={false}
        instant
      />
      <div className="relative mt-3 h-[16px] text-[13px]">
        <span aria-hidden={problemOpacity < 0.5} style={{ opacity: problemOpacity }} className="absolute inset-0 text-muted">
          {heroCardStats.lastReplyTime} · {lastReplyProblemLabel}
        </span>
        <span aria-hidden={solutionOpacity < 0.5} style={{ opacity: solutionOpacity }} className="absolute inset-0 whitespace-nowrap text-muted">
          {heroCardStats.lastReplyTime} · {heroCardStats.lastReplyLabel}
        </span>
      </div>
      <div className="mt-4 flex gap-3">
        <div style={{ opacity: appointmentsOpacity }} className="flex flex-1">
          <AppointmentsChip
            trigger={{ mode: "progress", value: scrollYProgress, threshold: MOBILE_PHASE_END }}
            reduceMotion={false}
            compact
          />
        </div>
        <SearchPercentChip
          trigger={{ mode: "progress", value: scrollYProgress, threshold: 0 }}
          reduceMotion={false}
          compact
        />
      </div>
    </div>
  );
  const layers: StackedCardLayer[] = [
    { key: "front", content: cardContent },
    { key: "echo", content: cardContent },
  ];

  return (
    <div ref={containerRef} className="relative mt-10 block lg:hidden" style={{ height: `${HERO_PIN_VH_MOBILE}vh` }}>
      <div className="sticky top-[88px]">
        <CardBacklight />
        <ParallaxLayer progress={scrollYProgress} speed={0.12} reduceMotion={false} className="absolute inset-0 -z-10">
          <MobileAmbientGlow variant="card" />
        </ParallaxLayer>
        <ExampleBadge />
        <VerifiedBadge />
        <DoctorCardSrOnlyTranscript />
        <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px -40px" />
        <ProofPointChips scrollYProgress={scrollYProgress} compact />
        <AccentOrbField progress={scrollYProgress} count={3} reduceMotion={false} className="opacity-70" />
        <DrawnPathAccent
          progress={scrollYProgress}
          range={[0.2, 0.6]}
          d="M 10 140 Q 150 40 300 100"
          viewBox="0 0 320 180"
          className="inset-0 h-full w-full opacity-70"
          reduceMotion={false}
        />
        <GrainTexture opacity={0.03} />
        <HeroScrollProgress progress={scrollYProgress} className="right-0" />
      </div>
    </div>
  );
}

// Mobile-only: fades and lifts the ENTIRE intro left column (wordmark,
// headline, paragraph, CTA, proof points) away as the card enters. On mobile
// everything stacks in one column, so there is no side-by-side reflow like
// desktop — the intro block simply exits. This is the ONLY opacity gate on the
// mobile left column: `HeroCinematicLeftColumn`'s inner paragraph/CTA gate is
// scoped to `enableIntroReflow`, which the mobile call site omits, so this
// wrapper is not stacked on a second ramp (which would keep the CTA dim).
function MobileWordmarkExit({ mobileScrollYProgress, children }: { mobileScrollYProgress: MotionValue<number>; children: ReactNode }) {
  const opacity = useScrub(mobileScrollYProgress, [0, 0.15], [1, 0]);
  const y = useScrub(mobileScrollYProgress, [0, 0.15], [0, -24]);
  return <div style={{ opacity, transform: `translate3d(0, ${y}px, 0)` }}>{children}</div>;
}

function HeroCinematic() {
  const { containerRef: desktopContainerRef, scrollYProgress: desktopScrollYProgress } = useScrollPin();
  const { containerRef: mobileContainerRef, scrollYProgress: mobileScrollYProgress } = useScrollPin();

  return (
    <section className="relative bg-hero-glow transition-[background,colors] duration-[280ms]">
      {/* overflow-x-clip contains the decorative glow/orb bleed (negative-inset
          MobileAmbientGlow, CardBacklight, AccentOrbField) so it can't push the
          mobile document wider than the viewport. `clip` (not `hidden`) does not
          establish a scroll container, so the sticky card pin still references
          the viewport. */}
      <div className="relative mx-auto w-full max-w-[1460px] overflow-x-clip px-4 pt-20 sm:px-6 lg:hidden">
        <MobileAmbientGlow variant="top" />
        <MobileWordmarkExit mobileScrollYProgress={mobileScrollYProgress}>
          <HeroCinematicLeftColumn scrollYProgress={mobileScrollYProgress} ctaId="hero-primary-cta-mobile" />
        </MobileWordmarkExit>
        <HeroCardMobilePinned containerRef={mobileContainerRef} scrollYProgress={mobileScrollYProgress} />
      </div>
      <div ref={desktopContainerRef} className="relative hidden lg:block" style={{ height: `${HERO_PIN_VH_DESKTOP}vh` }}>
        {/* top-[64px]/h-[calc(100vh-64px)], not top-0/h-screen: the sticky
            header (z-50, opaque, ~64px tall — same constant HeroStatic uses
            in its `min-h-[calc(100vh-64px)]`) paints over anything centered
            above this offset, which silently hid the eyebrow crossfade row
            for the entire pinned scroll range at common viewport heights
            (e.g. 1280x800) — found during the Task 3 verification pass. */}
        <div className="sticky top-[64px] flex h-[calc(100vh-64px)] items-center overflow-hidden">
          <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10 [container-type:inline-size]">
            <HeroCinematicLeftColumn scrollYProgress={desktopScrollYProgress} ctaId="hero-primary-cta" enableIntroReflow />
            <HeroCardClusterCinematic scrollYProgress={desktopScrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function BoreasHero() {
  const reduceMotion = !!useReducedMotion();
  return reduceMotion ? <HeroStatic /> : <HeroCinematic />;
}
