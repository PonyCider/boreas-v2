# Hero Polish Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix 6 visual-polish findings from a post-launch design review of the Hero cinematic intro (letter-reveal + scroll reflow, shipped in PR #67): give the "Boreas" wordmark reveal sole focus at load, fix a broken multi-line underline, declutter the desktop card cluster, fix a collapsed-positioning bug in the proof-point chips, fix a mobile rating number stuck at "0", and keep the orbit-dot decoration off mobile body copy.

**Architecture:** All 6 fixes are targeted edits inside the existing Hero component tree (`components/hero/boreas-hero.tsx`, `components/hero/header.tsx`, `components/hero/wordmark-intro.tsx`, `components/motion/highlighter-accent.tsx`, `components/motion/wordmark-orbit-accent.tsx`, `components/motion/drawn-path-accent.tsx`) plus one new small file (`lib/motion/hero-intro-context.tsx`) providing a React context so the sibling `Header` component can learn when the Hero's intro animation has settled. No new dependencies, no new primitives, no changes to the scroll-pin/scroll-progress machinery.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, framer-motion (existing `[0.22, 1, 0.36, 1]` ease convention), rough-notation (existing dependency, `HighlighterAccent`).

## Global Constraints

- No new npm dependencies. Every fix uses libraries already in this codebase (framer-motion, rough-notation, plain CSS/Tailwind).
- Motion timing/easing: reuse the project's existing ease curve `[0.22, 1, 0.36, 1]` (already used throughout `boreas-hero.tsx` and `header.tsx`) — do not introduce a different curve.
- `prefers-reduced-motion`: every task that touches an animated value must keep the existing reduced-motion behavior working (immediate/no animation), matching the pattern already used in the touched file.
- Reference file states: all line numbers below were read from `components/hero/boreas-hero.tsx`, `components/hero/header.tsx`, `components/motion/highlighter-accent.tsx`, `components/motion/wordmark-orbit-accent.tsx`, and `components/motion/drawn-path-accent.tsx` at commit `0a8a3a3` (current HEAD of `worktree-hero-cinematic-scroll` at plan-writing time). **Always re-read the current file before editing** — later tasks in this plan edit lines that earlier tasks in this same plan already touched (Task 1 and Task 6 both touch the same `WordmarkOrbitAccent`/`WordmarkIntro` block in `HeroCinematicLeftColumn`); the code shown in each task step is the expected state *after* all earlier tasks in this plan are applied, not the original pre-plan state.
- Do not touch `HeroStatic`, `HeroCardCluster`, or `HeroCardMobile` (the `prefers-reduced-motion` fallback tree) — none of the 6 findings are in that code path, and it must stay untouched per the existing project invariant (verified every prior verification pass in this branch's history).
- Do not touch gsap/`wordmark-letter-reveal.tsx` — none of the 6 findings require it.

---

### Task 1: Header logo waits for the Hero intro to settle

**Files:**
- Create: `lib/motion/hero-intro-context.tsx`
- Modify: `app/page.tsx` (wrap `Header` + `BoreasHero` in the new provider)
- Modify: `components/hero/header.tsx:1-6` (import), `components/hero/header.tsx:96-113` (logo)
- Modify: `components/hero/boreas-hero.tsx:22` (import), `components/hero/boreas-hero.tsx:534-542` (hook call), `components/hero/boreas-hero.tsx:573` (wire `onSettled`)

**Interfaces:**
- Produces: `HeroIntroProvider` (component), `useHeroIntroSettled(): boolean`, `useMarkHeroIntroSettled(): () => void` — exported from `lib/motion/hero-intro-context.tsx`. Both hooks default safely (`true` / no-op) when called outside a `HeroIntroProvider`, so no other call site in this plan needs to change.

**Problem:** `components/hero/header.tsx:111` renders the "Boreas" wordmark logo unconditionally, with no delay — it appears in the same frame as the Hero's own giant letter-by-letter "Boreas" reveal (`components/hero/wordmark-intro.tsx`). Two "Boreas" wordmarks competing for attention in the same instant undercuts the reveal the whole letter-animation was built for. `WordmarkIntro` already has an `onSettled?: () => void` prop (set when the intro's hold-then-move-up sequence finishes, `components/hero/wordmark-intro.tsx:33-34`) but no caller currently passes it.

