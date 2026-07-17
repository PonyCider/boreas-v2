# Hero Intro Reflow + Mobile Richness — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the empty-at-rest desktop Hero (doctor card invisible until 30% scroll) via a centered-intro-then-split choreography, and bring mobile's doctor card up to desktop's depth/glow treatment.

**Architecture:** Desktop gets a new pre-phase (`INTRO_END = 0.16`, before the existing `PHASE_1_END = 0.3`) that repositions (never hides) the text block and doctor card from a centered stack to today's two-column layout, using `transform` driven by scroll + CSS container-query units (`cqw`) — no JS measurement, no opacity gating on primary content. Mobile gets `StackedCards` depth layers and an ambient glow (`MobileAmbientGlow`), mirroring primitives already proven on desktop.

**Tech Stack:** Next.js 16, React 19, framer-motion, Tailwind v4 (CSS container queries via `[container-type:inline-size]` arbitrary property).

**Rollback:** `git tag hero-before-intro-reflow` at commit `7f25f4b` — `git checkout hero-before-intro-reflow` reverts to the pre-implementation state cleanly if this doesn't land well.

## Global Constraints

- Ease-out exponential `[0.22, 1, 0.36, 1]` (`EASE` constant) stays the default for any time-based transition. Scroll-scrubbed values (`useScrub`) stay linear, matching every existing scrub in this file — do not introduce per-scrub easing curves.
- No content gating: primary content (wordmark, H1, subcopy, CTAs, doctor card) must never have `opacity: 0` in its resting/DOM state. Secondary decorative chips (`AppointmentsChipEntrance`, `TimeChip`, `SearchPercentChip`'s own delay-triggers) keep their existing gated behavior — out of scope here.
- No JS measurement (`getBoundingClientRect`, `ResizeObserver`) for layout positioning — use CSS container query units (`cqw`) bound via `[container-type:inline-size]`, consistent with the project's prior rejection of JS-measurement-based layout (Relevo carousel fix).
- Transform + opacity only for animated properties (GPU-friendly) — write the full `transform:` string (`translate3d()`, `scale()`), never Framer Motion's `x`/`y`/`scale` shorthand props (those run on the main thread via `requestAnimationFrame`, not hardware-accelerated).
- `prefers-reduced-motion` (the `HeroStatic` / non-cinematic path) must show full content with no position choreography — already true, must remain true.
- Reuse existing primitives only: `StackedCards`, `ParallaxLayer`, `useScrub`, `useScrollPin`. Do not modify `components/motion/stacked-cards.tsx`, `lib/motion/use-scrub.ts`, `components/motion/parallax-layer.tsx`, or `lib/motion/use-scroll-pin.ts` unless a task explicitly says to.
- `--shadow-depth` (in `app/globals.css`) is already theme-adaptive (light/dark) — reuse as-is, no new token needed.
- File touched: `components/hero/boreas-hero.tsx` only (all 4 tasks).

---

### Task 1: Desktop intro reflow — centered stack → two-column split

**Files:**
- Modify: `components/hero/boreas-hero.tsx`

**Interfaces:**
- Consumes: existing `useScrub` (`lib/motion/use-scrub.ts`), existing `PHASE_1_END`/`PHASE_2_END`/`EASE` constants, existing `HeroCinematicLeftColumn`/`DoctorCardEntrance`/`HeroCardClusterCinematic` functions.
- Produces: new `INTRO_END` constant (consumed only within this file); `HeroCinematicLeftColumn` gains an `enableIntroReflow?: boolean` prop (default `false`) — later tasks/files do not consume this, it's desktop-call-site-only.

This task removes the opacity gate that hides the doctor card until 30% scroll, and replaces it with a transform-based "centered intro → split into columns" choreography that never hides primary content.

- [ ] **Step 1: Add the `INTRO_END` constant**

In `components/hero/boreas-hero.tsx`, find this block (around line 32-36):

```ts
const HERO_PIN_VH_DESKTOP = 280;
const HERO_PIN_VH_MOBILE = 150;
const MOBILE_PHASE_END = 0.5; // "busca+encuentra" → "responde+agenda"
const PHASE_1_END = 0.3; // "Te busca" → "Te encuentra"
const PHASE_2_END = 0.65; // "Te encuentra" → "Te escribe y agenda"
```

Replace with:

```ts
const HERO_PIN_VH_DESKTOP = 280;
const HERO_PIN_VH_MOBILE = 150;
const MOBILE_PHASE_END = 0.5; // "busca+encuentra" → "responde+agenda"
const INTRO_END = 0.16; // desktop-only: centered intro stack → two-column split
const PHASE_1_END = 0.3; // "Te busca" → "Te encuentra"
const PHASE_2_END = 0.65; // "Te encuentra" → "Te escribe y agenda"

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
```

- [ ] **Step 2: Mark the desktop grid wrapper as a container-query container**

Find (around line 653, inside `HeroCinematic`):

```tsx
          <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
            <HeroCinematicLeftColumn scrollYProgress={desktopScrollYProgress} ctaId="hero-primary-cta" />
            <HeroCardClusterCinematic scrollYProgress={desktopScrollYProgress} />
          </div>
```

Replace with:

```tsx
          <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10 [container-type:inline-size]">
            <HeroCinematicLeftColumn scrollYProgress={desktopScrollYProgress} ctaId="hero-primary-cta" enableIntroReflow />
            <HeroCardClusterCinematic scrollYProgress={desktopScrollYProgress} />
          </div>
```

(This is desktop-only markup — the mobile call site of `HeroCinematicLeftColumn`, a few lines above, is untouched and keeps `enableIntroReflow` at its default `false`.)

- [ ] **Step 3: Add the reflow transform to `HeroCinematicLeftColumn`**

Find the function signature and opening (around line 439-450):

```tsx
function HeroCinematicLeftColumn({ scrollYProgress, ctaId }: { scrollYProgress: MotionValue<number>; ctaId: string }) {
  const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
  const ease = EASE;
  const problemEyebrowOpacity = useScrub(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0]);
  const solutionEyebrowOpacity = 1 - problemEyebrowOpacity;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.09, delayChildren: 0.12 }}
    >
```

Replace with:

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
  const reveal = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0 } };
  const ease = EASE;
  const problemEyebrowOpacity = useScrub(scrollYProgress, [PHASE_1_END - 0.06, PHASE_1_END], [1, 0]);
  const solutionEyebrowOpacity = 1 - problemEyebrowOpacity;
  const introProgress = useScrub(scrollYProgress, [0, INTRO_END], [1, 0]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      transition={{ staggerChildren: 0.09, delayChildren: 0.12 }}
      style={
        enableIntroReflow
          ? { transform: `translate3d(calc(${introProgress} * ${TEXT_INTRO_TRANSLATE_X}), 0px, 0)` }
          : undefined
      }
    >
```

(The rest of the function — eyebrow, wordmark, H1, subcopy, CTAs, proof points — is unchanged. Do not touch it.)

- [ ] **Step 4: Remove the opacity gate from `DoctorCardEntrance`, add the matching reflow transform**

Find (around line 538-565):

```tsx
function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const opacity = useScrub(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [0, 1]);
  const y = useScrub(scrollYProgress, [PHASE_1_END, PHASE_1_END + 0.08], [24, 0]);
  const settleScale = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);

  const cardContent = (
    <div className="bg-surface p-[22px]">
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
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCardSrOnlyTranscript />
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />
    </div>
  );
}
```

Replace with:

```tsx
function DoctorCardEntrance({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Card is visible from scroll=0 (no opacity gate — content must never hide
  // behind animation). introProgress drives its position only: 1 = stacked
  // centered under the intro text, 0 = resting position in the right column.
  const introProgress = useScrub(scrollYProgress, [0, INTRO_END], [1, 0]);
  const settleScale = useScrub(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.05], [1, 1.015]);
  const introY = introProgress * 30; // vh — moves the card down to sit under the centered intro text

  const cardContent = (
    <div className="bg-surface p-[22px]">
      <DoctorCard
        trigger={{ mode: "delay", ms: 400 }}
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
    <div
      style={{
        transform: `translate3d(calc(${introProgress} * ${CARD_INTRO_TRANSLATE_X}), ${introY}vh, 0) scale(${settleScale})`,
      }}
      className="absolute left-0 right-[50px] top-[30px] z-[1]"
    >
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCardSrOnlyTranscript />
      <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px 0px" />
    </div>
  );
}
```

**Why the trigger changed:** `DoctorCard`'s rating-count-up (`RatingBlock`'s `useAnimatedNumber`) was triggered by `{mode:"progress", threshold: PHASE_1_END}` — timed to fire exactly when the card became visible. Now that the card is visible from scroll=0, a scroll-progress trigger would leave the number frozen at its start value until the user scrolls past the threshold, which is wrong for content that's already on screen. Switched to `{mode:"delay", ms:400}`, matching the same pattern already used for other always-visible cards in this file (`StackedCardsStaticDoctorCard` uses `{mode:"delay", ms:800}`).

- [ ] **Step 5: Verify TypeScript and lint**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll"
npx tsc --noEmit
npm run lint
```

Expected: both clean, no errors.

- [ ] **Step 6: Visual verification via gstack `/browse`**

Start the dev server if not running (`npm run dev`, port 3000), then:

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B goto http://localhost:3000
$B viewport 1440x900
$B screenshot /tmp/intro-1440-rest.png --viewport
$B js "window.scrollBy(0, 500)"
$B screenshot /tmp/intro-1440-mid.png --viewport
$B js "window.scrollBy(0, 2000)"
$B screenshot /tmp/intro-1440-final.png --viewport
$B viewport 1024x800
$B goto http://localhost:3000
$B screenshot /tmp/intro-1024-rest.png --viewport
$B viewport 1920x1000
$B goto http://localhost:3000
$B screenshot /tmp/intro-1920-rest.png --viewport
```

Read each screenshot with the Read tool. Expected:
- `intro-*-rest.png` (scroll 0, all three widths): text block AND doctor card both fully opaque and roughly horizontally centered as one stack — no empty right column, no `opacity: 0` element.
- `intro-1440-mid.png`: mid-transition, both elements partway between centered and final split position — no sudden jump/pop, no clipping.
- `intro-1440-final.png`: matches today's existing two-column layout exactly (this must be pixel-identical in structure to the pre-change layout, since `introProgress` is 0 here and `translate3d(calc(0 * ...), 0vh, 0)` is a no-op transform).

If the centering looks off at 1024px or 1920px (drift from the calc()'s ratio math), adjust the `TEXT_INTRO_TRANSLATE_X`/`CARD_INTRO_TRANSLATE_X` constants' px offsets in Step 1 and re-screenshot — this is a hand-tuned decorative value, matching how other position constants in this file (e.g. `VerifiedBadge`'s `left-[168px]`) were already tuned empirically.

- [ ] **Step 7: Accessibility check — no primary content gated by opacity at rest**

```bash
grep -n "opacity" "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll/components/hero/boreas-hero.tsx"
```

Confirm `DoctorCardEntrance` no longer appears in the output (its `opacity` scrub was removed in Step 4). Confirm the only remaining `opacity` usages are on secondary/decorative elements (eyebrow crossfade, `AppointmentsChipEntrance`, `TimeChip`, chip mount animations) — all pre-existing, out of scope, unchanged.

- [ ] **Step 8: Commit**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll"
git add components/hero/boreas-hero.tsx
git commit -m "feat: desktop Hero intro reflow — centered stack, no opacity gate on doctor card"
```

---

### Task 2: Mobile — StackedCards depth layer + ambient glow

**Files:**
- Modify: `components/hero/boreas-hero.tsx`

**Interfaces:**
- Consumes: `StackedCards`, `StackedCardLayer` (already imported in this file), `DoctorCardSrOnlyTranscript`, `ExampleBadge`, `VerifiedBadge` (already defined in this file), `ParallaxLayer` (already imported).
- Produces: new `MobileAmbientGlow({ variant: "top" | "card" })` component, used by this task and available to Task 3 if needed (it is not — Task 3 doesn't exist as a separate mobile task; mobile is fully covered here, see note below).

This task gives `HeroCardMobilePinned` (cinematic path) and `HeroCardMobile` (`HeroStatic`/reduced-motion fallback) the same depth-layer treatment desktop already has, plus an ambient glow so the mobile hero doesn't read as a flat void — confirmed by screenshot against the running build (`/tmp/hero-mobile-dark-vp.png`, `/tmp/hero-mobile-dark-scroll2.png` from the design session): dark mode especially shows large flat black areas above and below the card, and the card itself has no depth.

- [ ] **Step 1: Add `MobileAmbientGlow`**

In `components/hero/boreas-hero.tsx`, find `ClusterBackgroundTexture` (around line 260-271):

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

Add immediately after it:

```tsx
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
```

- [ ] **Step 2: Rewrite `HeroCardMobilePinned` with `StackedCards` + glow**

Find the full function (around line 599-639):

```tsx
function HeroCardMobilePinned({ containerRef, scrollYProgress }: ScrollPin) {
  const problemOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [1, 0]);
  const solutionOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [0, 1]);
  const appointmentsOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END, MOBILE_PHASE_END + 0.08], [0, 1]);

  return (
    <div ref={containerRef} className="relative mt-10 block lg:hidden" style={{ height: `${HERO_PIN_VH_MOBILE}vh` }}>
      <div className="sticky top-[88px] rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow)]">
        <ExampleBadge />
        <VerifiedBadge />
        <DoctorCard
          trigger={{ mode: "progress", value: scrollYProgress, threshold: 0.1 }}
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
    </div>
  );
}
```

Replace with:

```tsx
function HeroCardMobilePinned({ containerRef, scrollYProgress }: ScrollPin) {
  const problemOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [1, 0]);
  const solutionOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END - 0.05, MOBILE_PHASE_END], [0, 1]);
  const appointmentsOpacity = useScrub(scrollYProgress, [MOBILE_PHASE_END, MOBILE_PHASE_END + 0.08], [0, 1]);

  const cardContent = (
    <div className="bg-surface p-5">
      <DoctorCard
        trigger={{ mode: "progress", value: scrollYProgress, threshold: 0.1 }}
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
        <ParallaxLayer progress={scrollYProgress} speed={0.12} reduceMotion={false} className="absolute inset-0 -z-10">
          <MobileAmbientGlow variant="card" />
        </ParallaxLayer>
        <ExampleBadge />
        <VerifiedBadge />
        <DoctorCardSrOnlyTranscript />
        <StackedCards layers={layers} ghostLayers={[layers[0]]} radiusVar="var(--radius-xl)" clipInset="-4px -40px -40px -40px" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Rewrite `HeroCardMobile` (reduced-motion fallback) with `StackedCards` + static glow**

Find the full function (around line 321-338):

```tsx
function HeroCardMobile({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-10 block rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow)] lg:hidden"
    >
      <ExampleBadge />
      <VerifiedBadge />
      <DoctorCard trigger={{ mode: "delay", ms: 400 }} testimonialDelayMs={900} reduceMotion={reduceMotion} />
      <div className="mt-4 flex gap-3">
        <AppointmentsChip trigger={{ mode: "delay", ms: 700 }} reduceMotion={reduceMotion} compact />
        <SearchPercentChip trigger={{ mode: "delay", ms: 900 }} reduceMotion={reduceMotion} compact />
      </div>
    </motion.div>
  );
}
```

Replace with:

```tsx
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
```

- [ ] **Step 4: Add the "top" glow to both mobile entry points**

In `HeroCinematic` (around line 646-650), find:

```tsx
      <div className="mx-auto w-full max-w-[1460px] px-4 pt-20 sm:px-6 lg:hidden">
        <HeroCinematicLeftColumn scrollYProgress={mobileScrollYProgress} ctaId="hero-primary-cta-mobile" />
        <HeroCardMobilePinned containerRef={mobileContainerRef} scrollYProgress={mobileScrollYProgress} />
      </div>
