# Hero Motion System + Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build 6 reusable framer-motion primitives (`lib/motion/`, `components/motion/`) and use them to redesign the Hero section (desktop + mobile) so it stops reading as "barato y vacío" — bigger typography, more visual elements, real depth via parallax and a card stack, without reconstructing the already-tested scroll-pin mechanics from PR #67.

**Architecture:** The pin/phase mechanism in `components/hero/boreas-hero.tsx` (3 desktop phases, 2 mobile phases, tested on real iPhone hardware) is reused unchanged. New shared primitives replace ad-hoc scroll-linked code inline in Hero, and 5 new visual elements are added to the shared sub-components (`DoctorCard`, `RatingBlock`, `ExampleBadge` call sites) so they appear identically across `HeroStatic`, `HeroCinematic` (desktop), and mobile — no per-variant duplication.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, framer-motion 12.38.0. No new dependencies.

## Global Constraints

- No gsap. framer-motion + CSS only, project-wide (`DESIGN.md` Motion Rules).
- Every primitive only animates `transform` (x/y/scale/rotate) and `opacity` — never `width`/`height`/`top`/`left`.
- Every primitive accepts `reduceMotion` and is a no-op in that mode (no transform, final value shown immediately) — the off-switch lives in the primitive, not reimplemented per consumer.
- Binding a `useTransform`-derived `MotionValue` via `style={{ prop: mv }}` on a `motion.*` element silently fails to write to the DOM in this exact stack (React 19 / Next 16 / framer-motion 12.38.0) — always mirror through `useMotionValueState` (`lib/use-motion-value-state.ts`) and bind a plain number to a plain (non-`motion.*`) element. `lib/motion/use-scrub.ts` (Task 2) wraps this so later tasks never touch `useTransform`/`useMotionValueState` directly.
- Ease curve `[0.22, 1, 0.36, 1]` (exported as `EASE` in `boreas-hero.tsx`) is the default everywhere. A subtle spring/overshoot is allowed only for punctual micro-interactions (Task 7 formalizes this in `DESIGN.md`) — never the default.
- No cards anidadas, no visible phase labels on screen, one primary CTA per viewport, headline visible from scroll 0 (all carried over from `docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md`, still binding).
- Spec: `docs/superpowers/specs/2026-07-16-hero-motion-system-and-redesign.md`.

---

### Task 1: `lib/motion/use-scroll-pin.ts` — generalize the pin hook

**Files:**
- Create: `lib/motion/use-scroll-pin.ts`
- Delete: `lib/use-hero-scroll-phases.ts`
- Modify: `components/hero/boreas-hero.tsx:1-18` (imports), `:504` (type annotation), `:546-547` (hook calls)

**Interfaces:**
- Produces: `useScrollPin(): ScrollPin` where `interface ScrollPin { containerRef: React.RefObject<HTMLDivElement | null>; scrollYProgress: MotionValue<number>; }`

- [ ] **Step 1: Create the generalized hook**

```ts
// lib/motion/use-scroll-pin.ts
"use client";

import { useRef } from "react";
import { useScroll, type MotionValue } from "framer-motion";

export interface ScrollPin {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}

/**
 * Drives a pinned scroll sequence. `containerRef` must be attached to the
 * tall (N vh) scroll-driver div; `scrollYProgress` goes 0→1 across that
 * div's full scrollable height, independent of any sticky child inside it.
 */
export function useScrollPin(): ScrollPin {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  return { containerRef, scrollYProgress };
}
```

- [ ] **Step 2: Delete the old file**

```bash
rm lib/use-hero-scroll-phases.ts
```

- [ ] **Step 3: Update `boreas-hero.tsx` to use the new hook**

In the import block (line 18), replace:

```ts
import { useHeroScrollPhases, type HeroScrollPhases } from "@/lib/use-hero-scroll-phases";
```

with:

```ts
import { useScrollPin, type ScrollPin } from "@/lib/motion/use-scroll-pin";
```

At line 504, replace:

```ts
function HeroCardMobilePinned({ containerRef, scrollYProgress }: HeroScrollPhases) {
```

with:

```ts
function HeroCardMobilePinned({ containerRef, scrollYProgress }: ScrollPin) {
```

At lines 546-547, replace:

```ts
const { containerRef: desktopContainerRef, scrollYProgress: desktopScrollYProgress } = useHeroScrollPhases();
const { containerRef: mobileContainerRef, scrollYProgress: mobileScrollYProgress } = useHeroScrollPhases();
```

with:

```ts
const { containerRef: desktopContainerRef, scrollYProgress: desktopScrollYProgress } = useScrollPin();
const { containerRef: mobileContainerRef, scrollYProgress: mobileScrollYProgress } = useScrollPin();
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: both clean, no references to `use-hero-scroll-phases` remain (`grep -rn "use-hero-scroll-phases" --include="*.tsx" --include="*.ts" .` returns nothing outside `.next`/`node_modules`).

- [ ] **Step 5: Commit**

```bash
git add lib/motion/use-scroll-pin.ts components/hero/boreas-hero.tsx
git rm lib/use-hero-scroll-phases.ts
git commit -m "refactor: generalize hero scroll-pin hook into lib/motion/"
```

---

### Task 2: `lib/motion/use-scrub.ts` — formalize the scrub pattern

**Files:**
- Create: `lib/motion/use-scrub.ts`
- Modify: `components/hero/boreas-hero.tsx` (replace 7 `useMotionValueState(useTransform(...))` call sites)

**Interfaces:**
- Consumes: `useMotionValueState` from `lib/use-motion-value-state.ts` (unchanged, existing).
- Produces: `useScrub(progress: MotionValue<number>, input: [number, number], output: [number, number]): number`

- [ ] **Step 1: Create the hook**

```ts
// lib/motion/use-scrub.ts
"use client";

