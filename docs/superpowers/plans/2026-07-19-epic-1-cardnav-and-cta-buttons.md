# Epic 1 — CardNav, Section-Aware Theme, Hero CTA Buttons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current full-width sticky `Header` with a floating, centered React Bits
`CardNav` that recolors itself (and its logo) between light and dark based on which section is
currently under it, hides its CTA while the Hero is in view, drop the Hero's raster logo lockup in
favor of a pure-text "Boreas" wordmark, swap the Hero's two CTAs for `SpecularButton` (secondary)
and a recolored `InteractiveHoverButton` (primary), and retune `LightRays` to originate from the
top-center and read more intensely.

**Architecture:** `CardNav` is ported from `Boreas V3`'s already-hardened version (in its
`hero-cinematic-scroll` worktree) rather than the raw `@react-bits` registry copy — V3's version
fixed a mobile hamburger/toggle overlap bug and inlined the `react-icons` arrow so it has zero
extra icon-library dependency. Section-aware theming reuses the `data-theme="dark"` mechanism from
the Hero visual overhaul (an `IntersectionObserver`-driven scrollspy in `Header` reads
`data-theme` off whichever `<section>` is currently under the nav, then applies that same
attribute to the nav's own wrapper) — no new token system, no hardcoded alternate color set:
`CardNav` is already configured with `var(--bg-surface)`/`var(--ink)`/`var(--accent)` etc, and
those resolve to light or dark automatically depending on the wrapper's `data-theme`. The raster
logo can't follow a CSS variable, so its light/dark swap is one small `filter` rule in
`globals.css` keyed off the same attribute. `SpecularButton` and `InteractiveHoverButton` are
written with `forwardRef` from the start (not ported-then-patched) since the Hero's GSAP timeline
needs a real DOM ref to each.

**Tech Stack:** `gsap` (CardNav's expand/collapse, already installed), `ogl` (`SpecularButton`,
already installed), `lucide-react` (new — `InteractiveHoverButton`'s arrow icon).

## Global Constraints

- No glass/backdrop-filter — `SpecularButton` ships a `blur` prop; it stays at its default `0`
  (inert `backdrop-filter: blur(0px)`) and `tintOpacity` stays `0`, so no glass surface renders.
- No hardcoded color hex outside `globals.css` tokens — all new components are wired with
  `var(--...)` references, except the one explicit exception the user asked for by name: the
  primary CTA's hover fill is literal white (`bg-white`), matching "cambiando a blanco".
- `prefers-reduced-motion` keeps its existing static-equivalent behavior — `CardNav` already
  exposes a `reduceMotion` prop (skips the gsap expand/collapse, still functionally opens/closes)
  and the Hero's own reduced-motion branch (from the Hero visual overhaul) is unaffected by this
  plan.
- Copy lives in `content/`, not hardcoded in JSX — nav item labels and links move into
  `content/site.ts` alongside the existing `primaryCta`.
- One primary CTA per viewport — the nav's own CTA and the Hero's primary CTA both point at
  `primaryCta`/`#pricing`, but the nav one is hidden while the Hero (which has its own primary
  CTA) is in view, per the user's explicit instruction.
- Any element the Hero's `useGSAP` timeline animates via inline `opacity`/`transform` must not
  also carry a CSS `transition` covering those same properties — confirmed bug pattern from the
  Hero visual overhaul (`.btn`'s `transition: all` froze the primary CTA mid-tween). Checked here:
  `SpecularButton`'s outer button has `transition-transform duration-150` unconditionally, so it
  needs the same suspend/restore treatment; `InteractiveHoverButton`'s outer button has no such
  transition (its `transition-all` classes are on inner elements only), so it doesn't.

---

### Task 1: Install `lucide-react`

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install**

Run: `npm install lucide-react`
Expected: exits 0, `package.json` `dependencies` gains `"lucide-react"`.

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add lucide-react for InteractiveHoverButton's arrow icon"
```

---

### Task 2: Port `CardNav`

**Files:**
- Create: `components/layout/card-nav.tsx`

**Interfaces:**
- Produces: `CardNav` component and `CardNavItem`/`CardNavLink` types. Props: `{ logo: string;
  logoAlt?: string; items: CardNavItem[]; ctaLabel: string; ctaHref: string; onCtaClick?: () =>
  void; className?: string; ease?: string; baseColor?: string; menuColor?: string;
  buttonBgColor?: string; buttonTextColor?: string; reduceMotion?: boolean; showCta?: boolean }` —
  `showCta` (default `true`) is the one addition beyond `Boreas V3`'s version, added here so
  `Header` (Task 6) can hide the CTA while the Hero is in view without touching anything else in
  this file. Task 6 imports `CardNav` and both types.

- [ ] **Step 1: Write `components/layout/card-nav.tsx`** (ported from
  `Boreas V3/.claude/worktrees/hero-cinematic-scroll/components/hero/card-nav.tsx` — that version
  already fixed a mobile hamburger/theme-toggle overlap and replaced the `react-icons` arrow with
  an inline SVG, so it has no extra icon-library dependency; only addition here is `showCta`)

```tsx
"use client";

import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  items: CardNavItem[];
  ctaLabel: string;
  ctaHref: string;
  onCtaClick?: () => void;
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  /** When true, skip gsap animation entirely — expand/collapse still work, just instant. */
  reduceMotion?: boolean;
  /** When false, the CTA button is not rendered at all. Defaults to true. */
  showCta?: boolean;
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="nav-card-link-icon shrink-0"
    >
      <path d="M7 17L17 7M17 7H8M17 7V16" />
    </svg>
  );
}

export function CardNav({
  logo,
  logoAlt = "Boreas",
  items,
  ctaLabel,
  ctaHref,
  onCtaClick,
  className = "",
  ease = "expo.out",
  baseColor = "#fff",
  menuColor,
  buttonBgColor,
  buttonTextColor,
  reduceMotion = false,
  showCta = true,
}: CardNavProps) {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  // Tracks the *intended* open/closed target synchronously, independent of in-flight
  // animations or React state batching — handleResize must always branch on this, not on
  // `isExpanded`, since `isExpanded` only flips to false after the close tween finishes.
  const expandedTargetRef = useRef(false);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (isMobile) {
      const contentEl = navEl.querySelector(".card-nav-content") as HTMLElement | null;
      if (contentEl) {
        const wasVisible = contentEl.style.visibility;
        const wasPointerEvents = contentEl.style.pointerEvents;
        const wasPosition = contentEl.style.position;
        const wasHeight = contentEl.style.height;

        contentEl.style.visibility = "visible";
        contentEl.style.pointerEvents = "auto";
        contentEl.style.position = "static";
        contentEl.style.height = "auto";

        void contentEl.offsetHeight; // force a layout read (reflow) so scrollHeight below reflects the temporarily-unhidden content

        const topBar = 60;
        const padding = 16;
        const contentHeight = contentEl.scrollHeight;

        contentEl.style.visibility = wasVisible;
        contentEl.style.pointerEvents = wasPointerEvents;
        contentEl.style.position = wasPosition;
        contentEl.style.height = wasHeight;

        return topBar + contentHeight + padding;
      }
    }
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });
    tl.to(navEl, { height: calculateHeight, duration: 0.4, ease });
    tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, "-=0.1");
    return tl;
  };

  useLayoutEffect(() => {
    if (reduceMotion) {
      tlRef.current = null;
      return;
    }
    const tl = createTimeline();
    tlRef.current = tl;
    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items, reduceMotion]);

  // Instant (non-animated) height sync for the reduced-motion path: no gsap timeline exists,
  // so the nav's expanded/collapsed height is applied directly whenever isExpanded flips.
  useLayoutEffect(() => {
    if (!reduceMotion) return;
    const navEl = navRef.current;
    if (!navEl) return;
    navEl.style.height = isExpanded ? `${calculateHeight()}px` : "60px";
  }, [reduceMotion, isExpanded]);

  useLayoutEffect(() => {
    const handleResize = () => {
      const navEl = navRef.current;
      if (reduceMotion) {
        if (!navEl || !expandedTargetRef.current) return;
        navEl.style.height = `${calculateHeight()}px`;
        return;
      }
      if (!tlRef.current) return;
      // A tween (open or close) is actively running — let it finish naturally instead of
      // yanking it mid-flight. Killing an in-flight reverse tween here is what used to strand
      // the nav in a stuck, contradictory state (see expandedTargetRef comment above).
      if (tlRef.current.isActive()) return;
      if (expandedTargetRef.current) {
        const newHeight = calculateHeight();
        gsap.set(navEl, { height: newHeight });
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) tlRef.current = newTl;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  const toggleMenu = () => {
    if (reduceMotion) {
      if (!isExpanded) {
        expandedTargetRef.current = true;
        setIsHamburgerOpen(true);
        setIsExpanded(true);
      } else {
        expandedTargetRef.current = false;
        setIsHamburgerOpen(false);
        setIsExpanded(false);
      }
      return;
    }
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      expandedTargetRef.current = true;
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      expandedTargetRef.current = false;
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={`card-nav-container absolute left-1/2 top-[1.2em] z-[99] w-[90%] max-md:w-[62%] max-w-[800px] -translate-x-1/2 md:top-[2em] ${className}`}
    >
      <nav
        ref={navRef}
        className={`card-nav ${isExpanded ? "open" : ""} relative block h-[60px] overflow-hidden rounded-xl p-0 shadow-md will-change-[height]`}
        style={{ backgroundColor: baseColor }}
      >
        <div className="card-nav-top absolute inset-x-0 top-0 z-[2] flex h-[60px] items-center justify-between p-2 pl-[1.1rem]">
          <div
            className={`hamburger-menu ${isHamburgerOpen ? "open" : ""} group order-2 flex h-full cursor-pointer flex-col items-center justify-center gap-[6px] md:order-none`}
            onClick={toggleMenu}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            role="button"
            aria-label={isExpanded ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isExpanded}
            tabIndex={0}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={`hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${isHamburgerOpen ? "translate-y-[4px] rotate-45" : ""} group-hover:opacity-75`}
            />
            <div
              className={`hamburger-line h-[2px] w-[30px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%] ${isHamburgerOpen ? "-translate-y-[4px] -rotate-45" : ""} group-hover:opacity-75`}
            />
          </div>

          <Link
            href="/"
            aria-label="Boreas — inicio"
            className="logo-container order-1 flex items-center md:absolute md:left-1/2 md:top-1/2 md:order-none md:-translate-x-1/2 md:-translate-y-1/2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt={logoAlt} className="logo h-[28px]" />
          </Link>

          {showCta && (
            <a
              href={ctaHref}
              onClick={onCtaClick}
              className="card-nav-cta-button hidden h-full items-center rounded-[calc(0.75rem-0.2rem)] border-0 px-4 font-medium transition-colors duration-300 md:inline-flex"
              style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
            >
              {ctaLabel}
            </a>
          )}
        </div>

        <div
          className={`card-nav-content absolute inset-x-0 bottom-0 top-[60px] z-[1] flex flex-col items-stretch justify-start gap-2 p-2 ${isExpanded ? "visible pointer-events-auto" : "invisible pointer-events-none"} md:flex-row md:items-end md:gap-[12px]`}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="nav-card relative flex h-auto min-h-[60px] min-w-0 flex-[1_1_auto] select-none flex-col gap-2 rounded-[calc(0.75rem-0.2rem)] p-[12px_16px] md:h-full md:min-h-0 md:flex-[1_1_0%]"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="nav-card-label text-[18px] font-normal tracking-[-0.5px] md:text-[22px]">{item.label}</div>
              <div className="nav-card-links mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) => (
                  <a
                    key={`${lnk.label}-${i}`}
                    className="nav-card-link inline-flex cursor-pointer items-center gap-[6px] text-[15px] no-underline transition-opacity duration-300 hover:opacity-75 md:text-[16px]"
                    href={lnk.href}
                    aria-label={lnk.ariaLabel}
                  >
                    <ArrowUpRightIcon />
                    {lnk.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/layout/card-nav.tsx
git commit -m "feat: port CardNav from Boreas V3's hardened version"
```

---

### Task 3: Port `SpecularButton` (Hero secondary CTA)

**Files:**
- Create: `components/landing/specular-button.tsx`

**Interfaces:**
- Produces: default export `SpecularButton`, a `forwardRef<HTMLButtonElement, SpecularButtonProps>`
  component. Props: `{ children?: ReactNode; size?: 'sm'|'md'|'lg'; radius?: number; tint?:
  string; tintOpacity?: number; blur?: number; textColor?: string; lineColor?: string;
  baseColor?: string; intensity?: number; shineSize?: number; shineFade?: number; thickness?:
  number; speed?: number; followMouse?: boolean; proximity?: number; autoAnimate?: boolean;
  disabled?: boolean; onClick?: MouseEventHandler<HTMLButtonElement>; className?: string; type?:
  'button'|'submit'|'reset' }`. Task 7 attaches a ref to this and reads `.current` as a real
  `HTMLButtonElement` for its GSAP timeline.

- [ ] **Step 1: Write `components/landing/specular-button.tsx`** (ported from the `@react-bits`
  registry's `SpecularButton-TS-TW` item, wrapped in `forwardRef` from the start — the original
  registry version doesn't forward a ref, but this project's Hero needs a real DOM node for its
  GSAP entrance timeline. Defaults keep `blur: 0` and `tintOpacity: 0`, so no glass surface
  renders — satisfies the project's no-glass rule without any further changes)

```tsx
import { useRef, useEffect, forwardRef, CSSProperties, ReactNode, MouseEventHandler } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

type ButtonSize = 'sm' | 'md' | 'lg';

export interface SpecularButtonProps {
  children?: ReactNode;
  size?: ButtonSize;
  radius?: number;
  tint?: string;
  tintOpacity?: number;
  blur?: number;
  textColor?: string;
  lineColor?: string;
  baseColor?: string;
  intensity?: number;
  shineSize?: number;
  shineFade?: number;
  thickness?: number;
  speed?: number;
  followMouse?: boolean;
  proximity?: number;
  autoAnimate?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

interface ShaderProps {
  radius: number;
  lineColor: string;
  baseColor: string;
  intensity: number;
  shineSize: number;
  shineFade: number;
  thickness: number;
  speed: number;
  followMouse: boolean;
  proximity: number;
  autoAnimate: boolean;
}

const PAD = 20;

const SIZES: Record<ButtonSize, string> = {
  sm: 'text-[0.85rem] px-[22px] py-[10px]',
  md: 'text-[1rem] px-[30px] py-[14px]',
  lg: 'text-[1.15rem] px-10 py-[18px]'
};

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uCenter;
uniform vec2 uHalfSize;
uniform float uRadius;
uniform float uAngle;
uniform float uPx;
uniform vec3 uLineColor;
uniform vec3 uBaseColor;
uniform float uIntensity;
uniform float uShineSize;
uniform float uShineFade;
uniform float uThickness;
uniform float uBaseWidth;

out vec4 fragColor;

float sdRoundedRect(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

float shapeSDF(vec2 p) { return sdRoundedRect(p, uHalfSize, uRadius); }

float gaussianLine(float d, float sigma) {
  float x = d / (sigma + 1e-6);
  float k = mix(1.0, 1.6, smoothstep(0.0, 1.5, x));
  return exp(-k * x * x);
}

void main() {
  vec2 p = gl_FragCoord.xy - uCenter;
  float d = shapeSDF(p);
  vec2 L = vec2(cos(uAngle), sin(uAngle));

  // Dark base stroke hugging the edge for a sense of thickness
  float base = (1.0 - smoothstep(0.0, uBaseWidth, abs(d))) * 0.45;

  // Symmetric specular: the edges facing toward/away from the light both
  // catch a streak. The angular window (size + fade) is measured with an
  // elliptical normal so it varies continuously along straight edges.
  vec2 nEll = normalize(p / (uHalfSize * uHalfSize) + 1e-6);
  float phi = acos(clamp(abs(dot(nEll, L)), 0.0, 1.0));
  float rim = 1.0 - smoothstep(uShineSize - uShineFade, uShineSize + uShineFade + 1e-4, phi);
  float line = gaussianLine(d, uThickness);
  float edgeClamp = 1.0 - smoothstep(0.5 * uPx, 3.0 * uPx, abs(d));
  float hi = line * rim * edgeClamp * uIntensity;

  vec3 col = uBaseColor * base + uLineColor * hi;
  float a = clamp(base + hi, 0.0, 1.0);
  fragColor = vec4(col, a);
}
`;

const SpecularButton = forwardRef<HTMLButtonElement, SpecularButtonProps>(
  (
    {
      children = 'Get Started',
      size = 'lg',
      radius = 18,
      tint = '#ffffff',
      tintOpacity = 0,
      blur = 0,
      textColor = '#f5f5f5',
      lineColor = '#ffffff',
      baseColor = '#525252',
      intensity = 1,
      shineSize = 10,
      shineFade = 40,
      thickness = 1,
      speed = 0.35,
      followMouse = true,
      proximity = 250,
      autoAnimate = false,
      disabled = false,
      onClick,
      className = '',
      type = 'button'
    },
    ref
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const fxRef = useRef<HTMLSpanElement>(null);
    const propsRef = useRef<ShaderProps>({} as ShaderProps);

    propsRef.current = { radius, lineColor, baseColor, intensity, shineSize, shineFade, thickness, speed, followMouse, proximity, autoAnimate };

    useEffect(() => {
      const btn = localRef.current;
      const fx = fxRef.current;
      if (!btn || !fx) return;

      const dpr = window.devicePixelRatio || 1;
      const renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true, dpr });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uCenter: { value: [0, 0] },
          uHalfSize: { value: [1, 1] },
          uRadius: { value: 0 },
          uAngle: { value: 2.4 },
          uPx: { value: dpr },
          uLineColor: { value: [1, 1, 1] },
          uBaseColor: { value: [0.32, 0.32, 0.32] },
          uIntensity: { value: 1 },
          uShineSize: { value: 0.17 },
          uShineFade: { value: 0.7 },
          uThickness: { value: 1 },

          uBaseWidth: { value: dpr }
        }
      });

      const mesh = new Mesh(gl, { geometry, program });
      fx.appendChild(gl.canvas);

      const sizeRef = { w: 1, h: 1 };
      const resize = () => {
        // Fractional size + explicit center keep the SDF pinned to the exact
        // CSS border, instead of drifting up to a pixel from offsetWidth rounding.
        const rect = btn.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        sizeRef.w = w;
        sizeRef.h = h;
        renderer.setSize(w + PAD * 2, h + PAD * 2);
        program.uniforms.uCenter.value = [(PAD + w / 2) * dpr, (PAD + h / 2) * dpr];
        program.uniforms.uHalfSize.value = [(w / 2) * dpr, (h / 2) * dpr];
      };
      const ro = new ResizeObserver(resize);
      ro.observe(btn);
      resize();

      // Light angle steers toward the pointer (anywhere on the page) and falls
      // back to a slow sweep when the pointer hasn't moved yet.
      let pointerAngle: number | null = null;
      let proximityT = 0;
      const onPointerMove = (e: PointerEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
        const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
        const dist = Math.hypot(dx, dy);
        // Over the button itself the light settles on the diagonal (framing the
        // corners) and gently sways with the cursor position within the button.
        if (dist === 0) {
          const nx = (e.clientX - cx) / (rect.width / 2);
          const ny = (cy - e.clientY) / (rect.height / 2);
          pointerAngle = Math.atan2(2 / rect.height, -2 / rect.width) + nx * 0.3 + ny * 0.15;
        } else {
          pointerAngle = Math.atan2(cy - e.clientY, e.clientX - cx);
        }
        const t = Math.max(0, 1 - dist / Math.max(propsRef.current.proximity, 1));
        proximityT = t * t * (3 - 2 * t);
      };
      window.addEventListener('pointermove', onPointerMove);

      let angle = 2.4;
      let idleAngle = 2.4;
      let bright = 0;
      let last = performance.now();
      let raf = 0;

      const lineC = new Color();
      const baseC = new Color();

      const update = (now: number) => {
        raf = requestAnimationFrame(update);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const p = propsRef.current;

        idleAngle += p.speed * dt;
        const steer = p.followMouse && pointerAngle != null && (!p.autoAnimate || proximityT > 0);
        const target = steer ? pointerAngle : idleAngle;
        const diff = ((target - angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
        angle += diff * (1 - Math.exp(-dt * 7));

        // Shine fades in with pointer proximity unless autoAnimate keeps it on
        const brightTarget = p.autoAnimate ? 1 : proximityT;
        bright += (brightTarget - bright) * (1 - Math.exp(-dt * 8));

        lineC.set(p.lineColor);
        baseC.set(p.baseColor);
        program.uniforms.uAngle.value = angle;
        program.uniforms.uRadius.value = Math.min(p.radius, Math.min(sizeRef.w, sizeRef.h) / 2) * dpr;
        program.uniforms.uLineColor.value = [lineC.r, lineC.g, lineC.b];
        program.uniforms.uBaseColor.value = [baseC.r, baseC.g, baseC.b];
        program.uniforms.uIntensity.value = p.intensity * bright;
        program.uniforms.uShineSize.value = (p.shineSize * Math.PI) / 180;
        program.uniforms.uShineFade.value = (p.shineFade * Math.PI) / 180;
        program.uniforms.uThickness.value = p.thickness * dpr;
        renderer.render({ scene: mesh });
      };
      raf = requestAnimationFrame(update);

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        window.removeEventListener('pointermove', onPointerMove);
        if (gl.canvas.parentNode === fx) fx.removeChild(gl.canvas);
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      };
    }, []);

    return (
      <button
        ref={(node) => {
          localRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`relative m-0 inline-flex cursor-pointer items-center justify-center border-none font-medium leading-none tracking-[0.01em] outline-none transition-transform duration-150 active:scale-[0.97] disabled:cursor-default disabled:opacity-55 disabled:active:scale-100 [color:var(--sb-text-color)] [border-radius:var(--sb-radius)] [background:color-mix(in_srgb,var(--sb-tint)_calc(var(--sb-tint-opacity)*100%),transparent)] [backdrop-filter:blur(var(--sb-blur))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_8px_24px_rgba(0,0,0,0.25)] focus-visible:outline-2 focus-visible:outline-offset-[3px] ${SIZES[size] || SIZES.md}${className ? ` ${className}` : ''}`}
        style={
          {
            '--sb-radius': `${radius}px`,
            '--sb-tint': tint,
            '--sb-tint-opacity': tintOpacity,
            '--sb-blur': `${blur}px`,
            '--sb-text-color': textColor
          } as CSSProperties
        }
      >
        <span ref={fxRef} aria-hidden="true" className="pointer-events-none absolute -inset-5 z-[1] [&_canvas]:block [&_canvas]:h-full [&_canvas]:w-full" />
        <span className="relative z-[2]">{children}</span>
      </button>
    );
  }
);

SpecularButton.displayName = 'SpecularButton';

export default SpecularButton;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/specular-button.tsx
git commit -m "feat: port React Bits SpecularButton (forwardRef) for Hero secondary CTA"
```

---

### Task 4: Port + recolor `InteractiveHoverButton` (Hero primary CTA)

**Files:**
- Create: `components/landing/interactive-hover-button.tsx`

**Interfaces:**
- Produces: named export `InteractiveHoverButton`, a `forwardRef<HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>>` component. Task 7 attaches a ref to this and
  reads `.current` as a real `HTMLButtonElement` for its GSAP timeline.

- [ ] **Step 1: Write `components/landing/interactive-hover-button.tsx`** (ported from Magic UI's
  `interactive-hover-button`, wrapped in `forwardRef` from the start for the same reason as
  `SpecularButton`; recolored: resting state is accent-outlined/accent-text instead of the
  original neutral `bg-background`/`primary` shadcn tokens — which this project doesn't define —
  and the hover fill is literal white per the user's explicit "cambiando a blanco", with
  accent-colored text/arrow revealed on top of that white fill)

```tsx
import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export const InteractiveHoverButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto cursor-pointer overflow-hidden rounded-full border border-accent bg-transparent p-2 px-6 text-center font-semibold text-accent",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="h-2 w-2 rounded-full bg-white transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 text-accent opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/interactive-hover-button.tsx
git commit -m "feat: port and recolor Magic UI InteractiveHoverButton (accent to white) for Hero primary CTA"
```

---

### Task 5: Dark-theme logo filter in `globals.css`

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: a CSS rule that recolors any `.logo` image inside `.card-nav-container` to white
  whenever an ancestor carries `data-theme="dark"` — Task 6's `Header` sets that attribute
  dynamically; no JavaScript-side logo-swap logic is needed.

- [ ] **Step 1: Append to `app/globals.css`** (after the existing `.browser-frame-chrome::before`
  rule at the end of the file)

```css

/* CardNav logo recolor — flips to white when the nav's wrapper carries
   data-theme="dark" (Header sets this based on which section is under the
   nav). The raster logo can't follow a CSS variable the way text/border
   colors can, so this is a plain filter swap scoped to the same attribute
   the rest of the per-section theming already uses. */
[data-theme="dark"] .card-nav-container .logo {
  filter: brightness(0) invert(1);
}
```

- [ ] **Step 2: Verify the project still builds**

Run: `npm run build`
Expected: exits 0, output contains `Compiled successfully`.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: recolor CardNav logo to white when nav is in its dark state"
```

---

### Task 6: Rewrite `Header` — scrollspy theme, 3 nav cards, hidden-on-Hero CTA

**Files:**
- Modify: `content/site.ts`
- Modify: `components/layout/header.tsx`

**Interfaces:**
- Consumes: `CardNav`, `CardNavItem` (Task 2), `sectionIds`, `primaryCta` (existing, extended
  here).
- Produces: `Header` — same export other files already rely on (`app/page.tsx` imports it
  unchanged).

- [ ] **Step 1: Edit `content/site.ts`** — replace the existing `navLinks` export (now unused;
  `Header` builds its own `CardNavItem[]` structure) with `navCards`

Replace:

```ts
export const navLinks: Array<{ label: string; href: string }> = [
  { label: "Problema", href: `#${sectionIds.problema}` },
  { label: "Motores", href: `#${sectionIds.motores}` },
  { label: "Resultados", href: `#${sectionIds.socialProof}` },
  { label: "Contacto", href: `#${sectionIds.pricing}` },
];
```

with:

```ts
export type NavCard = {
  label: string;
  bgColor: string;
  links: Array<{ label: string; href: string; ariaLabel: string }>;
};

// Capped at 3 — CardNav only ever renders the first 3 items it's given.
// "Contacto" isn't a 4th card: the nav's always-visible CTA (hidden only
// while the Hero itself is in view) already covers that action.
export const navCards: NavCard[] = [
  {
    label: "Problema",
    bgColor: "var(--bg-elevated)",
    links: [{ label: "Ver el problema", href: `#${sectionIds.problema}`, ariaLabel: "Ir a Problema" }],
  },
  {
    label: "Motores",
    bgColor: "var(--accent-soft)",
    links: [{ label: "Ver los motores", href: `#${sectionIds.motores}`, ariaLabel: "Ir a Motores" }],
  },
  {
    label: "Resultados",
    bgColor: "var(--bg-elevated)",
    links: [{ label: "Ver resultados", href: `#${sectionIds.socialProof}`, ariaLabel: "Ir a Resultados" }],
  },
];
```

- [ ] **Step 2: Replace `components/layout/header.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { CardNav, type CardNavItem } from "@/components/layout/card-nav";
import { navCards, primaryCta, sectionIds } from "@/content/site";

const navItems: CardNavItem[] = navCards.map((card) => ({
  label: card.label,
  bgColor: card.bgColor,
  textColor: "var(--ink)",
  links: card.links,
}));

function useCurrentSectionTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isHero, setIsHero] = useState(true);

  useEffect(() => {
    const sectionEls = Array.from(document.querySelectorAll<HTMLElement>("section[id]"));
    if (sectionEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.reduce((a, b) =>
          a.boundingClientRect.top <= b.boundingClientRect.top ? a : b
        );
        const el = topMost.target as HTMLElement;
        setTheme(el.dataset.theme === "dark" ? "dark" : "light");
        setIsHero(el.id === sectionIds.hero);
      },
      { rootMargin: "-72px 0px -70% 0px", threshold: 0 }
    );

    sectionEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return { theme, isHero };
}

export function Header() {
  const { theme, isHero } = useCurrentSectionTheme();
  const reduceMotion = !!useReducedMotion();

  return (
    <header
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
      data-theme={theme === "dark" ? "dark" : undefined}
    >
      <div className="pointer-events-auto">
        <CardNav
          logo="/brand/boreas-mark.png"
          logoAlt="Boreas"
          items={navItems}
          ctaLabel={primaryCta}
          ctaHref={`#${sectionIds.pricing}`}
          showCta={!isHero}
          baseColor="var(--bg-surface)"
          menuColor="var(--ink)"
          buttonBgColor="var(--accent)"
          buttonTextColor="var(--bg-deep)"
          reduceMotion={reduceMotion}
        />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors (confirms nothing else still imports the removed `navLinks`).

- [ ] **Step 4: Commit**

```bash
git add content/site.ts components/layout/header.tsx
git commit -m "feat: replace Header with theme-aware CardNav (scrollspy-driven light/dark)"
```

---

### Task 7: Hero — text-only "Boreas", new CTA buttons, retuned LightRays

**Files:**
- Modify: `components/landing/hero-section.tsx`

**Interfaces:**
- Consumes: `SpecularButton` (Task 3), `InteractiveHoverButton` (Task 4), `LightRays` (existing),
  `GsapCounter` (existing), `sectionIds`, `primaryCta`, `heroContent` (existing).

- [ ] **Step 1: Replace `components/landing/hero-section.tsx`** — the logo `<Image>` becomes a
  plain text wordmark ("Boreas", Newsreader italic, scaled up), `primaryCtaRef`/`secondaryCtaRef`
  become `HTMLButtonElement` refs bound to `InteractiveHoverButton`/`SpecularButton` (both render
  a native `<button>`, not an `<a>`, so each gets an `onClick` that scrolls to its target section
  instead of an `href`), `SpecularButton` gets the same transition-suspend treatment `.btn` needed
  in the previous pass (see Global Constraints), and `LightRays` moves to `raysOrigin="top-center"`
  with tighter/longer/faster settings for a more intense look

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { SectionFrame } from "./landing-sections";
import LightRays from "./light-rays";
import SpecularButton from "./specular-button";
import { InteractiveHoverButton } from "./interactive-hover-button";
import { GsapCounter } from "./gsap-counter";
import { sectionIds, primaryCta } from "@/content/site";
import { heroContent } from "@/content/hero";

gsap.registerPlugin(GSAPSplitText);

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLHeadingElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const primaryCtaRef = useRef<HTMLButtonElement>(null);
  const secondaryCtaRef = useRef<HTMLButtonElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    });
    return () => cancelAnimationFrame(raf);
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

      const split = new GSAPSplitText(headlineRef.current, {
        type: "words",
        wordsClass: "split-word",
      });
      gsap.set(split.words, { opacity: 0, y: 24 });

      // SpecularButton's outer button carries `transition-transform duration-150`
      // (for its active:scale press feedback), which fights GSAP's own per-frame
      // transform writes the same way `.btn`'s `transition: all` did in the
      // previous pass (see Epic 1 pass 1's Hero fix). InteractiveHoverButton's
      // outer button has no such transition, so only this one needs suspending.
      gsap.set(secondaryCtaRef.current, { transition: "none" });

      const cards = cardRefs.current.filter((el): el is HTMLDivElement => el !== null);

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(logoRef.current, { opacity: 0, y: 20, scale: 0.94, duration: 0.8 }, 0)
        .from(eyebrowRef.current, { opacity: 0, y: 12, duration: 0.6 }, 0.55)
        .to(split.words, { opacity: 1, y: 0, duration: 0.8, stagger: 0.04 }, 0.75)
        .from(subheadRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.5)
        .from(primaryCtaRef.current, { opacity: 0, y: 16, duration: 0.7 }, 1.58)
        .from(
          secondaryCtaRef.current,
          {
            opacity: 0,
            y: 16,
            duration: 0.7,
            onComplete: () => {
              if (secondaryCtaRef.current) secondaryCtaRef.current.style.transition = "";
            },
          },
          1.66
        )
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
            raysOrigin="top-center"
            raysColor="#FBF8F3"
            raysSpeed={1.1}
            lightSpread={0.4}
            rayLength={1.8}
            fadeDistance={1.4}
            saturation={1}
            followMouse
            mouseInfluence={0.15}
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
          <h2
            ref={logoRef}
            style={{ fontFamily: "var(--font-newsreader), Georgia, serif" }}
            className="text-[clamp(2.6rem,7vw,5.5rem)] font-medium italic leading-none tracking-[-0.01em] text-foreground"
          >
            Boreas
          </h2>

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
            <InteractiveHoverButton
              ref={primaryCtaRef}
              onClick={() => scrollToSection(sectionIds.pricing)}
            >
              {primaryCta}
            </InteractiveHoverButton>
            <SpecularButton
              ref={secondaryCtaRef}
              size="md"
              onClick={() => scrollToSection(sectionIds.motores)}
            >
              {heroContent.ctaSecondaryLabel}
            </SpecularButton>
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

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/hero-section.tsx
git commit -m "feat: Hero text wordmark, SpecularButton/InteractiveHoverButton CTAs, retuned LightRays"
```

---

### Task 8: Final build/lint/visual verification

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
curl -s http://localhost:3000 -o /tmp/boreas-v4-nav-smoke.html
kill $DEV_PID
grep -o 'card-nav-container' /tmp/boreas-v4-nav-smoke.html
grep -o '>Boreas<' /tmp/boreas-v4-nav-smoke.html
grep -o 'Ver los motores en acción' /tmp/boreas-v4-nav-smoke.html
```
Expected: each `grep` prints at least one match.

- [ ] **Step 4: Visual check — Hero at top of page**

Open `http://localhost:3000` at desktop width, wait ~2.5s for the reveal timeline, screenshot.
Confirm by eye: floating pill nav centered at the top with the logo mark centered, no CTA button
visible in the nav (Hero is in view), the nav pill itself reads dark (since Hero is dark); in the
Hero body, "Boreas" renders as plain italic text (no mountain icon), light rays visibly emanate
from top-center and read noticeably more intense/defined than the previous pass, the primary CTA
is an accent-outlined pill that fills white on hover, the secondary CTA has a thin rim-light
outline (no visible glass blur).

- [ ] **Step 5: Visual check — nav flips light after scrolling past Hero**

Scroll until a light-themed stub section (e.g. "Problema") is under the nav, screenshot. Confirm
by eye: the nav pill is now light (matches the light section tokens), the logo is back to its
original dark mark color, and the nav's CTA button is now visible on the right.

- [ ] **Step 6: Commit** (only if Steps 4–5 required follow-up fixes; otherwise nothing to commit
  — Task 7 already committed the final code)

## Self-Review Notes

- **Spec coverage:** item 1 (CardNav, theme-adaptive incl. logo) → Tasks 2, 5, 6; item 2 (centered
  logo, CTA hidden on Hero) → CardNav's own centering CSS (unchanged) + Task 6's `showCta`; item 3
  (LightRays centered + more intense) → Task 7; item 4 (Hero shows only text "Boreas") → Task 7;
  item 5 (SpecularButton secondary, recolored InteractiveHoverButton primary) → Tasks 3, 4, 7;
  item 6 (right-side content) explicitly deferred by the user — no task, correctly out of scope.
- **Placeholder scan:** no TBD/TODO; every step shows complete, final file contents rather than
  incremental find/replace patches (the earlier draft of this plan patched `SpecularButton` after
  the fact to add `forwardRef` via a multi-step diff — rewritten here so Task 3 just writes the
  correct `forwardRef` version directly, removing an error-prone indirection).
- **Type consistency:** `CardNavItem`/`CardNavLink` (Task 2) match `navItems`'s shape built from
  `NavCard` (Task 6). `primaryCtaRef`/`secondaryCtaRef` are `HTMLButtonElement` in Task 7,
  matching the `forwardRef<HTMLButtonElement, ...>` signatures in Tasks 3 and 4.
