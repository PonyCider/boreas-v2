# Epic 1 — Hero Visual Overhaul (Pass 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the flat, single-tone Hero from Epic 1 pass 1 with a high-impact version: the Hero
runs in a fixed dark theme (rest of the page stays light), a React Bits `LightRays` WebGL
background replaces the old `bg-hero-glow` gradient, the Boreas logo replaces the nav's text
wordmark, and the Boreas lockup animates in large inside the Hero — first, before anything else —
followed by eyebrow, headline, subhead, CTAs, and the proof-stat cluster in one continuous
sequence.

**Architecture:** Per-section theming is added as a `theme?: "dark"` prop on `SectionFrame` that
sets `data-theme="dark"` on that `<section>` only — the existing dark-mode CSS token overrides in
`globals.css` (written for V3's now-removed global toggle) already cascade correctly to any
scoped subtree, so no token changes are needed, only where the attribute is applied. The
reveal sequence drops the React Bits `SplitText` *wrapper component* from pass 1 (it drives its
own `ScrollTrigger`-based timing, which can't be coordinated with "logo first, then everything
else") in favor of calling the underlying `gsap/SplitText` plugin directly inside the Hero's own
single `useGSAP` timeline — same plugin, but every beat (logo → eyebrow → headline words → subhead
→ CTAs → cards) gets an explicit position on one timeline instead of two independent, competing
animation systems. `components/landing/split-text.tsx` (the wrapper) becomes unused and is
deleted.

**Tech Stack:** `ogl` (WebGL, via React Bits' `LightRays-TS-TW`), `gsap/SplitText` (direct plugin
use, already unlocked by the `^3.15.0` bump in pass 1), `next/image` for the logo assets.

## Global Constraints

- `prefers-reduced-motion` must have a static equivalent — when it's set, the Hero's `useGSAP`
  timeline does not run at all (elements stay in their natural, already-visible DOM state) and
  `LightRays` is not mounted (a plain dark background renders instead, no continuous WebGL loop).
- Content must exist in the DOM and be visible by default — the reveal never conditionally
  unmounts elements; only opacity/transform are animated.
- No framer-motion/GSAP mixing in one component — the Hero stays 100% GSAP (framer-motion is
  still fine in Header, which this plan also touches, but only for its existing sticky-header
  fade and mobile-CTA `AnimatePresence`, unchanged).
- One primary CTA per viewport, still `primaryCta` from `content/site.ts`.
- Copy lives in `content/`, not hardcoded in JSX.
- Tokens only from `globals.css` — the dark palette used here is the existing V3 dark token set,
  not new colors.

---

### Task 1: Commit the processed logo assets

**Files:**
- Create (already generated on disk, not yet committed): `public/brand/boreas-mark.png`
- Create (already generated on disk, not yet committed): `public/brand/boreas-lockup.png`

**Context:** Both source files in `assets/` (`Logotipo Boreas.jpg`, `Logo oficial boreas.png`) ship
on a flat, near-uniform light-gray background (~`rgb(229,231,230)`) with no alpha channel. Both
were already processed with a Python/Pillow chroma-key script (distance-based alpha ramp from the
background color, cropped to content bounding box) during scoping — `boreas-mark.png` (872×640,
mountain mark only, from `Logotipo Boreas.jpg`) for the nav, and `boreas-lockup.png` (1186×735,
mountain mark + "BOREAS" wordmark, from `Logo oficial boreas.png`) for the Hero's big reveal.

- [ ] **Step 1: Verify both processed files exist and have real alpha transparency**

Run:
```bash
python3 -c "
from PIL import Image
for p in ['public/brand/boreas-mark.png', 'public/brand/boreas-lockup.png']:
    im = Image.open(p)
    print(p, im.mode, im.size, 'corner alpha =', im.getpixel((3,3))[3])
"
```
Expected: both print `RGBA`, a real size, and `corner alpha = 0` (transparent corner — confirms
the background was actually removed, not just visually blank).

- [ ] **Step 2: Commit**

```bash
git add public/brand/boreas-mark.png public/brand/boreas-lockup.png
git commit -m "feat: add processed (background-removed) Boreas logo assets"
```

---

### Task 2: Per-section theme prop on `SectionFrame`

**Files:**
- Modify: `components/landing/landing-sections.tsx`

**Interfaces:**
- Produces: `SectionFrame` now accepts an optional `theme?: "dark"` prop, rendered as
  `data-theme="dark"` on the `<section>` — Task 5 (Hero) uses this to scope the existing V3 dark
  token overrides (`[data-theme="dark"] { ... }` in `app/globals.css`, already ported unchanged in
  Epic 0) to just the Hero subtree.

- [ ] **Step 1: Edit `components/landing/landing-sections.tsx`**

Replace:

```tsx
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
```

with:

```tsx
export function SectionFrame({
  children,
  className = "",
  id,
  theme,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  theme?: "dark";
}) {
  return (
    <section
      id={id}
      data-theme={theme}
      className={`relative scroll-mt-28 py-20 sm:py-28 ${className}`}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/landing-sections.tsx
git commit -m "feat: add optional dark theme prop to SectionFrame for per-section theming"
```

---

### Task 3: Install `ogl`, port React Bits `LightRays-TS-TW`

**Files:**
- Modify: `package.json`
- Create: `components/landing/light-rays.tsx`

**Interfaces:**
- Produces: default export `LightRays` component with props `{ raysOrigin?: 'top-center' |
  'top-left' | 'top-right' | 'right' | 'left' | 'bottom-center' | 'bottom-right' | 'bottom-left';
  raysColor?: string; raysSpeed?: number; lightSpread?: number; rayLength?: number; pulsating?:
  boolean; fadeDistance?: number; saturation?: number; followMouse?: boolean; mouseInfluence?:
  number; noiseAmount?: number; distortion?: number; className?: string }` — Task 5 imports and
  renders this as the Hero's background layer. It self-mounts a WebGL canvas only once its
  container intersects the viewport (built-in `IntersectionObserver` gate) and is `pointer-events:
  none`, so it never blocks clicks on content above it.

- [ ] **Step 1: Install `ogl`**

Run: `npm install ogl@^1.0.11`
Expected: exits 0, `package.json` `dependencies` gains `"ogl": "^1.0.11"`.

- [ ] **Step 2: Write `components/landing/light-rays.tsx`** (ported verbatim from the `@react-bits`
  registry's `LightRays-TS-TW` item, verified via `mcp__shadcn__get_item_examples_from_registries`)

```tsx
import { useRef, useEffect, useState } from 'react';
import { Renderer, Program, Triangle, Mesh } from 'ogl';

export type RaysOrigin =
  | 'top-center'
  | 'top-left'
  | 'top-right'
  | 'right'
  | 'left'
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left';

interface LightRaysProps {
  raysOrigin?: RaysOrigin;
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  className?: string;
}

const DEFAULT_COLOR = '#ffffff';

const hexToRgb = (hex: string): [number, number, number] => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
};

const getAnchorAndDir = (
  origin: RaysOrigin,
  w: number,
  h: number
): { anchor: [number, number]; dir: [number, number] } => {
  const outside = 0.2;
  switch (origin) {
    case 'top-left':
      return { anchor: [0, -outside * h], dir: [0, 1] };
    case 'top-right':
      return { anchor: [w, -outside * h], dir: [0, 1] };
    case 'left':
      return { anchor: [-outside * w, 0.5 * h], dir: [1, 0] };
    case 'right':
      return { anchor: [(1 + outside) * w, 0.5 * h], dir: [-1, 0] };
    case 'bottom-left':
      return { anchor: [0, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-center':
      return { anchor: [0.5 * w, (1 + outside) * h], dir: [0, -1] };
    case 'bottom-right':
      return { anchor: [w, (1 + outside) * h], dir: [0, -1] };
    default: // "top-center"
      return { anchor: [0.5 * w, -outside * h], dir: [0, 1] };
  }
};

type Vec2 = [number, number];
type Vec3 = [number, number, number];

interface Uniforms {
  iTime: { value: number };
  iResolution: { value: Vec2 };
  rayPos: { value: Vec2 };
  rayDir: { value: Vec2 };
  raysColor: { value: Vec3 };
  raysSpeed: { value: number };
  lightSpread: { value: number };
  rayLength: { value: number };
  pulsating: { value: number };
  fadeDistance: { value: number };
  saturation: { value: number };
  mousePos: { value: Vec2 };
  mouseInfluence: { value: number };
  noiseAmount: { value: number };
  distortion: { value: number };
}

const LightRays: React.FC<LightRaysProps> = ({
  raysOrigin = 'top-center',
  raysColor = DEFAULT_COLOR,
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1.0,
  saturation = 1.0,
  followMouse = true,
  mouseInfluence = 0.1,
  noiseAmount = 0.0,
  distortion = 0.0,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uniformsRef = useRef<Uniforms | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const smoothMouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const cleanupFunctionRef = useRef<(() => void) | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    observerRef.current = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !containerRef.current) return;

    if (cleanupFunctionRef.current) {
      cleanupFunctionRef.current();
      cleanupFunctionRef.current = null;
    }

    const initializeWebGL = async () => {
      if (!containerRef.current) return;

      await new Promise(resolve => setTimeout(resolve, 10));

      if (!containerRef.current) return;

      const renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: true
      });
      rendererRef.current = renderer;

      const gl = renderer.gl;
      gl.canvas.style.width = '100%';
      gl.canvas.style.height = '100%';

      while (containerRef.current.firstChild) {
        containerRef.current.removeChild(containerRef.current.firstChild);
      }
      containerRef.current.appendChild(gl.canvas);

      const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

      const frag = `precision highp float;

uniform float iTime;
uniform vec2  iResolution;

uniform vec2  rayPos;
uniform vec2  rayDir;
uniform vec3  raysColor;
uniform float raysSpeed;
uniform float lightSpread;
uniform float rayLength;
uniform float pulsating;
uniform float fadeDistance;
uniform float saturation;
uniform vec2  mousePos;
uniform float mouseInfluence;
uniform float noiseAmount;
uniform float distortion;

varying vec2 vUv;

float noise(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord,
                  float seedA, float seedB, float speed) {
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);

  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;

  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));

  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);

  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;

  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)),
    0.0, 1.0
  );

  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);

  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0) {
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }

  vec4 rays1 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349,
                           1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) *
               rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234,
                           1.1 * raysSpeed);

  fragColor = rays1 * 0.5 + rays2 * 0.4;

  if (noiseAmount > 0.0) {
    float n = noise(coord * 0.01 + iTime * 0.1);
    fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n);
  }

  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;

  if (saturation != 1.0) {
    float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114));
    fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation);
  }

  fragColor.rgb *= raysColor;
}