```

Replace with:

```tsx
      <div className="relative mx-auto w-full max-w-[1460px] px-4 pt-20 sm:px-6 lg:hidden">
        <MobileAmbientGlow variant="top" />
        <HeroCinematicLeftColumn scrollYProgress={mobileScrollYProgress} ctaId="hero-primary-cta-mobile" />
        <HeroCardMobilePinned containerRef={mobileContainerRef} scrollYProgress={mobileScrollYProgress} />
      </div>
```

In `HeroStatic` (around line 350-351), find:

```tsx
    <section className="min-h-[calc(100vh-64px)] py-20 bg-hero-glow transition-[background,colors] duration-[280ms]">
      <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
```

Replace with:

```tsx
    <section className="min-h-[calc(100vh-64px)] py-20 bg-hero-glow transition-[background,colors] duration-[280ms]">
      <div className="relative mx-auto grid w-full max-w-[1460px] items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1fr_0.88fr] lg:gap-[60px] lg:px-10">
        <MobileAmbientGlow variant="top" />
```

(Note: this file already has a `<div className="relative mx-auto grid ...">` opening tag immediately followed by a `{/* Left column */}` comment and a `<motion.div>` — insert `<MobileAmbientGlow variant="top" />` as the first child, before the `{/* Left column */}` comment, without altering anything else in that block.)

- [ ] **Step 5: Verify TypeScript and lint**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll"
npx tsc --noEmit
npm run lint
```

