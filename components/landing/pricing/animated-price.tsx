"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { formatMxn } from "@/lib/pricing";

export function AnimatedPrice({
  value,
  className = "",
  prefix = "",
  suffix = "",
}: {
  value: number | null;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevValueRef = useRef<number | null>(value);

  useEffect(() => {
    const el = nodeRef.current;
    if (!el) return;

    if (value === null) {
      el.textContent = `${prefix}Cotización${suffix}`.trim();
      prevValueRef.current = null;
      return;
    }

    const startValue = prevValueRef.current ?? value;
    prevValueRef.current = value;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || startValue === value) {
      el.textContent = `${prefix}${formatMxn(value)}${suffix}`;
      return;
    }

    const state = { current: startValue };

    const tween = gsap.to(state, {
      current: value,
      duration: 0.4,
      ease: "power3.out",
      onUpdate: () => {
        el.textContent = `${prefix}${formatMxn(Math.round(state.current))}${suffix}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, prefix, suffix]);

  if (value === null) {
    return <span ref={nodeRef} className={className}>{`${prefix}Cotización${suffix}`.trim()}</span>;
  }

  return (
    <span ref={nodeRef} className={className}>
      {`${prefix}${formatMxn(value)}${suffix}`}
    </span>
  );
}