void main() {
  vec4 color;
  mainImage(color, gl_FragCoord.xy);
  gl_FragColor  = color;
}`;

      const uniforms: Uniforms = {
        iTime: { value: 0 },
        iResolution: { value: [1, 1] },

        rayPos: { value: [0, 0] },
        rayDir: { value: [0, 1] },

        raysColor: { value: hexToRgb(raysColor) },
        raysSpeed: { value: raysSpeed },
        lightSpread: { value: lightSpread },
        rayLength: { value: rayLength },
        pulsating: { value: pulsating ? 1.0 : 0.0 },
        fadeDistance: { value: fadeDistance },
        saturation: { value: saturation },
        mousePos: { value: [0.5, 0.5] },
        mouseInfluence: { value: mouseInfluence },
        noiseAmount: { value: noiseAmount },
        distortion: { value: distortion }
      };
      uniformsRef.current = uniforms;

      const geometry = new Triangle(gl);
      const program = new Program(gl, {
        vertex: vert,
        fragment: frag,
        uniforms
      });
      const mesh = new Mesh(gl, { geometry, program });
      meshRef.current = mesh;

      const updatePlacement = () => {
        if (!containerRef.current || !renderer) return;

        renderer.dpr = Math.min(window.devicePixelRatio, 2);

        const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
        renderer.setSize(wCSS, hCSS);

        const dpr = renderer.dpr;
        const w = wCSS * dpr;
        const h = hCSS * dpr;

        uniforms.iResolution.value = [w, h];

        const { anchor, dir } = getAnchorAndDir(raysOrigin, w, h);
        uniforms.rayPos.value = anchor;
        uniforms.rayDir.value = dir;
      };

      const loop = (t: number) => {
        if (!rendererRef.current || !uniformsRef.current || !meshRef.current) {
          return;
        }

        uniforms.iTime.value = t * 0.001;

        if (followMouse && mouseInfluence > 0.0) {
          const smoothing = 0.92;

          smoothMouseRef.current.x = smoothMouseRef.current.x * smoothing + mouseRef.current.x * (1 - smoothing);
          smoothMouseRef.current.y = smoothMouseRef.current.y * smoothing + mouseRef.current.y * (1 - smoothing);

          uniforms.mousePos.value = [smoothMouseRef.current.x, smoothMouseRef.current.y];
        }

        try {
          renderer.render({ scene: mesh });
          animationIdRef.current = requestAnimationFrame(loop);
        } catch (error) {
          console.warn('WebGL rendering error:', error);
          return;
        }
      };

      window.addEventListener('resize', updatePlacement);
      updatePlacement();
      animationIdRef.current = requestAnimationFrame(loop);

      cleanupFunctionRef.current = () => {
        if (animationIdRef.current) {
          cancelAnimationFrame(animationIdRef.current);
          animationIdRef.current = null;
        }

        window.removeEventListener('resize', updatePlacement);

        if (renderer) {
          try {
            const canvas = renderer.gl.canvas;
            const loseContextExt = renderer.gl.getExtension('WEBGL_lose_context');
            if (loseContextExt) {
              loseContextExt.loseContext();
            }

            if (canvas && canvas.parentNode) {
              canvas.parentNode.removeChild(canvas);
            }
          } catch (error) {
            console.warn('Error during WebGL cleanup:', error);
          }
        }

        rendererRef.current = null;
        uniformsRef.current = null;
        meshRef.current = null;
      };
    };

    initializeWebGL();

    return () => {
      if (cleanupFunctionRef.current) {
        cleanupFunctionRef.current();
        cleanupFunctionRef.current = null;
      }
    };
  }, [
    isVisible,
    raysOrigin,
    raysColor,
    raysSpeed,
    lightSpread,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    followMouse,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  useEffect(() => {
    if (!uniformsRef.current || !containerRef.current || !rendererRef.current) return;

    const u = uniformsRef.current;
    const renderer = rendererRef.current;

    u.raysColor.value = hexToRgb(raysColor);
    u.raysSpeed.value = raysSpeed;
    u.lightSpread.value = lightSpread;
    u.rayLength.value = rayLength;
    u.pulsating.value = pulsating ? 1.0 : 0.0;
    u.fadeDistance.value = fadeDistance;
    u.saturation.value = saturation;
    u.mouseInfluence.value = mouseInfluence;
    u.noiseAmount.value = noiseAmount;
    u.distortion.value = distortion;

    const { clientWidth: wCSS, clientHeight: hCSS } = containerRef.current;
    const dpr = renderer.dpr;
    const { anchor, dir } = getAnchorAndDir(raysOrigin, wCSS * dpr, hCSS * dpr);
    u.rayPos.value = anchor;
    u.rayDir.value = dir;
  }, [
    raysColor,
    raysSpeed,
    lightSpread,
    raysOrigin,
    rayLength,
    pulsating,
    fadeDistance,
    saturation,
    mouseInfluence,
    noiseAmount,
    distortion
  ]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !rendererRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      mouseRef.current = { x, y };
    };

    if (followMouse) {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [followMouse]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full pointer-events-none z-[3] overflow-hidden relative ${className}`.trim()}
    />
  );
};

