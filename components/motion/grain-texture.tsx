// components/motion/grain-texture.tsx
"use client";

import { useId } from "react";

export interface GrainTextureProps {
  opacity?: number;
  className?: string;
}

// The Hero mounts this on both the desktop and mobile branches, which can be
// simultaneously present in the DOM (one hidden via CSS, not unmounted) — a
// hardcoded filter id would collide. useId() keeps each instance unique.
export function GrainTexture({ opacity = 0.04, className = "" }: GrainTextureProps) {
  const filterId = useId();
  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{ opacity }}
    >
      <filter id={filterId}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.5" />
        </feComponentTransfer>
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