- [ ] **Step 1: Create the intro-settled context**

```tsx
// lib/motion/hero-intro-context.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface HeroIntroContextValue {
  introSettled: boolean;
  markIntroSettled: () => void;
}

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null);

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const [introSettled, setIntroSettled] = useState(false);

  function markIntroSettled() {
    setIntroSettled(true);
  }

  return (
    <HeroIntroContext.Provider value={{ introSettled, markIntroSettled }}>
      {children}
    </HeroIntroContext.Provider>
  );
}

// No provider in the tree means there's nothing to wait for (e.g. a page
// that doesn't render the cinematic Hero intro) — default to "settled" so
// consumers show immediately instead of waiting forever.
export function useHeroIntroSettled(): boolean {
  const ctx = useContext(HeroIntroContext);
  return ctx ? ctx.introSettled : true;
}

export function useMarkHeroIntroSettled(): () => void {
  const ctx = useContext(HeroIntroContext);
  return ctx ? ctx.markIntroSettled : () => {};
}
```

- [ ] **Step 2: Wrap `Header` + `BoreasHero` in the provider**

Read `app/page.tsx` first to confirm it still matches this shape (it is a small file, unlikely to have drifted):

```tsx
import { BoreasHero } from "@/components/hero/boreas-hero";
import { Header } from "@/components/hero/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BoreasLandingSections } from "@/components/landing/boreas-landing-sections";

export default function Home() {
  return (
    <div className="relative">
      <Header />
      <BoreasHero />
      <BoreasLandingSections />
      <SiteFooter />
    </div>
  );
}
```

Replace with:

```tsx
import { BoreasHero } from "@/components/hero/boreas-hero";
import { Header } from "@/components/hero/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BoreasLandingSections } from "@/components/landing/boreas-landing-sections";
import { HeroIntroProvider } from "@/lib/motion/hero-intro-context";

export default function Home() {
  return (
    <HeroIntroProvider>
      <div className="relative">
        <Header />
        <BoreasHero />
        <BoreasLandingSections />
        <SiteFooter />
      </div>
    </HeroIntroProvider>
  );
}
```

- [ ] **Step 3: Gate the header logo on `introSettled`**

In `components/hero/header.tsx`, add the import alongside the existing ones (after line 6, `import { trackAnalyticsEvent } from "@/lib/analytics";`):

```tsx
import { useHeroIntroSettled } from "@/lib/motion/hero-intro-context";
```

Inside `export function Header() {` (line 39), add the hook call next to the existing `reduceMotion` line (`const reduceMotion = useReducedMotion();`, line 43):

```tsx
  const introSettled = useHeroIntroSettled();
```

Replace the logo block (`components/hero/header.tsx:96-113`):

```tsx
        <Link
          href="/"
          className="flex h-11 min-w-0 items-center"
          aria-label="Boreas — inicio"
        >
          <span
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "26px",
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            Boreas
          </span>
        </Link>
```

with:

```tsx
        <Link
          href="/"
          className="flex h-11 min-w-0 items-center"
          aria-label="Boreas — inicio"
        >
          <motion.span
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: reduceMotion || introSettled ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: "var(--font-newsreader), Georgia, serif",
              fontStyle: "italic",
              fontWeight: 500,
              fontSize: "26px",
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            Boreas
          </motion.span>
        </Link>
```

(`motion` is already imported in this file — `components/hero/header.tsx:4`.)

- [ ] **Step 4: Wire `onSettled` from the Hero intro into the context**

In `components/hero/boreas-hero.tsx`, add the import after the existing `useScrub` import (line 22):

```tsx
import { useMarkHeroIntroSettled } from "@/lib/motion/hero-intro-context";
```

In `HeroCinematicLeftColumn` (`components/hero/boreas-hero.tsx:534-542`), add the hook call as the first line of the function body, before the existing `useScrub` calls:

```tsx
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
```

Then change the `WordmarkIntro` call (`components/hero/boreas-hero.tsx:573`) from:

```tsx
        <WordmarkIntro wordmark="Boreas" headline={heroHeadline} />
```

to:

```tsx
        <WordmarkIntro wordmark="Boreas" headline={heroHeadline} onSettled={markIntroSettled} />
```

