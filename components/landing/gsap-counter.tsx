"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function GsapCounter({
  to,
  decimals = 0,
  suffix = "",
  duration = 1.4,
  delay = 0,
}: {
  to: number;
  decimals?: number;
  suffix?: string;
  duration?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const counter = { value: 0 };

    const tween = gsap.to(counter, {
      value: to,
      duration: prefersReduced ? 0 : duration,
      delay: prefersReduced ? 0 : delay,
      ease: "power2.out",
      onUpdate: () => {
        el.textContent = `${counter.value.toFixed(decimals)}${suffix}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [to, decimals, suffix, duration, delay]);

  return <span ref={ref}>{`${(0).toFixed(decimals)}${suffix}`}</span>;
}
