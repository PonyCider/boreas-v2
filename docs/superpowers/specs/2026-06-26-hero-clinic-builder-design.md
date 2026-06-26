# Hero Clinic Builder — Design Spec

**Date:** 2026-06-26
**Component:** `components/hero/clinic-builder.tsx` (new) + `components/hero/boreas-hero.tsx` (edit)
**Status:** Approved in brainstorming, pending spec review

---

## 1. Context

The hero's right-side visual today ([boreas-hero.tsx](../../../components/hero/boreas-hero.tsx)) is a
static "clinical light" glass composition: an `hero-orbital-glass` orb plus a tilted
`hero-clinic-surface` slab holding an agenda card, a ★★★★★ review card, a WhatsApp node, and a
pulse-line, with scanlines, sage glow blobs, and pointer-parallax drift. It is decorative,
`aria-hidden`, and honors `prefers-reduced-motion`. A collapsed `hero-mobile-glass` mini version
shows below the copy on small screens.

The goal is to replace that static visual with an **infinite, looping animated widget** that depicts
the construction of a web presence — but reframed to fit Boreas positioning.

## 2. Goal & non-goals

**Goal:** A never-ending, smooth, lively loop where small IDE-shaped "bots" assemble the doctor's
**consultorio digital** piece by piece, then dissolve and rebuild. Many animated characters, soft
motion, premium feel. Reinforces the *outcome* Boreas sells, not the *feature*.

**Non-goals:**
- Not a literal "we build websites/edificio" metaphor (off-brand per GUIDELINES §1/§6 — sell the
  outcome, not the feature).
- Not a game/toy aesthetic. Stays inside "dark medical editorial."
- Not LCP-blocking. The headline text remains the LCP element.
- No change to hero copy, CTAs, proof-point list, or layout grid.

## 3. Concept — "Los constructores del consultorio"

A glass slab (reuses the existing `hero-clinic-surface` framing so it still belongs to the brand
"clinical light" system) starts **empty** — outline + faint blueprint grid. Colorful IDE-bots move
in and assemble the consultorio digital:

1. Bracket-bot snaps in the **agenda** card frame.
2. Caret-bot "types" the agenda lines into place.
3. Tag-bot raises the **★★★★★ reseña** card.
4. Terminal-bot drops the **WhatsApp** node (it pings).
5. Semicolon / hairline-bot draws the **pulse-line** and places a finishing period.
6. ~2s **hold** on the finished consultorio (beauty frame).
7. Soft **dissolve** back to blueprint → loop restarts. No hard cut.

The assembled pieces are the same proof elements already in the hero, so the visual says
"your digital clinic, built and working," not "we make web pages."

## 4. The characters (IDE-bots)

Small friendly bots, each shaped like a code primitive, each with a job and **its own color**
(per user: avoid monochrome). Each bot idle-bobs slightly so the scene stays alive between build
steps.

| Bot | Shape | Job | Hue (decorative token) |
|-----|-------|-----|------------------------|
| Bracket-bot | `{ }` | carries/snaps card frames | amber `--bot-amber` |
| Caret-bot | `▌` blinking cursor | "types" agenda lines | violet `--bot-violet` |
| Tag-bot | `</>` | raises the reviews card | coral `--bot-coral` |
| Terminal-bot | window w/ 3 traffic-light dots | hauls the WhatsApp node | cyan `--bot-cyan` |
| Semicolon-bot | `;` | finisher: places the period | sage `--glow-clinic` |
| Hairline-bot | `—` | draws the pulse-line | teal-tint `--accent` (decorative use only) |

Bots are soft, rounded, with subtle drop shadow. Multicolor bodies; the **assembled proof cards**
keep brand tokens (teal `--accent` / sage `--glow-clinic`) so the color discipline of the actual
product stays intact — only the construction crew is playful.

Target density: **lg+ → 5–7 bots; mobile → 2–3 bots.**

## 5. Choreography

One master gsap timeline, `repeat: -1`, with eased segments (no bounce — keeps the premium tone).
Bots run independent idle/bob sub-tweens so nothing freezes during holds.

```
blueprint fade-in (0.6s)
  → bracket-bot brings agenda frame (snap)
  → caret-bot types agenda lines (stagger)
  → tag-bot raises reviews card
  → terminal-bot drops WhatsApp node (pulse ping)
  → hairline-bot draws pulse-line + semicolon-bot places period
  → hold complete (2s)
  → dissolve to blueprint (0.8s)
  → repeat
```

Total loop ≈ 15–20s. Easing: `power2.out` / `power3.inOut` family, durations 0.4–1.2s per beat.

## 6. Technical structure

- New file `components/hero/clinic-builder.tsx`, `"use client"`, renders inline `<svg>` (or a small
  set of absolutely-positioned divs inside the slab), `aria-hidden="true"`.