`HeroCinematicLeftColumn` is called twice — once for mobile, once for desktop (`components/hero/boreas-hero.tsx:788` and `:801`) — so both instances call `markIntroSettled`. Since `setIntroSettled(true)` in the context is idempotent (calling it twice is a no-op the second time) and both instances share the same timing constants, this is safe with no extra guard needed.

- [ ] **Step 5: Verify**

```bash
npx tsc --noEmit
npm run lint
```

Then, with the dev server running, use gstack browse to load the page fresh (desktop viewport) and confirm via a screenshot at ~200ms and ~2000ms after load that the header's "Boreas" logo is not visible in the first screenshot and is visible (faded in) by the second — while the big Hero wordmark reveal plays uninterrupted in both. Also confirm with `prefers-reduced-motion: reduce` (or by reading `HeroStatic`'s render path) that the header logo shows immediately, since `HeroStatic` never renders `WordmarkIntro` and thus never calls `markIntroSettled`.

- [ ] **Step 6: Commit**

```bash
git add lib/motion/hero-intro-context.tsx app/page.tsx components/hero/header.tsx components/hero/boreas-hero.tsx
git commit -m "feat: header logo waits for Hero intro to settle before fading in"
```

---

### Task 2: Fix the "abierto las 24 horas" underline (multiline rough-notation)

**Files:**
- Modify: `components/motion/highlighter-accent.tsx:24-29`

**Interfaces:** No signature changes — `HighlighterAccentProps` is unchanged.

**Problem:** The headline's `HighlighterAccent` wraps "abierto las 24 horas" (`components/hero/wordmark-intro.tsx:63-65`), which wraps across two visual lines in the rendered `<h1>`. `annotate()` is called without `multiline: true`, so rough-notation treats the multi-line span as a single bounding box and draws one straight bar under only the last line — "abierto" (end of line 2) never gets marked at all. Confirmed live: `document.querySelectorAll('svg.rough-annotation')` plus DOM inspection of the underline `<path>` elements shows a single ~480px-wide straight stroke positioned under line 3 only ("las 24 horas."), with no stroke anywhere near "abierto" on line 2.

- [ ] **Step 1: Add `multiline: true`**

Replace (`components/motion/highlighter-accent.tsx:24-29`):

```tsx
    const annotation = annotate(ref.current, {
      type: "underline",
      color,
      strokeWidth: 2,
      animationDuration: reduceMotion ? 0 : 500,
    });
```

with:

```tsx
    const annotation = annotate(ref.current, {
      type: "underline",
      color,
      strokeWidth: 2,
      multiline: true,
      animationDuration: reduceMotion ? 0 : 500,
    });
```

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

With the dev server running, use gstack browse to load the page, wait for the intro to settle, and screenshot the headline at desktop width (where "abierto" and "las 24 horas" fall on different lines). Confirm two separate underline strokes now render: a short one under "abierto" (end of line 2) and one under "las 24 horas" (line 3, stopping before the trailing period, which is outside the highlighted span). Re-check at a mobile width where the phrase happens to sit on a single line — confirm it still renders a normal single-line underline (no regression from `multiline: true` there).

- [ ] **Step 3: Commit**

```bash
git add components/motion/highlighter-accent.tsx
git commit -m "fix: HighlighterAccent underline now covers every line of a wrapped phrase"
```

---

### Task 3: Declutter the desktop card cluster

**Files:**
- Modify: `components/hero/boreas-hero.tsx:602` (`TimeChip`), `:651` (`AppointmentsChipEntrance`), `:664-673` (`HeroCardClusterCinematic` — orb count, drawn-path curve), `:683` (`SearchPercentChip` wrapper)
- Modify: `components/motion/drawn-path-accent.tsx:44` (gradient mid-stop opacity)

**Interfaces:** No signature changes.

**Problem:** In `HeroCardClusterCinematic` (desktop-only right column), 4 floating elements — the doctor card, the "82%" `AppointmentsChip`, the "11:47 PM" `TimeChip`, and a diagonal `DrawnPathAccent` line — plus 5 `AccentOrbField` blobs all sit pinned flush against the cluster's raw edges with a hard diagonal line crossing between them. Compared to the disciplined left text column, this quadrant reads as busy/uncomposed. Fix: fewer orbs, a shorter/subtler decorative line confined to the card's upper-right corner instead of sweeping across the whole cluster, and consistent edge margins on the floating chips so nothing looks clipped at the container boundary.

