"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
  rx?: string | number;
}
export function BorderBeam({
  className,
  size = 280,
  duration = 12,
  borderWidth = 1.5,
  colorFrom = "var(--accent, #E27F62)",
  colorTo = "transparent",
  delay = 0,
  rx = "1rem",
}: BorderBeamProps) {
  const id = useId();
  const gradientId = `border-beam-gradient-${id.replace(/:/g, "")}`;
  const glowId = `border-beam-glow-${id.replace(/:/g, "")}`;

  // Calculate beam dash length and gap length normalized to 100% pathLength
  const beamLength = Math.min(Math.max((size / 1000) * 100, 15), 40);
  const gapLength = 100 - beamLength;

  return (
    <div className={cn("pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden", className)}>
      <svg
        className="h-full w-full rounded-[inherit] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorFrom} stopOpacity="1" />
            <stop offset="60%" stopColor={colorFrom} stopOpacity="0.5" />
            <stop offset="100%" stopColor={colorTo} stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Glow Beam */}
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={rx}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={borderWidth * 3}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${beamLength} ${gapLength}`}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{
            repeat: Infinity,
            duration: duration,
            ease: "linear",
            delay: delay,
          }}
          opacity={0.4}
          filter={`url(#${glowId})`}
        />

        {/* Sharp Beam Outline */}
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          rx={rx}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={borderWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${beamLength} ${gapLength}`}
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -100 }}
          transition={{
            repeat: Infinity,
            duration: duration,
            ease: "linear",
            delay: delay,
          }}
        />
      </svg>
    </div>
  );
}