Expected: both clean, no errors.

- [ ] **Step 6: Visual verification via gstack `/browse` — light and dark, cinematic and reduced-motion**

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B goto http://localhost:3000
$B viewport 390x844
$B screenshot /tmp/mobile-light-rest.png --viewport
```

Toggle dark mode (snapshot the header to find the theme button ref, click it — see the "Activar modo oscuro"/"Activar modo claro" button used earlier this session), then:

```bash
$B screenshot /tmp/mobile-dark-rest.png --viewport
$B js "window.scrollTo(0, 1300)"
$B screenshot /tmp/mobile-dark-card.png --viewport
```

Then check the reduced-motion fallback (`HeroStatic`) — emulate `prefers-reduced-motion: reduce` (browse doesn't expose this directly; instead verify by reading the component logic: `BoreasHero` renders `HeroStatic` when `useReducedMotion()` is true — confirm via code review that `HeroCardMobile`'s new `StackedCards`/`MobileAmbientGlow` render correctly by reasoning through the JSX, since forcing `prefers-reduced-motion` in a headless browser requires CDP emulation not exposed by this skill; a manual OS-level check is acceptable follow-up, not blocking).

Read each screenshot with the Read tool. Expected:
- `mobile-dark-rest.png`: glow visible behind the headline, no flat black void.
- `mobile-dark-card.png`: doctor card shows a visible echo/depth layer (subtle offset blurred duplicate behind the front card, same look as desktop), glow visible around the card, no large flat black areas directly above/below it.
- `mobile-light-rest.png`: same structural elements, glow present but naturally more subtle against the light background — confirms the glow isn't dark-mode-only.

If the glow bleeds outside the viewport or looks misplaced, adjust `MobileAmbientGlow`'s inset/position values in Step 1 and re-screenshot.

- [ ] **Step 7: Commit**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll"
git add components/hero/boreas-hero.tsx
git commit -m "feat: mobile Hero depth layer + ambient glow — parity with desktop richness"
```

