"use client";

import { HelpCircle } from "lucide-react";
import { FloatingTooltip } from "@/components/unlumen-ui/floating-tooltip";

export function InfoTooltip({
  summary,
  paragraphs,
  dark = false,
}: {
  summary: string;
  paragraphs: string[];
  dark?: boolean;
}) {
  const descriptionText = paragraphs.join(" ");

  return (
    <FloatingTooltip.Trigger
      content={summary}
      description={descriptionText}
      contentClassName="font-display text-base tracking-tight font-semibold text-foreground"
      descriptionClassName="text-xs text-clinical opacity-90 leading-relaxed"
    >
      <button
        type="button"
        aria-label={summary}
        className={`inline-flex h-5 w-5 cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          dark ? "text-[#c7bbb2] hover:text-[#f29a7e]" : "text-clinical hover:text-accent"
        }`}
      >
        <HelpCircle className="h-4 w-4 shrink-0" />
      </button>
    </FloatingTooltip.Trigger>
  );
}
