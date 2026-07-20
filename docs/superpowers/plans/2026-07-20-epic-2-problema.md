# Epic 2 — Problema Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Problema ("Entiendo tu dolor") section: a pinned comparison-slider teaser
(genérico vs. Boreas) that peeks under the Hero and locks to the viewport while scrolling, followed
by heading, animated stats, and pain points — replacing the current `problem-section.tsx` stub.

**Architecture:** Three vendored, self-contained animation primitives (React Bits `SplitText`,
React Bits `GradualBlur`, Motion Primitives `TextEffect`) are ported verbatim into
`components/landing/`, each already handling its own reveal/scroll logic internally — no manual
orchestration needed beyond mounting them with the right props. `ProblemCompareSlider` is a new
component wrapping `@img-comparison-slider/react` (the only new npm dependency this Epic adds,
justified in the design spec §2 — nothing installed accepts arbitrary JSX in a drag-compare slot)
with a GSAP `ScrollTrigger.create({ pin: true, start: "bottom bottom" })` — the standard recipe for
locking an element to its current on-screen position once its bottom edge reaches the viewport
bottom, which is what produces the "pinned near the bottom until it reaches its slot" effect.
`ProblemSection` composes all of it, pulling copy from a new `content/problem.ts`.

**Tech Stack:** `@img-comparison-slider/react` (new), `gsap`/`gsap/ScrollTrigger`/`@gsap/react`
(already installed), `motion` (already installed, via its `motion/react` subpath).

## Global Constraints

- `prefers-reduced-motion` must have a static equivalent: `ProblemCompareSlider` skips creating the
  `ScrollTrigger` pin entirely (slider renders in normal flow, no peek offset); `TextEffect` and
  `SplitText` both already no-op into visible-by-default states outside of `useGSAP`/animation
  timing (verified per-component in Tasks 2–4); `GsapCounter` already renders its final value
  instantly under reduced motion (existing behavior, unchanged).
- Content must exist in the DOM and be visible by default — no conditional unmounting of copy,
  only opacity/transform/blur are animated.
- No two animation libraries inside the same component. Each vendored component
  (`SplitText`=gsap, `GradualBlur`=none, `TextEffect`=motion) is single-library internally;
  `ProblemSection` only composes already-self-contained components, it does not mix libraries
  itself.
- One primary CTA per viewport — this Epic adds none; the mini "Boreas" mockup's button inside the
  slider is a non-interactive visual prop, not a real CTA (no `onClick`, not part of the funnel).
- Copy lives in `content/problem.ts`, never hardcoded in JSX.
- Tokens only from `app/globals.css` (`--bg-*`, `--ink*`, `--accent*`, `--c-amber/mint/lav/rose`,
  `--border`, `--line`, `--clinical`, `--radius-*`, `--shadow*`) — no new colors introduced. The
  deliberately bland "generic" mockup uses flat grays that are NOT design tokens (by design — it
  must look like it's from a different, generic site, not from Boreas's own palette).
- No glass/glow decorativo, no gradient text, no side-stripe borders, no nested cards.
- Every stat shown needs a citable source — `problemStatsSource` in `content/problem.ts` carries
  the same citation V3 used (Accenture Health Consumer Survey / Kyruus Care Access Benchmark
  Report), still valid since it's about patients researching healthcare providers online in
  general, not doctor-specific.

---

### Task 1: Install `@img-comparison-slider/react`

**Files:**
- Modify: `package.json`, `package-lock.json`

- [ ] **Step 1: Install**

Run: `npm install @img-comparison-slider/react@^8.0.2`
Expected: exits 0, `package.json` `dependencies` gains
`"@img-comparison-slider/react": "^8.0.2"`.

- [ ] **Step 2: Verify types resolve**

