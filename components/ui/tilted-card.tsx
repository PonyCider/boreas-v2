"use client";

import React, { useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TiltedCardProps {
  imageSrc?: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: ReactNode;
  children?: ReactNode;
  className?: string;
  glareEnable?: boolean;
}

const springConfig = { damping: 20, stiffness: 260, mass: 0.5 };

export function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText,
  containerHeight = "100%",
  containerWidth = "100%",
  imageHeight = "100%",
  imageWidth = "100%",
  rotateAmplitude = 14,
  scaleOnHover = 1.04,
  displayOverlayContent = false,
  overlayContent,
  children,
  className,
  glareEnable = true,
}: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scale = useSpring(1, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const px = mouseX / width - 0.5;
    const py = mouseY / height - 0.5;

    rotateX.set(-py * rotateAmplitude * 2);
    rotateY.set(px * rotateAmplitude * 2);

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseEnter = () => {
    if (reduceMotion) return;
    setIsHovered(true);
    scale.set(scaleOnHover);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex items-center justify-center [perspective:1000px]", className)}
      style={{
        height: containerHeight,
        width: containerWidth,
      }}
    >
      <motion.div
        className="relative h-full w-full rounded-[var(--radius-sm)] border border-line/80 bg-surface shadow-2xl transition-shadow duration-300 hover:shadow-accent/10"
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          scale: reduceMotion ? 1 : scale,
          transformStyle: "preserve-3d",
        }}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={altText}
            className="h-full w-full rounded-[var(--radius-sm)] object-cover"
            style={{
              height: imageHeight,
              width: imageWidth,
            }}
          />
        ) : null}

        {children ? (
          <div className="relative h-full w-full [transform:translateZ(0px)]">
            {children}
          </div>
        ) : null}

        {displayOverlayContent && overlayContent ? (
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-4 [transform:translateZ(30px)]">
            {overlayContent}
          </div>
        ) : null}

        {glareEnable && !reduceMotion && isHovered ? (
          <div
            className="pointer-events-none absolute inset-0 rounded-[var(--radius-sm)] transition-opacity duration-200"
            style={{
              background: `radial-gradient(circle 280px at ${x.get()}px ${y.get()}px, rgba(255, 255, 255, 0.22), transparent 80%)`,
            }}
          />
        ) : null}

        {captionText ? (
          <p className="mt-2 text-center text-xs text-muted">{captionText}</p>
        ) : null}
      </motion.div>
    </div>
  );
}
