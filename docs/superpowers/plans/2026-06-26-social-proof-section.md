# Social proof section — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `SocialProofSection` — heading + 3 friction rows + sequential stats + CSS browser/phone mockup frame — and mount it between `ProblemSection` and `TransformationSection`.

**Architecture:** All copy lives in `content/boreas-home.ts` (new `socialProof` export). The component (`components/landing/social-proof-section.tsx`) renders three visual blocks in sequence. Browser/phone frames are CSS-only sub-components inside the same file. No external images, no new deps.

**Tech Stack:** Next.js 16 App Router · React 19 · Tailwind v4 · framer-motion (entrance only)

## Global Constraints

- All copy in `content/boreas-home.ts`, never hardcoded in JSX
- Tailwind v4 — use `@theme inline` tokens (`bg-accent`, `text-foreground`, etc.), never raw hex
- No glass/glow outside hero/header (GUIDELINES.md)
- No side-stripe borders (`border-left` accent), no gradient text, no identical card grids
- framer-motion for entrance animation only: opacity fade, `useReducedMotion` respected
- One section = one file; sub-components may live in the same file if they are only used there
- `SectionFrame` wrapper from `boreas-landing-sections.tsx` — use it, don't re-create it

---

## File map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `content/boreas-home.ts` | Add `socialProof` export with all copy + mock data |
| Create | `components/landing/social-proof-section.tsx` | Full section: friction rows, stats, browser+phone frames |
| Modify | `components/landing/boreas-landing-sections.tsx` | Import + mount after `ProblemSection` |
| Modify | `app/globals.css` | Add `.browser-frame-chrome` CSS class for traffic-light dots |

---

## Task 1 — Add `socialProof` content export

**Files:**
- Modify: `content/boreas-home.ts` (append at end of file)

**Interfaces:**
- Produces: `socialProof` object consumed by Task 2

- [ ] **Step 1: Append export to `content/boreas-home.ts`**

Add exactly this block at the end of the file:

```ts
// Social proof section (Bloque: Esto pasa todos los días)
export const socialProof = {
  heading: "Esto pasa todos los días.",

  frictions: [
    {
      body: "Tu paciente buscaba agendar a altas horas de la noche. Nadie contesta llamadas a esa hora.",
      closer: "Agendó en línea con quien sí tenía página.",
    },
    {
      body: "Tu asistente contesta lo mismo todos los días antes de cada primera cita: ¿cuánto cuesta?, ¿atienden mi caso?, ¿tienen lugar esta semana?",
      closer: "Una página lo resuelve antes de que marquen.",
    },
    {
      body: "Alguien leyó tus reseñas en Google Maps y quería ir contigo. Buscó más información. No encontró nada.",
      closer: "“Lo pienso” casi siempre es “lo descarto.”",
    },
  ],

  stats: [
    {
      connector: null,
      value: "2 de cada 3",
      label: "pacientes prefiere agendar en línea antes que llamar.",
      closer: "El teléfono ya es el plan B.",
    },
    {
      connector: "Y de los que sí llaman, el",
      value: "84%",
      label: "busca en línea antes de marcar.",
      closer: "Si no encuentran nada, no marcan.",
    },
    {
      connector: "Y el",
      value: "40%",
      label: "de esas búsquedas ocurren fuera de horario.",
      closer: "Tu celular no contesta. Tu página sí.",
    },
  ],

  statsSources: "Accenture Health Consumer Survey · Think with Google · Kyruus",

  mockupCaption: "Tu paciente te buscó ayer a las 11 de la noche. Esto encontró.",

  mockupDoctor: {
    name: "Dr. Martínez",
    specialty: "Medicina General",
    rating: "4.8",
    reviewCount: "127",
    testimonial:
      "Llegué con muchas dudas y salí con todo claro. Lo recomiendo ampliamente.",
    reviewerName: "Paciente verificado · Google Maps",
  },
} as const;
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output (clean).

- [ ] **Step 3: Commit**

```bash
git add content/boreas-home.ts
git commit -m "feat(content): add socialProof data for social proof section"
```

---

## Task 2 — CSS chrome class for browser frame

**Files:**
- Modify: `app/globals.css` (append before closing)

**Interfaces:**
- Produces: `.browser-frame-chrome` class consumed by Task 3

- [ ] **Step 1: Append to `app/globals.css`**

Add at the end of the file:

```css
/* Browser frame traffic-light dots */
.browser-frame-chrome::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background: oklch(0.65 0.18 25);
  box-shadow:
    0.9rem 0 0 oklch(0.72 0.16 85),
    1.8rem 0 0 oklch(0.62 0.18 145);
}
```

- [ ] **Step 2: Verify TypeScript still compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(styles): add browser-frame-chrome CSS class"
```

