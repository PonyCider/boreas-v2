"use client";

import { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

export function useTheaterProgress(actCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeActRef = useRef(0);
  const [activeAct, setActiveAct] = useState(0);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const nextAct = Math.min(
      actCount - 1,
      Math.max(0, Math.floor(progress * actCount)),
    );
    if (nextAct === activeActRef.current) return;
    activeActRef.current = nextAct;
    setActiveAct(nextAct);
  });

  return { trackRef, activeAct, scrollYProgress };
}