---

### Task 3: Full verification pass

**Files:** none modified — verification only.

**Interfaces:** none.

- [ ] **Step 1: Build**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll"
npm run build
```

Expected: clean build, static prerender succeeds, no warnings about the Hero component.

- [ ] **Step 2: Full-file re-read and cross-task consistency check**

Read the complete `components/hero/boreas-hero.tsx` file. Confirm:
- `INTRO_END`, `TEXT_INTRO_TRANSLATE_X`, `CARD_INTRO_TRANSLATE_X` are all defined once, used consistently.
- `HeroCinematicLeftColumn`'s `enableIntroReflow` prop is `true` only at the desktop call site, absent (defaulting `false`) at the mobile call site.
- No leftover references to the old `DoctorCardEntrance` opacity/y scrub variables.
- `MobileAmbientGlow` is defined once, used in exactly 4 places (`HeroCardMobilePinned`, `HeroCardMobile`, `HeroCinematic`'s mobile wrapper, `HeroStatic`'s grid wrapper).
- Every `StackedCards` usage in the file (desktop x2, mobile x2, now 4 total) follows the same badge-as-sibling + `DoctorCardSrOnlyTranscript` pattern — no card lost its accessibility transcript.

- [ ] **Step 3: Full-breakpoint visual sweep**

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B goto http://localhost:3000
$B responsive /tmp/hero-final
```

