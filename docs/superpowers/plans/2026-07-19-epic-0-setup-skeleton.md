# Epic 0 — Setup & Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up a buildable, lintable Next.js 16 project in `Boreas V4` with the V3 design
tokens/fonts, a ported header/footer, shadcn + React Bits registry configured, and all 6 landing
sections present as non-functional stubs wired into one page with working nav anchors.

**Architecture:** Hand-authored `package.json`/config files (no interactive scaffolding CLI) so
every step is deterministic. `content/site.ts` is the single source of section ids, nav links, and
stub copy — both the header/footer and the 6 stub section components read from it, matching the
"copy lives in content/, not JSX" rule carried over from V3. `SectionFrame` + the 6 section files
follow V3's existing circular-import pattern (`landing-sections.tsx` imports each section
component; each section component imports `SectionFrame` back from `landing-sections.tsx`) — this
already works in the V3 codebase, so it's reused as-is rather than redesigned.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind v4 (CSS-first `@theme inline`, no
`tailwind.config.*`), TypeScript, framer-motion (ported components), gsap (installed now, used
starting Epic 1), shadcn CLI/MCP + React Bits registry.

## Global Constraints

- Stack: Next.js 16 (App Router) + React 19 + Tailwind v4 + TypeScript — per design spec §1.
- Design tokens/fonts ported verbatim from `Boreas V3/app/globals.css` — no redesign in Epic 0.
- Animation: framer-motion in pieces ported from V3 (header, footer, later Relevo); GSAP +
  ScrollTrigger in new showcase pieces from Epic 1 onward. Never both in the same component.
- `prefers-reduced-motion` must have a static equivalent on every animation (already baked into
  the ported `globals.css`; keep it when editing).
- No glass/backdrop-filter, no decorative glow, no gradient text, no side-stripe borders, no
  nested cards, no hardcoded color hex outside `globals.css` tokens.
- One primary CTA per viewport; no public pricing; no weekly-scarcity language.
- Copy lives in `content/site.ts`, not hardcoded in JSX.
- One section = one file under `components/landing/`.
- React Bits has no standalone MCP server — it is a registry entry
  (`"@react-bits": "https://reactbits.dev/r/{name}.json"`) consumed through the already-connected
  shadcn MCP/CLI.

---

### Task 1: Project scaffold — package.json, configs, tokens, minimal buildable app

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `eslint.config.mjs`
- Create: `.gitignore`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`

**Interfaces:**
- Produces: `--font-newsreader` / `--font-figtree` CSS variables (from `app/layout.tsx` fonts),
  full design-token set in `app/globals.css` (`--bg-*`, `--ink*`, `--accent*`, `--c-*`, `--line`,
  `--border`, `--radius-*`, `.btn`/`.btn-p`/`.btn-s`), Tailwind `@theme inline` mappings
  (`--color-background`, `--color-foreground`, `--color-muted`, `--color-accent`, `--color-line`,
  `--color-border`, `--font-display`, `--font-sans`, etc.) — every later task's Tailwind classes
  (`bg-background`, `text-foreground`, `border-line`, `font-display`, ...) depend on this.

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "boreas-v4",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "framer-motion": "^12.38.0",
    "gsap": "^3.12.7",
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

- [ ] **Step 4: Write `postcss.config.mjs`**

```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

- [ ] **Step 5: Write `eslint.config.mjs`**

```js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
```

- [ ] **Step 6: Write `.gitignore`**

```
# dependencies
/node_modules
/.pnp
.pnp.*

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 7: Write `app/globals.css`** (ported verbatim from `Boreas V3/app/globals.css`)

```css
@import "tailwindcss";

