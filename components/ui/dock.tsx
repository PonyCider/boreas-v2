"use client";

import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export interface DockProps {
  className?: string;
  children: React.ReactNode;
}

export interface DockIconProps {
  className?: string;
  children: React.ReactNode;
  href?: string;
  ariaLabel?: string;
  mouseX?: MotionValue<number>;
}

export function Dock({ className, children }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "flex h-12 items-center gap-3 rounded-full border border-[#373129] bg-[#1B1916]/80 px-4 backdrop-blur-md",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<{ mouseX: typeof mouseX }>, { mouseX });
        }
        return child;
      })}
    </motion.div>
  );
}

export function DockIcon({
  className,
  children,
  href = "#",
  ariaLabel,
  mouseX,
}: DockIconProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const fallbackMouseX = useMotionValue(Infinity);
  const resolvedMouseX = mouseX ?? fallbackMouseX;

  const distance = useTransform(resolvedMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [32, 44, 32]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      style={{ width, height: width }}
      className={cn(
        "flex items-center justify-center rounded-full bg-[#252119] text-[#A8A192] transition-colors hover:bg-[#373129] hover:text-[#F5F1E8]",
        className
      )}
    >
      {children}
    </motion.a>
  );
}