- Animation via **gsap** + `@gsap/react`'s `useGSAP()` hook (both already in `package.json`:
  `gsap@^3.14.2`, `@gsap/react@^2.1.2`). `useGSAP` auto-reverts/cleans up on unmount.
  - This resolves the GUIDELINES §5 / backlog-P3 "gsap unused → remove or justify" item: gsap is now
    justified for the one place that genuinely needs timeline choreography. framer-motion stays for
    everything else (hero text reveal, etc.). The two libs do not overlap in scope.
- All colors via CSS variables — **zero hardcoded hex**. Reuses `--accent`, `--glow-clinic`, `--ink`,
  `--line`, `--bg-*`; adds the new decorative bot palette (see §8). This also fixes the hero half of
  the backlog-P1 "two greens hardcoded" item for the visual that's being replaced.
- `boreas-hero.tsx`: remove the old right-side glass `motion.div` block (lines ~58–103) and the
  `hero-mobile-glass` block (lines ~179–191); mount `<ClinicBuilder />` in their place. Keep the
  background gradient/glow layers, the pointer-parallax wrapper, and all copy/CTAs unchanged. The
  parallax `visualX/visualY` transforms wrap the new widget — the subtle pointer tilt is retained.

## 7. Responsive · reduced-motion · performance

- **lg+:** full scene, 5–7 bots, full timeline.
- **mobile (`< lg`):** lighter animated scene — 2–3 bots, same build beats but fewer characters, so
  it doesn't tax phones or hurt LCP. Driven by `gsap.matchMedia()` so the bot count/scene swaps at
  the breakpoint cleanly.
- **`prefers-reduced-motion: reduce`:** render the **completed** consultorio as a still beauty frame,
  no timeline. Wired through `gsap.matchMedia()` (`(prefers-reduced-motion: reduce)` condition).
- **Performance:**
  - Animate transforms + opacity only (GPU-composited); `will-change` scoped to animating nodes.
  - `IntersectionObserver` pauses the master timeline when the hero scrolls out of view; resumes on
    re-entry — no CPU burned off-screen.
  - Not LCP-critical: the LCP element stays the headline text. Widget is `aria-hidden`, deferred to
    client.

## 8. Brand overrides & token plan

This widget makes **three deliberate, documented overrides** of the standing rules (mirroring how the
glass system is already an explicit override of impeccable):

1. **Motion** — DESIGN.md "motion quieto: opacity + small translate, no bounce" is relaxed *inside
   this hero widget only* to allow lively continuous character motion (still eased, no bounce). Rest
   of the site stays quiet.
2. **Color** — a small **decorative bot palette** is introduced so the bots are multicolor. Teal
   `--accent` remains reserved for action/proof semantics; the bot hues are decorative-only and
   confined to the hero widget.
3. **Library** — gsap is used here (not framer) for timeline choreography; justified and confined.

New tokens to add to `app/globals.css` (`@theme inline`), values TBD-by-implementation but must be
real OKLCH tokens, never inline hex:

```
--bot-amber   /* warm amber */
--bot-coral   /* soft coral */
--bot-violet  /* muted violet */
--bot-cyan    /* clinical cyan */
```

Docs to update after build: GUIDELINES.md §4 (note the bot palette + motion override, like the glass
override) and DESIGN.md motion section.

## 9. Files touched

| File | Change |
|------|--------|
| `components/hero/clinic-builder.tsx` | **new** — SVG scene + gsap timeline |
| `components/hero/boreas-hero.tsx` | remove old visual + mobile-glass blocks; mount `<ClinicBuilder/>` |
| `app/globals.css` | add `--bot-*` decorative tokens; possibly retire now-unused `hero-mobile-glass` etc. if nothing else uses them |
| `GUIDELINES.md`, `DESIGN.md` | document the motion + color overrides; mark backlog items resolved |

## 10. Testing / verification

- Visual: run the app, confirm the loop builds → holds → dissolves → repeats smoothly with no hard
  cut; bots are colorful and idle-bob; 5–7 bots on desktop, 2–3 on mobile.
- `prefers-reduced-motion`: emulate reduce → static completed scene, no motion.
- Scroll past the hero → timeline pauses (verify via no continued repaint); scroll back → resumes.
- No hardcoded hex in the new component (grep). No framer/gsap scope overlap regressions in hero
  text reveal.
- Lighthouse: LCP unchanged (text), no CLS from the widget (slab reserves its box).

## 11. Risks

- **Authoring effort:** a hand-built SVG character scene is the most labor of the three options. Bots
  may start simpler than described and gain detail iteratively.
- **Brand tone:** multicolor + lively risks reading toy-ish; mitigated by muted OKLCH hues, eased
  motion, premium slab framing. Review against "dark medical editorial" after first pass.
- **Mobile perf:** even 2–3 animated bots add cost; if profiling shows jank, fall back to static
  final frame on mobile.
