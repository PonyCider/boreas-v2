# Hero Letter-Reveal Intro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Hero's current "everything visible at rest" desktop entrance with a timed letter-by-letter "Boreas" reveal (gsap) that hands off to a scroll-gated reflow (paragraph/CTA/card behind scroll), add 6 new reusable decorative primitives ported from Magic UI/React Bits, and convert the 4 static `heroProofPoints` into floating chips — desktop and mobile both.

**Architecture:** A gsap-only leaf component (`WordmarkLetterReveal`) does the character split/stagger; a framer-motion orchestrator (`WordmarkIntro`) sequences hold → move-up → headline reveal and owns the scroll-skip logic via a shared hook. `boreas-hero.tsx`'s existing scroll-pin infrastructure (`useScrollPin`, `useScrub`, `PHASE_1_END`/`PHASE_2_END`) gets a new pre-phase (`REFLOW_END`, `CARD_END`) inserted before it. Six new files in `components/motion/` (each independently reusable elsewhere in the site) supply the decorative layer.

**Tech Stack:** Next.js 16, React 19, framer-motion, gsap + `@gsap/react` (new, scoped to one leaf component), `rough-notation` (new, via `highlighter`), Tailwind v4.

## Global Constraints

- `ease-out-exponential` (`[0.22, 1, 0.36, 1]`, project's `EASE` constant) is the default for every time-based transition. `useScrub` (scroll-tied) stays linear. Inside `wordmark-letter-reveal.tsx` (gsap), use `"expo.out"` — same curve family, gsap's own syntax.
- No content gating for primary content EXCEPT the Hero's documented exception (`DESIGN.md` § "Content gating — narrow exception, Hero intro only"): wordmark+H1 reveal automatically by timer (never scroll-gated); paragraph/CTA/card reveal behind scroll (scroll itself is NEVER blocked/delayed).
- Skip-on-scroll: if the user scrolls before the intro timer finishes, whatever remains resolves to its final state via a ~150-180ms eased transition — never an instant 0ms snap, never a scroll-jacked scrub of the intro itself.
- Transform + opacity only for animated properties. Full `transform:` string (`translate3d()`, `scale()`), never framer-motion's `x`/`y`/`scale` shorthand props.
- No JS measurement (`getBoundingClientRect`/`ResizeObserver`) for layout positioning.
- `prefers-reduced-motion` (`HeroStatic` and its mobile branch): no letter intro, no scroll gate, no parallax/drawing animation on decorative primitives — everything visible immediately, static.
- gsap is scoped to `components/motion/wordmark-letter-reveal.tsx` only — never imported alongside framer-motion in the same file (architecture discipline, not a hard rule anymore per `DESIGN.md` § "Animation library policy", but still the right call here).
- Magic UI registry items declare their framer-motion dependency as `motion` (the renamed package). This project pins the package name `framer-motion` (see `skills/framer-motion/SKILL.md` § "Boreas project overrides") — rewrite any `from "motion/react"` import to `from "framer-motion"` when porting, never install the `motion` package separately.
- All new `components/motion/*` primitives: `aria-hidden="true"`, `pointer-events-none`, exported with a typed props interface, same file-header/export convention as the existing `parallax-layer.tsx`/`stacked-cards.tsx`.
- Reference spec: `docs/superpowers/specs/2026-07-17-hero-letter-reveal-intro.md`. Reference file: `components/hero/boreas-hero.tsx` (current state — commit `d516524` at plan-writing time; later tasks in this same plan modify it further, so always read the CURRENT file content rather than trust another task's "before" snippet).

---

## File Structure

**New files:**
- `lib/motion/use-skip-on-scroll.ts` — shared one-time scroll-detection hook.
- `components/motion/wordmark-letter-reveal.tsx` — gsap-only leaf: character split + stagger-in for the wordmark.
- `components/hero/wordmark-intro.tsx` — framer-motion orchestrator: mounts the leaf, sequences hold → move-up → headline reveal.
- `components/motion/accent-orb-field.tsx` — soft blurred accent-color orbs with parallax drift.
- `components/motion/drawn-path-accent.tsx` — SVG line that "draws" with scroll progress.
- `components/motion/grain-texture.tsx` — subtle paper-grain overlay.
- `components/motion/highlighter-accent.tsx` — hand-drawn marker underline on a text phrase.
- `components/motion/gradient-accent-word.tsx` — animated gradient sweep on a single word.
- `components/motion/wordmark-orbit-accent.tsx` — small dots orbiting the wordmark during intro.
- `components/motion/hero-scroll-progress.tsx` — thin scroll-progress bar for the Hero's pin.
- `components/motion/card-backlight.tsx` — glow layer behind the doctor card.

**Modified files:**
- `components/hero/boreas-hero.tsx` — desktop reflow rewiring, mobile scroll-away/pin rewiring, proof-point chips, wiring all new primitives.
- `package.json` — add `gsap`, `@gsap/react`, `rough-notation`.

---

### Task 1: Install new dependencies

**Files:**
- Modify: `package.json`

**Interfaces:**
- Produces: `gsap`, `@gsap/react`, `rough-notation` available as imports for later tasks.

- [ ] **Step 1: Install packages**

Run: `cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll" && npm install gsap@^3.13.0 @gsap/react@^2.1.2 rough-notation@^0.5.1`

Expected: `package.json`/`package-lock.json` updated, no install errors.

- [ ] **Step 2: Verify gsap's SplitText plugin is importable**

Run: `node -e "const {SplitText} = require('gsap/SplitText'); console.log(typeof SplitText)"`
Expected: prints `function`

- [ ] **Step 3: Verify build still passes with new deps installed but unused**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean (no errors — nothing imports the new packages yet)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add gsap, @gsap/react, rough-notation dependencies"
```

---

### Task 2: `lib/motion/use-skip-on-scroll.ts`

**Files:**
- Create: `lib/motion/use-skip-on-scroll.ts`

**Interfaces:**
- Produces: `useSkipOnScroll(): boolean` — `false` until the user's first scroll event, then `true` forever (for that mount).

- [ ] **Step 1: Write the hook**

```ts
"use client";

import { useEffect, useState } from "react";

// One-time scroll detector for the Hero intro's skip behavior. Never calls
// preventDefault or otherwise delays the real scroll — it only observes.
export function useSkipOnScroll(): boolean {
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;
    const handleScroll = () => setSkipped(true);
    window.addEventListener("scroll", handleScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skipped]);

  return skipped;
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Commit**

```bash
git add lib/motion/use-skip-on-scroll.ts
git commit -m "feat: add useSkipOnScroll hook for Hero intro"
```

---

### Task 3: `components/motion/wordmark-letter-reveal.tsx`

**Files:**
- Create: `components/motion/wordmark-letter-reveal.tsx`

**Interfaces:**
- Consumes: nothing from earlier tasks (gsap/`@gsap/react` from Task 1).
- Produces: `WordmarkLetterReveal` component, props `{ text: string; skip: boolean; onComplete: () => void; className?: string }`. Later tasks (Task 4) mount this and read its `onComplete` callback.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, useGSAP);

export interface WordmarkLetterRevealProps {
  text: string;
  /** When true, whatever's left of the reveal resolves to its final state
   *  over 160ms instead of continuing the full stagger timeline. */
  skip: boolean;
  onComplete: () => void;
  className?: string;
}

// gsap-only leaf component — do not import framer-motion here (architecture
// discipline: keep the two animation engines in separate files, see
// DESIGN.md § "Animation library policy").
export function WordmarkLetterReveal({ text, skip, onComplete, className = "" }: WordmarkLetterRevealProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const completedRef = useRef(false);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      splitRef.current = new SplitText(containerRef.current, { type: "chars" });
      tweenRef.current = gsap.from(splitRef.current.chars, {
        yPercent: 100,
        opacity: 0,
        duration: 0.4,
        ease: "expo.out",
        stagger: 0.06,
        delay: 0.25,
        onComplete: () => {
          if (completedRef.current) return;
          completedRef.current = true;
          onComplete();
        },
      });
      return () => {
        splitRef.current?.revert();
      };
    },
    { scope: containerRef }
  );

  useGSAP(
    () => {
      if (!skip || !splitRef.current) return;
      tweenRef.current?.kill();
      gsap.to(splitRef.current.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 0.16,
        ease: "expo.out",
        stagger: 0,
        onComplete: () => {
          if (completedRef.current) return;
          completedRef.current = true;
          onComplete();
        },
      });
    },
    { dependencies: [skip], scope: containerRef }
  );

  return (
    <span ref={containerRef} className={className} aria-label={text}>
      {text}
    </span>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Manual smoke test**

Add a temporary test render to any page (e.g. append `<WordmarkLetterReveal text="Boreas" skip={false} onComplete={() => console.log("done")} className="text-6xl font-display italic" />` under the Hero in `app/page.tsx`), run `npm run dev`, load the page, confirm in the browser: letters slide up and fade in overlapping (not fully sequential — the 4th letter should visibly start before the 1st finishes), console logs "done" once after ~950ms, and the text is present and selectable in the DOM throughout (right-click → Inspect, confirm `<span>` per character with the full text still readable). Remove the temporary render after confirming.

Expected: overlapping stagger visible, single "done" log, text selectable.

- [ ] **Step 4: Commit**

```bash
git add components/motion/wordmark-letter-reveal.tsx
git commit -m "feat: add WordmarkLetterReveal (gsap SplitText leaf component)"
```

---

### Task 4: `components/hero/wordmark-intro.tsx`

**Files:**
- Create: `components/hero/wordmark-intro.tsx`

**Interfaces:**
- Consumes: `useSkipOnScroll()` (Task 2), `WordmarkLetterReveal` (Task 3), `TextReveal` (existing, `components/motion/text-reveal.tsx`).
- Produces: `WordmarkIntro` component, props `{ wordmark: string; headline: string; onSettled?: () => void }`. `onSettled` fires once the headline has fully appeared (hold complete). Later tasks (Task 12, Task 13) mount this in place of the current static wordmark+H1 block.

- [ ] **Step 1: Write the component**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { WordmarkLetterReveal } from "@/components/motion/wordmark-letter-reveal";
import { TextReveal } from "@/components/motion/text-reveal";
import { useSkipOnScroll } from "@/lib/motion/use-skip-on-scroll";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const HOLD_MS = 400;

export interface WordmarkIntroProps {
  wordmark: string;
  headline: string;
  onSettled?: () => void;
}

export function WordmarkIntro({ wordmark, headline, onSettled }: WordmarkIntroProps) {
  const skip = useSkipOnScroll();
  const [lettersDone, setLettersDone] = useState(false);
  const [holdDone, setHoldDone] = useState(false);

  useEffect(() => {
    if (!lettersDone) return;
    if (skip) {
      setHoldDone(true);
      return;
    }
    const timer = setTimeout(() => setHoldDone(true), HOLD_MS);
    return () => clearTimeout(timer);
  }, [lettersDone, skip]);

  useEffect(() => {
    if (holdDone) onSettled?.();
  }, [holdDone, onSettled]);

  const moveUpDuration = skip ? 0.16 : 0.5;

  return (
    <div className="relative">
      <motion.div
        animate={{ transform: holdDone ? "translate3d(0, -8px, 0)" : "translate3d(0, 0, 0)" }}
        transition={{ duration: moveUpDuration, ease: EASE }}
        className="font-display italic font-medium leading-[0.88] tracking-[-0.03em] text-foreground"
        style={{ fontSize: "clamp(5rem, 13vw, 10.5rem)" }}
      >
        <WordmarkLetterReveal text={wordmark} skip={skip} onComplete={() => setLettersDone(true)} />
      </motion.div>
      {holdDone && (
        <TextReveal reduceMotion={false} trigger={{ mode: "delay", ms: 0 }}>
          <h1
            className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}
          >
            {headline}
          </h1>
        </TextReveal>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 3: Manual smoke test**

Temporarily render `<WordmarkIntro wordmark="Boreas" headline="Tu consultorio digital, abierto las 24 horas." onSettled={() => console.log("settled")} />` in place of the Hero's left column (or on a scratch page). Confirm: letters reveal, ~400ms pause with only "Boreas" visible, "Boreas" shifts up slightly, headline fades/slides in below, console logs "settled" once. Then reload and scroll immediately (before letters finish) — confirm the whole sequence resolves within ~150-180ms of the scroll and the headline appears, no stuck/half-lettered state. Remove the temporary render after confirming.

Expected: both the full-timeline and skip-on-scroll paths produce a complete, non-stuck headline reveal.

- [ ] **Step 4: Commit**

```bash
git add components/hero/wordmark-intro.tsx
git commit -m "feat: add WordmarkIntro orchestrator (hold, move-up, headline reveal)"
```

---

### Task 5: `components/motion/accent-orb-field.tsx`

**Files:**
- Create: `components/motion/accent-orb-field.tsx`

**Interfaces:**
- Consumes: `ParallaxLayer` (existing, `components/motion/parallax-layer.tsx`).
- Produces: `AccentOrbField` component, props `{ progress: MotionValue<number>; count?: number; reduceMotion: boolean; className?: string }`. Default `count = 5`.

- [ ] **Step 1: Fetch the React Bits `Orb` reference for visual parameters**

Run this MCP tool call (via whatever MCP client this session has configured) to see the reference implementation's color/size/blur approach before adapting:
`mcp__shadcn__view_items_in_registries` with `items: ["@react-bits/Orb-TS-CSS"]`

Use it only as a visual reference (glow falloff, blur radius, layering) — do not install it. Adapt into the shape below, which must satisfy: 4 accent colors from `globals.css` (`--c-amber`, `--c-mint`, `--c-lav`, `--c-rose`), `blur` 20-40px, `opacity` 0.15-0.3, each orb using `ParallaxLayer` for drift, `aria-hidden`, `pointer-events-none`, static (no parallax) when `reduceMotion` is true.

- [ ] **Step 2: Write the component**

```tsx
"use client";

import type { MotionValue } from "framer-motion";
import { ParallaxLayer } from "@/components/motion/parallax-layer";

const ACCENT_COLORS = ["var(--c-amber)", "var(--c-mint)", "var(--c-lav)", "var(--c-rose)"] as const;

interface Orb {
  color: string;
  size: number;
  top: string;
  left: string;
  speed: number;
  blur: number;
  opacity: number;
}

function buildOrbs(count: number): Orb[] {
  return Array.from({ length: count }, (_, i) => {
    const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
    return {
      color,
      size: 80 + (i % 3) * 40,
      top: `${(i * 37) % 90}%`,
      left: `${(i * 53) % 90}%`,
      speed: 0.08 + (i % 4) * 0.05,
      blur: 20 + (i % 3) * 8,
      opacity: 0.15 + (i % 3) * 0.05,
    };
  });
}

export interface AccentOrbFieldProps {
  progress: MotionValue<number>;
  count?: number;
  reduceMotion: boolean;
  className?: string;
}

export function AccentOrbField({ progress, count = 5, reduceMotion, className = "" }: AccentOrbFieldProps) {
  const orbs = buildOrbs(count);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {orbs.map((orb, i) =>
        reduceMotion ? (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: orb.top,
              left: orb.left,
              width: orb.size,
              height: orb.size,
              background: orb.color,
              filter: `blur(${orb.blur}px)`,
              opacity: orb.opacity,
            }}
          />
        ) : (
          <ParallaxLayer key={i} progress={progress} speed={orb.speed} reduceMotion={false} className="absolute" style={{ top: orb.top, left: orb.left }}>
            <div
              className="rounded-full"
              style={{
                width: orb.size,
                height: orb.size,
                background: orb.color,
                filter: `blur(${orb.blur}px)`,
                opacity: orb.opacity,
              }}
            />
          </ParallaxLayer>
        )
      )}
    </div>
  );
}
```

- [ ] **Step 3: Check `ParallaxLayer`'s prop signature matches**

Read `components/motion/parallax-layer.tsx` and confirm it accepts a `style` prop passthrough alongside `progress`/`speed`/`reduceMotion`/`className`. If it doesn't currently forward `style` to its rendered element, add `style` as an optional prop and spread it onto the root element it renders — this is a small, additive change to an existing file (don't remove or rename any existing prop).

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 5: Commit**

```bash
git add components/motion/accent-orb-field.tsx components/motion/parallax-layer.tsx
git commit -m "feat: add AccentOrbField decorative primitive"
```

---

### Task 6: `components/motion/drawn-path-accent.tsx`

**Files:**
- Create: `components/motion/drawn-path-accent.tsx`

**Interfaces:**
- Consumes: `useScrub` (existing, `lib/motion/use-scrub.ts`).
- Produces: `DrawnPathAccent` component, props `{ progress: MotionValue<number>; range?: [number, number]; d: string; viewBox: string; color?: string; strokeWidth?: number; reduceMotion: boolean; className?: string }`.

- [ ] **Step 1: Fetch React Bits references for visual technique**

Run `mcp__shadcn__view_items_in_registries` with `items: ["@react-bits/Beams-TS-CSS", "@react-bits/Threads-TS-CSS", "@react-bits/Strands-TS-CSS"]` to compare the three as visual references (gradient stroke quality, curve style). Pick whichever reads best for a thin single-stroke decorative line — do not install any of them. The rule they must NOT violate that the reference components do: no `ResizeObserver`/`getBoundingClientRect` for positioning (unlike Magic UI's `animated-beam`, which was rejected specifically for this) — this component takes its path (`d`) as a static prop, computed by the caller from fixed layout knowledge, not measured live.

- [ ] **Step 2: Write the component**

```tsx
"use client";

import { useId } from "react";
import type { MotionValue } from "framer-motion";
import { useScrub } from "@/lib/motion/use-scrub";

export interface DrawnPathAccentProps {
  progress: MotionValue<number>;
  /** [start, end] of `progress` over which the line draws in. */
  range?: [number, number];
  /** Static SVG path data — computed by the caller, never measured via JS. */
  d: string;
  viewBox: string;
  color?: string;
  strokeWidth?: number;
  reduceMotion: boolean;
  className?: string;
}

export function DrawnPathAccent({
  progress,
  range = [0, 1],
  d,
  viewBox,
  color = "var(--accent)",
  strokeWidth = 1.5,
  reduceMotion,
  className = "",
}: DrawnPathAccentProps) {
  const id = useId();
  const drawProgress = useScrub(progress, range, [0, 1]);
  const dashOffset = reduceMotion ? 0 : 1000 * (1 - drawProgress);

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      viewBox={viewBox}
      fill="none"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0" />
          <stop offset="50%" stopColor={color} stopOpacity="0.5" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={d}
        stroke={`url(#${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={1000}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add components/motion/drawn-path-accent.tsx
git commit -m "feat: add DrawnPathAccent decorative primitive"
```

---

### Task 7: `components/motion/grain-texture.tsx`

**Files:**
- Create: `components/motion/grain-texture.tsx`

**Interfaces:**
- Produces: `GrainTexture` component, props `{ opacity?: number; className?: string }`. Default `opacity = 0.04`.

- [ ] **Step 1: Fetch both grain references and compare**

Run `mcp__shadcn__view_items_in_registries` with `items: ["@react-bits/Noise-TS-CSS"]` AND `mcp__magicuidesign-mcp__getRegistryItem` with `{ name: "noise-texture", includeSource: true }`. Both are dependency-free. `noise-texture` uses an SVG `feTurbulence` filter (typically sharper/more film-grain-like); `Noise-TS-CSS` is CSS-based (typically a repeating background-image data URI or canvas). Render both in a scratch page at the Hero's actual background color (`--bg-deep`) and pick whichever reads as texture, not noise/artifact, at low opacity. Use the winner's technique for Step 2 below — swap the SVG filter parameters or CSS approach in, but keep this component's prop shape.

- [ ] **Step 2: Write the component (SVG feTurbulence approach — adjust per Step 1's winner)**

```tsx
"use client";

export interface GrainTextureProps {
  opacity?: number;
  className?: string;
}

export function GrainTexture({ opacity = 0.04, className = "" }: GrainTextureProps) {
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <filter id="hero-grain-texture">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter="url(#hero-grain-texture)" />
    </svg>
  );
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 4: Commit**

```bash
git add components/motion/grain-texture.tsx
git commit -m "feat: add GrainTexture decorative primitive"
```

---

### Task 8: `components/motion/highlighter-accent.tsx`

**Files:**
- Create: `components/motion/highlighter-accent.tsx`

**Interfaces:**
- Consumes: `rough-notation` (Task 1).
- Produces: `HighlighterAccent` component, props `{ children: React.ReactNode; active: boolean; color?: string; reduceMotion: boolean; className?: string }`. `active` triggers the draw-on animation once (does not re-trigger on re-render).

- [ ] **Step 1: Fetch Magic UI `highlighter` source**

Run `mcp__magicuidesign-mcp__getRegistryItem` with `{ name: "highlighter", includeSource: true }`. It wraps `rough-notation`'s `annotate()` API with a `motion`-driven mount trigger — port the `rough-notation` usage, rewrite any `from "motion/react"` import to `from "framer-motion"` per the Global Constraints.

- [ ] **Step 2: Write the component**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { annotate } from "rough-notation";
import type { RoughAnnotation } from "rough-notation/lib/model";

export interface HighlighterAccentProps {
  children: React.ReactNode;
  active: boolean;
  color?: string;
  reduceMotion: boolean;
  className?: string;
}

export function HighlighterAccent({ children, active, color = "var(--accent)", reduceMotion, className = "" }: HighlighterAccentProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const shownRef = useRef(false);

  useEffect(() => {
    if (!active || !ref.current || shownRef.current) return;
    shownRef.current = true;
    annotationRef.current = annotate(ref.current, {
      type: "underline",
      color,
      strokeWidth: 2,
      animationDuration: reduceMotion ? 0 : 500,
    });
    annotationRef.current.show();
    return () => {
      annotationRef.current?.remove();
    };
  }, [active, color, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Verify types**

Run: `npx tsc --noEmit`
Expected: clean (if `rough-notation` ships no types, add a `declare module "rough-notation/lib/model"` shim in a new `types/rough-notation.d.ts` file with the minimal `RoughAnnotation` interface: `{ show(): void; remove(): void }`)

- [ ] **Step 4: Commit**

```bash
git add components/motion/highlighter-accent.tsx types/rough-notation.d.ts 2>/dev/null; git add components/motion/highlighter-accent.tsx
git commit -m "feat: add HighlighterAccent decorative primitive"
```

---

### Task 9: `components/motion/gradient-accent-word.tsx`

**Files:**
- Create: `components/motion/gradient-accent-word.tsx`

**Interfaces:**
- Produces: `GradientAccentWord` component, props `{ children: React.ReactNode; reduceMotion: boolean; className?: string }`.

- [ ] **Step 1: Fetch React Bits references**

Run `mcp__shadcn__view_items_in_registries` with `items: ["@react-bits/GradientText-TS-CSS", "@react-bits/ShinyText-TS-CSS"]` for the animated-gradient-on-text technique (`background-clip: text` + animated `background-position`, pure CSS, no deps for the CSS variants). Confirm the variant you view has zero dependencies before adapting (if it doesn't, use the other one — both cover the same technique).

- [ ] **Step 2: Write the component**

```tsx
"use client";

export interface GradientAccentWordProps {
  children: React.ReactNode;
  reduceMotion: boolean;
  className?: string;
}

export function GradientAccentWord({ children, reduceMotion, className = "" }: GradientAccentWordProps) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--accent), var(--c-amber), var(--accent))",
        backgroundSize: "200% 100%",
        animation: reduceMotion ? undefined : "hero-gradient-word-sweep 3s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 3: Add the keyframe to `app/globals.css`**

Add near the existing `@keyframes float`/`@keyframes pulse-dot` block:

```css
@keyframes hero-gradient-word-sweep {
  0%, 100% { background-position: 0% 50%; }
  50%       { background-position: 100% 50%; }
}
```

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 5: Commit**

```bash
git add components/motion/gradient-accent-word.tsx app/globals.css
git commit -m "feat: add GradientAccentWord decorative primitive"
```

---

### Task 10: `components/motion/wordmark-orbit-accent.tsx`

**Files:**
- Create: `components/motion/wordmark-orbit-accent.tsx`

**Interfaces:**
- Produces: `WordmarkOrbitAccent` component, props `{ active: boolean; count?: number; reduceMotion: boolean; className?: string }`. Default `count = 3`.

- [ ] **Step 1: Fetch references**

Run `mcp__magicuidesign-mcp__getRegistryItem` with `{ name: "orbiting-circles", includeSource: true }` and `mcp__shadcn__view_items_in_registries` with `items: ["@react-bits/OrbitImages-TS-CSS"]`. `orbiting-circles` uses pure CSS `@keyframes` (rotate + counter-rotate to keep dots upright) — port that technique, it has zero dependencies.

- [ ] **Step 2: Write the component**

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
              transformOrigin: `${-radius}px 0px`,
              marginLeft: -3,
              marginTop: -3,
            }}
          />
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Add the keyframe to `app/globals.css`**

```css
@keyframes hero-orbit-spin {
  from { transform: rotate(0deg) translateX(var(--orbit-radius, 90px)) rotate(0deg); }
  to   { transform: rotate(360deg) translateX(var(--orbit-radius, 90px)) rotate(-360deg); }
}
```

Then update Step 2's inline `style` to set `"--orbit-radius" as string]: radius` via a CSS custom property instead of `transformOrigin` (the `transformOrigin` trick above doesn't keep dots upright without a counter-rotation, which the keyframe's second `rotate()` term provides) — replace the `style` object with:

```tsx
style={{
  animation: `hero-orbit-spin ${duration}s linear infinite`,
  ["--orbit-radius" as string]: `${radius}px`,
  marginLeft: -3,
  marginTop: -3,
} as React.CSSProperties}
```

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 5: Manual smoke test**

Temporarily render `<WordmarkOrbitAccent active count={3} reduceMotion={false} className="h-40 w-40" />` inside a `relative` scratch container, `npm run dev`, confirm dots visibly orbit in circles without flying off-path or flipping orientation oddly.

- [ ] **Step 6: Commit**

```bash
git add components/motion/wordmark-orbit-accent.tsx app/globals.css
git commit -m "feat: add WordmarkOrbitAccent decorative primitive"
```

---

### Task 11: `components/motion/hero-scroll-progress.tsx` + `components/motion/card-backlight.tsx`

**Files:**
- Create: `components/motion/hero-scroll-progress.tsx`
- Create: `components/motion/card-backlight.tsx`

**Interfaces:**
- Produces: `HeroScrollProgress` component, props `{ progress: MotionValue<number>; className?: string }`. `CardBacklight` component, props `{ color?: string; className?: string }`.

- [ ] **Step 1: Fetch both references with full source**

Run `mcp__magicuidesign-mcp__getRegistryItem` with `{ name: "scroll-progress", includeSource: true }` and `{ name: "backlight", includeSource: true }`. Both have zero or `motion`-only dependencies (rewrite `from "motion/react"` to `from "framer-motion"` per Global Constraints).

- [ ] **Step 2: Write `hero-scroll-progress.tsx`**

Port the fetched `scroll-progress` source, adapted to take an existing `MotionValue<number>` (this project's `scrollYProgress` from `useScrollPin`) instead of creating its own via `useScroll` internally — the reference component typically calls `useScroll()` itself, which would create a second, redundant scroll listener. Target shape:

```tsx
"use client";

import { motion, type MotionValue } from "framer-motion";

export interface HeroScrollProgressProps {
  progress: MotionValue<number>;
  className?: string;
}

export function HeroScrollProgress({ progress, className = "" }: HeroScrollProgressProps) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 h-[2px] origin-left bg-accent ${className}`}
      style={{ scaleX: progress }}
    />
  );
}
```

(`scaleX` bound directly to a `MotionValue` via framer-motion's `style` prop is the one documented exception to the "no `x`/`y`/`scale` shorthand" rule — it's not the shorthand prop, it's a raw CSS `transform` sub-property passed through `style`, and framer-motion handles `MotionValue`-typed style values with a dedicated fast path.)

- [ ] **Step 3: Write `card-backlight.tsx`**

Port the fetched `backlight` source (it's typically a pure CSS radial-gradient glow with a blur, no framer-motion needed for a static glow):

```tsx
"use client";

export interface CardBacklightProps {
  color?: string;
  className?: string;
}

export function CardBacklight({ color = "var(--accent)", className = "" }: CardBacklightProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-6 -z-10 ${className}`}
      style={{
        background: `radial-gradient(circle, color-mix(in oklch, ${color} 22%, transparent) 0%, transparent 70%)`,
        filter: "blur(24px)",
      }}
    />
  );
}
```

- [ ] **Step 4: Verify types**

Run: `npx tsc --noEmit`
Expected: clean

- [ ] **Step 5: Commit**

```bash
git add components/motion/hero-scroll-progress.tsx components/motion/card-backlight.tsx
git commit -m "feat: add HeroScrollProgress and CardBacklight primitives"
```

---

### Task 12: Desktop wiring — `boreas-hero.tsx`

**Files:**
- Modify: `components/hero/boreas-hero.tsx`
- Modify: `content/boreas-home.ts` (read-only reference — no copy changes needed, `heroHeadline`/`heroProofPoints` already exist)

**Interfaces:**
- Consumes: `WordmarkIntro` (Task 4), `AccentOrbField` (Task 5), `DrawnPathAccent` (Task 6), `GrainTexture` (Task 7), `HighlighterAccent` (Task 8), `GradientAccentWord` (Task 9), `WordmarkOrbitAccent` (Task 10), `HeroScrollProgress` + `CardBacklight` (Task 11).
- Produces: desktop Hero renders the new intro + scroll-gated reflow + decorative layer. `REFLOW_END` and `CARD_END` constants (values below) are consumed by no later task in this plan — they're internal to this file.

**Before starting:** read the CURRENT content of `components/hero/boreas-hero.tsx` in full — Tasks 1-11 didn't touch it, but it reflects commits `e29ce5b`/`27db9c8`/`ed3bc03` from the prior pass. Locate `HeroCinematicLeftColumn`, `DoctorCardEntrance`, and `HeroCardClusterCinematic` by function name (not line number).

- [ ] **Step 1: Add new imports and constants**

At the top of `boreas-hero.tsx`, alongside the existing imports, add:

```tsx
import { WordmarkIntro } from "@/components/hero/wordmark-intro";
import { AccentOrbField } from "@/components/motion/accent-orb-field";
import { DrawnPathAccent } from "@/components/motion/drawn-path-accent";
import { GrainTexture } from "@/components/motion/grain-texture";
import { HighlighterAccent } from "@/components/motion/highlighter-accent";
import { GradientAccentWord } from "@/components/motion/gradient-accent-word";
import { WordmarkOrbitAccent } from "@/components/motion/wordmark-orbit-accent";
import { HeroScrollProgress } from "@/components/motion/hero-scroll-progress";
import { CardBacklight } from "@/components/motion/card-backlight";
```

Add two new phase constants near the existing `PHASE_1_END`/`PHASE_2_END`:

```tsx
const REFLOW_END = 0.2; // wordmark+H1 settle left, paragraph+CTA appear
const CARD_END = 0.32; // doctor card appears (was the old PHASE_1_END gate)
const PROOF_POINTS_START = CARD_END;
const PROOF_POINTS_STAGGER = 0.04;
```

- [ ] **Step 2: Rewrite `HeroCinematicLeftColumn` to use `WordmarkIntro` + scroll-gated reveal**

Replace the function's wordmark/H1 block (the `<motion.p>` for "Boreas" and the `<motion.div><TextReveal>...<h1>` block) with a single `<WordmarkIntro wordmark="Boreas" headline={heroHeadline} />` call. Keep the eyebrow crossfade above it and the CTA/subcopy/proof-points below it, but gate THOSE behind scroll now (they were unconditionally visible after Task 1 of the prior pass — that gate is being reintroduced here). Read the current function's full JSX before editing; the shape after your edit should be:

```tsx
function HeroCinematicLeftColumn({ scrollYProgress, ctaId }: { scrollYProgress: MotionValue<number>; ctaId: string }) {
  const problemEyebrowOpacity = useScrub(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0]);
  const solutionEyebrowOpacity = 1 - problemEyebrowOpacity;
  const reflowOpacity = useScrub(scrollYProgress, [0, REFLOW_END], [0, 1]);
  const reflowY = useScrub(scrollYProgress, [0, REFLOW_END], [10, 0]);

  return (
    <div>
      <div className="relative mb-5 h-[20px]">
        <p aria-hidden={problemEyebrowOpacity < 0.5} style={{ opacity: problemEyebrowOpacity }} className="absolute inset-0 text-sm font-semibold text-amber">
          {heroEyebrowProblem}
        </p>
        <p aria-hidden={solutionEyebrowOpacity < 0.5} style={{ opacity: solutionEyebrowOpacity }} className="absolute inset-0 text-sm font-semibold text-mint">
          {heroCredibility}
        </p>
      </div>

      <WordmarkIntro wordmark="Boreas" headline={heroHeadline} />

      <div style={{ opacity: reflowOpacity, transform: `translate3d(0, ${reflowY}px, 0)` }}>
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
```

Note: the `HighlighterAccent`/`GradientAccentWord` wrapping happens INSIDE `WordmarkIntro`'s `headline` rendering, not here — that's Step 3 below, since `WordmarkIntro` owns the `<h1>` markup.

- [ ] **Step 3: Wire `HighlighterAccent` and `GradientAccentWord` into the headline**

Open `components/hero/wordmark-intro.tsx` (from Task 4) and modify its `<h1>` rendering to wrap two specific substrings of the headline. The headline text is `"Tu consultorio digital, abierto las 24 horas."` — the marker-underline goes on "abierto las 24 horas" (the core value prop), the gradient goes on "digital" (ties to product identity). Since the headline arrives as a single string prop, split it in `WordmarkIntro` itself:

```tsx
import { HighlighterAccent } from "@/components/motion/highlighter-accent";
import { GradientAccentWord } from "@/components/motion/gradient-accent-word";

// Inside WordmarkIntro's JSX, replace the plain `{headline}` inside <h1> with:
<h1 className="mt-[22px] text-balance font-display font-normal leading-[1.08] tracking-[-0.012em] text-foreground" style={{ fontSize: "clamp(2.4rem, 5.6vw, 5.4rem)" }}>
  Tu consultorio <GradientAccentWord reduceMotion={false}>digital</GradientAccentWord>,{" "}
  <HighlighterAccent active={holdDone} reduceMotion={false}>
    abierto las 24 horas
  </HighlighterAccent>
  .
</h1>
```

This hardcodes the split instead of taking a generic `headline` string — acceptable since `heroHeadline`'s exact wording is a fixed content decision, not something that varies at runtime. Remove the now-unused `headline` prop plumbing if nothing else reads it, or keep it as a fallback for future headline changes (simplest: keep the prop for the aria-label/reduced-motion path, hardcode the JSX split only in the animated rendering).

- [ ] **Step 4: Add `ProofPointChips` (new local component in `boreas-hero.tsx`)**

```tsx
const PROOF_POINT_POSITIONS = [
  "absolute -left-4 top-[22%] z-[2]",
  "absolute -right-2 top-[6%] z-[2]",
  "absolute -left-2 bottom-[16%] z-[2]",
  "absolute -right-4 bottom-2 z-[2]",
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

function ProofPointChips({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  return (
    <div className="relative mt-9 h-0">
      {heroProofPoints.map((point, i) => (
        <ProofPointChip
          key={point}
          label={point}
          className={PROOF_POINT_POSITIONS[i]}
          scrollYProgress={scrollYProgress}
          start={PROOF_POINTS_START + i * PROOF_POINTS_STAGGER}
        />
      ))}
    </div>
  );
}
```

Note: these chips are positioned `absolute` relative to a zero-height wrapper inside the left column, reading visually as floating near the paragraph/CTA block. If live testing shows they overlap the right-column card cluster at any breakpoint ≥1024px, adjust the `left`/`right` values in `PROOF_POINT_POSITIONS` — this is a decorative-positioning tuning pass, not a structural change.

- [ ] **Step 5: Re-gate `DoctorCardEntrance` behind scroll (reverting Task 1's always-visible change)**

Locate `DoctorCardEntrance` in the current file. It currently has `opacity` fixed at `1` (from the prior pass's fix). Change it back to scroll-gated, using the new `CARD_END` constant instead of the old `PHASE_1_END`:

```tsx
function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useScrub(scrollYProgress, [CARD_END, CARD_END + 0.08], [0, 1]);
  const y = useScrub(scrollYProgress, [CARD_END, CARD_END + 0.08], [24, 0]);
  const settleScale = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);

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
    <div style={{ opacity, transform: `translate3d(0, ${y}px, 0) scale(${settleScale})` }} className="absolute left-0 right-[50px] top-[30px] z-[1]">
      <CardBacklight />
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCardSrOnlyTranscript />
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />
    </div>
  );
}
```

- [ ] **Step 6: Add the illustrative decorative layer to `HeroCardClusterCinematic`**

Locate `HeroCardClusterCinematic`. Add `AccentOrbField`, `DrawnPathAccent`, `GrainTexture`, `WordmarkOrbitAccent`, and `HeroScrollProgress` alongside the existing `ParallaxLayer`-wrapped `ClusterBackgroundTexture`:

```tsx
function HeroCardClusterCinematic({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const wordmarkOrbitActive = useScrub(scrollYProgress, [0, 0.02], [1, 0]) > 0.5;

  return (
    <div className="relative hidden lg:block" style={{ height: "460px" }}>
      <GrainTexture className="rounded-[var(--radius-xl)]" />
      <AccentOrbField progress={scrollYProgress} count={5} reduceMotion={false} />
      <DrawnPathAccent
        progress={scrollYProgress}
        range={[0.1, 0.5]}
        d="M 10 400 Q 200 100 420 250"
        viewBox="0 0 460 460"
        className="inset-0 h-full w-full"
        reduceMotion={false}
      />
      <WordmarkOrbitAccent active={wordmarkOrbitActive} count={3} reduceMotion={false} className="left-[10%] top-[10%] h-32 w-32" />
      <HeroScrollProgress progress={scrollYProgress} className="right-0" />

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

The `d="M 10 400 Q 200 100 420 250"` path is a placeholder curve sized to the cluster's known `460px` height/width-ish box — adjust the control points in Step 8 (live verification) if it visually clips or looks awkward at the actual rendered width (the cluster's width varies with `0.88fr` grid sizing, but the SVG's `viewBox` scales proportionally so the curve's general shape holds).

- [ ] **Step 7: Run type check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean

- [ ] **Step 8: Browser verification (desktop, gstack browse)**

```bash
npm run dev &
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B goto http://localhost:3000
$B viewport 1440x900
$B screenshot /tmp/hero-desktop-intro-load.png --viewport
```

Confirm in the screenshot/live browser: on load, "Boreas" reveals letter-by-letter, pauses, headline appears with "digital" in gradient and "abierto las 24 horas" underlined. Scroll: text settles left, paragraph+CTA+proof-point chips fade in, card appears with its backlight glow, orbs/line/grain visible, scroll-progress bar advances. No content ever fully invisible without a scroll-independent path to reveal it (wordmark+headline) — confirm paragraph/CTA appear within a reasonable scroll distance, not requiring excessive scrolling.

- [ ] **Step 9: Commit**

```bash
git add components/hero/boreas-hero.tsx components/hero/wordmark-intro.tsx
git commit -m "feat: desktop Hero wordmark intro + scroll-gated reflow + decorative layer"
```

---

### Task 13: Mobile wiring — `boreas-hero.tsx`

**Files:**
- Modify: `components/hero/boreas-hero.tsx`

**Interfaces:**
- Consumes: same primitives as Task 12, plus the existing `HeroCardMobilePinned`/`useScrollPin` mobile infrastructure.

**Before starting:** re-read the current `components/hero/boreas-hero.tsx` (now includes Task 12's changes) — locate `HeroCinematic`'s mobile branch and `HeroCardMobilePinned` by function name.

- [ ] **Step 1: Replace the mobile wordmark block with `WordmarkIntro`**

In `HeroCinematic`'s mobile branch (`lg:hidden` wrapper calling `HeroCinematicLeftColumn` with `mobileScrollYProgress`), the `HeroCinematicLeftColumn` component already renders `WordmarkIntro` after Task 12's Step 2 — no separate mobile-specific wordmark code exists, this is shared. Confirm by reading the current file that `HeroCinematicLeftColumn` is the same function used for both the mobile (`ctaId="hero-primary-cta-mobile"`) and desktop (`ctaId="hero-primary-cta"`) call sites — it already is, per the existing structure. No new code needed for this step; it's a verification-only step.

- [ ] **Step 2: Make Boreas+H1 scroll-away as the card enters, on mobile**

Locate `HeroCardMobilePinned`. Add a `WordmarkExitVeil`-style opacity/translate on the `HeroCinematicLeftColumn`'s wordmark block specifically for mobile — since `WordmarkIntro` is shared, add the exit behavior as a wrapping motion div around the mobile call site instead of inside the shared component. In the mobile branch of `HeroCinematic`:

```tsx
function MobileWordmarkExit({ mobileScrollYProgress, children }: { mobileScrollYProgress: MotionValue<number>; children: React.ReactNode }) {
  const opacity = useScrub(mobileScrollYProgress, [0, 0.15], [1, 0]);
  const y = useScrub(mobileScrollYProgress, [0, 0.15], [0, -24]);
  return <div style={{ opacity, transform: `translate3d(0, ${y}px, 0)` }}>{children}</div>;
}
```

Wrap the `<HeroCinematicLeftColumn scrollYProgress={mobileScrollYProgress} ctaId="hero-primary-cta-mobile" />` call in `HeroCinematic`'s mobile branch with `<MobileWordmarkExit mobileScrollYProgress={mobileScrollYProgress}><HeroCinematicLeftColumn ... /></MobileWordmarkExit>`.

Note: this makes the ENTIRE left column (wordmark, headline, paragraph, CTA, proof points) fade/slide away together on mobile scroll, matching the spec's "Boreas+H1 se desvanecen/deslizan fuera conforme la card entra" — since on mobile there's no side-by-side reflow (everything stacks), fading the whole intro block as the card takes over is the correct mobile-specific behavior, distinct from desktop's reflow-to-the-side.

- [ ] **Step 3: Add `CardBacklight` to `HeroCardMobilePinned`**

Locate `HeroCardMobilePinned`'s sticky card wrapper (`<div className="sticky top-[88px] rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow)]">`). Add `<CardBacklight />` as its first child, matching desktop's `DoctorCardEntrance`.

- [ ] **Step 4: Add mobile-scale decorative elements below the pinned card**

In `HeroCardMobilePinned`, after the existing chip row (`AppointmentsChip`/`SearchPercentChip`), add proof-point chips, a smaller `AccentOrbField`/`GrainTexture` pass, and the drawn-line accent (spec requires all three decorative primitives on mobile too, at reduced scale — not just orbs+grain). Since `HeroCardMobilePinned` doesn't currently import `ProofPointChips` (a `boreas-hero.tsx`-local function from Task 12, already in scope in the same file — no new import needed), add:

```tsx
// Inside HeroCardMobilePinned's returned JSX, after the existing chip row div:
<ProofPointChips scrollYProgress={scrollYProgress} />
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
<HeroScrollProgress progress={scrollYProgress} />
```

`ProofPointChips`'s `PROOF_POINT_POSITIONS` (Task 12) uses absolute corner positions tuned for the desktop cluster's 460px box — on mobile, the container is the card's own padding box, which is narrower. If live testing shows chips overlapping card content, add a `compact` boolean prop to `ProofPointChips`/`ProofPointChip` that switches to a simple `flex flex-wrap gap-2` row layout instead of absolute corners (mobile-appropriate), and pass `compact` from this call site only.

- [ ] **Step 5: Run type check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean

- [ ] **Step 6: Browser verification (mobile, gstack browse)**

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B viewport 390x844
$B goto http://localhost:3000
$B screenshot /tmp/hero-mobile-intro-load.png --viewport
```

Confirm: same letter-reveal intro as desktop. Scroll down: Boreas+headline+paragraph+CTA fade/slide away together, card becomes visible with its backlight, sticks to the top once it reaches `top-[88px]`. Continue scrolling: proof-point chips + orbs + grain appear below, no overlap with card content, no horizontal overflow. Test in both light and dark mode (toggle via the header button, same as prior sessions' verification pattern).

- [ ] **Step 7: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat: mobile Hero wordmark exit + card backlight + decorative layer"
```

---

### Task 14: Full verification pass

**Files:** none modified unless a bug is found and fixed (then: `components/hero/boreas-hero.tsx` and/or any of the new `components/motion/*` files).

- [ ] **Step 1: Full build**

Run: `cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll" && npm run build`
Expected: clean, static prerender succeeds.

- [ ] **Step 2: Cross-file consistency read**

Re-read `components/hero/boreas-hero.tsx` in full. Confirm:
- No leftover reference to the old `PHASE_1_END`-gated `DoctorCardEntrance` opacity range (should be `CARD_END` now).
- `WordmarkIntro`'s `HighlighterAccent`/`GradientAccentWord` split matches the exact current `heroHeadline` string (if that content string ever changed between tasks, the hardcoded split in Task 12 Step 3 would silently break — verify it still matches `content/boreas-home.ts`'s `heroHeadline`).
- No component in `components/motion/` imports `framer-motion` AND `gsap` in the same file (grep: `grep -l "from \"gsap\"" components/motion/*.tsx` should return only `wordmark-letter-reveal.tsx`).

- [ ] **Step 3: Accessibility spot-check**

Run gstack browse, load the page, run `$B accessibility` (or equivalent snapshot) at desktop and mobile. Confirm: headline text (including the "digital"/"abierto las 24 horas" spans) reads as normal text content, not hidden; all `components/motion/*` decorative primitives (`AccentOrbField`, `DrawnPathAccent`, `GrainTexture`, `WordmarkOrbitAccent`, `HeroScrollProgress`, `CardBacklight`) are absent from the accessibility tree (`aria-hidden` working); CTA links present with correct `href`/`id` even before any scroll (confirm via `$B html` or DOM inspection at scroll position 0 — even though they're not yet opacity-visible, they must exist in the DOM per the documented gating exception).

- [ ] **Step 4: `prefers-reduced-motion` check**

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B js "matchMedia('(prefers-reduced-motion: reduce)').matches"
```

If the browse tool supports emulating reduced-motion (check `$B --help` or the CDP allowlist for `Emulation.setEmulatedMedia`), use it; otherwise verify by reading `HeroStatic`'s code path directly (it doesn't render `WordmarkIntro` at all — confirm `BoreasHero`'s `reduceMotion` branch still renders `HeroStatic`, unchanged by this plan's tasks) and confirm `HeroStatic`'s `HeroCardCluster`/`HeroCardMobile` don't reference any of the new gsap/skip-on-scroll code.

- [ ] **Step 5: Screenshot sweep**

Take screenshots at 1024px, 1440px, 1920px (desktop) and 375px, 390px, 428px (mobile), both light and dark mode, at scroll positions 0%, 30%, 60%, 100% of the pin. Visually confirm no clipped/overflowing decorative elements, no layout shift jank, no console errors (`$B console --errors`).

- [ ] **Step 6: Update the progress ledger**

```bash
cat >> "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll/.superpowers/sdd/progress.md" << 'EOF'

--- New plan: 2026-07-17-hero-letter-reveal-intro ---
EOF
```

- [ ] **Step 7: If all clean, no commit needed for this task (verification-only). If a bug was found and fixed:**

```bash
git add -A
git commit -m "fix: address findings from Hero letter-reveal-intro verification pass"
```

- [ ] **Step 8: Push to update PR #67**

```bash
git push origin worktree-hero-cinematic-scroll
```