- [ ] **Step 1: Reduce orb count and confine the drawn-path curve**

Replace (`components/hero/boreas-hero.tsx:664-673`):

```tsx
      <AccentOrbField progress={scrollYProgress} count={5} reduceMotion={false} />
      <DrawnPathAccent
        progress={scrollYProgress}
        range={[0.1, 0.5]}
        d="M 10 400 Q 200 100 420 250"
        viewBox="0 0 460 460"
        className="inset-0 h-full w-full"
        reduceMotion={false}
      />
      <HeroScrollProgress progress={scrollYProgress} className="right-0" />
```

with:

```tsx
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
```

(The new curve stays in the upper-right quadrant — above and right of the doctor card, which occupies roughly `left-0 right-[50px] top-[30px]` of this same 460px box — instead of sweeping diagonally from bottom-left to right-middle through the chip cluster.)

- [ ] **Step 2: Soften the drawn-path stroke globally**

Replace (`components/motion/drawn-path-accent.tsx:44`):

```tsx
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
```

with:

```tsx
          <stop offset="50%" stopColor={color} stopOpacity="0.25" />
```

(This is the shared `DrawnPathAccent` primitive — the mobile decorative layer at `components/hero/boreas-hero.tsx:746` uses it too. The subtler stroke is an improvement there as well, not just on desktop, so this is a single global change rather than a new prop.)

- [ ] **Step 3: Give the floating chips breathing room from the cluster edges**

Replace (`components/hero/boreas-hero.tsx:602`):

```tsx
    <div className="absolute bottom-4 left-0 z-[2] rounded-[var(--radius-pill)] border border-border bg-surface px-3.5 py-2">
```

with:

```tsx
    <div className="absolute bottom-4 left-3 z-[2] rounded-[var(--radius-pill)] border border-border bg-surface px-3.5 py-2">
```

Replace (`components/hero/boreas-hero.tsx:651`):

```tsx
    <div style={{ opacity }} className="absolute right-0 top-0 z-[2]">
```

with:

```tsx
    <div style={{ opacity }} className="absolute right-3 top-3 z-[2]">
```

Replace (`components/hero/boreas-hero.tsx:683`):

```tsx
      <div className="absolute bottom-5 right-0 z-[2]">
```

with:

```tsx
      <div className="absolute bottom-5 right-3 z-[2]">
```

- [ ] **Step 4: Verify**

```bash
npx tsc --noEmit
npm run lint
```

With the dev server running, use gstack browse at desktop widths (1024px, 1440px, 1920px), light and dark mode: scroll to ~50% of the Hero pin (card cluster fully revealed) and screenshot the right column. Confirm: 3 orb blobs (not 5), the drawn-path line reads as a small accent near the card's top-right corner (not a diagonal line crossing toward the bottom-left chip), and the "82%" chip, "11:47 PM" chip, and search-percent chip all sit with visible margin from the cluster's outer edge rather than flush against it. Confirm no new horizontal overflow was introduced (this branch has a known, accepted ~2px sub-pixel overflow on mobile from an earlier task — check it hasn't grown, not that it's zero).

- [ ] **Step 5: Commit**

```bash
git add components/hero/boreas-hero.tsx components/motion/drawn-path-accent.tsx
git commit -m "polish: reduce visual density and add edge margin in the desktop card cluster"
```

---

### Task 4: Fix collapsed proof-point chip positions

**Files:**
- Modify: `components/hero/boreas-hero.tsx:495-500`

**Interfaces:** No signature changes.

**Problem:** `ProofPointChips` (desktop, non-`compact`) wraps its 4 `ProofPointChip` children in `<div className="relative mt-9 h-0">` (`components/hero/boreas-hero.tsx:519`) — an explicit zero-height container, used so the absolutely-positioned chips don't push layout down. But `PROOF_POINT_POSITIONS` uses percentage-based `top-[22%]` / `bottom-[16%]` values, and CSS resolves percentage `top`/`bottom` on an absolutely-positioned element against its containing block's own height — which is `0`. All 4 chips collapse to the same y-coordinate. Confirmed live via `getBoundingClientRect()` on all 4 chips: e.g. "Reseñas de Google" at `top: 831.9` and "Pacientes decididos" at `top: 817.9` (a 14px gap, not the ~140px spread the 22%/16%/etc. values were meant to produce), with the two right-side chips ("Agenda por WhatsApp", "Sin trabajo técnico") similarly overlapping. This reads as randomly clustered/overlapping chips rather than 4 distinct proof points.

