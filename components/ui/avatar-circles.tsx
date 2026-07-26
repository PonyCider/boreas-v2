"use client";

import { cn } from "@/lib/utils";

export interface AvatarCirclesProps {
  className?: string;
  avatarUrls?: string[];
  rating?: number;
  text?: string;
}

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1594824813571-2153349aed06?auto=format&fit=crop&w=120&h=120&q=80",
  "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&h=120&q=80",
];

export function AvatarCircles({
  className,
  avatarUrls = DEFAULT_AVATARS,
  text = "5.0 ★ · +120 especialistas confían en Boreas",
}: AvatarCirclesProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3.5", className)}>
      <div className="flex -space-x-3 rtl:space-x-reverse">
        {avatarUrls.map((url, index) => (
          // These URLs may be supplied by consumers at runtime. Keeping a
          // native image preserves that API without requiring host allowlists.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={index}
            className="h-10 w-10 rounded-full border-2 border-[#1B1916] object-cover shadow-md transition-transform hover:scale-110"
            src={url}
            width={40}
            height={40}
            alt={`Especialista ${index + 1}`}
          />
        ))}
      </div>
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="text-sm text-[#E2A33C]"
              style={{ color: "var(--rating-gold, #E2A33C)" }}
            >
              ★
            </span>
          ))}
        </div>
        <span className="text-xs sm:text-sm font-medium text-white/85 tracking-tight">
          {text}
        </span>
      </div>
    </div>
  );
}
