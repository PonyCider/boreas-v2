"use client";

import { forwardRef, useEffect, useState } from "react";
import { Activity, Brain, CalendarCheck, NotebookPen, type LucideIcon } from "lucide-react";
import CardSwap, { Card } from "./card-swap";
import { motorScreens, heroContent, type Accent, type MotorScreen } from "@/content/hero";

const accentVar: Record<Accent, string> = {
  amber: "var(--c-amber)",
  mint: "var(--c-mint)",
  lav: "var(--c-lav)",
  rose: "var(--c-rose)",
};

const motorIcon: Record<MotorScreen["icon"], LucideIcon> = {
  brain: Brain,
  "notebook-pen": NotebookPen,
  activity: Activity,
  "calendar-check": CalendarCheck,
};

// Stock reactbits Card chrome (bg-black, border-white, banner + content
// split) blended with Boreas's own accent per motor. Content is just the
// motor's icon for now — Epic 3 swaps this area for the real motor visuals
// once they exist.
function MotorCardContent({ screen }: { screen: MotorScreen }) {
  const Icon = motorIcon[screen.icon];
  const accent = accentVar[screen.accent];
  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <Icon className="h-4 w-4" style={{ color: accent }} />
        <span className="text-sm font-medium text-white">{screen.title}</span>
      </div>
      <div
        className="flex flex-1 items-center justify-center"
        style={{
          background: `radial-gradient(circle at 50% 30%, color-mix(in oklch, ${accent} 35%, transparent), black 70%)`,
        }}
      >
        <Icon className="h-16 w-16" style={{ color: accent, opacity: 0.18 }} />
      </div>
    </>
  );
}

// CardSwap's own responsive scaling (baked into card-swap.tsx as
// max-[768px]/max-[480px] transform scales) assumes a single base size
// shrunk down — combined with our much bigger desktop size that pushes the
// scaled-down result off-center and off-screen on narrow viewports. Sizing
// explicitly per breakpoint via JS avoids fighting that transform.
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

export const HeroVisual = forwardRef<HTMLDivElement>((_, ref) => {
  const isDesktop = useIsDesktop();
  const size = isDesktop
    ? { width: 460, height: 560, cardDistance: 70, verticalDistance: 85, box: "h-[560px] w-[460px]" }
    : { width: 300, height: 360, cardDistance: 46, verticalDistance: 56, box: "h-[360px] w-[300px]" };

  return (
    <div
      ref={ref}
      className="relative flex w-full flex-col items-end gap-4 lg:absolute lg:bottom-[-140px] lg:right-0 lg:w-auto lg:pr-16 xl:pr-28"
    >
      {/* card-swap.tsx bakes in its own translate-x-25% below 768px (tuned
          for reactbits' own demo layout) which otherwise pushes the fan
          well past the wrapper's right edge on narrow viewports — pull it
          back in to compensate. */}
      <div className={`relative shrink-0 -translate-x-[100px] lg:translate-x-0 ${size.box}`}>
        <CardSwap
          width={size.width}
          height={size.height}
          cardDistance={size.cardDistance}
          verticalDistance={size.verticalDistance}
          delay={3200}
          skewAmount={6}
        >
          {motorScreens.map((screen, i) => (
            <Card key={i} className="flex h-full flex-col overflow-hidden">
              <MotorCardContent screen={screen} />
            </Card>
          ))}
        </CardSwap>
      </div>

      <p className="text-xs text-clinical lg:hidden">{heroContent.proofBadge}</p>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
