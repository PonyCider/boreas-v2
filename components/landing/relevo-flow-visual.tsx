"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, UserRoundCheck } from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const FlowNode = forwardRef<
  HTMLDivElement,
  {
    icon: ReactNode;
    label: string;
    detail: string;
    featured?: boolean;
    delay: number;
    reduceMotion: boolean;
    direction?: -1 | 0 | 1;
  }
>(({ icon, label, detail, featured = false, delay, reduceMotion, direction = 0 }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "relative z-10 flex min-w-0 flex-1 flex-col items-center text-center",
      featured && "flex-[1.25]"
    )}
    initial={
      reduceMotion
        ? false
        : { opacity: 0, x: direction * 18, y: featured ? 12 : 8, scale: featured ? 0.86 : 0.94, filter: "blur(8px)" }
    }
    whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: reduceMotion ? 0 : 0.92, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {featured ? (
      <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-mint/35 bg-surface shadow-[0_16px_44px_rgba(57,106,94,0.22),0_0_0_7px_rgba(79,179,154,0.055)] sm:h-20 sm:w-20">
        <div className="pointer-events-none absolute inset-[5px] overflow-hidden rounded-full">
          <div className="absolute inset-0 flex items-center justify-center">
            <ThinkingOrb state="composing" size={64} />
          </div>
        </div>
        <span className="absolute inset-[5px] rounded-full ring-1 ring-inset ring-white/55" aria-hidden="true" />
        <span className="absolute -bottom-1.5 h-3 w-3 rounded-full border-2 border-background bg-mint shadow-[0_0_14px_rgba(79,179,154,0.7)]" aria-hidden="true" />
      </div>
    ) : (
      <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line/90 bg-background text-foreground shadow-[0_10px_28px_rgba(47,40,35,0.11),0_0_0_5px_rgba(255,255,255,0.55)] sm:h-12 sm:w-12">
        {icon}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent" aria-hidden="true" />
      </div>
    )}

    <p className={cn("mt-2.5 font-semibold tracking-[-0.01em] text-foreground", featured ? "text-sm sm:text-base" : "text-xs sm:text-sm")}>
      {label}
    </p>
    <p className="mt-0.5 hidden max-w-36 text-[10px] leading-snug text-muted sm:block">{detail}</p>
  </motion.div>
));

FlowNode.displayName = "FlowNode";

export function RelevoFlowVisual() {
  const reduceMotion = Boolean(useReducedMotion());
  const containerRef = useRef<HTMLDivElement>(null);
  const patientRef = useRef<HTMLDivElement>(null);
  const relevoRef = useRef<HTMLDivElement>(null);
  const specialistRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      role="img"
      className="relative mx-auto mt-10 flex h-32 w-full max-w-5xl items-center overflow-hidden border-y border-line/75 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.66)_24%,rgba(255,255,255,0.66)_76%,transparent)] px-2 sm:h-36 sm:px-8"
      aria-label="Flujo de atención: el paciente pregunta, Relevo responde y el especialista entra con contexto cuando hace falta"
      initial={reduceMotion ? false : { opacity: 0, scaleX: 0.97 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute inset-x-[7%] top-1/2 h-px -translate-y-1/2 bg-line/55" aria-hidden="true" />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-28 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-65 blur-2xl"
        style={{ background: "color-mix(in srgb, var(--c-mint) 25%, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full items-center justify-between">
        <FlowNode
          ref={patientRef}
          icon={<MessageCircle className="h-4 w-4" strokeWidth={1.8} />}
          label="Paciente"
          detail="pregunta a cualquier hora"
          delay={reduceMotion ? 0 : 0.15}
          reduceMotion={reduceMotion}
          direction={-1}
        />
        <FlowNode
          ref={relevoRef}
          icon={null}
          label="Relevo IA"
          detail="responde y organiza el contexto"
          featured
          delay={reduceMotion ? 0 : 0.46}
          reduceMotion={reduceMotion}
        />
        <FlowNode
          ref={specialistRef}
          icon={<UserRoundCheck className="h-4 w-4" strokeWidth={1.8} />}
          label="Especialista"
          detail="entra cuando hace falta"
          delay={reduceMotion ? 0 : 0.82}
          reduceMotion={reduceMotion}
          direction={1}
        />
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={patientRef}
        toRef={relevoRef}
        duration={4.2}
        endXOffset={-14}
        gradientStartColor="var(--accent)"
        gradientStopColor="var(--c-mint)"
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={relevoRef}
        toRef={specialistRef}
        duration={4.2}
        delay={0.9}
        startXOffset={14}
        gradientStartColor="var(--c-mint)"
        gradientStopColor="var(--accent)"
      />
    </motion.div>
  );
}
