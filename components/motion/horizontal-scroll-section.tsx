"use client";

import { useScrollPin } from "@/lib/motion/use-scroll-pin";
import { useScrub } from "@/lib/motion/use-scrub";

/**
 * Pins vertically, translates scroll progress into horizontal movement of an
 * inner track. Not consumed by Hero — designed now so the motion system is
 * complete; first real consumer will be a future gallery section (see
 * docs/superpowers/specs/2026-07-16-hero-motion-system-and-redesign.md,
 * "Fuera de alcance").
 */
export function HorizontalScrollSection({
  trackWidthVw,
  pinVh = 200,
  reduceMotion,
  children,
}: {
  /** Total width of the inner track, in vw units. Must be > 100. */
  trackWidthVw: number;
  pinVh?: number;
  reduceMotion: boolean;
  children: React.ReactNode;
}) {
  const { containerRef, scrollYProgress } = useScrollPin();
  const translateVw = useScrub(scrollYProgress, [0, 1], [0, -(trackWidthVw - 100)]);

  if (reduceMotion) {
    return (
      <div className="overflow-x-auto">
        <div style={{ width: `${trackWidthVw}vw` }} className="flex">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative" style={{ height: `${pinVh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          className="flex h-full"
          style={{ width: `${trackWidthVw}vw`, transform: `translate3d(${translateVw}vw, 0, 0)`, willChange: "transform" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
