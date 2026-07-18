// components/motion/card-backlight.tsx
"use client";

export interface CardBacklightProps {
  color?: string;
  className?: string;
}

export function CardBacklight({ color = "var(--accent)", className = "" }: CardBacklightProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute -inset-6 -z-10 ${className}`}
      style={{
        background: `radial-gradient(circle, color-mix(in oklch, ${color} 22%, transparent) 0%, transparent 70%)`,
        filter: "blur(24px)",
      }}
    />
  );
}
