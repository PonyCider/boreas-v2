"use client";

import { useEffect, useId, useState, type RefObject } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  className?: string;
  containerRef: RefObject<HTMLElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  curvature?: number;
  reverse?: boolean;
  pathColor?: string;
  pathWidth?: number;
  pathOpacity?: number;
  gradientStartColor?: string;
  gradientStopColor?: string;
  delay?: number;
  duration?: number;
  startXOffset?: number;
  startYOffset?: number;
  endXOffset?: number;
  endYOffset?: number;
}

export function AnimatedBeam({
  className,
  containerRef,
  fromRef,
  toRef,
  curvature = 0,
  reverse = false,
  duration = 4.5,
  delay = 0,
  pathColor = "var(--border)",
  pathWidth = 1.5,
  pathOpacity = 0.75,
  gradientStartColor = "var(--accent)",
  gradientStopColor = "var(--c-mint)",
  startXOffset = 0,
  startYOffset = 0,
  endXOffset = 0,
  endYOffset = 0,
}: AnimatedBeamProps) {
  const id = useId().replace(/:/g, "");
  const reduceMotion = useReducedMotion();
  const [pathD, setPathD] = useState("");
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  const gradientCoordinates = reverse
    ? { x1: ["90%", "-10%"], x2: ["100%", "0%"] }
    : { x1: ["10%", "110%"], x2: ["0%", "100%"] };

  useEffect(() => {
    const updatePath = () => {
      if (!containerRef.current || !fromRef.current || !toRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();
      const startX =
        fromRect.left - containerRect.left + fromRect.width / 2 + startXOffset;
      const startY =
        fromRect.top - containerRect.top + fromRect.height / 2 + startYOffset;
      const endX = toRect.left - containerRect.left + toRect.width / 2 + endXOffset;
      const endY = toRect.top - containerRect.top + toRect.height / 2 + endYOffset;

      setSvgDimensions({ width: containerRect.width, height: containerRect.height });
      setPathD(
        `M ${startX},${startY} Q ${(startX + endX) / 2},${startY - curvature} ${endX},${endY}`
      );
    };

    const observer = new ResizeObserver(updatePath);
    if (containerRef.current) observer.observe(containerRef.current);
    updatePath();

    return () => observer.disconnect();
  }, [
    containerRef,
    curvature,
    endXOffset,
    endYOffset,
    fromRef,
    startXOffset,
    startYOffset,
    toRef,
  ]);

  return (
    <svg
      aria-hidden="true"
      fill="none"
      width={svgDimensions.width}
      height={svgDimensions.height}
      viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
      className={cn("pointer-events-none absolute left-0 top-0 z-0 transform-gpu", className)}
    >
      <path
        d={pathD}
        stroke={pathColor}
        strokeWidth={pathWidth}
        strokeOpacity={pathOpacity}
        strokeLinecap="round"
      />

      <path
        d={pathD}
        strokeWidth={pathWidth + 0.5}
        stroke={`url(#${id})`}
        strokeLinecap="round"
      />
      <defs>
        <motion.linearGradient
          id={id}
          gradientUnits="userSpaceOnUse"
          initial={{ x1: "0%", x2: "0%", y1: "0%", y2: "0%" }}
          animate={
            reduceMotion
              ? { x1: "100%", x2: "0%", y1: "0%", y2: "0%" }
              : {
                  x1: gradientCoordinates.x1,
                  x2: gradientCoordinates.x2,
                  y1: ["0%", "0%"],
                  y2: ["0%", "0%"],
                }
          }
          transition={{
            delay: reduceMotion ? 0 : delay,
            duration: reduceMotion ? 0 : duration,
            ease: [0.16, 1, 0.3, 1],
            repeat: reduceMotion ? 0 : Infinity,
            repeatDelay: reduceMotion ? 0 : 0.35,
          }}
        >
          <stop stopColor={gradientStartColor} stopOpacity="0" />
          <stop stopColor={gradientStartColor} />
          <stop offset="32.5%" stopColor={gradientStopColor} />
          <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
        </motion.linearGradient>
      </defs>
    </svg>
  );
}