Read `/tmp/hero-final-mobile.png`, `/tmp/hero-final-tablet.png`, `/tmp/hero-final-desktop.png` with the Read tool. Confirm no layout breakage, no clipped content, no overlapping elements at any of the three breakpoints.

- [ ] **Step 4: Accessibility spot-check**

```bash
B="$HOME/.claude/skills/gstack/browse/dist/browse"
$B accessibility | grep -i "sofía\|cardiología\|verificado"
```

Expected: the doctor's name, specialty, and rating text are present in the accessibility tree (proving the `sr-only` transcripts are doing their job across all 4 `StackedCards` usages), even though the visual cards themselves are `aria-hidden`.

- [ ] **Step 5: Update the progress ledger**

Append to `.superpowers/sdd/progress.md`:

```
---
Plan: 2026-07-17-hero-intro-reflow-and-mobile-richness
Task 1: complete (desktop intro reflow, opacity gate removed)
Task 2: complete (mobile StackedCards depth + ambient glow)
Task 3: complete (full verification pass)
PLAN COMPLETE.
```

- [ ] **Step 6: Final commit if any fixes were made during verification**

If Steps 1-4 required any fixes, commit them:

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3/.claude/worktrees/hero-cinematic-scroll"
git add -A
git commit -m "fix: address findings from Hero intro-reflow verification pass"
```

If no fixes were needed, skip this step (nothing to commit).
