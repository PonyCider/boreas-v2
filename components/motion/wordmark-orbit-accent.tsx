"use client";

export interface WordmarkOrbitAccentProps {
  active: boolean;
  count?: number;
  radiusScale?: number;
  reduceMotion: boolean;
  className?: string;
}

export function WordmarkOrbitAccent({ active, count = 3, radiusScale = 1, reduceMotion, className = "" }: WordmarkOrbitAccentProps) {
  if (!active || reduceMotion) return null;

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className}`}>
      {Array.from({ length: count }).map((_, i) => {
        const radius = (90 + i * 24) * radiusScale;
        const duration = 8 + i * 3;
        return (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-accent/40"
            style={{
              animation: `hero-orbit-spin ${duration}s linear infinite`,
              ["--orbit-radius" as string]: `${radius}px`,
              marginLeft: -3,
              marginTop: -3,
            } as React.CSSProperties}
          />
        );
      })}
    </div>
  );
}