Run: `npx tsc --noEmit`
Expected: exits 0 (nothing imports it yet, this just confirms the install didn't break anything).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add @img-comparison-slider/react for the Problema comparison slider"
```

---

### Task 2: Port React Bits `SplitText` (headings / large text)

**Files:**
- Create: `components/landing/split-text.tsx`

**Interfaces:**
- Produces: default export `SplitText` — `{ text: string; className?: string; delay?: number;
  duration?: number; ease?: string | ((t:number)=>number); splitType?: 'chars'|'words'|'lines'|
  'words, chars'; from?: gsap.TweenVars; to?: gsap.TweenVars; threshold?: number; rootMargin?:
  string; tag?: 'h1'|'h2'|'h3'|'h4'|'h5'|'h6'|'p'|'span'; textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void }`. Self-contained — creates its own `ScrollTrigger` per
  instance (`scope: ref`, `once: true`), no external wiring needed. Task 7 imports and uses this
  for the Problema heading.
- Reduced motion: N/A at the component level — `ScrollTrigger`'s own `start`/`once` still fires the
  reveal once scrolled to, but since `from`/`to` only animate `opacity`/`y` (not visibility), the
  text is present in the DOM immediately; the global CSS reduced-motion rule in `app/globals.css`
  (`animation-duration: 0.01ms !important` / `transition-duration: 0.01ms !important`) already
  collapses the GSAP-driven duration for any user with the OS preference set, consistent with how
  `GsapCounter` relies on the same global rule today.

- [ ] **Step 1: Write `components/landing/split-text.tsx`** (ported verbatim from the `@react-bits`
  registry's `SplitText-TS-TW` item, verified via `mcp__shadcn__view_items_in_registries`)

```tsx
import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string | ((t: number) => number);
  splitType?: 'chars' | 'words' | 'lines' | 'words, chars';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const animationCompletedRef = useRef(false);
  const onCompleteRef = useRef(onLetterAnimationComplete);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (animationCompletedRef.current) return;
      const el = ref.current as HTMLElement & {
        _rbsplitInstance?: GSAPSplitText;
      };

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch (_) {}
        el._rbsplitInstance = undefined;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;
      let targets: Element[] = [];
      const assignTargets = (self: GSAPSplitText) => {
        if (splitType.includes('chars') && (self as GSAPSplitText).chars?.length)
          targets = (self as GSAPSplitText).chars;
        if (!targets.length && splitType.includes('words') && self.words.length) targets = self.words;
        if (!targets.length && splitType.includes('lines') && self.lines.length) targets = self.lines;
        if (!targets.length) targets = self.chars || self.words || self.lines;
      };
      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === 'lines',
        linesClass: 'split-line',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        reduceWhiteSpace: false,
        onSplit: (self: GSAPSplitText) => {
          assignTargets(self);
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                once: true,
                fastScrollEnd: true,
                anticipatePin: 0.4
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onCompleteRef.current?.();
              },
              willChange: 'transform, opacity',
              force3D: true
            }
          );
        }
      });
      el._rbsplitInstance = splitInstance;
      return () => {
        ScrollTrigger.getAll().forEach(st => {
          if (st.trigger === el) st.kill();
        });
        try {
          splitInstance.revert();
        } catch (_) {}
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded
      ],
      scope: ref
    }
  );

  const renderTag = () => {
    const style: React.CSSProperties = {
      textAlign,
      wordWrap: 'break-word',
      willChange: 'transform, opacity'
    };
    const classes = `split-parent overflow-hidden inline-block whitespace-normal ${className}`;
    const Tag = (tag || 'p') as React.ElementType;

    return (
      <Tag ref={ref} style={style} className={classes}>
        {text}
      </Tag>
    );
  };

  return renderTag();
};

export default SplitText;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/split-text.tsx
git commit -m "feat: port React Bits SplitText for heading reveals"
```

---

### Task 3: Port React Bits `GradualBlur` (top-edge mask for the slider teaser)

**Files:**
- Create: `components/landing/gradual-blur.tsx`

**Interfaces:**
- Produces: default export `GradualBlur` (memoized) — key props used by Task 6:
  `{ position?: 'top'|'bottom'|'left'|'right'; height?: string; strength?: number; className?:
  string }` (full prop list in the code below). Renders an absolutely-positioned (or `fixed` if
  `target="page"`) stack of backdrop-blur divs with a linear-gradient mask — must be placed inside
  a `position: relative` (or `position: fixed`, if page-targeted) ancestor.

- [ ] **Step 1: Write `components/landing/gradual-blur.tsx`** (ported verbatim from the
  `@react-bits` registry's `GradualBlur-TS-TW` item)

```tsx
import React, { CSSProperties, useEffect, useRef, useState, useMemo, PropsWithChildren } from 'react';

type GradualBlurProps = PropsWithChildren<{
  position?: 'top' | 'bottom' | 'left' | 'right';
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | 'scroll';
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: 'linear' | 'bezier' | 'ease-in' | 'ease-out' | 'ease-in-out';
  responsive?: boolean;
  mobileHeight?: string;
  tabletHeight?: string;
  desktopHeight?: string;
  mobileWidth?: string;
  tabletWidth?: string;
  desktopWidth?: string;

  preset?:
    | 'top'
    | 'bottom'
    | 'left'
    | 'right'
    | 'subtle'
    | 'intense'
    | 'smooth'
    | 'sharp'
    | 'header'
    | 'footer'
    | 'sidebar'
    | 'page-header'
    | 'page-footer';
  gpuOptimized?: boolean;
  hoverIntensity?: number;
  target?: 'parent' | 'page';

  onAnimationComplete?: () => void;
  className?: string;
  style?: CSSProperties;
}>;

const DEFAULT_CONFIG: Partial<GradualBlurProps> = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  animated: false,
  duration: '0.3s',
  easing: 'ease-out',
  opacity: 1,
  curve: 'linear',
  responsive: false,
  target: 'parent',
  className: '',
  style: {}
};

