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
import { GsapCounter } from "./gsap-counter";
import { motorScreens, feedEvents, heroContent, type Accent, type MotorScreen, type FeedEvent } from "@/content/hero";

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

const feedIcon: Record<FeedEvent["icon"], LucideIcon> = {
  star: Star,
  "calendar-check": CalendarCheck,
  "clipboard-check": ClipboardCheck,
  "message-circle": MessageCircle,
  "user-plus": UserPlus,
};

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

function MotorCard({ screen }: { screen: MotorScreen }) {
  const Icon = motorIcon[screen.icon];
  return (
    <Card
      className="flex flex-col justify-between p-5"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border)",
        borderRadius: "var(--radius-xl)",
      }}
    >
      <div className="flex items-center gap-3">
        <AccentBadge accent={screen.accent} Icon={Icon} />
        <p className="text-sm font-medium text-foreground">{screen.title}</p>
      </div>
      {screen.metric && (
        <p className="mt-4 text-3xl font-display text-foreground">
          <GsapCounter to={screen.metric.value} decimals={screen.metric.decimals} suffix={screen.metric.suffix} />
        </p>
      )}
      <p className="mt-2 text-sm text-muted">{screen.body}</p>
    </Card>
  );
}

function FeedItem({ event }: { event: FeedEvent }) {
  const Icon = feedIcon[event.icon];
  return (
    <div className="flex w-full items-center gap-3 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 shadow-[var(--shadow-sm)]">
      <AccentBadge accent={event.accent} Icon={Icon} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
        <p className="text-xs text-muted">{event.meta}</p>
      </div>
    </div>
  );
}

const FEED_ITEM_DELAY = 2200;

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
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <AnimatedList key={cycle} delay={FEED_ITEM_DELAY} className="gap-3">
        {feedEvents.map((event, i) => (
          <FeedItem key={i} event={event} />
        ))}
      </AnimatedList>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}

export const HeroVisual = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <div ref={ref} className="flex w-full flex-col items-center gap-4 lg:items-end">
      <div className="flex w-full flex-col items-center gap-6 lg:flex-row lg:items-stretch lg:justify-end">
        <div className="relative h-[260px] w-[220px] shrink-0">
          <CardSwap width={220} height={260} cardDistance={36} verticalDistance={44} delay={4200} pauseOnHover skewAmount={4}>
            {motorScreens.map((screen, i) => (
              <MotorCard key={i} screen={screen} />
            ))}
          </CardSwap>
        </div>

        <div className="hidden h-[300px] w-[220px] lg:block">
          <HeroFeed />
        </div>
      </div>

      <p className="text-xs text-clinical">{heroContent.proofBadge}</p>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
