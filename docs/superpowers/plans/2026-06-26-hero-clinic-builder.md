# Hero Clinic Builder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static hero visual with an infinite, looping animated widget where colorful IDE-shaped bots assemble the doctor's *consultorio digital* (agenda, reviews, WhatsApp, pulse-line) piece by piece, then dissolve and rebuild.

**Architecture:** One new client component `components/hero/clinic-builder.tsx` renders an inline SVG scene; a gsap timeline (via `@gsap/react`'s `useGSAP`) choreographs the build → hold → dissolve → loop. `gsap.matchMedia()` swaps crew size (desktop 5–7 bots / mobile 2–3) and renders a static finished frame for `prefers-reduced-motion`. An `IntersectionObserver` pauses the timeline off-screen. `boreas-hero.tsx` drops its old visual blocks and mounts the new widget inside the existing parallax wrapper.

**Tech Stack:** Next.js 16 · React 19 · Tailwind v4 (`@theme inline`) · gsap@^3.14.2 + @gsap/react@^2.1.2 (already in `package.json`, currently unused) · CSS custom-property tokens in `app/globals.css`.

## Global Constraints

- **Tokens only — zero hardcoded hex/rgb/oklch in components.** Colors come from CSS vars in `app/globals.css`. (GUIDELINES §4)
- **Teal `--accent` (oklch 0.75 0.13 174) is reserved for action/proof.** Bot hues are decorative-only, confined to this hero widget. (GUIDELINES §4 "regla de los dos verdes")
- **Glass/glow/animation allowed only inside hero/header.** This widget lives in the hero — OK. (DESIGN.md)
- **`prefers-reduced-motion` honored on every animation.** Reduced → static finished frame, no timeline. (GUIDELINES §4, DESIGN.md)
- **gsap is used only here**, for timeline choreography; framer-motion stays for everything else (hero text reveal). No two-lib overlap in one component. (GUIDELINES §5)
- **Copy lives in `content/boreas-home.ts`** — this widget is `aria-hidden` decoration with no real copy, so it adds none. (GUIDELINES §5)
- **Widget is `aria-hidden="true"` and not the LCP element** (headline text stays LCP).
- Spanish-first project; any visible text inside the SVG is decorative glyphs only (`{ }`, `</>`, `;`), not content.

### Testing note (read before Task 1)

This repo has **no unit-test runner** (`package.json` scripts: `dev`, `build`, `start`, `lint` only). Adding one is out of scope. Automated gates for every task are therefore:

```bash
npx tsc --noEmit        # typecheck
npm run lint            # eslint (next)
npm run build           # next build — the strong gate
```

Animation correctness is verified **visually**: `npm run dev` → open `http://localhost:3000`, observe the hero. Use the `/run` or `/browse` skill (or Claude Preview tools) to load the page and watch the loop / emulate reduced-motion / scroll the hero out of view. Each task lists exactly what to observe.

---

### Task 1: Decorative tokens in globals.css

Adds the sage `--glow-clinic` token (currently missing — the hero hardcodes `oklch(0.68 0.08 154)`; this is backlog P1) and the new multicolor bot palette. No component consumes them yet.

**Files:**
- Modify: `app/globals.css:3-17` (the `:root` block)

**Interfaces:**
- Consumes: nothing.
- Produces: CSS custom properties available globally: `--glow-clinic`, `--bot-amber`, `--bot-coral`, `--bot-violet`, `--bot-cyan`. Consumed by Task 2 via inline `style={{ fill: "var(--…)" }}`.

- [ ] **Step 1: Add the tokens**

In `app/globals.css`, inside the `:root { … }` block (currently lines 3–17), add these lines immediately after `--clinical: oklch(0.9 0.012 225);` (line 13):

```css
  /* sage glow — promoted from hardcoded oklch(0.68 0.08 154) in hero (backlog P1) */
  --glow-clinic: oklch(0.68 0.08 154);
  /* decorative bot palette — hero clinic-builder widget only; never action/proof */
  --bot-amber: oklch(0.82 0.14 78);
  --bot-coral: oklch(0.72 0.16 28);
  --bot-violet: oklch(0.72 0.13 300);
  --bot-cyan: oklch(0.82 0.1 210);
```

- [ ] **Step 2: Verify build + token presence**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
grep -n "glow-clinic\|bot-amber\|bot-coral\|bot-violet\|bot-cyan" app/globals.css
```
Expected: typecheck/lint/build PASS; grep prints the 5 new token definitions.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(tokens): add --glow-clinic + decorative bot palette for hero widget"
```

---

### Task 2: ClinicBuilder static scene (SVG, no animation)

Creates the component with the full inline-SVG scene drawn in its **completed** state: blueprint slab, the four assembled consultorio pieces, and the six bots resting. No gsap yet. This static render IS the `prefers-reduced-motion` frame, so it must look finished and good on its own. Not mounted in the hero yet (verified in isolation via build + a temporary local check).

**Files:**
- Create: `components/hero/clinic-builder.tsx`

**Interfaces:**
- Consumes: tokens from Task 1 (`--glow-clinic`, `--bot-*`) plus existing `--bg-deep`, `--bg-surface`, `--ink`, `--ink-muted`, `--accent`, `--line`.
- Produces: `export function ClinicBuilder(): JSX.Element`. The SVG root carries `ref`. Animatable hooks for Task 3 are the `data-*` attributes: pieces tagged `data-piece="agenda|reviews|whatsapp|pulse|period"`, agenda lines tagged `data-line`, bot outer groups tagged `data-bot="bracket|caret|tag|terminal|semicolon|hairline"`, each bot's animated inner group tagged `data-bob`.

- [ ] **Step 1: Create the component file**

Create `components/hero/clinic-builder.tsx` with exactly this content:

```tsx
"use client";

import { useRef } from "react";

/**
 * Decorative hero widget: colorful IDE-shaped bots assemble the doctor's
 * "consultorio digital" (agenda, reseñas, WhatsApp, pulse-line). Static here;
 * the gsap timeline is wired in clinic-builder.tsx Task 3. aria-hidden — no a11y content.
 */
export function ClinicBuilder() {
  const root = useRef<SVGSVGElement>(null);

  return (
    <svg
      ref={root}
      viewBox="0 0 600 460"
      role="presentation"
      aria-hidden="true"
      className="h-full w-full overflow-visible"
    >
      {/* ---------- blueprint slab ---------- */}
      <g data-blueprint>
        <rect
          x="60"
          y="40"
          width="480"
          height="380"
          rx="24"
          style={{ fill: "var(--bg-surface)", stroke: "var(--line)" }}
          strokeWidth="1.5"
        />
        {/* faint blueprint grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={60 + (i + 1) * 48}
            y1="40"
            x2={60 + (i + 1) * 48}
            y2="420"
            style={{ stroke: "var(--glow-clinic)" }}
            strokeOpacity="0.1"
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="60"
            y1={40 + (i + 1) * 47.5}
            x2="540"
            y2={40 + (i + 1) * 47.5}
            style={{ stroke: "var(--glow-clinic)" }}
            strokeOpacity="0.1"
          />
        ))}
      </g>

      {/* ---------- assembled pieces ---------- */}
      {/* agenda card */}
      <g data-piece="agenda">
        <rect
          x="96"
          y="104"
          width="180"
          height="150"
          rx="14"
          style={{ fill: "var(--bg-deep)", stroke: "var(--line)" }}
        />
        <rect x="116" y="126" width="70" height="10" rx="5" style={{ fill: "var(--accent)" }} />
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            data-line
            x="116"
            y={154 + i * 22}
            width={i % 2 === 0 ? 140 : 110}
            height="8"
            rx="4"
            style={{ fill: "var(--ink-muted)" }}
          />
        ))}
      </g>

      {/* reviews card */}
      <g data-piece="reviews">
        <rect
          x="318"
          y="120"
          width="160"
          height="110"
          rx="14"
          style={{ fill: "var(--bg-deep)", stroke: "var(--line)" }}
        />
        <text
          x="338"
          y="160"
          style={{ fill: "var(--bot-amber)", fontSize: "22px", letterSpacing: "2px" }}
        >
          ★★★★★
        </text>
        <rect x="338" y="178" width="118" height="8" rx="4" style={{ fill: "var(--ink-muted)" }} />
        <rect x="338" y="196" width="86" height="8" rx="4" style={{ fill: "var(--ink-muted)" }} />
      </g>

      {/* whatsapp node */}
      <g data-piece="whatsapp">
        <circle cx="430" cy="320" r="34" style={{ fill: "var(--glow-clinic)" }} />
        <circle cx="430" cy="320" r="34" style={{ fill: "none", stroke: "var(--ink)" }} strokeOpacity="0.25" />
        <path
          d="M418 332c-3-4-4-9-2-13 2-5 7-8 12-7 5 0 9 4 10 9 1 6-3 12-9 13-2 1-5 0-7-1l-6 2 2-5z"
          style={{ fill: "var(--bg-deep)" }}
        />
      </g>

      {/* pulse-line (scaled in from the left by the hairline-bot) */}
      <rect
        data-piece="pulse"
        x="96"
        y="300"
        width="210"
        height="3"
        rx="1.5"
        style={{ fill: "var(--accent)" }}
      />

      {/* finishing period */}
      <circle data-piece="period" cx="300" cy="386" r="6" style={{ fill: "var(--accent)" }} />

      {/* ---------- bots ---------- */}
      <Bot name="bracket" x={70} y={150} color="--bot-amber" glyph="{ }" w={44} h={34} />
      <Bot name="caret" x={250} y={150} color="--bot-violet" glyph="▌" w={22} h={36} />
      <Bot name="tag" x={500} y={150} color="--bot-coral" glyph="</>" w={48} h={30} />
      <Bot name="terminal" x={500} y={300} color="--bot-cyan" glyph="›_" w={48} h={34} terminal />
      <Bot name="semicolon" x={300} y={420} color="--glow-clinic" glyph=";" w={22} h={30} />
      <Bot name="hairline" x={70} y={300} color="--accent" glyph="—" w={42} h={16} />
    </svg>
  );
}

type BotProps = {
  name: string;
  x: number;
  y: number;
  color: string;
  glyph: string;
  w: number;
  h: number;
  terminal?: boolean;
};

/** One IDE-element bot: colored rounded body + glyph face + two eyes, in an idle-bob group. */
function Bot({ name, x, y, color, glyph, w, h, terminal }: BotProps) {
  return (
    <g data-bot={name} transform={`translate(${x} ${y})`}>
      <g data-bob>
        <rect
          x={-w / 2}
          y={-h / 2}
          width={w}
          height={h}
          rx={8}
          style={{ fill: `var(${color})` }}
        />
        {terminal && (
          <g>
            <circle cx={-w / 2 + 8} cy={-h / 2 + 7} r="2.5" style={{ fill: "var(--bg-deep)" }} />
            <circle cx={-w / 2 + 16} cy={-h / 2 + 7} r="2.5" style={{ fill: "var(--bg-deep)" }} />
            <circle cx={-w / 2 + 24} cy={-h / 2 + 7} r="2.5" style={{ fill: "var(--bg-deep)" }} />
          </g>
        )}
        <text
          x="0"
          y={terminal ? 6 : 5}
          textAnchor="middle"
          style={{
            fill: "var(--bg-deep)",
            fontSize: `${Math.min(h - 8, 18)}px`,
            fontWeight: 700,
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {glyph}
        </text>
        {/* eyes / antenna nub */}
        <circle cx="0" cy={-h / 2 - 4} r="2.5" style={{ fill: `var(${color})` }} />
      </g>
    </g>
  );
}
```

- [ ] **Step 2: Typecheck + lint + build**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: PASS. If `next build` tree-shakes the unused export and skips it, that's fine — Task 5 imports it.

- [ ] **Step 3: Visually verify the static scene in isolation**

Temporarily render it: in `app/page.tsx` (or any route you can open), nothing is required if you prefer — instead use the `/run` skill to start dev and the `/browse` skill to mount a scratch route. Minimum check: start `npm run dev`, and in a scratch client page import `{ ClinicBuilder }` and render it in a `400px` box. Observe:
- A slab with faint sage grid.
- Agenda card (teal title bar + 4 muted lines), reviews card (amber stars + 2 lines), green WhatsApp circle with chat glyph, teal pulse-line, teal period dot.
- Six colored bots (amber `{ }`, violet `▌`, coral `</>`, cyan terminal `›_` with 3 dots, sage `;`, teal `—`).
- Everything token-colored; no console errors.

Remove the scratch render before committing.

- [ ] **Step 4: Confirm no hardcoded color literals**

Run:
```bash
grep -nE "#[0-9a-fA-F]{3,8}|rgba?\(|oklch\(" components/hero/clinic-builder.tsx || echo "clean: tokens only"
```
Expected: prints `clean: tokens only`.

- [ ] **Step 5: Commit**

```bash
git add components/hero/clinic-builder.tsx
git commit -m "feat(hero): add ClinicBuilder static SVG scene (reduced-motion frame)"
```

---

### Task 3: gsap timeline — build → hold → dissolve → loop

Adds the animation to the same file: an infinite master timeline, idle bobbing, `gsap.matchMedia()` for crew size + reduced-motion, and an `IntersectionObserver` that pauses off-screen.

**Files:**
- Modify: `components/hero/clinic-builder.tsx` (add imports + a `useGSAP` block inside `ClinicBuilder`, before `return`)

**Interfaces:**
- Consumes: the `data-piece`, `data-line`, `data-bot`, `data-bob` hooks from Task 2; `root` ref.
- Produces: no new exports; behavior only.

- [ ] **Step 1: Add gsap imports**

At the top of `components/hero/clinic-builder.tsx`, replace the React import line:

```tsx
import { useRef } from "react";
```

with:

```tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
```

- [ ] **Step 2: Add the useGSAP block**

Inside `ClinicBuilder`, immediately after `const root = useRef<SVGSVGElement>(null);` and before `return (`, insert:

```tsx
  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const pieces = q("[data-piece]");
      const bots = q("[data-bot]");
      const bobs = q("[data-bob]");

      const piece = (n: string) => q(`[data-piece="${n}"]`);
      const bot = (n: string) => q(`[data-bot="${n}"]`);

      const mm = gsap.matchMedia();

      mm.add(
        {
          reduce: "(prefers-reduced-motion: reduce)",
          isDesktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { reduce, isDesktop } = ctx.conditions as {
            reduce: boolean;
            isDesktop: boolean;
          };

          // Reduced motion → completed static frame, no timeline.
          if (reduce) {
            gsap.set(pieces, { autoAlpha: 1, scale: 1 });
            gsap.set(bots, { autoAlpha: 0.95 });
            return;
          }

          // Crew selection: full desktop vs light mobile.
          const fullCrew = ["bracket", "caret", "tag", "terminal", "semicolon", "hairline"];
          const lightCrew = ["bracket", "terminal", "caret"];
          const crew = isDesktop ? fullCrew : lightCrew;
          bots.forEach((b) => {
            const name = (b as SVGElement).dataset.bot ?? "";
            gsap.set(b, { autoAlpha: crew.includes(name) ? 1 : 0 });
          });

          // Idle bob keeps the scene alive during holds (inner groups only — no
          // conflict with the master timeline moving the outer bot groups).
          const idle = gsap.to(bobs, {
            y: "-=5",
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.25, from: "random" },
          });

          // Reset helper: the start state, also used to close the loop seamlessly.
          const resetScene = () => {
            gsap.set(pieces, { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
            gsap.set(q('[data-piece="pulse"]'), { scaleX: 0, transformOrigin: "0% 50%" });
            gsap.set(q('[data-piece="agenda"] [data-line]'), {
              scaleX: 0,
              transformOrigin: "0% 50%",
            });
            crew.forEach((n) => gsap.set(bot(n), { x: 0, y: 0 }));
          };
          resetScene();

          const tl = gsap.timeline({ repeat: -1, defaults: { ease: "power2.out" } });

          tl.addLabel("build")
            // bracket-bot nudges in, agenda frame appears
            .to(bot("bracket"), { x: 36, y: -4, duration: 0.6 }, "build")
            .to(piece("agenda"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "build+=0.2")
            // caret-bot types the agenda lines
            .to(bot("caret"), { x: -8, y: 6, duration: 0.45 }, "build+=0.5")
            .to(
              q('[data-piece="agenda"] [data-line]'),
              { scaleX: 1, stagger: 0.1, duration: 0.35 },
              "<"
            )
            // tag-bot raises the reviews card
            .to(bot("tag"), { x: -70, y: -2, duration: 0.6 }, "build+=1.1")
            .to(piece("reviews"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.15")
            // terminal-bot drops the WhatsApp node, it pings
            .to(bot("terminal"), { x: -56, y: 4, duration: 0.6 }, "build+=1.7")
            .to(piece("whatsapp"), { autoAlpha: 1, scale: 1, duration: 0.5 }, "<0.15")
            .to(piece("whatsapp"), { scale: 1.1, duration: 0.22, yoyo: true, repeat: 1 }, ">")
            // hairline-bot draws the pulse-line; semicolon-bot sets the period
            .to(bot("hairline"), { x: 30, y: -2, duration: 0.45 }, "build+=2.3")
            .to(piece("pulse"), { scaleX: 1, duration: 0.6 }, "<")
            .to(bot("semicolon"), { x: 4, y: -34, duration: 0.4 }, "build+=2.7")
            .to(piece("period"), { autoAlpha: 1, scale: 1, duration: 0.3 }, "<0.1")
            // hold the finished consultorio
            .addLabel("hold")
            .to({}, { duration: 2 })
            // soft dissolve back to blueprint, then reset for a seamless loop
            .to(pieces, { autoAlpha: 0, duration: 0.8, ease: "power1.inOut" }, "hold+=2")
            .to(
              crew.map((n) => bot(n)),
              { x: 0, y: 0, duration: 0.8, ease: "power1.inOut" },
              "<"
            )
            .add(resetScene);

          // Pause the loop when the hero is scrolled out of view.
          const io = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) tl.play();
              else tl.pause();
            },
            { threshold: 0.08 }
          );
          if (root.current) io.observe(root.current);

          return () => {
            io.disconnect();
            idle.kill();
            tl.kill();
          };
        }
      );
    },
    { scope: root }
  );
```

- [ ] **Step 3: Typecheck + lint + build**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: PASS. Common fixes if it fails: ensure `ctx.conditions` cast matches both keys; ensure `crew.map((n) => bot(n))` (gsap accepts arrays of arrays — flatten with `crew.flatMap((n) => bot(n))` if a type complaint appears).

- [ ] **Step 4: Visually verify the loop**

`npm run dev`, mount `<ClinicBuilder/>` in your scratch route (as in Task 2 Step 3). Observe at desktop width (≥1024px):
- Scene starts on blueprint, then agenda → typed lines → reviews → WhatsApp ping → pulse-line draws → period.
- ~2s hold on the finished consultorio, then a soft fade back to blueprint and a **seamless** restart (no hard jump).
- All six bots idle-bob continuously.

Resize below 1024px: only ~3 bots visible (bracket, terminal, caret); the build still completes. Reload — no console errors.

- [ ] **Step 5: Verify reduced-motion + off-screen pause**

- In devtools (Rendering tab) emulate `prefers-reduced-motion: reduce` → reload → scene shows the **completed** consultorio, no motion, no looping.
- Disable the emulation. Wrap the scratch render so there's tall content below it; scroll the widget fully out of view → the loop stops repainting; scroll back → it resumes.

Remove the scratch render before committing.

- [ ] **Step 6: Commit**

```bash
git add components/hero/clinic-builder.tsx
git commit -m "feat(hero): animate ClinicBuilder — gsap loop, matchMedia crew, IO pause"
```

---

### Task 4: Mount in the hero, remove the old visual

Swaps the widget into `boreas-hero.tsx`: removes the old right-side glass composition and the mobile-glass block, mounts `<ClinicBuilder/>` inside the existing parallax wrapper so the subtle pointer tilt is retained.

**Files:**
- Modify: `components/hero/boreas-hero.tsx:58-103` (old right-side visual `motion.div`), `:179-191` (mobile-glass block), import line near `:11-16`.

**Interfaces:**
- Consumes: `ClinicBuilder` from Task 2/3.
- Produces: the rendered hero with the new widget.

- [ ] **Step 1: Import the component**

In `components/hero/boreas-hero.tsx`, add after the existing `@/content/boreas-home` import block (around line 16):

```tsx
import { ClinicBuilder } from "@/components/hero/clinic-builder";
```

- [ ] **Step 2: Replace the desktop visual block**

Replace the entire right-side visual `motion.div` (currently lines 58–103, the block that starts with `<motion.div aria-hidden="true" style={{ x: visualX, y: visualY }}` and contains `hero-orbital-glass`, `hero-clinic-surface`, scanlines, etc., through its closing `</motion.div>`) with:

```tsx
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
```

- [ ] **Step 3: Replace the mobile-glass block with a mobile widget**

Replace the `motion.div` carrying `className="hero-mobile-glass …"` (currently lines 179–191, including its inner review card + whatsapp node) with:

```tsx
          <motion.div
            aria-hidden="true"
            variants={reveal}
            transition={{ duration: 0.8, ease }}
            className="relative mt-10 aspect-[4/3] w-full lg:hidden"
          >
            <ClinicBuilder />
          </motion.div>
```

(The widget's own `matchMedia` renders the light 3-bot crew at this width.)

- [ ] **Step 4: Typecheck + lint + build**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: PASS.

- [ ] **Step 5: Verify the full hero**

`npm run dev` → `http://localhost:3000`:
- Headline "Boreas", subcopy, both CTAs, and the 4 proof points all render unchanged.
- Desktop: the animated widget sits on the right and loops; moving the mouse gives a subtle parallax tilt.
- Mobile width: the light widget shows below the copy and loops with ~3 bots.
- Reduced-motion: static finished widget; text reveal also static (existing behavior).
- No console errors; no layout shift (the widget box is reserved).

- [ ] **Step 6: Commit**

```bash
git add components/hero/boreas-hero.tsx
git commit -m "feat(hero): mount ClinicBuilder, remove static glass visual + mobile-glass"
```

---

### Task 5: Retire orphaned CSS + document the overrides

Removes hero CSS classes no longer referenced after Task 4, and records the three deliberate overrides (motion, color, gsap lib) plus the resolved backlog items in the source-of-truth docs.

**Files:**
- Modify: `app/globals.css` (remove now-unused `.hero-orbital-glass`, `.hero-clinic-surface`/`.hero-mobile-glass` group, `.hero-appointment-card`, `.hero-review-card`, `.hero-whatsapp-node`, `.hero-pulse-line`, `.hero-scanline`, `@keyframes hero-pulse-travel` — **only those with zero remaining references**)
- Modify: `GUIDELINES.md` (§4 motion/color notes, §5 gsap, §7 backlog), `DESIGN.md` (motion section)

- [ ] **Step 1: Find which hero-* classes are now orphaned**

Run:
```bash
for c in hero-orbital-glass hero-clinic-surface hero-mobile-glass hero-appointment-card hero-review-card hero-whatsapp-node hero-pulse-line hero-scanline; do
  echo "== $c =="; grep -rn "$c" --include=*.tsx --include=*.ts .
done
```
Expected: no `.tsx`/`.ts` hits for classes used only by the old hero visual. `hero-primary-cta`/`hero-secondary-cta` are still used by the CTAs — **do not remove those.**

- [ ] **Step 2: Delete the orphaned rules from `app/globals.css`**

Remove only the rule blocks whose selector got zero `.tsx`/`.ts` hits in Step 1: `.hero-orbital-glass` (lines ~222–234), the `.hero-clinic-surface, .hero-mobile-glass` group and their `::before`/`::after` (~236–279, 353–367), `.hero-appointment-card, .hero-review-card` (~281–292), `.hero-whatsapp-node` + pseudo (~294–323), `.hero-pulse-line` + `::before` (~325–336), `.hero-scanline` (~338–351), and `@keyframes hero-pulse-travel` (~369–382). Keep `.hero-primary-cta*` and `.hero-secondary-cta*`.

- [ ] **Step 3: Verify nothing else referenced them**

Run:
```bash
npx tsc --noEmit && npm run lint && npm run build
npm run dev   # spot-check the hero + CTAs still look right, then stop
```
Expected: build PASS; CTAs unchanged; hero widget intact.

- [ ] **Step 4: Document the overrides in GUIDELINES.md**

In `GUIDELINES.md` §4, under the "Glass / motion — decisión Boreas" callout, add a bullet:

```markdown
- ✅ **Hero clinic-builder widget** (`components/hero/clinic-builder.tsx`): override deliberado del
  "motion quieto" — loop animado infinito de bots IDE que construyen el consultorio. Permitido SOLO
  en este widget del hero. Bots usan paleta decorativa (`--bot-amber/-coral/-violet/-cyan`); el teal
  `--accent` sigue reservado a acción/prueba. Animación con **gsap** (única excepción a framer-motion,
  confinada aquí). `prefers-reduced-motion` → frame final estático.
```

In §5, change the gsap line to note it is now justified:

```markdown
- **Animación:** framer-motion por defecto. **gsap** se usa SOLO en `clinic-builder.tsx` (timeline
  del loop del hero) — justificado, confinado, sin solaparse con framer en un mismo componente.
```

In §7 backlog, mark resolved (edit the rows): P1 "Dos verdes hardcodeados" → add "(hero visual migrado a `--glow-clinic`; resto de `globals.css` pendiente)"; P3 "deps gsap sin usar" → "(gsap ahora justificado en clinic-builder)".

- [ ] **Step 5: Document the motion override in DESIGN.md**

In `DESIGN.md` "Motion Rules", append:

```markdown
- Exception: the hero `clinic-builder` widget runs an infinite gsap construction loop (colorful
  IDE-bots assembling the consultorio). This is a deliberate brand override of "quiet motion",
  confined to that one hero widget; `prefers-reduced-motion` renders its completed frame statically.
```

- [ ] **Step 6: Commit**

```bash
git add app/globals.css GUIDELINES.md DESIGN.md
git commit -m "chore(hero): retire orphaned glass CSS; document motion/color/gsap overrides"
```

---

## Self-Review

**Spec coverage:**
- Concept / build→hold→dissolve→loop → Task 3. ✔
- Bots assemble consultorio pieces (agenda/reviews/whatsapp/pulse/period) → Task 2 markup + Task 3 choreography. ✔
- 6 colorful bot archetypes, own hues → Task 2 `<Bot>` + Task 1 tokens. ✔
- Inline SVG + gsap `useGSAP` → Tasks 2–3. ✔
- Desktop 5–7 / mobile 2–3 crew via matchMedia → Task 3. ✔
- reduced-motion static frame → Task 3 (and Task 2 static render is that frame). ✔
- IntersectionObserver pause off-screen → Task 3. ✔
- Tokens only, `--glow-clinic` + `--bot-*` → Task 1, enforced by Task 2 Step 4 grep. ✔
- Mount in hero, retain parallax, drop old visual + mobile-glass → Task 4. ✔
- Document 3 overrides; clear gsap-unused + hero-greens backlog → Task 5. ✔
- Not LCP-blocking, aria-hidden → Task 2 (`aria-hidden`), no SSR text. ✔

**Placeholder scan:** No TBD/TODO; all code blocks complete; token values concrete; choreography fully specified. ✔

**Type consistency:** `data-piece`/`data-line`/`data-bot`/`data-bob` hooks defined in Task 2 are exactly the selectors used in Task 3. `ClinicBuilder` export name matches the Task 4 import. `root` ref typed `SVGSVGElement` in both tasks. ✔

**Note on TDD:** No unit-test runner exists in this repo and adding one is out of scope; per-task gates are `tsc --noEmit` + `npm run lint` + `npm run build` + scripted visual verification (what to observe is enumerated in each task). This is the honest substitute for a red/green test cycle on a decorative SVG animation.