const PRESETS: Record<string, Partial<GradualBlurProps>> = {
  top: { position: 'top', height: '6rem' },
  bottom: { position: 'bottom', height: '6rem' },
  left: { position: 'left', height: '6rem' },
  right: { position: 'right', height: '6rem' },

  subtle: { height: '4rem', strength: 1, opacity: 0.8, divCount: 3 },
  intense: { height: '10rem', strength: 4, divCount: 8, exponential: true },

  smooth: { height: '8rem', curve: 'bezier', divCount: 10 },
  sharp: { height: '5rem', curve: 'linear', divCount: 4 },

  header: { position: 'top', height: '8rem', curve: 'ease-out' },
  footer: { position: 'bottom', height: '8rem', curve: 'ease-out' },
  sidebar: { position: 'left', height: '6rem', strength: 2.5 },

  'page-header': {
    position: 'top',
    height: '10rem',
    target: 'page',
    strength: 3
  },
  'page-footer': {
    position: 'bottom',
    height: '10rem',
    target: 'page',
    strength: 3
  }
};

const CURVE_FUNCTIONS: Record<string, (p: number) => number> = {
  linear: p => p,
  bezier: p => p * p * (3 - 2 * p),
  'ease-in': p => p * p,
  'ease-out': p => 1 - Math.pow(1 - p, 2),
  'ease-in-out': p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2)
};

const mergeConfigs = (...configs: Partial<GradualBlurProps>[]): Partial<GradualBlurProps> => {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {});
};

const getGradientDirection = (position: string): string => {
  const directions: Record<string, string> = {
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right'
  };
  return directions[position] || 'to bottom';
};

const debounce = <T extends (...a: any[]) => void>(fn: T, wait: number) => {
  let t: ReturnType<typeof setTimeout>;
  return (...a: Parameters<T>) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), wait);
  };
};
const useResponsiveDimension = (
  responsive: boolean | undefined,
  config: Partial<GradualBlurProps>,
  key: keyof GradualBlurProps
) => {
  const [val, setVal] = useState<any>(config[key]);
  useEffect(() => {
    if (!responsive) return;
    const calc = () => {
      const w = window.innerWidth;
      let v: any = config[key];
      const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
      const k = cap(key as string);
      if (w <= 480 && (config as any)['mobile' + k]) v = (config as any)['mobile' + k];
      else if (w <= 768 && (config as any)['tablet' + k]) v = (config as any)['tablet' + k];
      else if (w <= 1024 && (config as any)['desktop' + k]) v = (config as any)['desktop' + k];
      setVal(v);
    };
    const deb = debounce(calc, 100);
    calc();
    window.addEventListener('resize', deb);
    return () => window.removeEventListener('resize', deb);
  }, [responsive, config, key]);
  return responsive ? val : (config as any)[key];
};

const useIntersectionObserver = (ref: React.RefObject<HTMLDivElement>, shouldObserve: boolean = false) => {
  const [isVisible, setIsVisible] = useState(!shouldObserve);

  useEffect(() => {
    if (!shouldObserve || !ref.current) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, shouldObserve]);

  return isVisible;
};