- [ ] **Step 1: Switch to pixel-based positions**

Replace (`components/hero/boreas-hero.tsx:495-500`):

```tsx
const PROOF_POINT_POSITIONS = [
  "absolute -left-4 top-[22%] z-[2]",
  "absolute -right-2 top-[6%] z-[2]",
  "absolute -left-2 bottom-[16%] z-[2]",
  "absolute -right-4 bottom-2 z-[2]",
];
```

with:

```tsx
const PROOF_POINT_POSITIONS = [
  "absolute left-0 top-0 z-[2]",
  "absolute right-0 top-9 z-[2]",
  "absolute left-6 top-[72px] z-[2]",
  "absolute right-6 top-[104px] z-[2]",
];
```

(Pixel-based `top` values don't depend on the zero-height container resolving a percentage — they position reliably regardless of the container's own height. The 4 values stagger the chips in a descending left/right cascade below the CTA row, each with enough vertical gap — 36px, 36px, 32px — to never overlap. `HeroCinematicLeftColumn` has nothing else below `ProofPointChips` in flow, and the sibling right-column card cluster is 460px tall, so 104px of downward drift is safely inside the row's height on desktop.)

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

With the dev server running, use gstack browse at desktop width (1440px): scroll to reveal the CTA row, then read the bounding rects of the 4 proof-point chips via `js "Array.from(document.querySelectorAll('li,span')).filter(el => ['Reseñas de Google','Agenda por WhatsApp','Pacientes decididos','Sin trabajo técnico'].includes(el.textContent.trim())).map(el => el.getBoundingClientRect())"` (adjust selector if needed) and confirm all 4 have distinct, non-overlapping `top` values with reasonable horizontal separation. Screenshot to visually confirm a clean staggered cascade below the CTA buttons, not a cluster of overlapping pills.

- [ ] **Step 3: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "fix: proof-point chips no longer collapse to the same position"
```

---

### Task 5: Fix mobile rating number stuck at "0"

**Files:**
- Modify: `components/hero/boreas-hero.tsx:697-703`

**Interfaces:** No signature changes.

**Problem:** `HeroCardMobilePinned`'s `DoctorCard` (`components/hero/boreas-hero.tsx:697-703`) is rendered with `instant` (no entrance fade — the card is fully visible from page load) but its rating-number trigger is `{ mode: "progress", value: scrollYProgress, threshold: 0.1 }`. `useAnimatedNumber` (`lib/use-animated-number.ts:49-51`) initializes its count-up at `0` and only starts once the scroll progress crosses that threshold — so on load, before the user scrolls even 10% into the mobile pin, the card shows literal `"★★★★★ 0"`. Every other part of the card (name, avatar, testimonial) is already visible, so this reads as a broken/unloaded number, not an intentional "problem state" (unlike `TimeChip`'s problem→solution text crossfade, which communicates its pre-scroll state through copy, not a bare "0"). Note: `MOBILE_PHASE_END` (0.5) is a *different* constant used elsewhere in this same function (lines 693-695, and the `AppointmentsChip` trigger at line 715) — it does not gate this `DoctorCard`, and this task must not touch it.

- [ ] **Step 1: Trigger the rating count-up on mount, matching the card's own `instant` visibility**

Replace (`components/hero/boreas-hero.tsx:697-703`):

```tsx
      <DoctorCard
        trigger={{ mode: "progress", value: scrollYProgress, threshold: 0.1 }}
        reduceMotion={false}
        instant
      />
```

with:

```tsx
      <DoctorCard
        trigger={{ mode: "delay", ms: 400 }}
        reduceMotion={false}
        instant
      />
```

(This matches the `{ mode: "delay", ms: 400 }` trigger already used for the same `DoctorCard` component in the reduced-motion fallback, `components/hero/boreas-hero.tsx:367`. `MOBILE_PHASE_END` remains in use elsewhere in `HeroCardMobilePinned` — lines 693-695 (problem/solution text crossfade) and line 715 (`AppointmentsChip` trigger) — this change only touches the rating number's own trigger and must not alter those.)

- [ ] **Step 2: Verify**

```bash
npx tsc --noEmit
npm run lint
```

With the dev server running, use gstack browse at a mobile viewport (390×844): load the page fresh, wait ~1s past the letter-reveal intro, and screenshot the pinned doctor card. Confirm the rating number shows the real value (matching `socialProof.mockupDoctor.rating` in `content/boreas-home.ts`) rather than `"0"`, without needing to scroll. Also scroll through the mobile pin to confirm the rest of `HeroCardMobilePinned`'s problem→solution crossfade (copy + appointments chip, still gated on `MOBILE_PHASE_END`) is unaffected.

- [ ] **Step 3: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "fix: mobile pinned card rating no longer stuck at 0 before scroll"
```

---

### Task 6: Keep the orbit-dot decoration off mobile body copy

**Files:**
- Modify: `components/motion/wordmark-orbit-accent.tsx:3-27`
- Modify: `components/hero/boreas-hero.tsx:567-574` (post-Task-1 state — includes the `onSettled` prop added in Task 1)

**Interfaces:**
- Modifies: `WordmarkOrbitAccentProps` — adds optional `radiusScale?: number` (default `1`), multiplied into each dot's `--orbit-radius`.

**Problem:** `WordmarkOrbitAccent` orbits its dots at a fixed radius (`90 + i * 24`px, i.e. 90–138px for `count=3`) inside a fixed 160×160px box (`className="left-[-15%] top-[-8%] h-40 w-40"`, `components/hero/boreas-hero.tsx:571` pre-Task-1). On desktop this sits proportionally within the large wordmark. On mobile, the wordmark itself is much smaller (`clamp(5rem, 13vw, 10.5rem)` resolves near its 5rem floor on a 390px viewport) while the same fixed-size orbit box and radius are reused (`count={enableIntroReflow ? 3 : 2}` already varies dot count by breakpoint, but not radius or box size) — so the orbit dots regularly swing down over the paragraph/underline text below the wordmark. Confirmed via screenshot: a stray dot visible mid-sentence near the eyebrow text and again near the headline underline on a 390px viewport.

- [ ] **Step 1: Add a `radiusScale` prop**

Replace (`components/motion/wordmark-orbit-accent.tsx`, full file):

```tsx
"use client";

export interface WordmarkOrbitAccentProps {
  active: boolean;
  count?: number;
  reduceMotion: boolean;
  className?: string;
}

export function WordmarkOrbitAccent({ active, count = 3, reduceMotion, className = "" }: WordmarkOrbitAccentProps) {
  if (!active || reduceMotion) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const radius = 90 + i * 24;
        const duration = 8 + i * 3;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-accent/40"
            style={{
              animation: `hero-orbit-spin ${duration}s linear infinite`,
              ["--orbit-radius" as string]: `${radius}px`,
              marginLeft: -3,
              marginTop: -3,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
```

with:

```tsx
"use client";

export interface WordmarkOrbitAccentProps {
  active: boolean;
  count?: number;
  radiusScale?: number;
  reduceMotion: boolean;
  className?: string;
}

export function WordmarkOrbitAccent({ active, count = 3, radiusScale = 1, reduceMotion, className = "" }: WordmarkOrbitAccentProps) {
  if (!active || reduceMotion) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const radius = (90 + i * 24) * radiusScale;
        const duration = 8 + i * 3;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-accent/40"
            style={{
              animation: `hero-orbit-spin ${duration}s linear infinite`,
              ["--orbit-radius" as string]: `${radius}px`,
              marginLeft: -3,
              marginTop: -3,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Shrink the orbit box and radius on mobile**

Read `components/hero/boreas-hero.tsx:567-574` first to confirm it matches the post-Task-1 state (Task 1 added the `onSettled={markIntroSettled}` prop to the `WordmarkIntro` call on this same block):

```tsx
      <div className="relative">
        <WordmarkOrbitAccent
          active={introProgress > 0}
          count={enableIntroReflow ? 3 : 2}
          reduceMotion={false}
          className="left-[-15%] top-[-8%] h-40 w-40"
        />
        <WordmarkIntro wordmark="Boreas" headline={heroHeadline} onSettled={markIntroSettled} />
      </div>
```

Replace with:

```tsx
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
```

(`enableIntroReflow` is `true` only on the desktop call site, `components/hero/boreas-hero.tsx:801` — so mobile, `enableIntroReflow=false`, gets both a smaller orbit box and a 0.55× radius multiplier, keeping every dot's max swing within ~76px of the wordmark's center instead of 138px.)

- [ ] **Step 3: Verify**

```bash
npx tsc --noEmit
npm run lint
```

With the dev server running, use gstack browse at a mobile viewport (390×844): load the page fresh and screenshot at 3–4 points across the first ~2 seconds (the orbit dots complete a full rotation every 8-14s, so sample across at least one visible arc). Confirm no orbit dot visibly overlaps the eyebrow text, the headline, or the paragraph below it. Re-check desktop (1440px) to confirm the orbit accent is visually unchanged there (`enableIntroReflow=true` keeps `radiusScale=1` and the original box size).

- [ ] **Step 4: Commit**

```bash
git add components/motion/wordmark-orbit-accent.tsx components/hero/boreas-hero.tsx
git commit -m "fix: shrink wordmark orbit-dot radius on mobile so it stays off body copy"
```

---

### Task 7: Full verification pass

**Files:** none modified unless a bug is found and fixed (then: whichever file the bug is in).

- [ ] **Step 1: Full build**

```bash
npm run build
```

Expected: clean, static prerender succeeds.

- [ ] **Step 2: Re-screenshot all 6 findings side by side with the original findings**

Using gstack browse:
1. Desktop (1440px), load, screenshot within the first 300ms and again at 2s — confirm header logo timing (Task 1).
2. Desktop (1440px), scroll to headline, screenshot the "abierto las 24 horas" underline (Task 2).
3. Desktop (1440px), scroll to ~50% of the pin, screenshot the right column card cluster (Task 3).
4. Desktop (1440px), same scroll position, screenshot the 4 proof-point chips below the CTA row (Task 4).
5. Mobile (390px), load, screenshot the pinned doctor card rating (Task 5).
6. Mobile (390px), load + a few samples across ~10s, screenshot for stray orbit dots over text (Task 6).

- [ ] **Step 3: Cross-file consistency read**

Re-read `components/hero/boreas-hero.tsx` in full. Confirm:
- `MOBILE_PHASE_END` is still used for the problem/solution copy crossfade and appointments chip in `HeroCardMobilePinned` (Task 5 only changed the rating trigger, not this constant's other uses).
- No leftover reference to the old percentage-based `PROOF_POINT_POSITIONS` values.
- `HeroStatic`, `HeroCardCluster`, `HeroCardMobile` (the reduced-motion fallback tree) are untouched — grep confirms no new imports of `useMarkHeroIntroSettled`/`useHeroIntroSettled` outside `HeroCinematicLeftColumn` and `header.tsx`.

- [ ] **Step 4: `prefers-reduced-motion` check**

Confirm (by reading the code, since `HeroStatic` never mounts `WordmarkIntro`) that the header logo in `header.tsx` still shows immediately when `reduceMotion` is true — Task 1's `animate={{ opacity: reduceMotion || introSettled ? 1 : 0 }}` should resolve to `1` immediately regardless of `introSettled`'s default `false`.

- [ ] **Step 5: Accessibility spot-check**

Via gstack browse, confirm no console errors on load (desktop and mobile), and that the header logo's `aria-label="Boreas — inicio"` on the parent `Link` (unchanged) still makes the link accessible even while the inner `motion.span` is at `opacity: 0` during the brief pre-settle window.

- [ ] **Step 6: Update the progress ledger**

```bash
cat >> "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll/.superpowers/sdd/progress.md" << 'EOF'

--- New plan: 2026-07-18-hero-polish-fixes ---
EOF
```

- [ ] **Step 7: If all clean, no commit needed for this task (verification-only). If a bug was found and fixed:**

```bash
git add -A
git commit -m "fix: address findings from Hero polish-fixes verification pass"
```

- [ ] **Step 8: Push to update PR #67**

```bash
git push origin worktree-hero-cinematic-scroll
```
