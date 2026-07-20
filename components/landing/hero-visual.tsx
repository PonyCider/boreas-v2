"use client";

import { forwardRef } from "react";
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

export const HeroVisual = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-4">
      <div className="relative h-[380px] w-[320px] shrink-0">
        <CardSwap width={320} height={380} cardDistance={60} verticalDistance={70} delay={3200} pauseOnHover skewAmount={6}>
          {motorScreens.map((screen, i) => (
            <Card key={i} className="flex h-full flex-col overflow-hidden">
              <MotorCardContent screen={screen} />
            </Card>
          ))}
        </CardSwap>
      </div>

      <p className="text-xs text-clinical">{heroContent.proofBadge}</p>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