const GradualBlur: React.FC<GradualBlurProps> = props => {
  const containerRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [isHovered, setIsHovered] = useState(false);

  const config = useMemo(() => {
    const presetConfig = props.preset && PRESETS[props.preset] ? PRESETS[props.preset] : {};
    return mergeConfigs(DEFAULT_CONFIG, presetConfig, props) as Required<GradualBlurProps>;
  }, [props]);

  const responsiveHeight = useResponsiveDimension(config.responsive, config, 'height');
  const responsiveWidth = useResponsiveDimension(config.responsive, config, 'width');

  const isVisible = useIntersectionObserver(containerRef, config.animated === 'scroll');

  const blurDivs = useMemo(() => {
    const divs: React.ReactNode[] = [];
    const increment = 100 / config.divCount;
    const currentStrength =
      isHovered && config.hoverIntensity ? config.strength * config.hoverIntensity : config.strength;

    const curveFunc = CURVE_FUNCTIONS[config.curve] || CURVE_FUNCTIONS.linear;

    for (let i = 1; i <= config.divCount; i++) {
      let progress = i / config.divCount;
      progress = curveFunc(progress);

      let blurValue: number;
      if (config.exponential) {
        blurValue = Number(Math.pow(2, progress * 4)) * 0.0625 * currentStrength;
      } else {
        blurValue = 0.0625 * (progress * config.divCount + 1) * currentStrength;
      }

      const p1 = Math.round((increment * i - increment) * 10) / 10;
      const p2 = Math.round(increment * i * 10) / 10;
      const p3 = Math.round((increment * i + increment) * 10) / 10;
      const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;

      const direction = getGradientDirection(config.position);

      const divStyle: CSSProperties = {
        maskImage: `linear-gradient(${direction}, ${gradient})`,
        WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
        backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
        opacity: config.opacity,
        transition:
          config.animated && config.animated !== 'scroll'
            ? `backdrop-filter ${config.duration} ${config.easing}`
            : undefined
      };

      divs.push(<div key={i} className="absolute inset-0" style={divStyle} />);
    }

    return divs;
  }, [config, isHovered]);

  const containerStyle: CSSProperties = useMemo(() => {
    const isVertical = ['top', 'bottom'].includes(config.position);
    const isHorizontal = ['left', 'right'].includes(config.position);
    const isPageTarget = config.target === 'page';

    const baseStyle: CSSProperties = {
      position: isPageTarget ? 'fixed' : 'absolute',
      pointerEvents: config.hoverIntensity ? 'auto' : 'none',
      opacity: isVisible ? 1 : 0,
      transition: config.animated ? `opacity ${config.duration} ${config.easing}` : undefined,
      zIndex: isPageTarget ? config.zIndex + 100 : config.zIndex,
      ...config.style
    };

    if (isVertical) {
      baseStyle.height = responsiveHeight;
      baseStyle.width = responsiveWidth || '100%';
      baseStyle[config.position] = 0;
      baseStyle.left = 0;
      baseStyle.right = 0;
    } else if (isHorizontal) {
      baseStyle.width = responsiveWidth || responsiveHeight;
      baseStyle.height = '100%';
      baseStyle[config.position] = 0;
      baseStyle.top = 0;
      baseStyle.bottom = 0;
    }

    return baseStyle;
  }, [config, responsiveHeight, responsiveWidth, isVisible]);

  const { hoverIntensity, animated, onAnimationComplete, duration } = config as any;
  useEffect(() => {
    if (isVisible && animated === 'scroll' && onAnimationComplete) {
      const t = setTimeout(() => onAnimationComplete(), parseFloat(duration) * 1000);
      return () => clearTimeout(t);
    }
  }, [isVisible, animated, onAnimationComplete, duration]);

  return (
    <div
      ref={containerRef}
      className={`gradual-blur relative isolate ${config.target === 'page' ? 'gradual-blur-page' : 'gradual-blur-parent'} ${config.className}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="relative w-full h-full">{blurDivs}</div>
      {props.children && <div className="relative">{props.children}</div>}
    </div>
  );
};

const GradualBlurMemo = React.memo(GradualBlur);
GradualBlurMemo.displayName = 'GradualBlur';
(GradualBlurMemo as any).PRESETS = PRESETS;
(GradualBlurMemo as any).CURVE_FUNCTIONS = CURVE_FUNCTIONS;
export default GradualBlurMemo;

const injectStyles = () => {
  if (typeof document === 'undefined') return;
  const id = 'gradual-blur-styles';
  if (document.getElementById(id)) return;
  const el = document.createElement('style');
  el.id = id;
  el.textContent = `.gradual-blur{pointer-events:none;transition:opacity .3s ease-out}.gradual-blur-inner{pointer-events:none}`;
  document.head.appendChild(el);
};
if (typeof document !== 'undefined') {
  injectStyles();
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/gradual-blur.tsx
git commit -m "feat: port React Bits GradualBlur for the slider's top-edge mask"
```

---

### Task 4: Port Motion Primitives `TextEffect` (body / small text)

**Files:**
- Create: `components/landing/text-effect.tsx`

**Interfaces:**
- Produces: named export `TextEffect` — `{ children: string; per?: 'word'|'char'|'line'; as?:
  keyof React.JSX.IntrinsicElements; preset?: 'blur'|'fade-in-blur'|'scale'|'fade'|'slide'; delay?:
  number; trigger?: boolean; className?: string; ... }` (full prop list below). Externally
  controlled via the `trigger` boolean prop — Task 7 pairs it with `useInView` from `motion/react`
  to gate the reveal until the section scrolls into view. `children` must be a plain `string` (not
  JSX) — Task 7's pain points render multiple adjacent `<TextEffect as="span">` calls to combine
  plain and emphasized text, since this component can't take mixed JSX children.
- Consumes: `cn` from `@/lib/utils` (already exists, confirmed).

- [ ] **Step 1: Write `components/landing/text-effect.tsx`** (ported verbatim from
  `ibelick/motion-primitives`, `components/core/text-effect.tsx`)

```tsx
'use client';
import { cn } from '@/lib/utils';
import {
  AnimatePresence,
  motion
} from 'motion/react';
import type {
  TargetAndTransition,
  Transition,
  Variant,
  Variants,
} from 'motion/react'
import React from 'react';

export type PresetType = 'blur' | 'fade-in-blur' | 'scale' | 'fade' | 'slide';

export type PerType = 'word' | 'char' | 'line';

export type TextEffectProps = {
  children: string;
  per?: PerType;
  as?: keyof React.JSX.IntrinsicElements;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: PresetType;
  delay?: number;
  speedReveal?: number;
  speedSegment?: number;
  trigger?: boolean;
  onAnimationComplete?: () => void;
  onAnimationStart?: () => void;
  segmentWrapperClassName?: string;
  containerTransition?: Transition;
  segmentTransition?: Transition;
  style?: React.CSSProperties;
};

const defaultStaggerTimes: Record<PerType, number> = {
  char: 0.03,
  word: 0.05,
  line: 0.1,
};

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
  exit: { opacity: 0 },
};

const presetVariants: Record<
  PresetType,
  { container: Variants; item: Variants }
> = {
  blur: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, filter: 'blur(12px)' },
      visible: { opacity: 1, filter: 'blur(0px)' },
      exit: { opacity: 0, filter: 'blur(12px)' },
    },
  },
  'fade-in-blur': {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
      exit: { opacity: 0, y: 20, filter: 'blur(12px)' },
    },
  },
  scale: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0 },
    },
  },
  fade: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 },
    },
  },
  slide: {
    container: defaultContainerVariants,
    item: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
  },
};

const AnimationComponent: React.FC<{
  segment: string;
  variants: Variants;
  per: 'line' | 'word' | 'char';
  segmentWrapperClassName?: string;
}> = React.memo(({ segment, variants, per, segmentWrapperClassName }) => {
  const content =
    per === 'line' ? (
      <motion.span variants={variants} className='block'>
        {segment}
      </motion.span>
    ) : per === 'word' ? (
      <motion.span
        aria-hidden='true'
        variants={variants}
        className='inline-block whitespace-pre'
      >
        {segment}
      </motion.span>
    ) : (
      <motion.span className='inline-block whitespace-pre'>
        {segment.split('').map((char, charIndex) => (
          <motion.span
            key={`char-${charIndex}`}
            aria-hidden='true'
            variants={variants}
            className='inline-block whitespace-pre'
          >
            {char}
          </motion.span>
        ))}
      </motion.span>
    );

  if (!segmentWrapperClassName) {
    return content;
  }

  const defaultWrapperClassName = per === 'line' ? 'block' : 'inline-block';

  return (
    <span className={cn(defaultWrapperClassName, segmentWrapperClassName)}>
      {content}
    </span>
  );
});

AnimationComponent.displayName = 'AnimationComponent';

const splitText = (text: string, per: PerType) => {
  if (per === 'line') return text.split('\n');
  return text.split(/(\s+)/);
};

const hasTransition = (
  variant?: Variant
): variant is TargetAndTransition & { transition?: Transition } => {
  if (!variant) return false;
  return (
    typeof variant === 'object' && 'transition' in variant
  );
};

const createVariantsWithTransition = (
  baseVariants: Variants,
  transition?: Transition & { exit?: Transition }
): Variants => {
  if (!transition) return baseVariants;

  const { exit: _, ...mainTransition } = transition;

  return {
    ...baseVariants,
    visible: {
      ...baseVariants.visible,
      transition: {
        ...(hasTransition(baseVariants.visible)
          ? baseVariants.visible.transition
          : {}),
        ...mainTransition,
      },
    },
    exit: {
      ...baseVariants.exit,
      transition: {
        ...(hasTransition(baseVariants.exit)
          ? baseVariants.exit.transition
          : {}),
        ...mainTransition,
        staggerDirection: -1,
      },
    },
  };
};

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  variants,
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  onAnimationComplete,
  onAnimationStart,
  segmentWrapperClassName,
  containerTransition,
  segmentTransition,
  style,
}: TextEffectProps) {
  const segments = splitText(children, per);
  const MotionTag = motion[as as keyof typeof motion] as typeof motion.div;

  const baseVariants = preset
    ? presetVariants[preset]
    : { container: defaultContainerVariants, item: defaultItemVariants };

  const stagger = defaultStaggerTimes[per] / speedReveal;

  const baseDuration = 0.3 / speedSegment;

  const customStagger = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.staggerChildren
    : undefined;

  const customDelay = hasTransition(variants?.container?.visible ?? {})
    ? (variants?.container?.visible as TargetAndTransition).transition
        ?.delayChildren
    : undefined;

  const computedVariants = {
    container: createVariantsWithTransition(
      variants?.container || baseVariants.container,
      {
        staggerChildren: customStagger ?? stagger,
        delayChildren: customDelay ?? delay,
        ...containerTransition,
        exit: {
          staggerChildren: customStagger ?? stagger,
          staggerDirection: -1,
        },
      }
    ),
    item: createVariantsWithTransition(variants?.item || baseVariants.item, {
      duration: baseDuration,
      ...segmentTransition,
    }),
  };

  return (
    <AnimatePresence mode='popLayout'>
      {trigger && (
        <MotionTag
          initial='hidden'
          animate='visible'
          exit='exit'
          variants={computedVariants.container}
          className={className}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          style={style}
        >
          {per !== 'line' ? <span className='sr-only'>{children}</span> : null}
          {segments.map((segment, index) => (
            <AnimationComponent
              key={`${per}-${index}-${segment}`}
              segment={segment}
              variants={computedVariants.item}
              per={per}
              segmentWrapperClassName={segmentWrapperClassName}
            />
          ))}
        </MotionTag>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors. (Confirms `motion/react` resolves from the already-installed `motion`
package and `cn` resolves from `@/lib/utils`.)

- [ ] **Step 3: Commit**

```bash
git add components/landing/text-effect.tsx
git commit -m "feat: port Motion Primitives TextEffect for body-text reveals"
```

---

### Task 5: `content/problem.ts`

**Files:**
- Create: `content/problem.ts`

**Interfaces:**
- Produces: `problemHeading: { eyebrow: string; heading: string }`, `problemStats: { value: string;
  label: string }[]`, `problemStatsSource: string`, `painPoints: { text: string; emphasis: string
  }[]`, `compareSlider: { label: string; generic: CompareMock; boreas: CompareMock }` where
  `CompareMock = { eyebrow: string; heading: string; body: string; ctaLabel: string }`. Task 6 and
  Task 7 both import from this file.

- [ ] **Step 1: Write `content/problem.ts`**

```ts
export const problemHeading = {
  eyebrow: "El problema",
  heading: "Tus pacientes ya están buscando. ¿Qué encuentran?",
};

export type ProblemStat = {
  value: string;
  label: string;
};

export const problemStats: ProblemStat[] = [
  {
    value: "82%",
    label: "de los pacientes busca y evalúa tu presencia en línea antes de agendar su primera cita.",
  },
  {
    value: "40%",
    label: "de las citas y consultas ocurren fuera del horario de oficina. Tu web las captura 24/7.",
  },
];

export const problemStatsSource =
  "Accenture Health Consumer Survey · Kyruus Care Access Benchmark Report";

export type PainPoint = {
  text: string;
  emphasis: string;
};

export const painPoints: PainPoint[] = [
  {
    text: "Tu paciente te encuentra a las 11 de la noche, pero tu web sigue mostrando la misma información de hace dos años.",
    emphasis: "sigue mostrando la misma información de hace dos años",
  },
  {
    text: "Contestas mensajes de curiosos mientras el paciente decidido ya agendó con alguien más.",
    emphasis: "el paciente decidido ya agendó con alguien más",
  },
  {
    text: "Tienes buenas reseñas, pero nada en tu presencia digital las convierte en una cita agendada.",
    emphasis: "las convierte en una cita agendada",
  },
];

export type CompareMock = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
};

export const compareSlider: {
  label: string;
  generic: CompareMock;
  boreas: CompareMock;
} = {
  label: "Genérico vs. Boreas",
  generic: {
    eyebrow: "Sitio genérico",
    heading: "Bienvenido a nuestro consultorio",
    body: "Atendemos con calidad y profesionalismo.",
    ctaLabel: "Contáctenos",
  },
  boreas: {
    eyebrow: "Boreas",
    heading: "Tu presencia digital, abierta las 24 horas.",
    body: "Convierte cada búsqueda en un paciente agendado.",
    ctaLabel: "Quiero mi presencia digital",
  },
};
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add content/problem.ts
git commit -m "feat: add Problema section content (stats, pain points, compare-slider copy)"
```

---

### Task 6: `ProblemCompareSlider` — pinned teaser with the genérico-vs-Boreas slider

**Files:**
- Create: `components/landing/problem-compare-slider.tsx`

**Interfaces:**
- Consumes: `ImgComparisonSlider` from `@img-comparison-slider/react` (Task 1), `GradualBlur`
  (Task 3), `InteractiveHoverButton` (existing, unchanged), `compareSlider` from
  `@/content/problem` (Task 5).
- Produces: named export `ProblemCompareSlider` (no props) — Task 7 renders this as the first thing
  inside the Problema `SectionFrame`, before the heading.

- [ ] **Step 1: Write `components/landing/problem-compare-slider.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ImgComparisonSlider } from "@img-comparison-slider/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GradualBlur from "./gradual-blur";
import { InteractiveHoverButton } from "./interactive-hover-button";
import { compareSlider } from "@/content/problem";

gsap.registerPlugin(ScrollTrigger);

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
      <div className="flex items-center gap-1.5 border-b border-border bg-elevated px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-clinical/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-clinical/40" />
        <span className="h-2.5 w-2.5 rounded-full bg-clinical/40" />
      </div>
      <div className="h-[calc(100%-33px)] w-full">{children}</div>
    </div>
  );
}

