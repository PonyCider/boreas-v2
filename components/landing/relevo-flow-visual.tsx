"use client";

import { forwardRef, useRef, useState, type ReactNode } from "react";
import { Bot, MessageCircle, UserRoundCheck, Sparkles } from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { BorderBeam } from "@/components/ui/border-beam";
import { cn } from "@/lib/utils";

const FlowNode = forwardRef<
  HTMLDivElement,
  {
    icon: ReactNode;
    label: string;
    detail: string;
    badge?: string;
    featured?: boolean;
    active?: boolean;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
  }
>(({ icon, label, detail, badge, featured = false, active = false, onMouseEnter, onMouseLeave }, ref) => (
  <div
    ref={ref}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={cn(
      "relative z-10 flex min-w-[105px] cursor-pointer flex-col items-center rounded-[var(--radius-md)] border bg-surface/90 px-3.5 py-3.5 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 sm:min-w-44 sm:px-6 sm:py-4",
      featured
        ? "border-mint/60 shadow-[0_0_35px_rgba(79,179,154,0.35)] bg-surface/95"
        : active
        ? "border-accent/60 shadow-[0_0_25px_rgba(226,127,98,0.3)] bg-surface/95"
        : "border-line/80 hover:border-accent/40"
    )}
  >
    {featured ? (
      <BorderBeam
        size={180}
        duration={8}
        colorFrom="var(--c-mint)"
        colorTo="var(--accent)"
        borderWidth={2}
        rx="var(--radius-md)"
      />
    ) : null}

    <div className="relative flex items-center justify-center">
      {featured ? (
        <div className="relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90 scale-125">
            <ThinkingOrb state="composing" size={64} />
          </div>
          <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-mint backdrop-blur-md shadow-md border border-mint/30">
            {icon}
          </span>
        </div>
      ) : (
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 shadow-sm",
            active
              ? "border-accent/60 bg-accent/15 text-accent scale-110 shadow-[0_0_12px_rgba(226,127,98,0.4)]"
              : "border-border bg-background/90 text-foreground"
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
    </div>

    <div className="mt-2 flex items-center gap-1.5">
      <span className="text-xs font-bold tracking-tight text-foreground sm:text-base">{label}</span>
      {badge ? (
        <span className="hidden items-center gap-1 rounded-full border border-mint/40 bg-mint/15 px-1.5 py-0.5 text-[9px] font-semibold text-mint sm:inline-flex">
          <Sparkles className="h-2.5 w-2.5 animate-pulse" />
          {badge}
        </span>
      ) : null}
    </div>

    <span className="mt-1 font-mono text-[9.5px] font-medium uppercase tracking-[0.08em] text-muted sm:block">
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
  const [activeNode, setActiveNode] = useState<"patient" | "relevo" | "specialist" | null>(null);

  return (
    <div
      ref={containerRef}
      className="relative mt-12 flex h-40 w-full items-center overflow-hidden rounded-[var(--radius-xl)] border border-line/90 bg-surface/75 px-3 sm:h-44 sm:px-8 lg:px-16 shadow-2xl backdrop-blur-md"
      aria-label="Flujo de atención: el paciente pregunta, Relevo responde y el especialista entra con contexto cuando hace falta"
    >
      {/* Resplandor radial de atmósfera de IA */}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--c-mint) 25%, transparent), color-mix(in srgb, var(--accent) 10%, transparent) 50%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full items-center justify-between gap-3">
        <FlowNode
          ref={patientRef}
          icon={<MessageCircle className="h-4 w-4" strokeWidth={2} />}
          label="Paciente"
          detail="pregunta 24/7"
          active={activeNode === "patient"}
          onMouseEnter={() => setActiveNode("patient")}
          onMouseLeave={() => setActiveNode(null)}
        />
        <FlowNode
          ref={relevoRef}
          icon={<Bot className="h-5 w-5" strokeWidth={2} />}
          label="Relevo IA"
          detail="responde & procesa"
          badge="IA activa"
          featured
          active={activeNode === "relevo" || activeNode !== null}
          onMouseEnter={() => setActiveNode("relevo")}
          onMouseLeave={() => setActiveNode(null)}
        />
        <FlowNode
          ref={specialistRef}
          icon={<UserRoundCheck className="h-4 w-4" strokeWidth={2} />}
          label="Especialista"
          detail="recibe contexto"
          active={activeNode === "specialist"}
          onMouseEnter={() => setActiveNode("specialist")}
          onMouseLeave={() => setActiveNode(null)}
        />
      </div>

      {/* Haz Continuo Paciente -> Relevo IA */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={patientRef}
        toRef={relevoRef}
        duration={3.2}
        endXOffset={-18}
        gradientStartColor="var(--c-amber)"
        gradientStopColor="var(--c-mint)"
      />

      {/* Haz Continuo Relevo IA -> Especialista */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={relevoRef}
        toRef={specialistRef}
        duration={3.2}
        delay={0.5}
        startXOffset={18}
        gradientStartColor="var(--c-mint)"
        gradientStopColor="var(--accent)"
      />
    </div>
  );
}

