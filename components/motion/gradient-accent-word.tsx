"use client";

export interface GradientAccentWordProps {
  children: React.ReactNode;
  reduceMotion: boolean;
  className?: string;
}

export function GradientAccentWord({ children, reduceMotion, className = "" }: GradientAccentWordProps) {
  return (
    <span
      className={`bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: "linear-gradient(90deg, var(--accent), var(--c-amber), var(--accent))",
        backgroundSize: "200% 100%",
        animation: reduceMotion ? undefined : "hero-gradient-word-sweep 3s ease-in-out infinite",
      }}
    >
      {children}
    </span>
  );
}
