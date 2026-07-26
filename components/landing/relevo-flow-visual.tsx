"use client";

import { forwardRef, useRef, type ReactNode } from "react";
import { Bot, MessageCircle, UserRoundCheck } from "lucide-react";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { cn } from "@/lib/utils";

const FlowNode = forwardRef<
  HTMLDivElement,
  {
    icon: ReactNode;
    label: string;
    detail: string;
    featured?: boolean;
  }
>(({ icon, label, detail, featured = false }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-10 flex min-w-[92px] flex-col items-center rounded-[var(--radius-md)] border bg-surface/90 px-3 py-3 text-center shadow-sm backdrop-blur-sm sm:min-w-36 sm:px-5",
      featured
        ? "border-mint/35 shadow-[0_14px_38px_rgba(79,179,154,0.14)]"
        : "border-line"
    )}
  >
    <span
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border",
        featured
          ? "border-mint/30 bg-mint/10 text-mint"
          : "border-border bg-background text-foreground"
      )}
      aria-hidden="true"
    >
      {icon}
    </span>
    <span className="mt-2 text-xs font-semibold text-foreground sm:text-sm">{label}</span>
    <span className="mt-0.5 hidden font-mono text-[9px] uppercase tracking-[0.06em] text-muted sm:block">
      {detail}
    </span>
  </div>
));

FlowNode.displayName = "FlowNode";

export function RelevoFlowVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const patientRef = useRef<HTMLDivElement>(null);
  const relevoRef = useRef<HTMLDivElement>(null);
  const specialistRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      className="relative mt-12 flex h-32 w-full items-center overflow-hidden rounded-[var(--radius-xl)] border border-line bg-surface/55 px-3 sm:h-36 sm:px-8 lg:px-16"
      aria-label="Flujo de atención: el paciente pregunta, Relevo responde y el especialista entra con contexto cuando hace falta"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--c-mint) 12%, transparent), transparent 42%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full items-center justify-between gap-3">
        <FlowNode
          ref={patientRef}
          icon={<MessageCircle className="h-4 w-4" strokeWidth={1.8} />}
          label="Paciente"
          detail="pregunta"
        />
        <FlowNode
          ref={relevoRef}
          icon={<Bot className="h-4 w-4" strokeWidth={1.8} />}
          label="Relevo"
          detail="responde y detecta"
          featured
        />
        <FlowNode
          ref={specialistRef}
          icon={<UserRoundCheck className="h-4 w-4" strokeWidth={1.8} />}
          label="Especialista"
          detail="entra con contexto"
        />
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={patientRef}
        toRef={relevoRef}
        duration={4.2}
        endXOffset={-18}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={relevoRef}
        toRef={specialistRef}
        duration={4.2}
        delay={0.7}
        startXOffset={18}
        gradientStartColor="var(--c-mint)"
        gradientStopColor="var(--accent)"
      />
    </div>
  );
}
