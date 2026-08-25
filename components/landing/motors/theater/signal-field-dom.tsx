"use client";

import { motion, useReducedMotion } from "motion/react";

type SignalFieldDomProps = {
  activeAct: number;
};

const nodes = [
  { label: "precio", position: "left-[7%] top-[14%]", x: 74, y: 48 },
  { label: "tiempo", position: "right-[8%] top-[18%]", x: -70, y: 38 },
  { label: "primera cita", position: "bottom-[18%] left-[9%]", x: 82, y: -48 },
  { label: "disponibilidad", position: "bottom-[12%] right-[7%]", x: -78, y: -58 },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function SignalFieldDom({ activeAct }: SignalFieldDomProps) {
  const reduceMotion = !!useReducedMotion();
  const structured = activeAct >= 1;
  const resolved = activeAct >= 2;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden opacity-70 [mask-image:radial-gradient(circle_at_center,black_15%,transparent_76%)]"
    >
      <motion.span
        className="absolute left-[22%] top-1/2 h-px w-[56%] origin-center bg-accent/35"
        animate={{ scaleX: structured ? 1 : 0, opacity: resolved ? 0.72 : 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
      />
      <motion.span
        className="absolute left-1/2 top-[24%] h-[52%] w-px origin-center bg-accent/25"
        animate={{ scaleY: structured ? 1 : 0, opacity: resolved ? 0.55 : 0.25 }}
        transition={{ duration: reduceMotion ? 0 : 0.55, ease, delay: reduceMotion ? 0 : 0.06 }}
      />

      {nodes.map((node, index) => (
        <motion.span
          key={node.label}
          className={`absolute rounded-full border border-accent/25 bg-background/85 px-2.5 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-accent shadow-sm ${node.position}`}
          animate={{
            x: structured ? node.x : 0,
            y: structured ? node.y : 0,
            opacity: resolved ? 0.28 : structured ? 0.58 : 0.82,
            scale: resolved ? 0.92 : 1,
          }}
          transition={{
            duration: reduceMotion ? 0 : 0.5,
            ease,
            delay: reduceMotion ? 0 : index * 0.035,
          }}
        >
          {node.label}
        </motion.span>
      ))}
    </div>
  );
}
