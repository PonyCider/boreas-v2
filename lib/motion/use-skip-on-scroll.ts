"use client";

import { useEffect, useState } from "react";

// One-time scroll detector for the Hero intro's skip behavior. Never calls
// preventDefault or otherwise delays the real scroll — it only observes.
export function useSkipOnScroll(): boolean {
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    if (skipped) return;
    const handleScroll = () => setSkipped(true);
    window.addEventListener("scroll", handleScroll, { once: true, passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [skipped]);

  return skipped;
}
