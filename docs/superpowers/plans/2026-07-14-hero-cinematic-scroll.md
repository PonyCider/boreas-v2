# Hero Cinematic Scroll Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the desktop/mobile Hero into a scroll-linked, pinned sequence (framer-motion `useScroll`/`useTransform`, `position: sticky`) that dramatizes "Una noche, un paciente" in 3 phases, while the left column (headline, subcopy, CTA) stays static and visible from scroll 0.

**Architecture:** `BoreasHero` branches once on `useReducedMotion()`. The `true` branch renders the existing T4 static hero unchanged (extracted verbatim into `HeroStatic`). The `false` branch renders a new `HeroCinematic`, which pins the right-column card cluster inside a tall scroll-driver `div` (`useScroll({ target, offset: ["start start", "end end"] })`) and derives every phase transform from a single `scrollYProgress` motion value — desktop (280vh, 3 phases) and mobile (150vh, 2 phases) each get their own driver but share the same hook and the same subcomponents (`DoctorCard`, `RatingBlock`, `AppointmentsChip`, `SearchPercentChip`), generalized in Task 2 to accept any trigger (mount-delay or scroll-progress) instead of only a mount-delay.

**Tech Stack:** Next.js 16 / React 19, `framer-motion@^12.38.0` (package name `framer-motion`, not `motion/react` — see override below), Tailwind v4, TypeScript.

## Global Constraints