function GenericMock() {
  const { eyebrow, heading, body, ctaLabel } = compareSlider.generic;
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-3 bg-[#EDEDED] px-6 py-8">
      <p className="text-xs text-[#8A8A8A]">{eyebrow}</p>
      <h3 className="text-2xl font-bold leading-tight text-[#3A3A3A]">{heading}</h3>
      <p className="max-w-xs text-sm text-[#6B6B6B]">{body}</p>
      <span className="mt-2 inline-flex items-center rounded-sm bg-[#3A3A3A] px-4 py-2 text-xs font-bold uppercase text-white">
        {ctaLabel}
      </span>
    </div>
  );
}

function BoreasMock() {
  const { eyebrow, heading, body, ctaLabel } = compareSlider.boreas;
  return (
    <div className="flex h-full w-full flex-col items-start justify-center gap-3 bg-background px-6 py-8">
      <p className="text-xs font-medium text-accent">{eyebrow}</p>
      <h3 className="font-display text-2xl font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
        {heading}
      </h3>
      <p className="max-w-xs text-sm leading-relaxed text-muted">{body}</p>
      <InteractiveHoverButton className="mt-2 min-h-9 px-4 text-xs">
        {ctaLabel}
      </InteractiveHoverButton>
    </div>
  );
}

export function ProblemCompareSlider() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useGSAP(
    () => {
      if (reducedMotion || !wrapperRef.current) return;

      // Pins the slider at whatever screen position its bottom edge occupies
      // the moment that edge touches the viewport bottom — the standard GSAP
      // recipe for "lock to where it already is" rather than "lock to the
      // top", which is what makes it read as glued to the bottom of the
      // screen instead of sticking under a nav bar. `end` controls how much
      // scroll distance it stays pinned for before releasing into its
      // resting position in the section layout below — tuned visually in
      // Task 9, this starting value is a reasonable first pass.
      const trigger = ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "bottom bottom",
        end: "+=100%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      });

      return () => trigger.kill();
    },
    { dependencies: [reducedMotion] }
  );

  return (
    <div className={reducedMotion ? "" : "-mt-24 sm:-mt-32"}>
      <div ref={wrapperRef} className="relative mx-auto max-w-[900px] px-4 sm:px-6">
        {!reducedMotion && (
          <GradualBlur position="top" height="3rem" strength={2.5} />
        )}
        <div className="aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-xl)] border border-border shadow-[var(--shadow)] sm:aspect-[16/8]">
          <ImgComparisonSlider className="h-full w-full">
            <div slot="first" className="h-full w-full">
              <BrowserFrame>
                <GenericMock />
              </BrowserFrame>
            </div>
            <div slot="second" className="h-full w-full">
              <BrowserFrame>
                <BoreasMock />
              </BrowserFrame>
            </div>
          </ImgComparisonSlider>
        </div>
        <p className="mt-3 text-center text-xs text-clinical">{compareSlider.label}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors. (Confirms `slot="first"`/`slot="second"` type-check as valid
`HTMLAttributes` and `ImgComparisonSlider`'s types resolve from Task 1's install.)

- [ ] **Step 3: Commit**

```bash
git add components/landing/problem-compare-slider.tsx
git commit -m "feat: add pinned genérico-vs-Boreas comparison slider teaser"
```

---

### Task 7: Rewrite `ProblemSection`

**Files:**
- Modify: `components/landing/problem-section.tsx`

**Interfaces:**
- Consumes: `SectionFrame` (unchanged), `ProblemCompareSlider` (Task 6), `SplitText` (Task 2),
  `TextEffect` (Task 4), `GsapCounter` (existing, unchanged), `sectionIds` from `@/content/site`,
  `problemHeading`/`problemStats`/`problemStatsSource`/`painPoints` from `@/content/problem`
  (Task 5).

- [ ] **Step 1: Replace `components/landing/problem-section.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { useInView } from "motion/react";
import { SectionFrame } from "./landing-sections";
import { SplitText } from "./split-text";
import { TextEffect } from "./text-effect";
import { GsapCounter } from "./gsap-counter";
import { ProblemCompareSlider } from "./problem-compare-slider";
import { sectionIds } from "@/content/site";
import {
  problemHeading,
  problemStats,
  problemStatsSource,
  painPoints,
} from "@/content/problem";

export function ProblemSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const inView = useInView(textRef, { once: true, margin: "-100px" });

  return (
    <SectionFrame id={sectionIds.problema} className="border-t border-line">
      <ProblemCompareSlider />

      <div ref={textRef} className="mx-auto max-w-[1460px] px-4 pt-16 sm:px-6 lg:px-10">
        <TextEffect
          as="p"
          per="word"
          preset="fade"
          trigger={inView}
          className="text-sm font-medium text-accent"
        >
          {problemHeading.eyebrow}
        </TextEffect>

        <SplitText
          text={problemHeading.heading}
          tag="h2"
          splitType="words"
          textAlign="left"
          className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground"
        />

        <div className="mt-14 grid gap-8 sm:grid-cols-2">
          {problemStats.map((stat, i) => {
            const suffix = stat.value.replace(/[\d.]/g, "");
            return (
              <div key={stat.value} className="border-t-2 border-accent pt-5">
                <span className="block font-display text-[clamp(2.6rem,5vw,4rem)] font-medium leading-none text-foreground">
                  {inView ? (
                    <GsapCounter
                      to={parseFloat(stat.value)}
                      suffix={suffix}
                      delay={i * 0.15}
                    />
                  ) : (
                    `0${suffix}`
                  )}
                </span>
                <TextEffect
                  as="p"
                  per="word"
                  preset="fade"
                  trigger={inView}
                  delay={0.3 + i * 0.15}
                  className="mt-4 text-base leading-relaxed text-muted"
                >
                  {stat.label}
                </TextEffect>
              </div>
            );
          })}
        </div>

        <TextEffect
          as="p"
          per="word"
          preset="fade"
          trigger={inView}
          delay={0.6}
          className="mt-6 text-xs text-clinical"
        >
          {problemStatsSource}
        </TextEffect>

        <div className="mt-16 border-t border-line pt-14">
          {painPoints.map((point, i) => {
            const [before, after] = point.text.split(point.emphasis);
            const base = 0.8 + i * 0.18;
            return (
              <p
                key={point.emphasis}
                className="border-b border-line py-5 text-[15px] leading-relaxed text-muted last:border-b-0"
              >
                <TextEffect as="span" per="word" preset="fade" trigger={inView} delay={base}>
                  {before}
                </TextEffect>
                <TextEffect
                  as="span"
                  per="word"
                  preset="fade"
                  trigger={inView}
                  delay={base + 0.1}
                  className="font-medium text-foreground"
                >
                  {point.emphasis}
                </TextEffect>
                <TextEffect as="span" per="word" preset="fade" trigger={inView} delay={base + 0.2}>
                  {after}
                </TextEffect>
              </p>
            );
          })}
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
git add components/landing/problem-section.tsx
git commit -m "feat: assemble Problema section — slider teaser, heading, stats, pain points"
```

---

### Task 8: Remove the now-unused `problema` stub from `content/site.ts`

**Files:**
- Modify: `content/site.ts`

**Interfaces:**
- Produces: `sectionStubs` type narrows from `Record<Exclude<SectionId, "hero">, ...>` to
  `Record<Exclude<SectionId, "hero" | "problema">, ...>` — the remaining stub sections (Epics 3–6)
  are unaffected.

- [ ] **Step 1: Edit `content/site.ts`**

Replace:

```ts
export const sectionStubs: Record<Exclude<SectionId, "hero">, { eyebrow: string; heading: string }> = {
  [sectionIds.problema]: {
    eyebrow: "Epic 2",
    heading: "El problema — pendiente de pulir",
  },
  [sectionIds.motores]: {
```

with:

```ts
export const sectionStubs: Record<
  Exclude<SectionId, "hero" | "problema">,
  { eyebrow: string; heading: string }
> = {
  [sectionIds.motores]: {
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: exits 0, no errors (confirms `problem-section.tsx` no longer references
`sectionStubs[sectionIds.problema]` after Task 7).

- [ ] **Step 3: Commit**

```bash
git add content/site.ts
git commit -m "chore: remove problema from sectionStubs now that Epic 2 has real content"
```

---

### Task 9: Final build/lint/visual verification

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
curl -s http://localhost:3000 -o /tmp/boreas-v4-epic2-smoke.html
kill $DEV_PID
grep -o 'img-comparison-slider' /tmp/boreas-v4-epic2-smoke.html
grep -o 'Tus pacientes ya están buscando' /tmp/boreas-v4-epic2-smoke.html
```
Expected: both `grep` commands print at least one match.

- [ ] **Step 4: Visual check — slider teaser peeking under the Hero**

Open `http://localhost:3000` in the browser preview at desktop width, no scroll. Confirm by eye: a
sliver of the comparison slider (browser-frame mockup) is visible peeking above the fold right
below the Hero's content, its top edge blurred/faded rather than a hard cut.

- [ ] **Step 5: Visual check — pin behavior while scrolling**

Scroll down slowly from the top. Confirm by eye: the slider locks in place near the bottom of the
viewport for a stretch of scroll (rather than scrolling away immediately), then releases and
settles into its resting position above the "Tus pacientes ya están buscando…" heading. If the pin
releases too early/late or the peek offset looks wrong at this viewport size, adjust
`problem-compare-slider.tsx`'s `-mt-24 sm:-mt-32` offset and the `ScrollTrigger.create`'s
`start`/`end` values, then re-check.

- [ ] **Step 6: Visual check — drag interaction, stats, pain points**

Drag the slider handle left/right — confirm the generic mockup and Boreas mockup swap smoothly.
Scroll further down — confirm the heading reveals per-word, the two stat numbers count up, and the
three pain points fade in with their bold phrase visually distinct from the surrounding text.

- [ ] **Step 7: Visual check — `prefers-reduced-motion`**

Re-run with the OS/browser "reduce motion" preference enabled (or emulate via DevTools). Confirm:
no pin/scroll-jack (slider sits in normal flow, no `-mt` peek offset), heading/stats/pain-points
are all immediately visible with no stagger.

- [ ] **Step 8: Commit** (only if Steps 4–7 required follow-up fixes; otherwise nothing to commit)

## Self-Review Notes

- **Spec coverage:** slider-first teaser order, pin mechanic (bottom-bottom start, tunable end),
  `img-comparison-slider` with JSX-slotted mini mockups, `GradualBlur` top mask, `SplitText` for
  headings, `TextEffect` for body/small text, 2 stats + citable source, 3 pain points, reduced-motion
  static equivalents — all covered across Tasks 1–9. `sectionStubs` cleanup (Task 8) wasn't in the
  design spec explicitly but is required for `tsc` to pass once Task 7 stops consuming it — added
  to keep the build green, not scope creep.
- **Placeholder scan:** no TBD/TODO; every step has complete, real code. Task 9's Steps 4–7 are
  visual-QA steps (matching Epic 1's Task 6 precedent in this repo), not placeholders — they
  describe concrete pass/fail criteria to check by eye, same pattern already established.
- **Type consistency:** `ProblemCompareSlider` (Task 6, no props) matches its call site in Task 7
  (`<ProblemCompareSlider />`). `compareSlider`/`problemHeading`/`problemStats`/
  `problemStatsSource`/`painPoints` field names in `content/problem.ts` (Task 5) match exactly how
  Tasks 6–7 destructure them. `TextEffect`'s `trigger`/`delay`/`as`/`per`/`preset` prop names (Task
  4) match every call site in Task 7. `SplitText`'s `text`/`tag`/`splitType`/`textAlign`/`className`
  props (Task 2) match its one call site in Task 7.
