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
  }
>(({ icon, label, detail, featured = false, delay, reduceMotion }, ref) => (
  <motion.div
    ref={ref}
    className={cn(
      "relative z-10 flex min-w-0 flex-1 flex-col items-center text-center",
      featured && "flex-[1.25]"
    )}
    initial={reduceMotion ? false : { opacity: 0, y: 18, filter: "blur(8px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: reduceMotion ? 0 : 0.62, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {featured ? (
      <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-mint/45 bg-surface shadow-[0_10px_30px_rgba(57,106,94,0.2)] sm:h-16 sm:w-16">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center sm:scale-100">
          <ThinkingOrb state="composing" size={64} />
        </div>
        <span className="absolute inset-1 rounded-full ring-1 ring-inset ring-white/40" aria-hidden="true" />
      </div>
    ) : (
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface text-foreground shadow-[0_8px_22px_rgba(47,40,35,0.1)] sm:h-11 sm:w-11">
        {icon}
      </div>
    )}

    <p className={cn("mt-2 font-semibold text-foreground", featured ? "text-sm sm:text-base" : "text-xs sm:text-sm")}>
      {label}
    </p>
    <p className="mt-0.5 hidden text-[10px] text-muted sm:block">{detail}</p>
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
    <div
      ref={containerRef}
      role="img"
      className="relative mx-auto mt-10 flex h-28 w-full max-w-5xl items-center overflow-hidden border-y border-line/75 px-2 sm:h-32 sm:px-8"
      aria-label="Flujo de atención: el paciente pregunta, Relevo responde y el especialista entra con contexto cuando hace falta"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-24 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-55 blur-2xl"
        style={{ background: "color-mix(in srgb, var(--c-mint) 22%, transparent)" }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full items-center justify-between">
        <FlowNode
          ref={patientRef}
          icon={<MessageCircle className="h-4 w-4" strokeWidth={1.8} />}
          label="Paciente"
          detail="pregunta a cualquier hora"
          delay={reduceMotion ? 0 : 0}
          reduceMotion={reduceMotion}
        />
        <FlowNode
          ref={relevoRef}
          icon={null}
          label="Relevo IA"
          detail="responde y organiza el contexto"
          featured
          delay={reduceMotion ? 0 : 0.1}
          reduceMotion={reduceMotion}
        />
        <FlowNode
          ref={specialistRef}
          icon={<UserRoundCheck className="h-4 w-4" strokeWidth={1.8} />}
          label="Especialista"
          detail="entra cuando hace falta"
          delay={reduceMotion ? 0 : 0.2}
          reduceMotion={reduceMotion}
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
    </div>
  );
}
