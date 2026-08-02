"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface VariableProximityProps {
  label: string;
  className?: string;
  radius?: number;
}

export function VariableProximity({
  label,
  className = "",
  radius = 120,
}: VariableProximityProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const letters = label.split("");

  return (
    <span
      ref={containerRef}
      className={`inline-flex items-center cursor-pointer select-none ${className}`}
    >
      {letters.map((letter, index) => (
        <LetterSpan
          key={index}
          letter={letter}
          mouseX={mousePosition.x}
          mouseY={mousePosition.y}
          radius={radius}
        />
      ))}
    </span>
  );
}

function LetterSpan({
  letter,
  mouseX,
  mouseY,
  radius,
}: {
  letter: string;
  mouseX: number;
  mouseY: number;
  radius: number;
}) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [scale, setScale] = useState(1);
  const [colorIntensity, setColorIntensity] = useState(0);

  useEffect(() => {
    if (!spanRef.current) return;
    const rect = spanRef.current.getBoundingClientRect();
    const charX = rect.left + rect.width / 2;
    const charY = rect.top + rect.height / 2;

    const dist = Math.hypot(mouseX - charX, mouseY - charY);

    if (dist < radius) {
      const factor = 1 - dist / radius;
      setScale(1 + factor * 0.28);
      setColorIntensity(factor);
    } else {
      setScale(1);
      setColorIntensity(0);
    }
  }, [mouseX, mouseY, radius]);

  return (
    <motion.span
      ref={spanRef}
      animate={{ scale }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      style={{
        display: "inline-block",
        color:
          colorIntensity > 0
            ? `color-mix(in oklch, #E27F62 ${Math.round(colorIntensity * 100)}%, #F5F1E8)`
            : "#F5F1E8",
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}
