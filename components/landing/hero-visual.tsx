"use client";

import { forwardRef, useEffect, useState } from "react";
import {
  Activity,
  Brain,
  CalendarCheck,
  ClipboardCheck,
  MessageCircle,
  NotebookPen,
  Star,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import CardSwap, { Card } from "./card-swap";
import { AnimatedList } from "@/components/ui/animated-list";
import { motorScreens, feedEvents, heroContent, type Accent, type FeedEvent, type MotorScreen } from "@/content/hero";

const accentVar: Record<Accent, string> = {
  amber: "var(--c-amber)",
  mint: "var(--c-mint)",
  lav: "var(--c-lav)",
  rose: "var(--c-rose)",
};

const feedIcon: Record<FeedEvent["icon"], LucideIcon> = {
  star: Star,
  "calendar-check": CalendarCheck,
  "clipboard-check": ClipboardCheck,
  "message-circle": MessageCircle,
  "user-plus": UserPlus,
};

const motorIcon: Record<MotorScreen["icon"], LucideIcon> = {
  brain: Brain,
  "notebook-pen": NotebookPen,
  activity: Activity,
  "calendar-check": CalendarCheck,
};

function MotorCardContent({ screen }: { screen: MotorScreen }) {
  const Icon = motorIcon[screen.icon];
  return (
    <>
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
        <Icon className="h-4 w-4 text-white/70" />
        <span className="text-sm font-medium text-white">{screen.title}</span>
      </div>
      <div
        className="flex flex-1 items-center justify-center"
        style={{
          background: `radial-gradient(circle at 50% 30%, color-mix(in oklch, ${accentVar[screen.accent]} 35%, transparent), black 70%)`,
        }}
      >
        <Icon className="h-16 w-16 text-white/10" />
      </div>
    </>
  );
}

function AccentBadge({ accent, Icon }: { accent: Accent; Icon: LucideIcon }) {
  return (
    <span
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: `color-mix(in oklch, ${accentVar[accent]} 18%, transparent)` }}
    >
      <Icon className="h-4 w-4" style={{ color: accentVar[accent] }} />
    </span>
  );
}

function FeedItem({ event }: { event: FeedEvent }) {
  const Icon = feedIcon[event.icon];
  return (
    <div className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-sm">
      <AccentBadge accent={event.accent} Icon={Icon} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{event.title}</p>
        <p className="text-xs text-white/50">{event.meta}</p>
      </div>
    </div>
  );
}

const FEED_ITEM_DELAY = 1700;

function HeroFeed() {
  // AnimatedList only plays forward once; remounting via `key` on a timer
  // is what makes the feed loop instead of freezing after the last item.
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const total = feedEvents.length * FEED_ITEM_DELAY + 2600;
    const timeout = setTimeout(() => setCycle((c) => c + 1), total);
    return () => clearTimeout(timeout);
  }, [cycle]);

  return (
    <div className="flex h-full w-full flex-col justify-end overflow-hidden">
      <AnimatedList key={cycle} delay={FEED_ITEM_DELAY} className="gap-3">
        {feedEvents.map((event, i) => (
          <FeedItem key={i} event={event} />
        ))}
      </AnimatedList>
    </div>
  );
}

export const HeroVisual = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-4 lg:items-end">
      <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-end lg:justify-end lg:pr-16">
        <div className="hidden h-[360px] w-[240px] lg:block">
          <HeroFeed />
        </div>

        <div className="relative h-[380px] w-[320px] shrink-0">
          <CardSwap width={320} height={380} cardDistance={60} verticalDistance={70} delay={3200} pauseOnHover skewAmount={6}>
            {motorScreens.map((screen, i) => (
              <Card key={i} className="flex h-full flex-col overflow-hidden">
                <MotorCardContent screen={screen} />
              </Card>
            ))}
          </CardSwap>
        </div>
      </div>

      <p className="text-xs text-clinical">{heroContent.proofBadge}</p>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