import { useTransform, type MotionValue } from "framer-motion";
import { useMotionValueState } from "@/lib/use-motion-value-state";

/**
 * Scrubs a numeric value from a scroll-linked MotionValue's progress range
 * into a plain React number, re-rendering on every scroll frame. Wraps
 * useTransform + useMotionValueState — see use-motion-value-state.ts for why
 * the mirror-to-state step is required in this stack.
 */
export function useScrub(
  progress: MotionValue<number>,
  input: [number, number],
  output: [number, number]
): number {
  return useMotionValueState(useTransform(progress, input, output));
}
```

- [ ] **Step 2: Replace call sites in `boreas-hero.tsx`**

Replace the import line:

```ts
import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
```

with:

```ts
import { motion, useReducedMotion, type MotionValue } from "framer-motion";
```

Add to the import block:

```ts
import { useScrub } from "@/lib/motion/use-scrub";
```

Remove the now-unused import:

```ts
import { useMotionValueState } from "@/lib/use-motion-value-state";
```

In `HeroCinematicLeftColumn` (around line 359), replace:

```ts
const problemEyebrowOpacity = useMotionValueState(
  useTransform(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0])
);
```

with:

```ts
const problemEyebrowOpacity = useScrub(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0]);
```

In `TimeChip` (around line 439), replace:

```ts
const problemOpacity = useMotionValueState(
  useTransform(scrollYProgress, [PHASE_2_END - 0.04, PHASE_2_END], [1, 0])
);
```

with:

```ts
const problemOpacity = useScrub(scrollYProgress, [PHASE_2_END - 0.04, PHASE_2_END], [1, 0]);
```

In `DoctorCardEntrance` (around lines 458-460), replace:

```ts
const opacity = useMotionValueState(useTransform(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [0, 1]));
const y = useMotionValueState(useTransform(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [24, 0]));
const settleScale = useMotionValueState(useTransform(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]));
```

with:

```ts
const opacity = useScrub(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [0, 1]);
const y = useScrub(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [24, 0]);
const settleScale = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);
```

In `AppointmentsChipEntrance` (around line 477), replace:

```ts
const opacity = useMotionValueState(useTransform(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [0, 1]));
```

with:

```ts
const opacity = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [0, 1]);
```

In `HeroCardMobilePinned` (around lines 505-507), replace:

```ts
const problemOpacity = useMotionValueState(useTransform(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [1, 0]));
const solutionOpacity = useMotionValueState(useTransform(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [0, 1]));
const appointmentsOpacity = useMotionValueState(useTransform(scrollYProgress, [MOBILE_PHASE_END, MOBILE_PHASE_END + 0.08], [0, 1]));
```

with:

```ts
const problemOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [1, 0]);
const solutionOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [0, 1]);
const appointmentsOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END, MOBILE_PHASE_END + 0.08], [0, 1]);
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all clean. `grep -n "useMotionValueState\|useTransform" components/hero/boreas-hero.tsx` returns nothing (both fully replaced).

- [ ] **Step 4: Manual smoke test**

Start the dev server, open the Hero section, scroll through all 3 desktop phases and both mobile phases. Expected: identical behavior to before this task — this is a pure refactor, no visual change.

- [ ] **Step 5: Commit**

```bash
git add lib/motion/use-scrub.ts components/hero/boreas-hero.tsx
git commit -m "refactor: formalize scroll-scrub pattern into lib/motion/use-scrub"
```

---

### Task 3: `components/motion/parallax-layer.tsx`

**Files:**
- Create: `components/motion/parallax-layer.tsx`

**Interfaces:**
- Consumes: `useScrub` from `lib/motion/use-scrub.ts` (Task 2).
- Produces: `ParallaxLayer` component, props `{ progress: MotionValue<number>; speed: number; range?: [number, number]; reduceMotion: boolean; className?: string; children: React.ReactNode }`.

- [ ] **Step 1: Create the component**

```tsx
// components/motion/parallax-layer.tsx
"use client";

import type { MotionValue } from "framer-motion";
import { useScrub } from "@/lib/motion/use-scrub";

/**
 * Moves its children vertically at a fraction of scroll speed, creating a
 * depth illusion when two layers under the same `progress` use different
 * `speed` values. Pure transform:translate3d — no WebGL.
 */
export function ParallaxLayer({
  progress,
  speed,
  range = [0, 100],
  reduceMotion,
  className,
  children,
}: {
  progress: MotionValue<number>;
  /** 0 = fixed, 1 = moves 1:1 with scroll, 0.3 = moves at 30% speed. */
  speed: number;
  /** [min, max] px offset applied across progress 0→1, before the speed scale. */
  range?: [number, number];
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const offset = useScrub(progress, [0, 1], [range[0] * speed, range[1] * speed]);

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={className} style={{ transform: `translate3d(0, ${offset}px, 0)`, willChange: "transform" }}>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Expected: clean (component is not consumed yet — Task 12 is the first real usage).

- [ ] **Step 3: Commit**

```bash
git add components/motion/parallax-layer.tsx
git commit -m "feat: add ParallaxLayer motion primitive"
```

---

### Task 4: `components/motion/text-reveal.tsx`

**Files:**
- Create: `components/motion/text-reveal.tsx`

**Interfaces:**
- Consumes: `useScrub` from `lib/motion/use-scrub.ts` (Task 2).
- Produces: `TextReveal` component, props `{ children: React.ReactNode; reduceMotion: boolean; trigger: { mode: "progress"; value: MotionValue<number>; range: [number, number] } | { mode: "delay"; ms?: number }; className?: string }`.

- [ ] **Step 1: Create the component**

```tsx
// components/motion/text-reveal.tsx
"use client";