:root {
  /* Backgrounds */
  --bg-deep:     #FBF8F3;
  --bg-surface:  #FFFFFF;
  --bg-elevated: #F4F1EA;
  --bg-void:     #EDE9DF;

  /* Text */
  --ink:         #1E1B18;
  --ink-muted:   #6C675E;
  --clinical:    #9C978F;

  /* Action — arcilla */
  --accent:      #D2674A;
  --accent-h:    #BA5238;
  --accent-soft: rgba(210, 103, 74, 0.12);

  /* Acentos vivos */
  --c-amber:     #E2A33C;
  --c-mint:      #4FB39A;
  --c-lav:       #7E86E8;
  --c-rose:      #E0617E;

  /* Estructura */
  --line:        rgba(30, 27, 24, 0.09);
  --border:      #EAE5DA;
  --danger:      #C0392B;

  /* Stars / WA */
  --rating-gold:    #E2A33C;
  --whatsapp-green: oklch(0.62 0.18 145);

  /* Glass — desactivado; mantener vacío para compatibilidad */
  --glass-bg:         transparent;
  --glass-border:     var(--border);
  --glass-highlight:  transparent;

  /* Shadows */
  --shadow:    0 4px 24px rgba(30,27,24,.08), 0 1px 4px rgba(30,27,24,.05);
  --shadow-sm: 0 1px 3px rgba(30,27,24,.08);

  /* Radii */
  --radius-xl:   16px;
  --radius-md:   10px;
  --radius-sm:    8px;
  --radius-pill: 999px;
}

[data-theme="dark"], .dark {
  --bg-deep:     #1B1916;
  --bg-surface:  #252119;
  --bg-elevated: #201E1A;
  --bg-void:     #131210;
  --ink:         #F5F1E8;
  --ink-muted:   #A8A192;
  --clinical:    #706A5F;
  --accent:      #E27F62;
  --accent-h:    #C9633C;
  --accent-soft: rgba(226, 127, 98, 0.18);
  --c-amber:     #EBB45A;
  --c-mint:      #5FC4AA;
  --c-lav:       #949BF0;
  --c-rose:      #EC7791;
  --line:        rgba(255, 255, 255, 0.08);
  --border:      #373129;
  --rating-gold: #EBB45A;
  --shadow:    0 4px 28px rgba(0,0,0,.32), 0 1px 4px rgba(0,0,0,.24);
  --shadow-sm: 0 1px 4px rgba(0,0,0,.22);
}

@theme inline {
  --color-background: var(--bg-deep);
  --color-foreground: var(--ink);
  --color-muted: var(--ink-muted);
  --color-surface: var(--bg-surface);
  --color-elevated: var(--bg-elevated);
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-danger: var(--danger);
  --color-line: var(--line);
  --color-clinical: var(--clinical);
  --color-void: var(--bg-void);
  --color-whatsapp: var(--whatsapp-green);
  --color-rating-gold: var(--rating-gold);
  --color-border: var(--border);
  --color-amber: var(--c-amber);
  --color-mint: var(--c-mint);
  --color-lavender: var(--c-lav);
  --color-rose-acc: var(--c-rose);
  --font-display: var(--font-newsreader);
  --font-sans: var(--font-figtree);
}

* {
  box-sizing: border-box;
}

html {
  background: var(--bg-deep);
  scroll-behavior: smooth;
  height: 100%;
}

body {
  background: var(--bg-deep);
  color: var(--ink);
  font-family: var(--font-figtree), sans-serif;
  min-height: 100%;
  transition: background .28s, color .28s;
}