---

## Task 3 — Build `SocialProofSection` component

**Files:**
- Create: `components/landing/social-proof-section.tsx`

**Interfaces:**
- Consumes: `socialProof` from `content/boreas-home.ts`
- Consumes: `SectionFrame` from `./boreas-landing-sections`
- Produces: `export function SocialProofSection()` — used in Task 4

- [ ] **Step 1: Create the file with all imports and skeleton**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { socialProof } from "@/content/boreas-home";
import { SectionFrame } from "./boreas-landing-sections";

export function SocialProofSection() {
  const reduceMotion = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

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
```

- [ ] **Step 2: Add `FrictionRows` sub-component (same file)**

Append below `SocialProofSection`:

```tsx
function FrictionRows({
  reduceMotion,
  ease,
  fadeUp,
}: {
  reduceMotion: boolean | null;
  ease: readonly number[];
  fadeUp: { hidden: object; show: object };
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
```

- [ ] **Step 3: Add `StatsBlock` sub-component (same file)**

Append below `FrictionRows`:

```tsx
function StatsBlock({
  reduceMotion,
  ease,
  fadeUp,
}: {
  reduceMotion: boolean | null;
  ease: readonly number[];
  fadeUp: { hidden: object; show: object };
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
```

- [ ] **Step 4: Add `MockupBlock` sub-component (same file)**

Append below `StatsBlock`:

```tsx
function MockupBlock({
  reduceMotion,
  ease,
  fadeUp,
}: {
  reduceMotion: boolean | null;
  ease: readonly number[];
  fadeUp: { hidden: object; show: object };
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
```

- [ ] **Step 5: Add `MockupContent` sub-component (same file)**

Append below `MockupBlock`:

```tsx
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
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 7: Commit**

```bash
git add components/landing/social-proof-section.tsx
git commit -m "feat(ui): add SocialProofSection component with friction rows, stats, and mockup frame"
```

---

## Task 4 — Mount section and update nav

**Files:**
- Modify: `components/landing/boreas-landing-sections.tsx`

**Interfaces:**
- Consumes: `SocialProofSection` from `./social-proof-section`

- [ ] **Step 1: Import and mount `SocialProofSection`**

In `components/landing/boreas-landing-sections.tsx`, add the import after the existing imports:

```tsx
import { SocialProofSection } from "./social-proof-section";
```

Then update `BoreasLandingSections` to mount it after `ProblemSection`:

```tsx
export function BoreasLandingSections() {
  return (
    <div className="relative text-foreground">
      <ProblemSection />
      <SocialProofSection />
      <TransformationSection />
      <ProcessSection />
      <GuaranteeSection />
      <ContactFormSection />
      <FaqSection />
      <RelevoCuriositySection />
    </div>
  );
}
```

- [ ] **Step 2: Verify nav link `"Prueba"` resolves correctly**

In `components/hero/header.tsx`, the nav already has:
```ts
{ label: "Prueba", href: "#prueba" }
```
The section uses `id="prueba"` via `SectionFrame`. No change needed — confirm the IDs match.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no output.

- [ ] **Step 4: Run dev server and visually verify**

```bash
npm run dev
```

Open `http://localhost:3000`. Check:
- [ ] Nav link "Prueba" scrolls to the new section
- [ ] Heading "Esto pasa todos los días." visible
- [ ] 3 friction rows render with body + bold closer
- [ ] Stats render sequentially with connector text, accent stat value, closer
- [ ] Sources line visible in muted text below stats
- [ ] Caption "Tu paciente te buscó ayer a las 11 de la noche. Esto encontró." visible
- [ ] Desktop (≥1024px): browser frame with traffic-light dots + URL bar + mockup content
- [ ] Mobile (<1024px): phone frame with status bar + mockup content
- [ ] WhatsApp button visible and green
- [ ] Entrance animations fire on scroll (or instant if reduced-motion OS preference set)
- [ ] No glass/glow outside hero

- [ ] **Step 5: Commit**

```bash
git add components/landing/boreas-landing-sections.tsx
git commit -m "feat(layout): mount SocialProofSection between Problem and Transformation sections"
```
