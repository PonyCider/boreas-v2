"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface HeroIntroContextValue {
  introSettled: boolean;
  markIntroSettled: () => void;
}

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null);

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const [introSettled, setIntroSettled] = useState(false);

  function markIntroSettled() {
    setIntroSettled(true);
  }

  return (
    <HeroIntroContext.Provider value={{ introSettled, markIntroSettled }}>
      {children}
    </HeroIntroContext.Provider>
  );
}

// No provider in the tree means there's nothing to wait for (e.g. a page
// that doesn't render the cinematic Hero intro) — default to "settled" so
// consumers show immediately instead of waiting forever.
export function useHeroIntroSettled(): boolean {
  const ctx = useContext(HeroIntroContext);
  return ctx ? ctx.introSettled : true;
}

export function useMarkHeroIntroSettled(): () => void {
  const ctx = useContext(HeroIntroContext);
  return ctx ? ctx.markIntroSettled : () => {};
}