import { useEffect, useState } from "react";
import type { MotionValue } from "framer-motion";
import { useScrub } from "@/lib/motion/use-scrub";

/**
 * Reveals text via an opacity ramp from 0.2 to 1 — never 0, so content stays
 * legible from the first frame (DESIGN.md Motion Rules: content is never
 * gated behind animation). Two trigger modes: tied to a scroll-linked
 * MotionValue's progress range, or a fixed mount-time delay.
 */
export function TextReveal({
  children,
  reduceMotion,
  trigger,
  className,
}: {
  children: React.ReactNode;
  reduceMotion: boolean;
  trigger:
    | { mode: "progress"; value: MotionValue<number>; range: [number, number] }
    | { mode: "delay"; ms?: number };
  className?: string;
}) {
  if (trigger.mode === "progress") {
    return (
      <TextRevealProgress value={trigger.value} range={trigger.range} reduceMotion={reduceMotion} className={className}>
        {children}
      </TextRevealProgress>
    );
  }
  return (
    <TextRevealDelay ms={trigger.ms ?? 0} reduceMotion={reduceMotion} className={className}>
      {children}
    </TextRevealDelay>
  );
}

function TextRevealProgress({
  value,
  range,
  reduceMotion,
  className,
  children,
}: {
  value: MotionValue<number>;
  range: [number, number];
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const opacity = useScrub(value, range, [0.2, 1]);
  return (
    <div className={className} style={{ opacity: reduceMotion ? 1 : opacity }}>
      {children}
    </div>
  );
}

function TextRevealDelay({
  ms,
  reduceMotion,
  className,
  children,
}: {
  ms: number;
  reduceMotion: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [opacity, setOpacity] = useState(reduceMotion ? 1 : 0.2);
  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setTimeout(() => setOpacity(1), ms);
    return () => window.clearTimeout(timer);
  }, [ms, reduceMotion]);
  return (
    <div
      className={className}
      style={{ opacity, transition: reduceMotion ? undefined : "opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1)" }}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 3: Commit**

```bash
git add components/motion/text-reveal.tsx
git commit -m "feat: add TextReveal motion primitive"
```

---

### Task 5: `components/motion/horizontal-scroll-section.tsx`

**Files:**
- Create: `components/motion/horizontal-scroll-section.tsx`

**Interfaces:**
- Consumes: `useScrollPin` (Task 1), `useScrub` (Task 2).
- Produces: `HorizontalScrollSection` component, props `{ trackWidthVw: number; pinVh?: number; reduceMotion: boolean; children: React.ReactNode }`.

Not consumed by Hero — designed now so the motion system is complete for future sections (see spec, "Fuera de alcance"). No visual verification today; verified by type-check and build only.

- [ ] **Step 1: Create the component**

```tsx
// components/motion/horizontal-scroll-section.tsx
"use client";

import { useScrollPin } from "@/lib/motion/use-scroll-pin";
import { useScrub } from "@/lib/motion/use-scrub";

/**
 * Pins vertically, translates scroll progress into horizontal movement of an
 * inner track. Not consumed by Hero — designed now so the motion system is
 * complete; first real consumer will be a future gallery section (see
 * docs/superpowers/specs/2026-07-16-hero-motion-system-and-redesign.md,
 * "Fuera de alcance").
 */
export function HorizontalScrollSection({
  trackWidthVw,
  pinVh = 200,
  reduceMotion,
  children,
}: {
  /** Total width of the inner track, in vw units. Must be > 100. */
  trackWidthVw: number;
  pinVh?: number;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const { containerRef, scrollYProgress } = useScrollPin();
  const translateVw = useScrub(scrollYProgress, [0, 1], [0, -(trackWidthVw - 100)]);

  if (reduceMotion) {
    return (
      <div className="overflow-x-auto">
        <div style={{ width: `${trackWidthVw}vw` }} className="flex">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${pinVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="flex h-full"
          style={{ width: `${trackWidthVw}vw`, transform: `translate3d(${translateVw}vw, 0, 0)`, willChange: "transform" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all clean.

- [ ] **Step 3: Commit**

```bash
git add components/motion/horizontal-scroll-section.tsx
git commit -m "feat: add HorizontalScrollSection motion primitive (unconsumed)"
```

---

### Task 6: `components/motion/stacked-cards.tsx` — extract from Relevo, refactor Relevo to consume it

**Files:**
- Create: `components/motion/stacked-cards.tsx`
- Modify: `components/landing/relevo-example-carousel.tsx:12-21` (remove local `stackLayerStyles`), `:266-327` (replace manual stack JSX with `<StackedCards>`)

**Interfaces:**
- Produces: `StackedCards` component + `StackedCardLayer` type + `stackedCardLayerStyles` constant, all exported from `components/motion/stacked-cards.tsx`.
  - `interface StackedCardLayer { key: string; content: React.ReactNode }`
  - `StackedCards(props: { layers: StackedCardLayer[]; ghostLayers: StackedCardLayer[]; frontOverride?: { x: number; y: number; scale: number; opacity: number; blur: number }; clipInset?: string; radiusVar?: string; className?: string })`

- [ ] **Step 1: Create the primitive**

This is the height-stable, polished card-stack depth pattern fixed and pulled from `relevo-example-carousel.tsx` earlier in this session (commits `0e63e13`, then the shadow/blur polish pass) — generalized so any consumer can pass its own layer content instead of `ConversationCard`.

```tsx
// components/motion/stacked-cards.tsx
"use client";

export interface StackedCardLayer {
  key: string;
  content: React.ReactNode;
}

// Back layers read as soft shadow first, hint-of-content second (reference:
// relevo.chat's own stack is a pure dark blurred bleed, no visible card
// edges). No border on back layers — a crisp rounded-rect outline at any
// opacity still reads as "another card" instead of "shadow".
export const stackedCardLayerStyles = [
  { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, zIndex: 14 },
  { x: 24, y: 16, scale: 0.965, opacity: 0.22, blur: 6, zIndex: 13 },
  { x: 44, y: 30, scale: 0.93, opacity: 0.1, blur: 11, zIndex: 12 },
] as const;

/**
 * Renders a front card with 0-2 blurred "echo" layers behind it for depth.
 * Height is stable no matter which content is active: every possible layer
 * (ghostLayers) is rendered invisibly stacked in the same CSS grid cell
 * (grid-area: 1 / 1), so the wrapper's natural height is always the tallest
 * among them — no JS measurement, no per-change resize. For a static
 * (non-cycling) stack, pass the same array as both `layers` and
 * `ghostLayers`.
 */
export function StackedCards({
  layers,
  ghostLayers,
  frontOverride,
  clipInset = "-4px 0px -40px -40px",
  radiusVar = "var(--radius-sm)",
  className = "",
}: {
  /** Front-to-back. Only stackedCardLayerStyles.length are rendered. */
  layers: StackedCardLayer[];
  /** Every possible layer's content, for height-stable sizing (see above). */
  ghostLayers: StackedCardLayer[];
  /** Temporarily override the front (index 0) layer's transform/opacity/blur
   *  — e.g. a departure animation while cycling to a new front layer. */
  frontOverride?: { x: number; y: number; scale: number; opacity: number; blur: number };
  clipInset?: string;
  radiusVar?: string;
  className?: string;
}) {
  const visibleLayers = layers.slice(0, stackedCardLayerStyles.length);

  return (
    <div className={`relative overflow-x-clip pr-10 ${className}`} style={{ clipPath: `inset(${clipInset})` }}>
      <div className="pointer-events-none invisible grid" aria-hidden="true">
        {ghostLayers.map((layer) => (
          <div key={layer.key} className="overflow-hidden border border-line" style={{ gridArea: "1 / 1", borderRadius: radiusVar }}>
            {layer.content}
          </div>
        ))}
      </div>

      {visibleLayers.map((layer, index) => {
        const isFrontCard = index === 0;
        const style = isFrontCard && frontOverride ? { ...frontOverride, zIndex: 15 } : stackedCardLayerStyles[index];
        return (
          <div
            key={layer.key}
            aria-hidden="true"
            className={`absolute inset-x-0 top-0 overflow-hidden pointer-events-none transition-all duration-500 ${
              isFrontCard ? "border border-line" : ""
            }`}
            style={{
              borderRadius: radiusVar,
              transform: `translate3d(${style.x}px, ${style.y}px, 0) scale(${style.scale})`,
              opacity: style.opacity,
              zIndex: style.zIndex,
              filter: `blur(${style.blur}px)`,
              transformOrigin: "top left",
              boxShadow: isFrontCard ? "var(--shadow)" : "16px 22px 48px -10px rgba(20,18,15,0.38)",
            }}
          >
            {layer.content}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Refactor `relevo-example-carousel.tsx` to consume it**

Remove the local `stackLayerStyles` constant and its comment (lines 12-21):

```ts
// DELETE these lines entirely:
// Back layers read as soft shadow first, hint-of-content second (reference:
// relevo.chat's own stack is a pure dark blurred bleed, no visible card
// edges). More offset/blur and less opacity than a naive "duplicate card"
// treatment, and no border on the back layers — a crisp rounded-rect
// outline at any opacity still reads as "another card" instead of "shadow".
const stackLayerStyles = [
  { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, zIndex: 14 },
  { x: 24, y: 16, scale: 0.965, opacity: 0.22, blur: 6, zIndex: 13 },
  { x: 44, y: 30, scale: 0.93, opacity: 0.1, blur: 11, zIndex: 12 },
] as const;
```

Add the import at the top of the file:

```ts
import { StackedCards, type StackedCardLayer } from "@/components/motion/stacked-cards";
```

Replace the entire "Card stack" block (lines 259-328, from `{/* Card stack */}` through the closing `</button>`) with:

```tsx
      {/* Card stack */}
      <button
        type="button"
        onClick={nextExample}
        aria-label="Ver el siguiente ejemplo"
        className="mt-6 block w-full cursor-pointer rounded-[var(--radius-sm)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <StackedCards
          layers={stackExamples.map((preview, previewIndex): StackedCardLayer => ({
            key: `${preview.business.name}-${previewIndex}-${activeIndex}`,
            content: <ConversationCard preview={preview} isFrontCard={previewIndex === 0} />,
          }))}
          ghostLayers={relevoExamples.map((preview): StackedCardLayer => ({
            key: preview.business.name,
            content: <ConversationCard preview={preview} isFrontCard={true} />,
          }))}
          frontOverride={stackPhase === "shifting" ? { x: -30, y: -2, scale: 0.965, opacity: 0, blur: 5 } : undefined}
        />
      </button>
```

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all clean.

- [ ] **Step 4: Manual regression test**

Start the dev server, scroll to `#relevo`, click through all 7 examples. Expected: identical behavior to the fixed/polished version from earlier this session — container height stays exactly constant across every example, no hard-clipped blur, soft shadow bleed on back layers. This is a pure refactor (same values, same markup shape), not a new visual change.

- [ ] **Step 5: Commit**

```bash
git add components/motion/stacked-cards.tsx components/landing/relevo-example-carousel.tsx
git commit -m "refactor: extract StackedCards primitive from Relevo carousel"
```

---

### Task 7: Update `DESIGN.md` Motion Rules

**Files:**
- Modify: `DESIGN.md:113-121` (Prohibitions section)

**Interfaces:** None (documentation only).

- [ ] **Step 1: Replace the Prohibitions section**

Replace:

```markdown
## Prohibitions (carried over, still binding)

- No glass/backdrop-filter anywhere (including the hero, now retired).
- No decorative glow/orbs anywhere.
- No hardcoded color hex outside `globals.css` tokens.
- No side-stripe borders (`border-left/right` of color as accent).
- No gradient text.
- No mixing gsap + framer-motion in the same component (gsap is retired project-wide; framer-motion is the only animation library in active use).
```

with:

```markdown
## Prohibitions (carried over, still binding)

- No hardcoded color hex outside `globals.css` tokens.
- No side-stripe borders (`border-left/right` of color as accent).
- No mixing gsap + framer-motion in the same component (gsap is retired project-wide; framer-motion is the only animation library in active use).
- No cards anidadas (see radius scale above) — still banned even where the rules below relax: nesting reads as generic/templated, the opposite of the direction those rules exist to serve.
- No visible phase labels on screen ("Fase 1", "Confianza", etc.) — choreography is understood by what elements do, not by tutorial-style narration.

### Glass/glow/gradient — relaxed 2026-07-16 (owner directive)

> Previously fully banned. Now allowed **as a punctual accent at a single moment of
> impact per section** — not as decorative wallpaper repeated throughout. This is a
> narrower rule than "banned," not "anything goes":
> - Glass/backdrop-filter: allowed for one deliberate surface per section at most.
> - Decorative glow/orbs: allowed as an atmospheric background layer (e.g. Hero's
>   parallax background texture), not stacked on every card.
> - Gradient text: allowed on headline-scale text at a moment of impact, not on
>   body copy or repeated UI labels.

### Easing — relaxed 2026-07-16 (owner directive)

> Ease-out exponential (`[0.22, 1, 0.36, 1]`) remains the default for everything.
> A subtle spring/overshoot is now allowed, but only for punctual micro-interactions
> (e.g. a card settling into place) — never a full bounce/elastic keyframe, and never
> the default for section-level reveals.
```

- [ ] **Step 2: Verify**

```bash
grep -n "No glass\|No decorative glow\|No gradient text" DESIGN.md
```

Expected: no output (old blanket bans removed); `grep -n "punctual accent\|Easing — relaxed" DESIGN.md` shows the new sections present.

- [ ] **Step 3: Commit**

```bash
git add DESIGN.md
git commit -m "docs: relax glass/glow/gradient/easing bans per maximalist motion directive"
```

---

### Task 8: Hero — typography scale + `TextReveal` on the headline

**Files:**
- Modify: `content/boreas-home.ts` (no change needed — reuses `heroHeadline`)
- Modify: `components/hero/boreas-hero.tsx` (H1 + wordmark sizing in `HeroStatic` and `HeroCinematicLeftColumn`)

**Interfaces:**
- Consumes: `TextReveal` from `components/motion/text-reveal.tsx` (Task 4).

- [ ] **Step 1: Bump the H1 clamp in both `HeroStatic` and `HeroCinematicLeftColumn`**

In `HeroStatic` (around line 299), replace:

```ts
style={{ fontSize: "clamp(1.85rem, 4vw, 3.8rem)" }}
```

with:

```ts
style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
```

In `HeroCinematicLeftColumn` (around line 392), same replacement — from `"clamp(1.85rem, 4vw, 3.8rem)"` to `"clamp(2.4rem, 5.6vw, 5.4rem)"`.

- [ ] **Step 2: Wrap the H1 in `HeroCinematicLeftColumn` with `TextReveal`**

Import at the top of `boreas-hero.tsx`:

```ts
import { TextReveal } from "@/components/motion/text-reveal";
```

In `HeroCinematicLeftColumn` (around lines 388-395), replace:

```tsx
      <motion.h1
        variants={reveal}
        transition={{ duration: 0.7, ease }}
        className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
        style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
      >
        {heroHeadline}
      </motion.h1>
```

with:

```tsx
      <motion.div variants={reveal} transition={{ duration: 0.7, ease }}>
        <TextReveal reduceMotion={false} trigger={{ mode: "delay", ms: 200 }}>
          <h1
            className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
          >
            {heroHeadline}
          </h1>
        </TextReveal>
      </motion.div>
```

`HeroStatic`'s H1 is left as a plain `motion.h1` (no `TextReveal`) — it's the reduced-motion fallback, where `TextReveal`'s own `reduceMotion` branch would just render final-state anyway, so wrapping it adds a layer of indirection with no visible effect. Keep it simple there.

- [ ] **Step 3: Verify types**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 4: Visual verification**

Start the dev server, load the Hero section fresh (hard refresh, not HMR — `TextReveal`'s delay trigger only fires once per mount). Expected: the H1 is legible immediately at ~20% opacity, brightens to full within ~200-800ms after mount. Confirm at both mobile (375px) and desktop (1440px) viewport widths that the bigger clamp doesn't cause the headline to overflow its column or collide with the wordmark above it — if it does, tighten the clamp's max value (currently `5.4rem`) until it fits at 1440px, re-verify.

- [ ] **Step 5: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: bigger Hero H1 scale + TextReveal opacity ramp"
```

---

### Task 9: Hero — verification badge + location/specialty chip

**Files:**
- Modify: `content/boreas-home.ts` (add `heroVerifiedLabel`, `heroLocationLabel`)
- Modify: `components/hero/boreas-hero.tsx` (`ExampleBadge` call sites, `DoctorCard`)

**Interfaces:**
- Produces: `VerifiedBadge()` component (new, local to `boreas-hero.tsx`).

- [ ] **Step 1: Add content constants**

In `content/boreas-home.ts`, after the `exampleBadgeLabel` export (around line 40), add:

```ts
export const heroVerifiedLabel = "Verificado";

// Reuses socialProof.mockupDoctor's own city context — CDMX is already the
// city used for other example businesses in this file (relevoExamples),
// kept consistent rather than inventing a new one.
export const heroLocationLabel = "CDMX";
```

- [ ] **Step 2: Add `VerifiedBadge` next to `ExampleBadge`**

In `boreas-hero.tsx`, update the import from `content/boreas-home` to include the two new constants:

```ts
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
```

After the `ExampleBadge` function (around line 189), add:

```tsx
function VerifiedBadge() {
  return (
    <span className="absolute -top-2.5 right-4 flex items-center gap-1 rounded-[var(--radius-pill)] border border-mint/30 bg-mint/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-mint">
      <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      {heroVerifiedLabel}
    </span>
  );
}
```

Add `<VerifiedBadge />` immediately after every `<ExampleBadge />` call site — there are 4: in `HeroCardCluster` (~line 210), `HeroCardMobile` (~line 247), `DoctorCardEntrance` (~line 466), and `HeroCardMobilePinned` (~line 512). Each becomes:

```tsx
        <ExampleBadge />
        <VerifiedBadge />
```

- [ ] **Step 3: Add the location/specialty chip inside `DoctorCard`**

In the `DoctorCard` function (around lines 91-94), replace:

```tsx
        <div>
          <p className="text-[15.5px] font-semibold leading-tight text-foreground">{doctor.name}</p>
          <p className="mt-0.5 text-[13px] text-muted">{doctor.specialty}</p>
        </div>
```

with:

```tsx
        <div>
          <p className="text-[15.5px] font-semibold leading-tight text-foreground">{doctor.name}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
            <p className="text-[13px] text-muted">{doctor.specialty}</p>
            <span className="rounded-[var(--radius-pill)] border border-line bg-elevated px-2 py-0.5 text-[11px] text-muted">
              {heroLocationLabel}
            </span>
          </div>
        </div>
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 5: Visual verification**

Load the Hero section (both `HeroStatic`/reduced-motion and `HeroCinematic`/normal), desktop and mobile. Expected: a small green "✓ Verificado" pill on the doctor card's top-right corner (mirroring the existing "Ejemplo ilustrativo" pill on the top-left), and a "CDMX" pill next to the specialty text. Confirm neither pill overlaps or clips against the card's own border at 375px width — if the two top badges collide at narrow widths, stack them (`VerifiedBadge` moves to `-top-2.5 right-4` only above `sm:`, and drops to inline below the name at mobile widths) and re-verify.

- [ ] **Step 6: Commit**

```bash
git add content/boreas-home.ts components/hero/boreas-hero.tsx
git commit -m "feat: add verification badge and location/specialty chip to doctor card"
```

---

### Task 10: Hero — patient avatar mini-stack

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`RatingBlock`)

**Interfaces:** None new — modifies an existing shared component.

- [ ] **Step 1: Replace the plain review-count text with an avatar stack**

In `RatingBlock` (around lines 55-71), replace:

```tsx
  return (
    <div ref={ref} className="flex items-baseline gap-2">
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
      <span className="text-[13px] text-muted">
        {doctor.reviewCount} {heroCardStats.reviewCountLabel}
      </span>
    </div>
  );
```

with:

```tsx
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
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

- [ ] **Step 3: Visual verification**

Load the Hero section. Expected: 3 small overlapping circular initials chips between the rating number and "+124 reseñas" text (127 total minus the 3 shown). Confirm it doesn't wrap awkwardly at 375px width — `flex-wrap` on the parent should let the avatar group + count drop to their own line if the row is too narrow; verify that looks intentional, not broken, and adjust `gap-2`/avatar size if it looks cramped.

- [ ] **Step 4: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: add patient avatar mini-stack to doctor rating block"
```

---

### Task 11: Hero — second depth layer behind the doctor card

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`HeroCardCluster`, `DoctorCardEntrance`)

**Interfaces:**
- Consumes: `StackedCards`, `type StackedCardLayer` from `components/motion/stacked-cards.tsx` (Task 6).

- [ ] **Step 1: Import the primitive**

Add to the import block in `boreas-hero.tsx`:

```ts
import { StackedCards, type StackedCardLayer } from "@/components/motion/stacked-cards";
```

- [ ] **Step 2: Wrap the cinematic doctor card in `StackedCards`**

In `DoctorCardEntrance` (around lines 457-474), replace the whole function body with:

```tsx
function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useScrub(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [0, 1]);
  const y = useScrub(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [24, 0]);
  const settleScale = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);

  const cardContent = (
    <div className="bg-surface p-[22px]">
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCard
        trigger={{ mode: "progress", value: scrollYProgress, threshold: PHASE_1_END }}
        reduceMotion={false}
        instant
      />
    </div>
  );
  const layers: StackedCardLayer[] = [
    { key: "front", content: cardContent },
    { key: "echo", content: cardContent },
  ];

  return (
    <div style={{ opacity, transform: `translateY(${y}px) scale(${settleScale})` }} className="absolute left-0 right-[50px] top-[30px] z-[1]">
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />
    </div>
  );
}
```

Note this removes the standalone `rounded-[var(--radius-xl)] border border-border ... shadow-[var(--shadow)]` classes from the outer div — `StackedCards` now applies rounding, border, and shadow to its own front/back layers (via `radiusVar` and its built-in `boxShadow` logic), so those classes on the wrapper would be redundant.

- [ ] **Step 3: Apply the same treatment to the static (`HeroCardCluster`) doctor card**

By this point, Task 9 has already added a `<VerifiedBadge />` line right after `<ExampleBadge />` here, so the block in `HeroCardCluster` (around lines 203-213) currently reads:

```tsx
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 right-[50px] top-[30px] z-[1] rounded-[var(--radius-xl)] border border-border bg-surface p-[22px] shadow-[var(--shadow)]"
        style={reduceMotion ? undefined : { animation: "float 5.2s ease-in-out infinite" }}
      >
        <ExampleBadge />
        <VerifiedBadge />
        <DoctorCard trigger={{ mode: "delay", ms: 800 }} testimonialDelayMs={1300} reduceMotion={reduceMotion} />
      </motion.div>
```

Replace that whole block with:

```tsx
      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-0 right-[50px] top-[30px] z-[1]"
        style={reduceMotion ? undefined : { animation: "float 5.2s ease-in-out infinite" }}
      >
        <StackedCardsStaticDoctorCard reduceMotion={reduceMotion} />
      </motion.div>
```

Add a small helper above `HeroCardCluster` (this keeps the static path's `testimonialDelayMs={1300}` behavior intact, which `DoctorCardEntrance`'s `instant` cinematic path doesn't need):

```tsx
function StackedCardsStaticDoctorCard({ reduceMotion }: { reduceMotion: boolean }) {
  const cardContent = (
    <div className="bg-surface p-[22px]">
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCard trigger={{ mode: "delay", ms: 800 }} testimonialDelayMs={1300} reduceMotion={reduceMotion} />
    </div>
  );
  const layers: StackedCardLayer[] = [
    { key: "front", content: cardContent },
    { key: "echo", content: cardContent },
  ];
  return <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />;
}
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 5: Visual verification**

Load Hero at desktop width in both reduced-motion (`HeroStatic`) and normal (`HeroCinematic`) modes (toggle `prefers-reduced-motion` in devtools). Expected: a soft blurred echo of the doctor card visible peeking behind it (to the left, since `clipInset="-4px -40px -40px 0px"` gives breathing room on the left/bottom instead of Relevo's right/bottom — the doctor card sits near the right edge of its column with `right-[50px]`, so the echo should bleed toward the open side). If the echo bleeds off-canvas or gets clipped, adjust `clipInset` and re-verify. Confirm the CTA and rest of the page layout are unaffected — this card is decorative-only (`aria-hidden` on the echo layer, handled inside `StackedCards`).

- [ ] **Step 6: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: add depth layer behind Hero doctor card via StackedCards"
```

---

### Task 12: Hero — background texture + parallax on the desktop cinematic cluster

**Files:**
- Modify: `components/hero/boreas-hero.tsx` (`HeroCardClusterCinematic`, `HeroCardCluster`)

**Interfaces:**
- Consumes: `ParallaxLayer` from `components/motion/parallax-layer.tsx` (Task 3).

- [ ] **Step 1: Import the primitive**

Add to the import block:

```ts
import { ParallaxLayer } from "@/components/motion/parallax-layer";
```

- [ ] **Step 2: Add a background texture helper**

Add above `HeroCardClusterCinematic` (around line 488):

```tsx
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
```

- [ ] **Step 3: Wrap it in `ParallaxLayer` for the cinematic cluster**

In `HeroCardClusterCinematic` (around lines 488-502), replace:

```tsx
function HeroCardClusterCinematic({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <AppointmentsChipEntrance scrollYProgress={scrollYProgress} />

      <DoctorCardEntrance scrollYProgress={scrollYProgress} />

      <div className="absolute bottom-5 right-0 z-[2]">
        <SearchPercentChip trigger={{ mode: "progress", value: scrollYProgress, threshold: 0 }} reduceMotion={false} />
      </div>

      <TimeChip scrollYProgress={scrollYProgress} />
    </div>
  );
}
```

with:

```tsx
function HeroCardClusterCinematic({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <ParallaxLayer progress={scrollYProgress} speed={0.15} reduceMotion={false} className="absolute inset-0 -z-10">
        <ClusterBackgroundTexture />
      </ParallaxLayer>

      <AppointmentsChipEntrance scrollYProgress={scrollYProgress} />

      <DoctorCardEntrance scrollYProgress={scrollYProgress} />

      <div className="absolute bottom-5 right-0 z-[2]">
        <SearchPercentChip trigger={{ mode: "progress", value: scrollYProgress, threshold: 0 }} reduceMotion={false} />
      </div>

      <TimeChip scrollYProgress={scrollYProgress} />
    </div>
  );
}
```

- [ ] **Step 4: Add the static (non-parallax) texture to `HeroCardCluster`**

In `HeroCardCluster` (around lines 191-193), replace:

```tsx
function HeroCardCluster({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
```

with:

```tsx
function HeroCardCluster({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <ClusterBackgroundTexture />
```

(No `ParallaxLayer` wrapper here — this path renders when `prefers-reduced-motion` is on, so the texture stays static, satisfying "content never gated behind animation" without adding scroll-linked work for users who asked to avoid it.)

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- [ ] **Step 6: Visual verification**

Load Hero at desktop width, both reduced-motion and normal modes. Expected: a soft warm radial glow behind the card cluster, static in reduced-motion mode, drifting slightly slower than the cards during the cinematic scroll (barely perceptible — `speed={0.15}` is intentionally subtle, this is atmosphere, not a headline effect). Confirm it never overlaps the left column's text (the texture is scoped to the cluster's own `-inset-x-10 -inset-y-16`, which at `lg:grid-cols-[1fr_0.88fr]` should stay within the right column, but verify at exactly 1024px — the `lg:` breakpoint — where the column is narrowest). If it bleeds into the left column at that width, reduce the negative inset values and re-verify.

- [ ] **Step 7: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: add parallax background texture to Hero card cluster"
```

---

### Task 13: Full verification pass

**Files:** None (verification only).

- [ ] **Step 1: Full type/lint/build**

```bash
npx tsc --noEmit
npm run lint
npm run build
```

Expected: all three clean.

- [ ] **Step 2: Production server, desktop browser walkthrough**

```bash
npm run build && npx next start -p 3001
```

Using the project's `/browse` skill (per `CLAUDE.md` — never `mcp__claude-in-chrome__*`), at 1440×900:
- Scroll through all 3 desktop Hero phases. Confirm: headline legible from scroll 0 (not 0 opacity at any point), CTA clickable at every scroll position within the pin, verification badge + location chip + avatar stack + depth layer + background texture all visible and none clipped or overlapping.
- Toggle `prefers-reduced-motion: reduce` (via `$B` viewport/emulation or OS-level toggle) and reload. Confirm `HeroStatic` renders — same 5 new elements present, zero scroll-linked motion, zero pin.

- [ ] **Step 3: Mobile browser walkthrough**

At 375×812: scroll through both mobile Hero phases. Confirm the new elements (badge, chip, avatar stack) render correctly at mobile card width — no overflow, no awkward wrapping (per the specific checks called out in Tasks 9-10). Note: Tasks 11-12 (depth layer, parallax texture) are desktop-only per this plan's scope — confirm mobile's doctor card still renders normally (single card, no stack/texture), matching the "recalibrado, no desktop encogido" rule from the spec (mobile keeps its own already-tested composition, not a shrunk desktop).

- [ ] **Step 4: Real device check (mobile)**

Per the project's established testing pattern (see `docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md`), production build served over LAN (`npx next start -H 0.0.0.0 -p 3001`), opened on a real phone — confirm no new jank was introduced by the added elements (avatar stack, badges are static content, should add zero scroll cost; verify this assumption held).

- [ ] **Step 5: Update the spec status**

In `docs/superpowers/specs/2026-07-16-hero-motion-system-and-redesign.md`, change the `**Status:**` line from "Diseño aprobado, pendiente de plan de implementación." to "Implementado — ver `components/hero/boreas-hero.tsx` y `components/motion/`."

- [ ] **Step 6: Commit**

```bash
git add docs/superpowers/specs/2026-07-16-hero-motion-system-and-redesign.md
git commit -m "docs: mark hero motion system + redesign spec as implemented"
```
