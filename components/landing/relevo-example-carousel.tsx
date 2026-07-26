"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  relevoContent,
  relevoExamples,
  type RelevoExample,
  type RelevoMessage,
} from "@/content/relevo";

const stackLayerStyles = [
  { x: 0, y: 0, scale: 1, opacity: 1, blur: 0, zIndex: 14 },
  { x: 28, y: 10, scale: 0.96, opacity: 0.38, blur: 4, zIndex: 13 },
  { x: 50, y: 18, scale: 0.925, opacity: 0.2, blur: 7, zIndex: 12 },
] as const;

const SWIPE_OFFSET_THRESHOLD = 44;
const SWIPE_VELOCITY_THRESHOLD = 420;

function messageToText(message: RelevoMessage): string {
  switch (message.role) {
    case "patient":
      return `Paciente: ${message.text}`;
    case "assistant":
      return `Relevo: ${message.text}`;
    case "specialist":
      return `${message.name}${message.isInternalContext ? " (equipo médico)" : ""}: ${message.text}`;
    case "handoff":
      return `La conversación se transfiere a ${message.to}. Motivo: ${message.reason}.`;
    case "resolved":
      return message.text;
  }
}

function ConversationCard({
  example,
  isFrontCard,
}: {
  example: RelevoExample;
  isFrontCard: boolean;
}) {
  return (
    <>
      <div
        className={`flex items-center gap-3 px-4 py-3 ${
          isFrontCard ? "bg-foreground" : "bg-foreground/90"
        }`}
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
          <span className="text-[11px] font-semibold text-background">
            {example.practice.initials}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-background/92">
            {example.practice.name}
          </p>
          <p className="truncate text-[11px] text-background/48">
            {isFrontCard ? "vía WhatsApp" : example.practice.channel}
          </p>
        </div>
        {isFrontCard ? (
          <span className="h-2 w-2 rounded-full bg-mint" aria-hidden="true" />
        ) : null}
      </div>

      <div className="space-y-3 bg-surface/95 p-4">
        {example.messages.map((message, index) => {
          if (message.role === "patient") {
            return (
              <div key={index} className="flex justify-end">
                <div className="max-w-[82%] rounded-lg rounded-tr-none bg-accent-soft px-3.5 py-2">
                  <p className="text-[12.5px] leading-snug text-foreground">
                    {message.text}
                  </p>
                  <p className="mt-0.5 text-right text-[10px] text-muted">
                    {message.time}
                  </p>
                </div>
              </div>
            );
          }

          if (message.role === "assistant") {
            return (
              <div key={index} className="flex items-start gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint">
                  <span className="text-[8px] font-bold text-white">IA</span>
                </div>
                <div className="max-w-[85%]">
                  <div className="rounded-lg rounded-tl-none bg-elevated px-3.5 py-2">
                    <p className="text-[12.5px] leading-snug text-foreground">
                      {message.text}
                    </p>
                  </div>
                  <p className="ml-1 mt-0.5 text-[10px] text-muted">
                    {message.time} · Relevo
                  </p>
                </div>
              </div>
            );
          }

          if (message.role === "handoff") {
            return (
              <div key={index} className="space-y-0.5">
                <div className="flex items-center gap-2 py-0.5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mint">
                    <svg
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5M16.5 3 21 7.5m0 0L16.5 12M21 7.5H7.5"
                      />
                    </svg>
                    Relevo → {message.to}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                  {message.reason}
                </p>
              </div>
            );
          }

          if (message.role === "specialist") {
            const isInternal = message.isInternalContext;
            return (
              <div key={index} className="flex items-start gap-2">
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                    isInternal ? "bg-clinical" : "bg-foreground"
                  }`}
                >
                  <span
                    className={`text-[8px] font-bold ${
                      isInternal ? "text-foreground" : "text-background"
                    }`}
                  >
                    {message.initial}
                  </span>
                </div>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-lg rounded-tl-none px-3.5 py-2 ${
                      isInternal
                        ? "border border-dashed border-border bg-surface"
                        : "bg-elevated"
                    }`}
                  >
                    <p className="text-[12.5px] leading-snug text-foreground">
                      {message.text}
                    </p>
                  </div>
                  <p
                    className={`ml-1 mt-0.5 text-[10px] font-medium ${
                      isInternal ? "text-muted" : "text-mint"
                    }`}
                  >
                    {message.time} · {message.name}
                    {isInternal ? " · equipo médico" : " · Equipo"}
                  </p>
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="flex justify-center pt-1">
              <div className="flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1">
                <svg
                  className="h-3 w-3 text-mint"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-mint">
                  {message.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export function RelevoExampleCarousel() {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stackPhase, setStackPhase] = useState<"idle" | "shifting">("idle");
  const [textPhase, setTextPhase] = useState<"idle" | "out" | "preEnter">("idle");
  const [direction, setDirection] = useState<1 | -1>(1);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  const timersRef = useRef<number[]>([]);
  const ghostRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef(false);
  const dragX = useMotionValue(0);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  useLayoutEffect(() => {
    const node = ghostRef.current;
    if (!node) return;

    const updateHeight = () => {
      setContainerHeight(Math.ceil(node.getBoundingClientRect().height));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const activeExample = relevoExamples[activeIndex];
  const orderedExamples = relevoExamples.map(
    (_, index) => relevoExamples[(activeIndex + index) % relevoExamples.length]
  );
  const stackExamples = orderedExamples.slice(0, 3);
  const [contextBefore, contextAfter] = activeExample.context.text.split(
    activeExample.context.emphasis
  );

  const goTo = useCallback(
    (index: number, nextDirection: 1 | -1 = 1) => {
      if (stackPhase !== "idle" || index === activeIndex) return;

      setDirection(nextDirection);
      if (reduceMotion) {
        setActiveIndex(index);
        setTextPhase("idle");
        return;
      }

      setStackPhase("shifting");
      setTextPhase("out");
      const swapTimer = window.setTimeout(() => {
        setActiveIndex(index);
        setStackPhase("idle");
        setTextPhase("preEnter");
        const enterTimer = window.setTimeout(() => setTextPhase("idle"), 24);
        timersRef.current.push(enterTimer);
      }, 320);
      timersRef.current.push(swapTimer);
    },
    [activeIndex, reduceMotion, stackPhase]
  );

  const nextExample = useCallback(() => {
    goTo((activeIndex + 1) % relevoExamples.length, 1);
  }, [activeIndex, goTo]);

  const previousExample = useCallback(() => {
    goTo((activeIndex - 1 + relevoExamples.length) % relevoExamples.length, -1);
  }, [activeIndex, goTo]);

  const resetDragPosition = () => {
    animate(dragX, 0, { duration: reduceMotion ? 0 : 0.2, ease: "easeOut" });
  };

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipedLeft =
      info.offset.x <= -SWIPE_OFFSET_THRESHOLD || info.velocity.x <= -SWIPE_VELOCITY_THRESHOLD;
    const swipedRight =
      info.offset.x >= SWIPE_OFFSET_THRESHOLD || info.velocity.x >= SWIPE_VELOCITY_THRESHOLD;

    resetDragPosition();
    if (swipedLeft) nextExample();
    else if (swipedRight) previousExample();
  };

  return (
    <div
      className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14 xl:gap-20"
      aria-roledescription="carrusel"
      aria-label="Ejemplos de conversaciones con Relevo"
    >
      <div className="min-w-0 lg:col-span-5">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Especialidades">
          {relevoExamples.map((example, index) => (
            <button
              key={example.practice.name}
              type="button"
              role="tab"
              onClick={() => goTo(index, index >= activeIndex ? 1 : -1)}
              aria-label={`Ver ejemplo de ${example.chipLabel}`}
              aria-selected={activeIndex === index}
              disabled={stackPhase !== "idle"}
              className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-medium transition-colors disabled:cursor-default ${
                activeIndex === index
                  ? "bg-mint/10 text-mint ring-1 ring-mint/30"
                  : "bg-surface text-muted hover:bg-elevated hover:text-foreground"
              }`}
            >
              <span aria-hidden="true">{example.chipIcon}</span>
              <span>{example.chipLabel}</span>
            </button>
          ))}
        </div>

        <div
          className="mt-6 transition-[opacity,transform] duration-500"
          style={{
            opacity: textPhase === "idle" ? 1 : 0,
            transform:
              textPhase === "out"
                ? `translate3d(${-16 * direction}px,0,0)`
                : textPhase === "preEnter"
                  ? `translate3d(${8 * direction}px,0,0)`
                  : "translate3d(0,0,0)",
          }}
        >
          <div className="flex items-center justify-between gap-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {relevoContent.exampleLabel}
            </p>
            <p className="text-right font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
              {activeExample.practice.channel}
            </p>
          </div>
          <p className="mt-2 font-display text-lg italic leading-snug text-foreground">
            {activeExample.quote}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-muted">
            {contextBefore}
            <strong className="font-medium text-foreground">
              {activeExample.context.emphasis}
            </strong>
            {contextAfter}
          </p>

          <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-3">
            <div>
              <p className="font-display text-lg font-medium leading-none text-mint sm:text-xl">
                {activeExample.metrics.conversation}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                conversación
              </p>
            </div>
            <span className="h-8 w-px bg-border" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-medium leading-none text-mint sm:text-xl">
                {activeExample.metrics.outcome}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                resultado
              </p>
            </div>
            <span className="h-8 w-px bg-border" aria-hidden="true" />
            <div>
              <p className="font-display text-lg font-medium leading-none text-mint sm:text-xl">
                {activeExample.metrics.team}
              </p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">
                tu equipo
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Diapositiva {activeIndex + 1} de {relevoExamples.length}. {activeExample.practice.name} —{" "}
        {activeExample.practice.channel}. {activeExample.messages.map(messageToText).join(" ")}
      </div>

      <div className="min-w-0 lg:col-span-7">
      <motion.button
        type="button"
        drag="x"
        dragConstraints={{ left: -56, right: 56 }}
        dragElastic={0}
        dragMomentum={false}
        style={{ x: dragX }}
        onDragStart={() => {
          draggedRef.current = true;
        }}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (draggedRef.current) {
            draggedRef.current = false;
            return;
          }
          nextExample();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            previousExample();
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            nextExample();
          }
        }}
        aria-label="Conversación ilustrativa. Activa para ver el siguiente ejemplo"
        aria-disabled={stackPhase !== "idle"}
        className="block w-full touch-pan-y cursor-grab rounded-[var(--radius-sm)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background active:cursor-grabbing"
      >
        <div
          className="relative overflow-x-clip pr-10 transition-[height] duration-500 ease-out"
          style={{
            height: containerHeight ?? undefined,
            clipPath: "inset(-24px 0 0 -40px)",
          }}
        >
          <div ref={ghostRef} className="pointer-events-none invisible" aria-hidden="true">
            <div className="overflow-hidden rounded-[var(--radius-sm)] border border-line">
              <ConversationCard example={activeExample} isFrontCard />
            </div>
          </div>

          {stackExamples.map((example, previewIndex) => {
            const restingStyle = stackLayerStyles[previewIndex];
            const animatedStyle =
              previewIndex === 0
                ? {
                    x: -30 * direction,
                    y: -2,
                    scale: 0.965,
                    opacity: 0,
                    blur: 5,
                    zIndex: 15,
                  }
                : stackLayerStyles[previewIndex - 1];
            const layerStyle = stackPhase === "shifting" ? animatedStyle : restingStyle;
            const isFrontCard = previewIndex === 0;

            return (
              <div
                key={`${example.practice.name}-${previewIndex}-${activeIndex}`}
                aria-hidden="true"
                className="pointer-events-none absolute left-0 right-10 top-0 overflow-hidden rounded-[var(--radius-sm)] border border-line transition-[transform,opacity,filter] duration-500"
                style={{
                  transform: `translate3d(${layerStyle.x}px, ${layerStyle.y}px, 0) scale(${layerStyle.scale})`,
                  opacity: layerStyle.opacity,
                  zIndex: layerStyle.zIndex,
                  filter: `blur(${layerStyle.blur}px)`,
                  transformOrigin: "top left",
                  boxShadow: isFrontCard ? "var(--shadow)" : "var(--shadow-sm)",
                }}
              >
                <ConversationCard example={example} isFrontCard={isFrontCard} />
              </div>
            );
          })}
        </div>
      </motion.button>

      <div className="mt-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-label="Diapositivas">
          {relevoExamples.map((example, index) => (
            <button
              key={example.practice.name}
              type="button"
              onClick={() => goTo(index, index >= activeIndex ? 1 : -1)}
              disabled={stackPhase !== "idle"}
              aria-label={`Ir al ejemplo ${index + 1}: ${example.chipLabel}`}
              aria-current={activeIndex === index ? "true" : undefined}
              className={`rounded-full transition-[width,background-color] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activeIndex === index ? "h-2 w-5 bg-mint" : "h-2 w-2 bg-border hover:bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={previousExample}
            disabled={stackPhase !== "idle"}
            aria-label="Ver ejemplo anterior"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="min-w-12 text-center font-mono text-[11px] text-muted" aria-hidden="true">
            {activeIndex + 1} / {relevoExamples.length}
          </span>
          <button
            type="button"
            onClick={nextExample}
            disabled={stackPhase !== "idle"}
            aria-label="Ver siguiente ejemplo"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
