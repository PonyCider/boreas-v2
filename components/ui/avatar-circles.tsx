"use client";

import { cn } from "@/lib/utils";

export interface AvatarCirclesProps {
  className?: string;
  avatarUrls?: string[];
  rating?: number;
  text?: string;
}

const DEFAULT_AVATARS = [
  "/testimonials/specialist-01.jpg",
  "/testimonials/specialist-02.jpg",
  "/testimonials/specialist-03.jpg",
  "/testimonials/specialist-04.jpg",
];

export function AvatarCircles({
  className,
  avatarUrls = DEFAULT_AVATARS,
  text = "+120 especialistas confían en Boreas",
}: AvatarCirclesProps) {
  return (
    <div className={cn("inline-flex max-w-full items-center gap-3", className)}>
      <div className="flex shrink-0 -space-x-2.5 rtl:space-x-reverse">
        {avatarUrls.map((url, index) => (
          // These URLs may be supplied by consumers at runtime. Keeping a
          // native image preserves that API without requiring host allowlists.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            className="size-9 rounded-full border-2 border-[#1B1916] object-cover shadow-md transition-transform hover:scale-110 sm:size-10"
            src={url}
            width={40}
            height={40}
            decoding="async"
            alt={`Especialista ${index + 1}`}
          />
        ))}
      </div>
      <div className="min-w-0 text-left">
        <div className="flex items-center gap-0.5" role="img" aria-label="5 de 5 estrellas">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="text-xs text-[#E2A33C] sm:text-sm"
              style={{ color: "var(--rating-gold, #E2A33C)" }}
              aria-hidden="true"
            >
              ★
            </span>
          ))}
          <span className="ml-1 text-xs font-semibold tabular-nums text-white/90">5.0</span>
        </div>
        <span className="mt-0.5 block text-pretty text-[11px] font-medium leading-snug text-white/70 sm:text-xs">
          {text}
        </span>
      </div>
    </div>
  );
}