export default LightRays;
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors. (`ogl` ships its own type declarations — if this fails with a
missing-types error instead, stop and report it rather than adding an `any`-typed shim.)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json components/landing/light-rays.tsx
git commit -m "feat: port React Bits LightRays-TS-TW background"
```

---

### Task 4: Header — logo instead of text wordmark, remove the dark-mode toggle

**Files:**
- Modify: `components/layout/header.tsx`

**Interfaces:**
- Consumes: `public/brand/boreas-mark.png` (Task 1).
- Produces: `Header` unchanged in every other respect (nav links, header-scroll CTA reveal, mobile
  menu) — only the logo mark and the removal of theme state change.

- [ ] **Step 1: Replace `components/layout/header.tsx`** (dark/light toggle state, `toggleTheme`,
  `MoonIcon`/`SunIcon`, and their `useEffect` removed; logo swapped for the processed mark image)

```tsx
"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { navLinks, primaryCta, sectionIds } from "@/content/site";

// Below this scroll offset, the hero's own CTA is out of view — the header
// CTA can appear without competing for the same first viewport.
const HEADER_CTA_SCROLL_THRESHOLD = 600;

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showHeaderCta, setShowHeaderCta] = useState(false);
  const reduceMotion = useReducedMotion();

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
          <Image
            src="/brand/boreas-mark.png"
            alt="Boreas"
            width={872}
            height={640}
            priority
            className="h-9 w-auto"
          />
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
git commit -m "feat: swap nav wordmark for logo image, remove global dark-mode toggle"
```

---

### Task 5: Rewrite `HeroSection` — dark theme, LightRays, logo-first unified reveal

**Files:**
- Modify: `components/landing/hero-section.tsx`
- Delete: `components/landing/split-text.tsx` (the React Bits `SplitText` wrapper from pass 1 —
  no longer imported anywhere once this task lands, since the headline now uses `gsap/SplitText`
  directly inside the Hero's own timeline)

**Interfaces:**
- Consumes: `SectionFrame` with the new `theme` prop (Task 2), `LightRays` (Task 3),
  `/brand/boreas-lockup.png` (Task 1), `GsapCounter` (pass 1, unchanged), `sectionIds`,
  `primaryCta` from `@/content/site`, `heroContent` from `@/content/hero` (unchanged).

- [ ] **Step 1: Delete the now-unused SplitText wrapper**

```bash
rm components/landing/split-text.tsx
```

- [ ] **Step 2: Replace `components/landing/hero-section.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { SectionFrame } from "./landing-sections";
import LightRays from "./light-rays";
import { GsapCounter } from "./gsap-counter";
import { sectionIds, primaryCta } from "@/content/site";
import { heroContent } from "@/content/hero";

