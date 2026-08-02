"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RelevoOrbProps {
  className?: string;
  size?: number;
  active?: boolean;
}

/**
 * RelevoOrb — Componente de Esfera Fluida e Inteligente ("Composing" style)
 * Inspirado en las esferas de orbs.jakubantalik.com.
 * Utiliza capas compuestas de gradientes radiales, rotación orgánica,
 * aceleración por hardware GPU y filtrado de dispersión cromática.
 */
export function RelevoOrb({ className, size = 120, active = false }: RelevoOrbProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full bg-gradient-to-tr from-[var(--c-mint)] via-[var(--accent)] to-[var(--c-amber)] opacity-90 shadow-md backdrop-blur-md",
          className
        )}
        style={{ width: size, height: size }}
      >
        <div className="h-1/2 w-1/2 rounded-full bg-white/20 blur-sm" />
      </div>
    );
  }

  return (
    <div
      className={cn("relative flex items-center justify-center select-none pointer-events-none", className)}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {/* Resplandor ambiental de fondo */}
      <motion.div
        animate={{
          scale: active ? [1, 1.25, 1] : [1, 1.12, 1],
          opacity: active ? [0.45, 0.75, 0.45] : [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: active ? 2.2 : 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--c-mint)] via-[var(--accent)] to-[var(--c-amber)] blur-xl"
      />

      {/* Capa principal del Orb "Composing" con animación multicapa */}
      <div className="relative h-full w-full overflow-hidden rounded-full border border-white/20 shadow-2xl backdrop-blur-sm">
        {/* Capa 1: Menta Base */}
        <motion.div
          animate={{
            rotate: 360,
            scale: active ? [1, 1.15, 0.95, 1] : [1, 1.08, 0.98, 1],
          }}
          transition={{
            rotate: { duration: active ? 8 : 16, repeat: Infinity, ease: "linear" },
            scale: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -inset-4 origin-center rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, var(--c-mint) 0%, transparent 65%), radial-gradient(circle at 75% 75%, var(--accent) 0%, transparent 70%)",
            filter: "blur(8px)",
          }}
        />

        {/* Capa 2: Ámbar & Lavanda en contra-rotación */}
        <motion.div
          animate={{
            rotate: -360,
            x: [0, 8, -6, 0],
            y: [0, -6, 8, 0],
          }}
          transition={{
            rotate: { duration: active ? 10 : 20, repeat: Infinity, ease: "linear" },
            x: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -inset-4 origin-center rounded-full opacity-80 mix-blend-color-dodge"
          style={{
            background:
              "radial-gradient(circle at 65% 30%, var(--c-amber) 0%, transparent 60%), radial-gradient(circle at 25% 70%, var(--c-lav) 0%, transparent 65%)",
            filter: "blur(10px)",
          }}
        />

        {/* Capa 3: Destello blanco central "Composing Aura" */}
        <motion.div
          animate={{
            opacity: active ? [0.6, 0.95, 0.6] : [0.4, 0.7, 0.4],
            scale: active ? [0.85, 1.1, 0.85] : [0.9, 1.02, 0.9],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.1) 45%, transparent 75%)",
            filter: "blur(4px)",
          }}
        />

        {/* Anillo especular de reflejo en cristal */}
        <div className="absolute inset-0 rounded-full border border-white/30 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
      </div>
    </div>
  );
}