.bg-hero-glow {
  background: linear-gradient(160deg, color-mix(in oklch, var(--bg-deep) 70%, #FFF8EC) 0%, var(--bg-deep) 50%);
}

[data-theme="dark"] .bg-hero-glow,
.dark .bg-hero-glow {
  background: linear-gradient(160deg, color-mix(in oklch, var(--bg-deep) 48%, #FFF8EC) 0%, var(--bg-deep) 60%);
}

a {
  color: inherit;
  text-decoration: none;
}

@layer base {
  button {
    font: inherit;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }
}

::selection {
  background-color: var(--accent-soft);
  color: var(--ink);
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

input,
button,
a {
  -webkit-tap-highlight-color: transparent;
}

/* Button system */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-sm);
  font-family: var(--font-figtree), sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1;
  transition: all .18s ease;
  cursor: pointer;
  text-decoration: none;
}

.btn-p {
  background: var(--accent);
  color: var(--bg-deep);
  border: none;
}

.btn-p:hover {
  background: var(--accent-h);
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(210,103,74,.28);
}

.btn-p:active {
  transform: translateY(0);
}

.btn-s {
  background: transparent;
  color: var(--ink);
  border: 1.5px solid var(--border);
}

.btn-s:hover {
  border-color: var(--ink);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }

  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 8: Write `app/layout.tsx`** (fonts ported from V3; metadata adapted to the broader
  health-specialist audience per design spec)

```tsx
import type { Metadata } from "next";
import { Newsreader, Figtree } from "next/font/google";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Boreas | Presencia digital para especialistas de la salud",
  description:
    "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
  openGraph: {
    title: "Boreas | Presencia digital para especialistas de la salud",
    description:
      "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boreas | Presencia digital para especialistas de la salud",
    description:
      "Diseñamos la presencia digital de tu consultorio o práctica — psicólogos, nutriólogos, fisioterapeutas y médicos — con motores de conversión hechos a medida.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${newsreader.variable} ${figtree.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground selection:bg-[var(--accent-soft)] selection:text-foreground">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Write a temporary minimal `app/page.tsx`** (replaced in Task 7)

```tsx
export default function Home() {
  return <main className="p-10">Boreas V4 — en construcción.</main>;
}
```

- [ ] **Step 10: Install dependencies**

Run: `npm install`
Expected: exits 0, creates `node_modules/` and `package-lock.json`.

- [ ] **Step 11: Verify the project builds**

Run: `npm run build`
Expected: exits 0, output contains `Compiled successfully`.

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs .gitignore app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: scaffold Next.js 16 project with V3 design tokens"
```

---

### Task 2: shadcn + React Bits registry + `cn()` utility

**Files:**
- Create: `components.json`
- Create: `lib/utils.ts`

**Interfaces:**
- Produces: `cn(...inputs: ClassValue[]): string` from `@/lib/utils` — every later shadcn/React
  Bits component pulled in from Epic 1 onward depends on this existing at `lib/utils.ts`.

- [ ] **Step 1: Install `clsx` and `tailwind-merge`**

Run: `npm install clsx tailwind-merge`
Expected: exits 0, both packages added to `package.json` `dependencies`.

- [ ] **Step 2: Write `lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Write `components.json`** (standard shadcn config, Tailwind v4 has no config file
  so `tailwind.config` is empty, plus the React Bits registry per
  `docs/superpowers/specs/2026-07-19-boreas-v4-landing-design.md` §1)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide",
  "registries": {
    "@react-bits": "https://reactbits.dev/r/{name}.json"
  }
}
```

- [ ] **Step 4: Verify the React Bits registry resolves**

Call the `mcp__shadcn__list_items_in_registries` tool with `{ "registries": ["@react-bits"] }`.
Expected: a non-empty list of items (e.g. entries like `dither`, `aurora`, `card-swap`).

- [ ] **Step 5: Verify TypeScript still compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 6: Commit**

```bash
git add components.json lib/utils.ts package.json package-lock.json
git commit -m "feat: configure shadcn + React Bits registry"
```

---

### Task 3: `content/site.ts` — section ids, nav links, CTA, stub copy

**Files:**
- Create: `content/site.ts`

**Interfaces:**
- Produces: `sectionIds` (object with keys `hero`, `problema`, `motores`, `socialProof`,
  `pricing`, `relevo`, each mapping to its DOM `id` string), `SectionId` (union type of
  `sectionIds` values), `navLinks: Array<{ label: string; href: string }>`, `primaryCta: string`,
  `sectionStubs: Record<SectionId, { eyebrow: string; heading: string }>` — Tasks 4, 5, and 6 all
  import from this file.

- [ ] **Step 1: Write `content/site.ts`**

```ts
export const sectionIds = {
  hero: "hero",
  problema: "problema",
  motores: "motores",
  socialProof: "social-proof",
  pricing: "pricing",
  relevo: "relevo",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export const navLinks: Array<{ label: string; href: string }> = [
  { label: "Problema", href: `#${sectionIds.problema}` },
  { label: "Motores", href: `#${sectionIds.motores}` },
  { label: "Resultados", href: `#${sectionIds.socialProof}` },
  { label: "Contacto", href: `#${sectionIds.pricing}` },
];

// Provisional — Epic 1 may finalize this string once the Hero copy is written.
// Kept audience-neutral ("presencia digital") rather than "consultorio digital"
// (V3's medico-specific term) per design spec §6.
export const primaryCta = "Quiero mi presencia digital";

export const sectionStubs: Record<SectionId, { eyebrow: string; heading: string }> = {
  [sectionIds.hero]: {
    eyebrow: "Epic 1",
    heading: "Hero — pendiente de pulir",
  },
  [sectionIds.problema]: {
    eyebrow: "Epic 2",
    heading: "El problema — pendiente de pulir",
  },
  [sectionIds.motores]: {
    eyebrow: "Epic 3",
    heading: "Motores de conversión — pendiente de pulir",
  },
  [sectionIds.socialProof]: {
    eyebrow: "Epic 4",
    heading: "Prueba social — pendiente de pulir",
  },
  [sectionIds.pricing]: {
    eyebrow: "Epic 5",
    heading: "Empecemos — pendiente de pulir",
  },
  [sectionIds.relevo]: {
    eyebrow: "Epic 6",
    heading: "Relevo — pendiente de pulir",
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/site.ts
git commit -m "feat: add content/site.ts with section ids, nav links, and stub copy"
```

---

### Task 4: `components/layout/header.tsx` (ported from V3, adapted)

**Files:**
- Create: `components/layout/header.tsx`

**Interfaces:**
- Consumes: `navLinks`, `primaryCta`, `sectionIds` from `@/content/site` (Task 3).
- Produces: `Header` component, rendered by `app/page.tsx` in Task 7.

- [ ] **Step 1: Write `components/layout/header.tsx`** (ported from
  `Boreas V3/components/hero/header.tsx`: analytics tracking removed — V4 has no analytics epic
  yet — and nav links/CTA now sourced from `content/site.ts` instead of a hardcoded array)

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { navLinks, primaryCta, sectionIds } from "@/content/site";

// Below this scroll offset, the hero's own CTA is out of view — the header
// CTA can appear without competing for the same first viewport.
const HEADER_CTA_SCROLL_THRESHOLD = 600;

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [showHeaderCta, setShowHeaderCta] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const stored = localStorage.getItem("theme") as "light" | "dark" | null;
      const initial = stored ?? "light";
      setTheme(initial);
      document.documentElement.setAttribute("data-theme", initial === "dark" ? "dark" : "");
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setShowHeaderCta(window.scrollY > HEADER_CTA_SCROLL_THRESHOLD);
    });
    function onScroll() {
      setShowHeaderCta(window.scrollY > HEADER_CTA_SCROLL_THRESHOLD);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "");
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: reduceMotion ? 0 : -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 border-b bg-[var(--bg-deep)] transition-colors duration-[280ms]"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="relative mx-auto flex w-full max-w-[1460px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-10">
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

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150"
              style={{ color: "var(--ink-muted)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink)";
                (e.currentTarget as HTMLElement).style.background = "var(--accent-soft)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--ink-muted)";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Activar modo oscuro" : "Activar modo claro"}
            className="flex items-center justify-center rounded-md border transition-colors duration-150"
            style={{
              width: "38px",
              height: "38px",
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--ink-muted)",
            }}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <div className="hidden lg:block">
            <AnimatePresence>
              {showHeaderCta && (
                <motion.a
                  href={`#${sectionIds.pricing}`}
                  initial={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-flex items-center justify-center rounded-md font-semibold transition-all duration-150 hover:brightness-95 active:translate-y-px"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg-deep)",
                    height: "40px",
                    padding: "0 18px",
                    fontSize: "14px",
                  }}
                >
                  {primaryCta}
                </motion.a>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-md border transition-colors lg:hidden"
            style={{
              borderColor: "var(--border)",
              background: "var(--bg-elevated)",
              color: "var(--ink)",
            }}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label="Abrir menú"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isOpen && (
          <div
            id="mobile-nav"
            className="absolute left-0 right-0 top-[calc(100%+1px)] z-50 border-b lg:hidden"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
          >
            <nav className="flex flex-col px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-4 py-2 text-base font-medium transition-colors"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                <a
                  href={`#${sectionIds.pricing}`}
                  onClick={() => setIsOpen(false)}
                  className="flex min-h-11 w-full items-center justify-center rounded-md font-semibold transition-all"
                  style={{
                    background: "var(--accent)",
                    color: "var(--bg-deep)",
                    fontSize: "15px",
                  }}
                >
                  {primaryCta}
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </motion.header>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/header.tsx
git commit -m "feat: port Header component from V3, drop analytics, source nav from content/site.ts"
```

---

### Task 5: `components/layout/site-footer.tsx` (ported from V3, adapted)

**Files:**
- Create: `components/layout/site-footer.tsx`

**Interfaces:**
- Consumes: `sectionIds` from `@/content/site` (Task 3).
- Produces: `SiteFooter` component, rendered by `app/page.tsx` in Task 7.

- [ ] **Step 1: Write `components/layout/site-footer.tsx`** (ported from
  `Boreas V3/components/layout/site-footer.tsx`; nav links point at V4's section ids —
  Problema / Motores / Contacto — instead of V3's Problema / Proceso / Contacto)

```tsx
import { sectionIds } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-background py-8 text-foreground">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <span
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "22px",
                color: "var(--ink)",
              }}
            >
              Boreas
            </span>
            <span className="text-sm text-muted">
              © 2026 Boreas. Todos los derechos reservados.
            </span>
          </div>

          <nav className="flex flex-wrap gap-x-8 gap-y-2">
            <a
              href={`#${sectionIds.problema}`}
              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-foreground"
            >
              Problema
            </a>
            <a
              href={`#${sectionIds.motores}`}
              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-foreground"
            >
              Motores
            </a>
            <a
              href={`#${sectionIds.pricing}`}
              className="flex min-h-[44px] items-center text-sm text-muted transition-colors hover:text-foreground"
            >
              Contacto
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/site-footer.tsx
git commit -m "feat: port SiteFooter component from V3, adapt nav to V4 section ids"
```

---

### Task 6: `SectionFrame` + 6 stub section components

**Files:**
- Create: `components/landing/landing-sections.tsx`
- Create: `components/landing/hero-section.tsx`
- Create: `components/landing/problem-section.tsx`
- Create: `components/landing/motors-section.tsx`
- Create: `components/landing/social-proof-section.tsx`
- Create: `components/landing/pricing-section.tsx`
- Create: `components/landing/relevo-section.tsx`

**Interfaces:**
- Consumes: `sectionIds`, `sectionStubs` from `@/content/site` (Task 3).
- Produces: `SectionFrame({ children, className, id })` and `LandingSections()` from
  `landing-sections.tsx` — `LandingSections` is rendered by `app/page.tsx` in Task 7. Each section
  file exports one named component (`HeroSection`, `ProblemSection`, `MotorsSection`,
  `SocialProofSection`, `PricingSection`, `RelevoSection`) that Epics 1–6 will each rewrite in
  place without touching `landing-sections.tsx`.

Note on the import cycle: `landing-sections.tsx` imports each section component, and each section
component imports `SectionFrame` back from `landing-sections.tsx`. This is the same pattern
already used in `Boreas V3/components/landing/boreas-landing-sections.tsx` (see
`relevo-curiosity-section.tsx`'s `import { SectionFrame } from "./boreas-landing-sections"`) — it
works because `SectionFrame` is only referenced inside JSX at render time, not at module-eval
time.

- [ ] **Step 1: Write `components/landing/hero-section.tsx`**

```tsx
import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function HeroSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.hero];

  return (
    <SectionFrame id={sectionIds.hero}>
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h1>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 2: Write `components/landing/problem-section.tsx`**

```tsx
import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function ProblemSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.problema];

  return (
    <SectionFrame id={sectionIds.problema} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h2>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 3: Write `components/landing/motors-section.tsx`**

```tsx
import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function MotorsSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.motores];

  return (
    <SectionFrame id={sectionIds.motores} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h2>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 4: Write `components/landing/social-proof-section.tsx`**

```tsx
import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function SocialProofSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.socialProof];

  return (
    <SectionFrame id={sectionIds.socialProof} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h2>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 5: Write `components/landing/pricing-section.tsx`**

```tsx
import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function PricingSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.pricing];

  return (
    <SectionFrame id={sectionIds.pricing} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h2>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 6: Write `components/landing/relevo-section.tsx`**

```tsx
import { SectionFrame } from "./landing-sections";
import { sectionIds, sectionStubs } from "@/content/site";

export function RelevoSection() {
  const { eyebrow, heading } = sectionStubs[sectionIds.relevo];

  return (
    <SectionFrame id={sectionIds.relevo} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {heading}
        </h2>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 7: Write `components/landing/landing-sections.tsx`**

```tsx
"use client";

import { HeroSection } from "./hero-section";
import { ProblemSection } from "./problem-section";
import { MotorsSection } from "./motors-section";
import { SocialProofSection } from "./social-proof-section";
import { PricingSection } from "./pricing-section";
import { RelevoSection } from "./relevo-section";

export function SectionFrame({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-28 py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}

export function LandingSections() {
  return (
    <div className="relative text-foreground">
      <HeroSection />
      <ProblemSection />
      <MotorsSection />
      <SocialProofSection />
      <PricingSection />
      <RelevoSection />
    </div>
  );
}
```

- [ ] **Step 8: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 9: Commit**

```bash
git add components/landing/
git commit -m "feat: add SectionFrame and 6 stub landing sections"
```

---

### Task 7: Wire page, final build/lint/smoke verification

**Files:**
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `Header` from `@/components/layout/header` (Task 4), `SiteFooter` from
  `@/components/layout/site-footer` (Task 5), `LandingSections` from
  `@/components/landing/landing-sections` (Task 6).

- [ ] **Step 1: Replace `app/page.tsx`**

```tsx
import { Header } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/site-footer";
import { LandingSections } from "@/components/landing/landing-sections";

export default function Home() {
  return (
    <>
      <Header />
      <LandingSections />
      <SiteFooter />
    </>
  );
}
```

- [ ] **Step 2: Run the full build**

Run: `npm run build`
Expected: exits 0, output contains `Compiled successfully`.

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: exits 0, no errors reported.

- [ ] **Step 4: Smoke-test the dev server and every section anchor**

Run:
```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:3000 -o /tmp/boreas-v4-smoke.html
kill $DEV_PID
grep -o 'id="hero"' /tmp/boreas-v4-smoke.html
grep -o 'id="problema"' /tmp/boreas-v4-smoke.html
grep -o 'id="motores"' /tmp/boreas-v4-smoke.html
grep -o 'id="social-proof"' /tmp/boreas-v4-smoke.html
grep -o 'id="pricing"' /tmp/boreas-v4-smoke.html
grep -o 'id="relevo"' /tmp/boreas-v4-smoke.html
grep -o 'href="#pricing"' /tmp/boreas-v4-smoke.html
```
Expected: each `grep` prints one match — all 6 section ids and at least one CTA link to
`#pricing` are present in the rendered HTML.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: wire Header, LandingSections, and SiteFooter into app/page.tsx"
```

---

## Self-Review Notes

- **Spec coverage:** every Epic 0 bullet from the design spec is covered — scaffold (Task 1),
  shadcn + React Bits registry (Task 2), header/footer port (Tasks 4–5), `SectionFrame` + 6 stubs
  with working nav anchors (Task 6–7), `content/` skeleton (Task 3).
- **Placeholder scan:** no TBD/TODO in any step; stub section copy is real, deterministic text
  ("Hero — pendiente de pulir", etc.), not a meta-placeholder.
- **Type consistency:** `sectionIds`, `SectionId`, `sectionStubs`, `navLinks`, `primaryCta` are
  defined once in Task 3 and consumed with matching names/shapes in Tasks 4, 5, 6, 7.
- **Known gap carried forward, not silently dropped:** the design spec's Epic 0 bullet listed
  "Relevo" both as something ported from V3 and as one of the 6 stubbed sections — a leftover
  inconsistency from drafting. This plan resolves it the way the Epic breakdown presented to and
  approved by the user actually described it: Epic 0 only stubs Relevo (`relevo-section.tsx`
  above); the real port of `relevo-curiosity-section.tsx` + its carousel happens in Epic 6, per
  the design spec's own Epic 6 description. No action needed now — noted here so Epic 6's plan
  doesn't get written against the wrong assumption.