- Import motion APIs from `"framer-motion"` (installed package name), never `"motion/react"` — see `skills/framer-motion/SKILL.md` → "Boreas project overrides".
- No `type: "spring"` transitions. Use duration + the project's ease-out exponential curve `EASE = [0.22, 1, 0.36, 1]` (already defined in `components/hero/boreas-hero.tsx`).
- No bounce/elastic, no glass/glow decorative effects, no gradient text, no nested cards, no on-screen phase labels ("Fase 1", "Confianza", etc.).
- Headline, subcopy, and both hero CTAs must be visible and clickable from scroll 0 through pin release — never gated behind scroll progress.
- No new numeric stat without a citable source already in `content/boreas-home.ts` (T7-T8 discipline). Copy is added to `content/boreas-home.ts`, never hardcoded in JSX.
- Reduced motion collapses to the exact current T4 behavior (fade-in, no pin, no sticky, no `scrollYProgress`-linked transform) — not a shortened version of the cinematic sequence.
- **This repo has no automated test suite** (confirmed in `AGENTS.md`). Every task's acceptance gate, in place of the skill template's test-first cycle, is: `npx tsc --noEmit` clean → `npm run lint` clean (0 errors/0 warnings, matching the T1-T10 checkpoint standard) → `npm run build` succeeds → manual browser verification of the specific behavior described in that task's steps (via the project's preview tools). This substitution is noted once here rather than repeated in every task.
- Source docs for this plan: `docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md` (spec), `docs/handoff/2026-07-14-fable-hero-scroll-copy-review.md` (narrative review), `docs/handoff/2026-07-13-checkpoint-and-cinematic-scroll-plan.md` (prior session's constraints).

---

## File Structure

- **Modify** `lib/use-animated-number.ts` — add a `"progress"` trigger mode (fires once when a given `MotionValue<number>` crosses a threshold), alongside the existing `"inView"`/`"delay"` modes. Export the `Trigger` type as `NumberTrigger`.
- **Create** `lib/use-hero-scroll-phases.ts` — tiny hook wrapping `useScroll` for a pin container ref; returns `{ containerRef, scrollYProgress }`. Reused by both the desktop and mobile pin.
- **Modify** `content/boreas-home.ts` — add `heroEyebrowProblem` and `lastReplyProblemLabel` copy keys.
- **Modify** `components/hero/boreas-hero.tsx` — the bulk of the work: generalize `DoctorCard`/`RatingBlock`/`AppointmentsChip`/`SearchPercentChip` to take a `trigger` prop; extract the current markup into `HeroStatic`; add `HeroCinematic` (desktop pin + mobile pin) driven by the new hook; add `id="hero-primary-cta"` to the primary CTA anchor in both branches.
- **Modify** `components/hero/header.tsx` — replace the `window.scrollY > 600` threshold with an `IntersectionObserver` on `#hero-primary-cta`.

No new component files beyond the one hook — `HeroStatic`, `HeroCinematic`, and the cinematic cluster pieces stay as functions inside `boreas-hero.tsx`, following the existing pattern in that file (it already composes several small functions: `RatingBlock`, `DoctorCard`, `AppointmentsChip`, `SearchPercentChip`, `ExampleBadge`, `HeroCardCluster`, `HeroCardMobile`).

---

### Task 1: Copy — problem-state eyebrow and time-chip label

**Files:**
- Modify: `content/boreas-home.ts:26-28`
- Test: manual (no runtime behavior yet, just new exports)

**Interfaces:**
- Produces: `heroEyebrowProblem: string`, `lastReplyProblemLabel: string` — consumed by Task 6 (Phase 1 content) and Task 7 (Phase 3 chip flip).

- [ ] **Step 1: Add the two new copy exports**

In `content/boreas-home.ts`, the block currently reads:

```ts
export const heroCardStats = {
  appointmentsToday: 3,
  appointmentsTodayLabelSingular: "cita hoy",
  appointmentsTodayLabelPlural: "citas hoy",
  searchPercent: "82%",
  searchLabel: "busca en línea antes de agendar",
  searchStatTitle: "Pacientes digitales",
  reviewCountLabel: "reseñas",
  lastReplyTime: "11:47 PM",
  lastReplyLabel: "tu consultorio respondió",
};

export const exampleBadgeLabel = "Ejemplo ilustrativo";
```

Replace it with:

```ts
export const heroCardStats = {
  appointmentsToday: 3,
  appointmentsTodayLabelSingular: "cita hoy",
  appointmentsTodayLabelPlural: "citas hoy",
  searchPercent: "82%",
  searchLabel: "busca en línea antes de agendar",
  searchStatTitle: "Pacientes digitales",
  reviewCountLabel: "reseñas",
  lastReplyTime: "11:47 PM",
  lastReplyLabel: "tu consultorio respondió",
};

// Cinematic hero sequence (docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md):
// the 11:47 PM chip starts in this "problem" state and flips to `lastReplyLabel`
// (above) partway through the scroll-linked sequence — same object, same
// timestamp, inverted meaning.
export const lastReplyProblemLabel = "tu paciente sigue esperando";

// Eyebrow shown only during the cinematic sequence's first phase, before it
// crossfades to `heroCredibility`. Sourced stat (40%, fuera de horario) is
// the same one already used in `problemStats` and `socialProof` — repeated
// here by deliberate choice, not oversight (see spec, "Fase 1").
export const heroEyebrowProblem = "El 40% de las búsquedas ocurre fuera de horario laboral.";

export const exampleBadgeLabel = "Ejemplo ilustrativo";
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (these are unused exports at this point — TypeScript doesn't flag unused top-level exports, so this passes clean).

- [ ] **Step 3: Commit**

```bash
git add content/boreas-home.ts
git commit -m "content: add problem-state hero copy for cinematic scroll sequence"
```

---

### Task 2: Generalize hero subcomponents from mount-delay to a trigger prop

This is a behavior-preserving refactor: every existing call site keeps producing the exact same static hero it does today. It exists so Tasks 6-8 can pass a scroll-progress trigger into the same components instead of a mount delay, without forking them.

**Files:**
- Modify: `lib/use-animated-number.ts` (full file)
- Modify: `components/hero/boreas-hero.tsx:34-236` (component signatures + call sites only)

**Interfaces:**
- Consumes: nothing new.
- Produces: `NumberTrigger` type (exported from `lib/use-animated-number.ts`) — `{ mode: "inView"; margin?: MarginValue } | { mode: "delay"; ms?: number } | { mode: "progress"; value: MotionValue<number>; threshold: number }`. `RatingBlock`, `DoctorCard`, `AppointmentsChip`, `SearchPercentChip` now take `trigger: NumberTrigger` instead of `delay: number`. `DoctorCard` also takes `testimonialDelayMs?: number` (default `500`, replaces the old `delay + 0.5s` math) and `instant?: boolean` (default `false`, skips the testimonial's own fade when the card's entrance is already scroll-driven).

- [ ] **Step 1: Add the `"progress"` trigger mode to `useAnimatedNumber`**

Replace the full contents of `lib/use-animated-number.ts` with:

```ts
"use client";

import { useEffect, useRef, useState } from "react";
import {
  animate as fmAnimate,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
} from "framer-motion";

const DEFAULT_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

type MarginValue = `${number}${"px" | "%"}`;
export type NumberTrigger =
  | { mode: "inView"; margin?: MarginValue }
  | { mode: "delay"; ms?: number }
  | { mode: "progress"; value: MotionValue<number>; threshold: number };

/**
 * Animates a number from 0 to `target` once, via framer-motion's `animate()`.
 * Three trigger modes: "inView" (starts when scrolled into view, e.g. below-the-fold
 * stats), "delay" (starts a fixed time after mount, e.g. an above-the-fold hero
 * that's visible immediately), or "progress" (starts once a scroll-linked
 * MotionValue crosses `threshold`, e.g. a pinned scroll sequence). Respects
 * reduced motion by jumping straight to `target`.
 */
export function useAnimatedNumber<T extends HTMLElement = HTMLDivElement>(
  target: number,
  {
    reduceMotion,
    decimals = 0,
    duration = 1.5,
    ease = DEFAULT_EASE,
    trigger = { mode: "inView" },
  }: {
    reduceMotion: boolean | null;
    decimals?: number;
    duration?: number;
    ease?: [number, number, number, number];
    trigger?: NumberTrigger;
  }
) {
  const ref = useRef<T>(null);
  const inViewMargin: MarginValue = trigger.mode === "inView" ? trigger.margin ?? "-80px" : "0px";
  const inView = useInView(ref, { once: true, margin: inViewMargin });

  const [progressFired, setProgressFired] = useState(false);
  const fallbackProgress = useMotionValue(0);
  const watchedProgress = trigger.mode === "progress" ? trigger.value : fallbackProgress;
  useMotionValueEvent(watchedProgress, "change", (latest) => {
    if (trigger.mode === "progress" && !progressFired && latest >= trigger.threshold) {
      setProgressFired(true);
    }
  });

  const shouldStart =
    trigger.mode === "inView" ? inView : trigger.mode === "progress" ? progressFired : true;
  const count = useMotionValue(reduceMotion ? target : 0);
  const value = useTransform(count, (v) => Number(v.toFixed(decimals)));
  const delaySeconds = trigger.mode === "delay" ? (trigger.ms ?? 0) / 1000 : 0;

  useEffect(() => {
    if (reduceMotion) {
      count.set(target);
      return;
    }
    if (!shouldStart) return;
    const controls = fmAnimate(count, target, { duration, ease, delay: delaySeconds });
    return controls.stop;
  }, [shouldStart, reduceMotion, target, count, duration, ease, delaySeconds]);

  return { ref, value };
}
```

- [ ] **Step 2: Typecheck the hook in isolation**

Run: `npx tsc --noEmit`
Expected: errors in `components/hero/boreas-hero.tsx` (its call sites still pass `delay`, which no longer exists) — this is expected at this point in the task. Confirm the *only* errors are in that one file, about the `delay` prop.

- [ ] **Step 3: Update `boreas-hero.tsx` signatures and call sites**

In `components/hero/boreas-hero.tsx`, add `NumberTrigger` to the import from `@/lib/use-animated-number`:

```ts
import { useAnimatedNumber, type NumberTrigger } from "@/lib/use-animated-number";
```

Change `RatingBlock`'s signature and its call into `useAnimatedNumber` (currently lines 34-41):

```tsx
function RatingBlock({ trigger, reduceMotion, size = "md" }: { trigger: NumberTrigger; reduceMotion: boolean; size?: "md" | "sm" }) {
  const { ref, value } = useAnimatedNumber(doctorRating, {
    reduceMotion,
    decimals: 1,
    duration: 0.9,
    ease: EASE,
    trigger,
  });
```

Change `DoctorCard`'s signature and body (currently lines 65-103):

```tsx
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
          <p className="mt-0.5 text-[13px] text-muted">{doctor.specialty}</p>
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
```

Change `AppointmentsChip`'s signature (currently lines 105-135):

```tsx
function AppointmentsChip({ trigger, reduceMotion, compact = false }: { trigger: NumberTrigger; reduceMotion: boolean; compact?: boolean }) {
  const { ref, value } = useAnimatedNumber(heroCardStats.appointmentsToday, {
    reduceMotion,
    duration: 0.7,
    ease: EASE,
    trigger,
  });
```

(rest of `AppointmentsChip` body unchanged)

Change `SearchPercentChip`'s signature (currently lines 137-162):

```tsx
function SearchPercentChip({ trigger, reduceMotion, compact = false }: { trigger: NumberTrigger; reduceMotion: boolean; compact?: boolean }) {
  const { ref, value } = useAnimatedNumber(searchPercentValue, {
    reduceMotion,
    duration: 0.9,
    ease: EASE,
    trigger,
  });
```

(rest of `SearchPercentChip` body unchanged)

Update the call sites in `HeroCardCluster` (currently lines 172-218) — replace every `delay={N}` with `trigger={{ mode: "delay", ms: N }}`:

```tsx
<AppointmentsChip trigger={{ mode: "delay", ms: 1400 }} reduceMotion={reduceMotion} />
...
<DoctorCard trigger={{ mode: "delay", ms: 800 }} reduceMotion={reduceMotion} />
...
<SearchPercentChip trigger={{ mode: "delay", ms: 2000 }} reduceMotion={reduceMotion} />
```

(keep every other prop, position, and the `float`/`pulse-dot` inline animations exactly as they are today)

Update the call sites in `HeroCardMobile` (currently lines 220-236):

```tsx
<DoctorCard trigger={{ mode: "delay", ms: 400 }} reduceMotion={reduceMotion} />
<div className="mt-4 flex gap-3">
  <AppointmentsChip trigger={{ mode: "delay", ms: 700 }} reduceMotion={reduceMotion} compact />
  <SearchPercentChip trigger={{ mode: "delay", ms: 900 }} reduceMotion={reduceMotion} compact />
</div>
```

- [ ] **Step 4: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three clean, zero errors, zero warnings.

- [ ] **Step 5: Manual regression check**

Start the dev server, load the homepage, and visually compare the hero against a screenshot taken before this task (or against `git stash` if unsure) — the doctor card, rating count-up, appointments chip, and search% chip must animate identically to before (same delays, same final values). This is a pure refactor; any visible difference is a bug.

- [ ] **Step 6: Commit**

```bash
git add lib/use-animated-number.ts components/hero/boreas-hero.tsx
git commit -m "refactor: generalize hero number triggers from mount-delay to inView/delay/progress"
```

---

### Task 3: Scroll-phase hook

**Files:**
- Create: `lib/use-hero-scroll-phases.ts`
- Test: manual (consumed starting Task 4)

**Interfaces:**
- Produces: `useHeroScrollPhases(): { containerRef: RefObject<HTMLDivElement | null>; scrollYProgress: MotionValue<number> }`.

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useRef } from "react";
import { useScroll, type MotionValue } from "framer-motion";

export interface HeroScrollPhases {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Drives the hero's pinned scroll sequence. `containerRef` must be attached
 * to the tall (N vh) scroll-driver div; `scrollYProgress` goes 0→1 across
 * that div's full scrollable height, independent of the sticky child inside it.
 */
export function useHeroScrollPhases(): HeroScrollPhases {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  return { containerRef, scrollYProgress };
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean (file isn't imported anywhere yet, but should still typecheck standalone).

- [ ] **Step 3: Commit**

```bash
git add lib/use-hero-scroll-phases.ts
git commit -m "feat: add scroll-phase hook for pinned hero sequence"
```

---

### Task 4: Extract `HeroStatic`, scaffold `HeroCinematic` desktop pin (no phase behavior yet)

This task proves the pin mechanic itself — sticky cluster, correct scroll-driver height, no layout breakage — before any phase-driven opacity/position work. The cluster inside the pin renders in its final ("phase 3 complete") visual state statically; Tasks 6-7 make it phase-driven.

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (restructure `BoreasHero`, add `HeroStatic`, add `HeroCinematic` skeleton, add `HERO_PIN_VH_DESKTOP` constant)

**Interfaces:**
- Consumes: `useHeroScrollPhases` (Task 3), `NumberTrigger` (Task 2).
- Produces: `HeroStatic()` (no props — exact current hero, reduced-motion path), `HeroCinematic()` (no props — new pinned hero, desktop pin scaffolded here, mobile pin added in Task 9).

- [ ] **Step 1: Add the pin height constant and import the hook**

Near the top of `components/hero/boreas-hero.tsx`, alongside `EASE`:

```ts
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HERO_PIN_VH_DESKTOP = 280;
const PHASE_1_END = 0.3; // "Te busca" → "Te encuentra"
const PHASE_2_END = 0.65; // "Te encuentra" → "Te escribe y agenda"
```

Add to the imports:

```ts
import { useHeroScrollPhases } from "@/lib/use-hero-scroll-phases";
```

- [ ] **Step 2: Extract the current `BoreasHero` body into `HeroStatic`**

Rename the current `export function BoreasHero()` (lines 238-334) to `function HeroStatic()`, dropping the `export`, and add `id="hero-primary-cta"` to its primary CTA anchor. The function body is otherwise **byte-for-byte identical** to what exists today:

```tsx
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
            style={{ fontSize: "clamp(1.85rem, 4vw, 3.8rem)" }}
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
```

- [ ] **Step 3: Add the `HeroCinematic` desktop pin scaffold**

Directly below `HeroStatic`, add:

```tsx
function HeroCinematicLeftColumn() {
  const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
  const ease = EASE;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.09, delayChildren: 0.12 }}
    >
      <motion.p
        variants={reveal}
        transition={{ duration: 0.6, ease }}
        className="mb-5 text-sm font-semibold text-mint"
      >
        {heroCredibility}
      </motion.p>

      <motion.p
        variants={reveal}
        transition={{ duration: 0.65, ease }}
        className="font-display italic font-medium leading-[0.88] tracking-[-0.03em] text-foreground"
        style={{ fontSize: "clamp(5rem, 13vw, 10.5rem)" }}
      >
        Boreas
      </motion.p>

      <motion.h1
        variants={reveal}
        transition={{ duration: 0.7, ease }}
        className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
        style={{ fontSize: "clamp(1.85rem, 4vw, 3.8rem)" }}
      >
        {heroHeadline}
      </motion.h1>

      <motion.p
        variants={reveal}
        transition={{ duration: 0.65, ease }}
        className="mt-6 max-w-[50ch] text-[17px] leading-[1.7] text-muted"
      >
        {heroSubcopy}
      </motion.p>

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
    </motion.div>
  );
}

function HeroCardClusterCinematic({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Scaffold only — every element renders in its final ("phase 3 complete")
  // state so the pin mechanic can be verified before Tasks 6-7 wire in
  // scroll-driven opacity/position per phase.
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <div className="absolute right-0 top-0 z-[2]">
        <AppointmentsChip trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_2_END }} reduceMotion={false} />
      </div>

      <div className="absolute left-0 right-[50px] top-[30px] z-[1] rounded-[var(--radius-xl)] border border-border bg-surface p-[22px] shadow-[var(--shadow)]">
        <ExampleBadge />
        <DoctorCard trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_1_END }} reduceMotion={false} instant />
      </div>

      <div className="absolute bottom-5 right-0 z-[2]">
        <SearchPercentChip trigger={{ mode: "progress", value: scrollYProgress, threshold: 0 }} reduceMotion={false} />
      </div>

      <div className="absolute bottom-4 left-0 z-[2] rounded-[var(--radius-pill)] border border-border bg-surface px-3.5 py-2">
        <span className="text-xs text-muted">
          {heroCardStats.lastReplyTime} · {heroCardStats.lastReplyLabel}
        </span>
      </div>
    </div>
  );
}

