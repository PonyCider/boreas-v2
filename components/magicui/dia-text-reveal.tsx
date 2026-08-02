"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";

import { cn } from "@/lib/utils";

const DEFAULT_COLORS = ["#A94932", "#D2674A", "#E2A33C", "#276C5B", "#E0617E"];
const BAND_HALF = 17;
const SWEEP_START = -BAND_HALF;
const SWEEP_END = 100 + BAND_HALF;

const sweepEase = (t: number) =>
  t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;

function buildGradient(
  pos: number,
  colors: string[],
  textColor: string,
  isFirstReveal: boolean,
  revealFromTransparent: boolean
) {
  const bandStart = pos - BAND_HALF;
  const bandEnd = pos + BAND_HALF;

  if (bandStart >= 100) {
    return `linear-gradient(90deg, ${textColor}, ${textColor})`;
  }
  const n = colors.length;
  const parts: string[] = [];

  if (bandStart > 0)
    parts.push(`${textColor} 0%`, `${textColor} ${bandStart.toFixed(2)}%`);

  colors.forEach((c, i) => {
    const pct = n === 1 ? pos : bandStart + (i / (n - 1)) * BAND_HALF * 2;
    const clamped = Math.max(0, Math.min(100, pct));
    parts.push(`${c} ${clamped.toFixed(2)}%`);
  });

  const trailingColor = isFirstReveal && revealFromTransparent ? "transparent" : textColor;
  if (bandEnd < 100)
    parts.push(`${trailingColor} ${Math.max(0, bandEnd).toFixed(2)}%`, `${trailingColor} 100%`);

  return `linear-gradient(90deg, ${parts.join(", ")})`;
}

function measureWidths(el: HTMLElement, texts: string[]) {
  const ghost = el.cloneNode() as HTMLElement;
  Object.assign(ghost.style, {
    position: "absolute",
    visibility: "hidden",
    pointerEvents: "none",
    width: "auto",
    whiteSpace: "nowrap",
  });
  el.parentElement!.appendChild(ghost);
  const widths = texts.map((t) => {
    ghost.textContent = t;
    return ghost.getBoundingClientRect().width;
  });
  ghost.remove();
  return widths;
}

export interface DiaTextRevealProps extends Omit<
  HTMLMotionProps<"span">,
  "ref" | "children" | "style" | "animate" | "transition" | "color"
> {
  text: string | string[];
  colors?: string[];
  textColor?: string;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  repeatDelay?: number;
  startOnView?: boolean;
  once?: boolean;
  className?: string;
  fixedWidth?: boolean;
  revealFromTransparent?: boolean;
}

export function DiaTextReveal({
  text,
  colors = DEFAULT_COLORS,
  textColor = "var(--color-foreground, var(--ink, #1E1B18))",
  duration = 2.2,
  delay = 0.2,
  repeat = true,
  repeatDelay = 4,
  startOnView = true,
  once = false,
  className,
  fixedWidth = false,
  revealFromTransparent = true,
  ...props
}: DiaTextRevealProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);
  const isMulti = texts.length > 1;
  const prefersReducedMotion = useReducedMotion();

  const spanRef = useRef<HTMLSpanElement>(null);
  const [isFirstReveal, setIsFirstReveal] = useState(true);
  const isFirstRevealRef = useRef(true);

  const optsRef = useRef({
    colors,
    textColor,
    duration,
    delay,
    repeat,
    repeatDelay,
    texts,
    revealFromTransparent,
  });
  const indexRef = useRef(0);
  const hasPlayedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const playRef = useRef<() => void>(null!);
  const stopRef = useRef<(() => void) | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [measuredWidths, setMeasuredWidths] = useState<number[]>([]);

  const sweepPos = useMotionValue(SWEEP_START);
  const appearanceVersion = useMotionValue(0);

  const backgroundImage = useTransform([sweepPos, appearanceVersion], ([pos]) =>
    buildGradient(
      pos as number,
      optsRef.current.colors,
      optsRef.current.textColor,
      isFirstReveal,
      optsRef.current.revealFromTransparent
    )
  );

  useEffect(() => {
    optsRef.current = {
      colors,
      textColor,
      duration,
      delay,
      repeat,
      repeatDelay,
      texts,
      revealFromTransparent,
    };
    appearanceVersion.set(appearanceVersion.get() + 1);
  }, [
    appearanceVersion,
    colors,
    delay,
    duration,
    repeat,
    repeatDelay,
    revealFromTransparent,
    textColor,
    texts,
  ]);

  const isInView = useInView(spanRef, { once, amount: 0.1 });

  useEffect(() => {
    const el = spanRef.current;
    if (!el || !isMulti) return;
    setMeasuredWidths(measureWidths(el, texts));
  }, [isMulti, texts]);

  const play = useCallback(() => {
    const { duration, delay, repeat, repeatDelay, texts } = optsRef.current;

    sweepPos.set(SWEEP_START);

    const controls = animate(sweepPos, SWEEP_END, {
      duration,
      delay: isFirstRevealRef.current ? delay : 0,
      ease: sweepEase,
      onComplete() {
        isFirstRevealRef.current = false;
        setIsFirstReveal(false);
        if (!repeat) return;
        timerRef.current = setTimeout(() => {
          const next = (indexRef.current + 1) % texts.length;
          indexRef.current = next;
          setActiveIndex(next);
          playRef.current();
        }, repeatDelay * 1000);
      },
    });

    stopRef.current = () => controls.stop();
  }, [sweepPos]);

  useEffect(() => {
    playRef.current = play;
  }, [play]);

  useEffect(() => {
    if (prefersReducedMotion) {
      sweepPos.set(SWEEP_END);
      return;
    }
    if (startOnView && !isInView) return;
    if (once && hasPlayedRef.current) return;
    hasPlayedRef.current = true;
    play();

    return () => {
      stopRef.current?.();
      clearTimeout(timerRef.current);
    };
  }, [isInView, startOnView, once, play, prefersReducedMotion, sweepPos]);

  const fixedW =
    isMulti && fixedWidth && measuredWidths.length > 0
      ? Math.max(...measuredWidths)
      : undefined;

  const animatedW =
    isMulti && !fixedWidth && measuredWidths[activeIndex] != null
      ? measuredWidths[activeIndex]
      : undefined;

  return (
    <motion.span
      ref={spanRef}
      className={cn("align-bottom leading-[100%] text-inherit", className)}
      style={{
        transform: "translateY(-2px)",
        color: "transparent",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        backgroundSize: "100% 100%",
        backgroundImage,
        ...(isMulti && {
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
          verticalAlign: "text-center",
          ...(fixedW != null && { width: fixedW }),
        }),
      }}
      animate={animatedW != null ? { width: animatedW } : undefined}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      {...props}
    >
      {texts[activeIndex]}
    </motion.span>
  );
}
