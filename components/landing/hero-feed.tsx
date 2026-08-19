"use client";

// Not wired into the Hero yet — parked here for a later Epic as a
// "these could be your notifications" proof: Boreas-built site → more
// patients/citas, shown as a live activity feed. Keep this standalone so
// it drops back in with a single import + render.

import { useEffect, useState } from "react";
import { CalendarCheck, ClipboardCheck, MessageCircle, Star, UserPlus, type LucideIcon } from "lucide-react";
import { AnimatedList } from "@/components/ui/animated-list";
import { feedEvents, type Accent, type FeedEvent } from "@/content/hero";

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

function AccentBadge({ accent, Icon }: { accent: Accent; Icon: LucideIcon }) {
  return (
    <span
      className="flex size-7 shrink-0 items-center justify-center rounded-full sm:size-8"
      style={{ backgroundColor: `color-mix(in oklch, ${accentVar[accent]} 18%, transparent)` }}
    >
      <Icon className="size-3.5 sm:size-4" style={{ color: accentVar[accent] }} />
    </span>
  );
}

function FeedItem({ event }: { event: FeedEvent }) {
  const Icon = feedIcon[event.icon];
  return (
    <div className="flex w-full items-center gap-2.5 rounded-[var(--radius-md)] border border-white/10 bg-black/50 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
      <AccentBadge accent={event.accent} Icon={Icon} />
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-white sm:text-sm">{event.title}</p>
        <p className="truncate text-[11px] text-white/50 sm:text-xs">{event.meta}</p>
      </div>
    </div>
  );
}

const FEED_ITEM_DELAY = 1275;

// Repeats the 6 events into a long stream (magicui's own hero demo does the
// same) so the list keeps feeding new items for a good while instead of
// stopping after one pass through — AnimatedList only advances forward and
// never loops on its own.
const feedStream = Array.from({ length: 8 }, () => feedEvents).flat();

export function HeroFeed() {
  // AnimatedList's index stops advancing once it runs out of children;
  // remounting via `key` on a timer is what makes it pick back up once the
  // (long) stream above is exhausted.
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const total = feedStream.length * FEED_ITEM_DELAY + 2600;
    const timeout = setTimeout(() => setCycle((c) => c + 1), total);
    return () => clearTimeout(timeout);
  }, [cycle]);

  return (
    <div
      className="h-full w-full overflow-hidden"
      style={{
        maskImage: "linear-gradient(to top, transparent 0%, black 20%)",
        WebkitMaskImage: "linear-gradient(to top, transparent 0%, black 20%)",
      }}
    >
      <AnimatedList key={cycle} delay={FEED_ITEM_DELAY} maxItems={6} className="gap-2 sm:gap-3">
        {feedStream.map((event, i) => (
          <FeedItem key={i} event={event} />
        ))}
      </AnimatedList>
    </div>
  );
}