function HeroCinematic() {
  const { containerRef, scrollYProgress } = useHeroScrollPhases();

  return (
    <section className="relative bg-hero-glow transition-[background,colors] duration-[280ms]">
      <div ref={containerRef} className="hidden lg:block" style={{ height: `${HERO_PIN_VH_DESKTOP}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
            <HeroCinematicLeftColumn />
            <HeroCardClusterCinematic scrollYProgress={scrollYProgress} />
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
```

Add `MotionValue` to the framer-motion import at the top of the file:

```ts
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
```

Note: this step deliberately leaves mobile unhandled (`HeroCinematic`'s `<section>` renders nothing below `lg:`) — Task 9 adds the mobile pin. Until then, non-reduced-motion mobile users see no hero content; that's expected and temporary within this plan's sequencing, not a shippable intermediate state.

- [ ] **Step 4: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Manual verification — pin mechanic**

Start the dev server, open the homepage on a desktop viewport (≥1024px) with no `prefers-reduced-motion` set. Scroll down slowly through the hero. Confirm: the right-column cluster stays fixed in place (pinned) while the page scrolls underneath it, for roughly 2.8 screen-heights, then releases and the next section (`ProblemSection`) scrolls in normally. Confirm the left column (headline, CTA) is visible immediately at scroll 0 and stays in place the whole time (it's inside the same sticky wrapper, so it doesn't scroll independently). Click the primary CTA — it must be clickable at every scroll position within the pin.

- [ ] **Step 6: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: scaffold pinned desktop hero sequence (static cluster content)"
```

---

### Task 5: Header CTA — IntersectionObserver instead of scroll threshold

Pulled forward (before the phase content tasks) because it only depends on the `id="hero-primary-cta"` anchor added in Task 4, and is fully independent of Tasks 6-9's phase work — smaller, self-contained, easy to verify in isolation.

**Files:**
- Modify: `components/hero/header.tsx`

**Interfaces:**
- Consumes: `#hero-primary-cta` DOM id (produced by Task 4, present in both `HeroStatic` and `HeroCinematic`).

- [ ] **Step 1: Replace the scroll-threshold effect with an IntersectionObserver**

In `components/hero/header.tsx`, remove the `HEADER_CTA_SCROLL_THRESHOLD` constant (lines 15-17) and the second `useEffect` (lines 64-78, the one that calls `setShowHeaderCta` from `window.scrollY`). Replace that effect with:

```tsx
  useEffect(() => {
    const heroCta = document.getElementById("hero-primary-cta");
    if (!heroCta) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowHeaderCta(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroCta);
    return () => observer.disconnect();
  }, []);
```

The rest of `header.tsx` (the `showHeaderCta` state, the `AnimatePresence` block rendering the header CTA) is unchanged — only how `showHeaderCta` gets set changes.

- [ ] **Step 2: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 3: Manual verification**

Load the homepage. Confirm the header CTA is hidden while the hero's own CTA is in viewport (including scrolling through the whole pinned sequence from Task 4 — it must *stay* hidden the entire pin, since the hero CTA is visible the whole time). Scroll past the pinned hero into `ProblemSection` — the header CTA must appear as soon as the hero CTA scrolls out of view. Scroll back up — it must disappear again once the hero CTA re-enters view. Repeat with `prefers-reduced-motion: reduce` enabled (devtools → rendering → emulate CSS media) against `HeroStatic` — same behavior, using its own `#hero-primary-cta`.

- [ ] **Step 4: Commit**

```bash
git add components/hero/header.tsx
git commit -m "feat: drive header CTA visibility from hero CTA intersection, not a fixed scroll offset"
```

---

### Task 6: Phase 1 content — "Te busca" (0–30%)

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`HeroCinematicLeftColumn`, `HeroCardClusterCinematic`)

**Interfaces:**
- Consumes: `heroEyebrowProblem`, `lastReplyProblemLabel` (Task 1), `PHASE_1_END` (Task 4).
- Produces: eyebrow crossfade pattern and time-chip crossfade pattern, reused by Task 7 for the chip's second flip.

- [ ] **Step 1: Crossfade the eyebrow from problem-framing to `heroCredibility`**

In `HeroCinematicLeftColumn`, `scrollYProgress` needs to be passed in. Change its signature and the eyebrow block:

```tsx
function HeroCinematicLeftColumn({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
  const ease = EASE;
  const problemEyebrowOpacity = useTransform(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0]);
  const solutionEyebrowOpacity = useTransform(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [0, 1]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.09, delayChildren: 0.12 }}
    >
      <motion.div variants={reveal} transition={{ duration: 0.6, ease }} className="relative mb-5 h-[20px]">
        <motion.p style={{ opacity: problemEyebrowOpacity }} className="absolute inset-0 text-sm font-semibold text-amber">
          {heroEyebrowProblem}
        </motion.p>
        <motion.p style={{ opacity: solutionEyebrowOpacity }} className="absolute inset-0 text-sm font-semibold text-mint">
          {heroCredibility}
        </motion.p>
      </motion.div>
```

(the wordmark, H1, subcopy, CTAs, and proof points blocks below are unchanged from Task 4's version — only the eyebrow block and the function signature change)

Import `useTransform` and `heroEyebrowProblem` at the top of the file:

```ts
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
```

```ts
import {
  exampleBadgeLabel,
  heroCardStats,
  heroCredibility,
  heroEyebrowProblem,
  heroHeadline,
  heroProofPoints,
  heroSubcopy,
  lastReplyProblemLabel,
  problemStatsSources,
  socialProof,
} from "@/content/boreas-home";
```

Update `HeroCinematic` to pass `scrollYProgress` down:

```tsx
<HeroCinematicLeftColumn scrollYProgress={scrollYProgress} />
```

- [ ] **Step 2: Crossfade the time chip between problem and solution labels**

In `HeroCardClusterCinematic`, replace the static bottom-left chip with a crossfading version, and thread `scrollYProgress` through for the label (the trigger props on `AppointmentsChip`/`DoctorCard`/`SearchPercentChip` from Task 4 are unchanged for now — Tasks 7-8 revisit their timing):

```tsx
function TimeChip({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const problemOpacity = useTransform(scrollYProgress, [PHASE_2_END - 0.04, PHASE_2_END], [1, 0]);
  const solutionOpacity = useTransform(scrollYProgress, [PHASE_2_END - 0.04, PHASE_2_END], [0, 1]);
  return (
    <div className="absolute bottom-4 left-0 z-[2] rounded-[var(--radius-pill)] border border-border bg-surface px-3.5 py-2">
      <div className="relative">
        <motion.span style={{ opacity: problemOpacity }} className="text-xs text-muted">
          {heroCardStats.lastReplyTime} · {lastReplyProblemLabel}
        </motion.span>
        <motion.span style={{ opacity: solutionOpacity }} className="absolute inset-0 whitespace-nowrap text-xs text-muted">
          {heroCardStats.lastReplyTime} · {heroCardStats.lastReplyLabel}
        </motion.span>
      </div>
    </div>
  );
}
```

Replace the last block of `HeroCardClusterCinematic` (the static bottom-left `div`) with `<TimeChip scrollYProgress={scrollYProgress} />`.

- [ ] **Step 3: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 4: Manual verification**

At scroll 0, confirm the eyebrow reads the problem-framing copy (amber) and the time chip reads "tu paciente sigue esperando". Scroll to roughly 30% through the pin (use the browser's scroll position or a quick `console.log` of `scrollYProgress.get()` via devtools) — the eyebrow must have crossfaded to `heroCredibility` (mint) and stay that way for the rest of the pin. The time chip should *not* have flipped yet at 30% (its threshold is `PHASE_2_END`, wired in Task 7) — confirm it still reads the problem label at 30%, this is expected at this point in the plan.

- [ ] **Step 5: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: phase 1 — problem-framing eyebrow and time-chip crossfade"
```

---

### Task 7: Phase 2 content — "Te encuentra" (30–65%)

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`HeroCardClusterCinematic`)

**Interfaces:**
- Consumes: `PHASE_1_END`, `PHASE_2_END` (Task 4), `NumberTrigger` progress mode (Task 2).

- [ ] **Step 1: Make the doctor card enter at `PHASE_1_END` instead of rendering statically**

Replace the doctor card block in `HeroCardClusterCinematic`:

```tsx
function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [0, 1]);
  const y = useTransform(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [24, 0]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute left-0 right-[50px] top-[30px] z-[1] rounded-[var(--radius-xl)] border border-border bg-surface p-[22px] shadow-[var(--shadow)]"
    >
      <ExampleBadge />
      <DoctorCard
        trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_1_END }}
        reduceMotion={false}
        instant
      />
    </motion.div>
  );
}
```

In `HeroCardClusterCinematic`, replace the doctor-card `<div>` (the one with `top-[30px]`) with `<DoctorCardEntrance scrollYProgress={scrollYProgress} />`.

- [ ] **Step 2: Verify the rating count-up fires once, not on every scroll direction change**

This is already covered by Task 2's `progressFired` state (`useState`, set once and never reset) inside `useAnimatedNumber` — no additional code needed here. This step is a verification-only step.

- [ ] **Step 3: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 4: Manual verification**

At scroll 0-29%, the doctor card must be invisible (`opacity: 0`) — confirm the search% chip and time chip are still visible on their own (they don't depend on the doctor card). Scroll past 30% — the doctor card fades and slides in, the rating counts from 0 to 4.8 once. Scroll back above 30% and forward past it again — the rating must *not* recount (it should already show 4.8 statically, since `progressFired` stays `true`). Scroll to 100% and back to 0% — same check.

- [ ] **Step 5: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: phase 2 — doctor card scroll-linked entrance, single-fire rating count-up"
```

---

### Task 8: Phase 3 content — "Te escribe y agenda" (65–100%)

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`HeroCardClusterCinematic`)

**Interfaces:**
- Consumes: `PHASE_2_END` (Task 4), `TimeChip` (Task 6, already flips at `PHASE_2_END` — no change needed here).

- [ ] **Step 1: Make the appointments chip appear and count at `PHASE_2_END`**

Replace the appointments chip block in `HeroCardClusterCinematic`:

```tsx
function AppointmentsChipEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [0, 1]);
  return (
    <motion.div style={{ opacity }} className="absolute right-0 top-0 z-[2]">
      <AppointmentsChip
        trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_2_END }}
        reduceMotion={false}
      />
    </motion.div>
  );
}
```

Replace the appointments chip `<div>` at the top of `HeroCardClusterCinematic` with `<AppointmentsChipEntrance scrollYProgress={scrollYProgress} />`.

- [ ] **Step 2: Give the WhatsApp button a subtle settle treatment (no glow, no pulse)**

`DoctorCard`'s WhatsApp button is decorative (`tabIndex={-1} aria-hidden="true"`, not the real CTA). Add a small scale-up as the cluster settles, applied from the parent so `DoctorCard` itself doesn't need a new prop. In `DoctorCardEntrance` (Task 7), wrap the WhatsApp affordance with a settle transform — since `DoctorCard` renders the button internally, apply the settle to the whole card via a second `useTransform` on the same wrapping `motion.div`:

```tsx
function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useTransform(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [0, 1]);
  const y = useTransform(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [24, 0]);
  const settleScale = useTransform(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);
  return (
    <motion.div
      style={{ opacity, y, scale: settleScale }}
      className="absolute left-0 right-[50px] top-[30px] z-[1] rounded-[var(--radius-xl)] border border-border bg-surface p-[22px] shadow-[var(--shadow)]"
    >
      <ExampleBadge />
      <DoctorCard
        trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_1_END }}
        reduceMotion={false}
        instant
      />
    </motion.div>
  );
}
```

- [ ] **Step 3: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 4: Manual verification**

Scroll through the full pin. At 65%, the time chip flips to "tu consultorio respondió" (already wired in Task 6), the appointments chip fades in and counts to 3, and the doctor card settles with a barely-perceptible scale-up — confirm it reads as "settling," not as a glow/pulse/bounce (open devtools performance if unsure whether it overshoots — it must not). Past ~70%, nothing further changes through 100%; the pin releases cleanly into `ProblemSection`.

- [ ] **Step 5: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: phase 3 — appointments chip entrance, doctor card settle treatment"
```

---

### Task 9: Mobile pin (2 phases, ≤150vh) with real-device gate

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`HeroCinematic`, new `HeroCardMobilePinned`)

**Interfaces:**
- Consumes: `useHeroScrollPhases` (a second, independent instance — mobile gets its own container/progress, not shared with desktop), `NumberTrigger` progress mode.

- [ ] **Step 1: Add the mobile pin constant**

Alongside `HERO_PIN_VH_DESKTOP`:

```ts
const HERO_PIN_VH_MOBILE = 150;
const MOBILE_PHASE_END = 0.5; // "busca+encuentra" → "responde+agenda"
```

- [ ] **Step 2: Build `HeroCardMobilePinned`**

```tsx
function HeroCardMobilePinned() {
  const { containerRef, scrollYProgress } = useHeroScrollPhases();
  const problemOpacity = useTransform(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [1, 0]);
  const solutionOpacity = useTransform(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [0, 1]);
  const appointmentsOpacity = useTransform(scrollYProgress, [MOBILE_PHASE_END, MOBILE_PHASE_END + 0.08], [0, 1]);

  return (
    <div ref={containerRef} className="mt-10 block lg:hidden" style={{ height: `${HERO_PIN_VH_MOBILE}vh` }}>
      <div className="sticky top-[88px] rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <ExampleBadge />
        <DoctorCard
          trigger={{ mode: "progress", value: scrollYProgress, threshold: 0.1 }}
          reduceMotion={false}
          instant
        />
        <div className="relative mt-3 h-[16px] text-[13px]">
          <motion.span style={{ opacity: problemOpacity }} className="absolute inset-0 text-muted">
            {heroCardStats.lastReplyTime} · {lastReplyProblemLabel}
          </motion.span>
          <motion.span style={{ opacity: solutionOpacity }} className="absolute inset-0 whitespace-nowrap text-muted">
            {heroCardStats.lastReplyTime} · {heroCardStats.lastReplyLabel}
          </motion.span>
        </div>
        <div className="mt-4 flex gap-3">
          <motion.div style={{ opacity: appointmentsOpacity }} className="flex flex-1">
            <AppointmentsChip
              trigger={{ mode: "progress", value: scrollYProgress, threshold: MOBILE_PHASE_END }}
              reduceMotion={false}
              compact
            />
          </motion.div>
          <SearchPercentChip
            trigger={{ mode: "progress", value: scrollYProgress, threshold: 0 }}
            reduceMotion={false}
            compact
          />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire it into `HeroCinematic`**

```tsx
function HeroCinematic() {
  const { containerRef, scrollYProgress } = useHeroScrollPhases();

  return (
    <section className="relative bg-hero-glow transition-[background,colors] duration-[280ms]">
      <div className="mx-auto w-full max-w-[1460px] px-4 pt-20 sm:px-6 lg:hidden">
        <HeroCinematicLeftColumn scrollYProgress={scrollYProgress} />
        <HeroCardMobilePinned />
      </div>
      <div ref={containerRef} className="hidden lg:block" style={{ height: `${HERO_PIN_VH_DESKTOP}vh` }}>
        <div className="sticky top-0 flex h-screen items-center overflow-hidden">
          <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
            <HeroCinematicLeftColumn scrollYProgress={scrollYProgress} />
            <HeroCardClusterCinematic scrollYProgress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

Note: `HeroCinematicLeftColumn` now renders twice in the DOM (once for the `lg:hidden` mobile block, once for the `lg:block` desktop block) — each visible only at its breakpoint via CSS, matching the pattern `HeroStatic` already uses today for its own left column vs. `HeroCardMobile`/`HeroCardCluster` split. This means `id="hero-primary-cta"` would exist twice simultaneously. Fix: only the desktop instance keeps the id; give the mobile-block instance's CTA a different id and no observer target, OR — simpler and consistent with "only one hero variant's primary CTA should be the one the header watches at a time" — since the two blocks are mutually exclusive via `lg:hidden`/`lg:block` (only one is ever laid out and visible, but **both exist in the DOM and both have non-zero size in Tailwind's default responsive model — `lg:hidden` sets `display: none` above the breakpoint, not real exclusivity below it**), duplicate ids are invalid HTML regardless. Change `HeroCinematicLeftColumn` to accept an `id` prop:

```tsx
function HeroCinematicLeftColumn({ scrollYProgress, ctaId }: { scrollYProgress: MotionValue<number>; ctaId: string }) {
  // ...unchanged body, except the primary CTA anchor:
  <a
    id={ctaId}
    href="#contacto"
    className="btn btn-p w-full sm:w-auto"
    onClick={() => trackAnalyticsEvent({ name: "cta_click", surface: "hero" })}
  >
```

Call sites: mobile block passes `ctaId="hero-primary-cta-mobile"`, desktop block passes `ctaId="hero-primary-cta"`. Then revisit Task 5's header effect to watch *both*:

```tsx
  useEffect(() => {
    const ids = ["hero-primary-cta", "hero-primary-cta-mobile"];
    const heroCtas = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (heroCtas.length === 0) return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        }
        setShowHeaderCta(visible.size === 0);
      },
      { threshold: 0 }
    );
    heroCtas.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
```

This also correctly covers `HeroStatic`, whose single CTA keeps the plain `id="hero-primary-cta"` from Task 4 — it's simply the only element in `ids` that resolves via `getElementById` on that render path, and the `filter` drops the missing one.

- [ ] **Step 4: Typecheck, lint, build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: clean.

- [ ] **Step 5: Manual verification — devtools mobile emulation**

Using the browser's device toolbar (e.g. iPhone 12/Pixel 5 viewport), load the homepage. Confirm: left column content visible immediately, mobile card sticks near the top of the viewport while scrolling ~1.5 screen-heights, flips its time-chip label and reveals the appointments chip partway through, then releases into `ProblemSection`. Confirm the header CTA behaves correctly here too (Task 5's dual-id observer).

- [ ] **Step 6: Real-device verification gate — required before this task is done**

Load the deployed preview (or a tunneled dev server) on an actual Android and iOS phone, mid-range hardware if available. Scroll through the mobile hero at normal thumb-scroll speed. **Decision point:**
- If it scrolls smoothly, no visible jank, no viewport-height jump from the address bar collapsing mid-sequence → keep this implementation.
- If it jankes or the address-bar viewport shift breaks the sticky positioning → **do not ship the mobile pin.** Replace `HeroCardMobilePinned` with the original `HeroCardMobile` (from `HeroStatic`, reused as-is) inside `HeroCinematic`'s mobile block, dropping the pin/scroll-linked behavior for mobile only, matching the spec's explicit plan B (`docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md`, "Estructura del pin → Mobile"). Desktop pin (Tasks 4-8) is unaffected either way.

This step cannot be automated or skipped — it's the explicit decision point the spec and the checkpoint doc both call out as needing a real device, not devtools.

- [ ] **Step 7: Commit**

```bash
git add components/hero/boreas-hero.tsx components/hero/header.tsx
git commit -m "feat: mobile pinned hero sequence (2 phases) + dual-CTA header observer"
```

(If Step 6 required falling back to plan B, commit that fallback instead, with message `fix: mobile hero falls back to static T4 card — pinned sequence janked on real device`.)

---

### Task 10: Full verification pass

**Files:** none (verification only)

- [ ] **Step 1: Full clean build**

Run: `npx tsc --noEmit && npm run lint && npm run build`
Expected: all three clean — this repeats prior tasks' checks as a final combined gate, matching the standard the T1-T10 checkpoint held itself to.

- [ ] **Step 2: Browser QA checklist**

Using the project's preview tooling, walk through:
- Desktop, no reduced motion: full 3-phase sequence, CTA clickable throughout, header CTA appears only after pin release.
- Desktop, `prefers-reduced-motion: reduce`: identical to the pre-existing T4 hero (no pin, immediate fade-in), header CTA still governed by the (now-static) `#hero-primary-cta`.
- Mobile viewport (devtools), both motion settings, same two checks.
- Keyboard-only pass: confirm the primary CTA remains reachable and focusable at every scroll position (a pinned CTA that's visually present but behind a stacking-context issue would still be a regression even if `Step 5` visual checks pass).

- [ ] **Step 3: Confirm mobile real-device decision from Task 9 is reflected in the code**

If Task 9 fell back to plan B, verify `HeroCardMobilePinned` is no longer referenced (or is intentionally unused pending a future retry) and `HeroCardMobile` is used instead — no dead code left importing the removed path.

- [ ] **Step 4: Update the spec's status line**

In `docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md`, change the `**Status:**` line from "Design approved, not yet implemented" to "Implemented — see `components/hero/boreas-hero.tsx`. Mobile pin: [kept | fell back to static T4, see Task 9 Step 6]." (fill in the actual outcome).

- [ ] **Step 5: Commit**

```bash
git add docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md
git commit -m "docs: mark hero cinematic scroll spec as implemented"
```

---

## Self-Review

**Spec coverage:** 3-phase desktop arc (Task 6-8), static left column (Task 4/6, never gated), mobile 2-phase pin + real-device plan-B gate (Task 9), reduced-motion collapse to T4 (Task 4's branch, unchanged `HeroStatic`), header CTA rule (Task 5, extended in Task 9 for the dual-id case), chip flip mechanic (Task 6/8), eyebrow crossfade + copy (Task 1/6), anti-bans (no springs anywhere in this plan; `EASE` reused throughout; WhatsApp settle in Task 8 is a 1.5% scale, not a glow/pulse). Proof points: confirmed static in the left column per the spec correction, untouched by any task. Analytics/interaction tracking for scroll phases: explicitly out of scope per the spec, not present in this plan.

**Placeholder scan:** no TBD/TODO remain — Task 9's real-device gate is a genuine runtime decision point (not a placeholder), with both outcomes fully specified in code.

**Type consistency:** `NumberTrigger` (Task 2) is the single trigger type used by every subsequent task; `scrollYProgress: MotionValue<number>` threaded consistently through `HeroCinematicLeftColumn`, `HeroCardClusterCinematic`, `TimeChip`, `DoctorCardEntrance`, `AppointmentsChipEntrance`, `HeroCardMobilePinned`. `PHASE_1_END`/`PHASE_2_END`/`MOBILE_PHASE_END` are the only threshold constants introduced, each defined once (Task 4, Task 9) and reused, not redefined.