gsap.registerPlugin(GSAPSplitText);

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLAnchorElement>(null);
  const secondaryCtaRef = useRef<HTMLAnchorElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion) return;
      if (
        !logoRef.current ||
        !eyebrowRef.current ||
        !headlineRef.current ||
        !subheadRef.current ||
        !primaryCtaRef.current ||
        !secondaryCtaRef.current
      ) {
        return;
      }

      // .btn carries `transition: all .18s ease` for its hover/active lift,
      // which fights GSAP's per-frame inline writes on the same element
      // (see Epic 1 pass 1). Suspend it for the entrance, restore on completion.
      gsap.set(primaryCtaRef.current, { transition: "none" });

      const split = new GSAPSplitText(headlineRef.current, {
        type: "words",
        wordsClass: "split-word",
      });
      gsap.set(split.words, { opacity: 0, y: 24 });

      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(logoRef.current, { opacity: 0, y: 20, scale: 0.94, duration: 0.8 }, 0)
        .from(eyebrowRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.55)
        .to(split.words, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04 }, 0.75)
        .from(subheadRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.5)
        .from(
          primaryCtaRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.7,
            onComplete: () => {
              if (primaryCtaRef.current) primaryCtaRef.current.style.transition = "";
            },
          },
          1.58
        )
        .from(secondaryCtaRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.66)
        .from(cards, { opacity: 0, y: 24, duration: 0.7, stagger: 0.12 }, 1.85);

      return () => {
        split.revert();
      };
    },
    { scope: containerRef, dependencies: [reducedMotion] }
  );

  return (
    <SectionFrame
      id={sectionIds.hero}
      theme="dark"
      className="relative overflow-hidden bg-background"
    >
      {!reducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-0">
          <LightRays
            raysOrigin="top-left"
            raysColor="#FBF8F3"
            raysSpeed={0.6}
            lightSpread={0.85}
            rayLength={1.3}
            fadeDistance={1.1}
            saturation={1}
            followMouse
            mouseInfluence={0.08}
            noiseAmount={0.06}
            distortion={0.05}
          />
        </div>
      )}

      <div
        ref={containerRef}
        className="relative z-10 mx-auto grid max-w-[1460px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:px-10"
      >
        <div className="flex flex-col items-start text-left">
          <Image
            ref={logoRef}
            src="/brand/boreas-lockup.png"
            alt="Boreas"
            width={1186}
            height={735}
            priority
            className="w-full max-w-[280px] brightness-0 invert sm:max-w-[340px]"
          />

          <p ref={eyebrowRef} className="mt-6 text-sm font-medium text-accent">
            {heroContent.eyebrow}
          </p>

          <h1
            ref={headlineRef}
            className="mt-4 max-w-2xl text-[clamp(2rem,4.5vw,3.8rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
          >
            {heroContent.headline}
          </h1>

          <p
            ref={subheadRef}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {heroContent.subheadline}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a ref={primaryCtaRef} href={`#${sectionIds.pricing}`} className="btn btn-p">
              {primaryCta}
            </a>
            <a
              ref={secondaryCtaRef}
              href={heroContent.ctaSecondaryHref}
              className="flex min-h-11 items-center text-sm font-medium text-muted underline-offset-4 hover:text-foreground hover:underline"
            >
              {heroContent.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <div className="hidden flex-col gap-4 lg:flex">
          {heroContent.proofStats.map((stat, index) => (
            <div
              key={stat.label}
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow)]"
            >
              <p className="text-2xl font-display text-foreground">
                {stat.animated ? (
                  <GsapCounter to={stat.value} decimals={stat.decimals} suffix={stat.suffix} />
                ) : (
                  stat.staticValue
                )}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
          <p className="text-xs text-clinical">{heroContent.proofBadge}</p>
        </div>
      </div>
    </SectionFrame>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors (confirms nothing else still imports the deleted `split-text.tsx`).

- [ ] **Step 4: Commit**

```bash
git add components/landing/hero-section.tsx components/landing/split-text.tsx
git commit -m "feat: dark-themed Hero — LightRays background, logo-first unified GSAP reveal"
```

---

### Task 6: Final build/lint/visual verification

**Files:** none (verification only)

- [ ] **Step 1: Run the full build**

Run: `npm run build`
Expected: exits 0, output contains `Compiled successfully`.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: exits 0, no errors reported.

- [ ] **Step 3: Smoke-test the rendered HTML**

```bash
npm run dev &
DEV_PID=$!
sleep 3
curl -s http://localhost:3000 -o /tmp/boreas-v4-hero-v2-smoke.html
kill $DEV_PID
grep -o 'data-theme="dark"' /tmp/boreas-v4-hero-v2-smoke.html
grep -o '/brand/boreas-mark' /tmp/boreas-v4-hero-v2-smoke.html
grep -o '/brand/boreas-lockup' /tmp/boreas-v4-hero-v2-smoke.html
```
Expected: each `grep` prints at least one match (dark theme scoped to Hero, nav mark present,
Hero lockup present).

- [ ] **Step 4: Visual check — Hero (dark)**

Open `http://localhost:3000` in the browser preview at desktop width, wait ~2.5s for the reveal
timeline to finish, screenshot. Confirm by eye: Hero renders on a dark background with visible
light-ray beams from the top-left, the logo lockup is large and rendered in a clean light/white
tone (not raw color-inverted with odd hues), sequence has settled with logo → eyebrow → headline
→ subhead → CTAs → proof cluster all visible, nav shows the logo mark instead of the text
"Boreas", no dark-mode toggle button in the header.

- [ ] **Step 5: Visual check — rest of page stays light**

Scroll to the Epic 2–6 stub sections in the same screenshot pass. Confirm by eye: everything below
the Hero still renders in the light/cream palette (no bleed of the dark theme past the Hero's
`data-theme="dark"` boundary).

- [ ] **Step 6: Commit** (only if Steps 4–5 required follow-up fixes; otherwise nothing to commit —
  Task 5 already committed the final code)

## Self-Review Notes

- **Spec coverage:** logo replaces nav text (Task 4), single fixed-per-section theme replacing the
  global toggle (Tasks 2 + 4 removing the toggle, Task 5 applying `theme="dark"`), `bg-hero-glow`
  removed from the Hero and replaced by `LightRays` (Task 5), "Boreas" large in the Hero animating
  first (Task 5's timeline position `0`). All covered.
- **Placeholder scan:** no TBD/TODO; every step has real, complete code.
- **Type consistency:** `SectionFrame`'s new `theme?: "dark"` prop (Task 2) matches its one call
  site in Task 5 (`theme="dark"`). `LightRays`' prop names in Task 3's interface match exactly how
  Task 5 invokes it.
