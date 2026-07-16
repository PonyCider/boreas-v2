"use client";

import { useEffect, useRef, useState } from "react";
import { relevoExampleLabel, relevoExamples, type RelevoExample, type RelevoMessage } from "@/content/boreas-home";
import { StackedCards, type StackedCardLayer } from "@/components/motion/stacked-cards";

// Ported from relevo.chat's own landing (components/landing/how-it-works.tsx),
// retinted to Boreas tokens. Card-stack depth is CSS-transition-driven (not
// framer-motion) — matches the source implementation; the global
// prefers-reduced-motion rule in globals.css already collapses these
// transitions to ~0, so no extra reduced-motion branching is needed here.

// The card stack is entirely aria-hidden (it's a decorative, animated,
// duplicated-DOM effect) — this renders the same conversation as plain,
// linear text so screen reader users get the content, not just "ver el
// siguiente ejemplo".
function messageToText(msg: RelevoMessage): string {
  switch (msg.role) {
    case "customer":
      return `Paciente: ${msg.text}`;
    case "ai":
      return `Relevo (IA): ${msg.text}`;
    case "human":
      return `${msg.name}${msg.isContext ? " (contexto interno)" : ""}: ${msg.text}`;
    case "handoff":
      return `Se transfiere a ${msg.to}. Motivo: ${msg.reason}.`;
    case "resolved":
      return msg.text;
    default:
      return "";
  }
}

function ConversationCard({ preview, isFrontCard }: { preview: RelevoExample; isFrontCard: boolean }) {
  return (
    <>
      <div className={`flex items-center gap-3 px-4 py-3 ${isFrontCard ? "bg-foreground" : "bg-foreground/90"}`}>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/10">
          <span className="text-[11px] font-semibold text-background">{preview.business.initials}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-background/92">{preview.business.name}</p>
          <p className="truncate text-[11px] text-background/48">{isFrontCard ? "vía WhatsApp" : preview.business.channel}</p>
        </div>
        {isFrontCard && (
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-mint" />
          </div>
        )}
      </div>

      <div className="space-y-3 bg-surface/95 p-4">
        {preview.messages.map((msg: RelevoMessage, i) => {
          if (msg.role === "customer") {
            return (
              <div key={i} className="flex justify-end">
                <div className="max-w-[82%] rounded-lg rounded-tr-none bg-accent-soft px-3.5 py-2">
                  <p className="text-[12.5px] leading-snug text-foreground">{msg.text}</p>
                  <p className="mt-0.5 text-right text-[10px] text-muted">{msg.time}</p>
                </div>
              </div>
            );
          }

          if (msg.role === "ai") {
            return (
              <div key={i} className="flex items-start gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mint">
                  <span className="text-[8px] font-bold text-white">IA</span>
                </div>
                <div className="max-w-[85%]">
                  <div className="rounded-lg rounded-tl-none bg-elevated px-3.5 py-2">
                    <p className="text-[12.5px] leading-snug text-foreground">{msg.text}</p>
                  </div>
                  <p className="ml-1 mt-0.5 text-[10px] text-muted">{msg.time} · IA</p>
                </div>
              </div>
            );
          }

          if (msg.role === "handoff") {
            return (
              <div key={i} className="space-y-0.5">
                <div className="flex items-center gap-2 py-0.5">
                  <div className="h-px flex-1 bg-border" />
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mint">
                    <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                    </svg>
                    Relevo → {msg.to}
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <p className="text-center font-mono text-[10px] uppercase tracking-[0.06em] text-muted/70">{msg.reason}</p>
              </div>
            );
          }

          if (msg.role === "human") {
            const isContext = msg.isContext;
            return (
              <div key={i} className="flex items-start gap-2">
                <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${isContext ? "bg-clinical" : "bg-foreground"}`}>
                  <span className={`text-[8px] font-bold ${isContext ? "text-foreground" : "text-background"}`}>{msg.initial}</span>
                </div>
                <div className="max-w-[85%]">
                  <div
                    className={`rounded-lg rounded-tl-none px-3.5 py-2 ${isContext ? "border border-dashed border-border bg-surface" : "bg-elevated"}`}
                  >
                    <p className="text-[12.5px] leading-snug text-foreground">{msg.text}</p>
                  </div>
                  <p className={`ml-1 mt-0.5 text-[10px] font-medium ${isContext ? "text-muted" : "text-mint"}`}>
                    {msg.time} · {msg.name}
                    {isContext ? " · contexto interno" : " · Equipo"}
                  </p>
                </div>
              </div>
            );
          }

          if (msg.role === "resolved") {
            return (
              <div key={i} className="flex justify-center pt-1">
                <div className="flex items-center gap-1.5 rounded-full bg-mint/10 px-3 py-1">
                  <svg className="h-3 w-3 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-mint">{msg.text}</span>
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </>
  );
}

// Opens on Dental — the one example directly relevant to Boreas's audience
// (doctors), not a random industry (a médico landing on "Boutique" or "Gym"
// on first paint undersells the point).
const INITIAL_INDEX = Math.max(
  relevoExamples.findIndex((example) => example.chipLabel === "Dental"),
  0
);

export function RelevoExampleCarousel() {
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX);
  const [stackPhase, setStackPhase] = useState<"idle" | "shifting">("idle");
  const [textPhase, setTextPhase] = useState<"idle" | "out" | "preEnter">("idle");
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const activeExample = relevoExamples[activeIndex];
  const orderedExamples = relevoExamples.map((_, index) => relevoExamples[(activeIndex + index) % relevoExamples.length]);
  const stackExamples = orderedExamples.slice(0, 3);
  const [contextBefore, contextAfter] = activeExample.context.text.split(activeExample.context.emphasis);

  const goTo = (index: number) => {
    if (stackPhase !== "idle" || index === activeIndex) return;
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
  };

  const nextExample = () => goTo((activeIndex + 1) % relevoExamples.length);

  return (
    <div>
      {/* Industry chips */}
      <div className="flex flex-wrap gap-1.5">
        {relevoExamples.map((example, i) => (
          <button
            key={example.business.name}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver ejemplo: ${example.chipLabel}`}
            aria-pressed={activeIndex === i}
            className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2.5 py-1 text-[11px] font-medium transition-all ${
              activeIndex === i ? "bg-mint/10 text-mint ring-1 ring-mint/30" : "bg-surface text-muted hover:bg-elevated hover:text-foreground"
            }`}
          >
            <span aria-hidden="true">{example.chipIcon}</span>
            <span>{example.chipLabel}</span>
          </button>
        ))}
      </div>

      {/* Narrative */}
      <div
        className="mt-5 transition-all duration-500"
        style={{
          opacity: textPhase === "idle" ? 1 : 0,
          transform: textPhase === "out" ? "translate3d(-16px,0,0)" : textPhase === "preEnter" ? "translate3d(8px,0,0)" : "translate3d(0,0,0)",
        }}
      >
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{relevoExampleLabel}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted/60">{activeExample.business.channel}</p>
        </div>
        <p className="mt-2 font-display italic text-lg leading-snug text-foreground">{activeExample.quote}</p>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">
          {contextBefore}
          <strong className="font-medium text-foreground">{activeExample.context.emphasis}</strong>
          {contextAfter}
        </p>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-5 gap-y-3">
          <div>
            <p className="font-display text-lg sm:text-xl font-medium leading-none text-mint">{activeExample.stats.time}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">conversación</p>
          </div>
          <span className="h-8 w-px bg-border" />
          <div>
            <p className="font-display text-lg sm:text-xl font-medium leading-none text-mint">{activeExample.stats.sale}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">resultado</p>
          </div>
          <span className="h-8 w-px bg-border" />
          <div>
            <p className="font-display text-lg sm:text-xl font-medium leading-none text-mint">{activeExample.stats.effort}</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.06em] text-muted">tu equipo</p>
          </div>
        </div>
      </div>

      {/* Screen-reader-only transcript — the card stack below is fully
          aria-hidden (decorative, duplicated DOM for the depth effect), so
          this is the only path assistive tech has to the conversation. */}
      <div className="sr-only" aria-live="polite">
        {activeExample.business.name} — {activeExample.business.channel}.{" "}
        {activeExample.messages.map(messageToText).join(" ")}
      </div>

      {/* Card stack */}
      <button
        type="button"
        onClick={nextExample}
        aria-label="Ver el siguiente ejemplo"
        className="mt-6 block w-full cursor-pointer rounded-[var(--radius-sm)] text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
      >
        <StackedCards
          layers={stackExamples.map((preview, previewIndex): StackedCardLayer => ({
            key: `${preview.business.name}-${previewIndex}-${activeIndex}`,
            content: <ConversationCard preview={preview} isFrontCard={previewIndex === 0} />,
          }))}
          ghostLayers={relevoExamples.map((preview): StackedCardLayer => ({
            key: preview.business.name,
            content: <ConversationCard preview={preview} isFrontCard={true} />,
          }))}
          frontOverride={stackPhase === "shifting" ? { x: -30, y: -2, scale: 0.965, opacity: 0, blur: 5 } : undefined}
        />
      </button>

      {/* Dots + hint */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {relevoExamples.map((example, i) => (
            <span
              key={example.business.name}
              className={`rounded-full transition-all duration-300 ${activeIndex === i ? "h-1.5 w-4 bg-mint" : "h-1.5 w-1.5 bg-border"}`}
            />
          ))}
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-mint">toca para ver el siguiente</p>
      </div>
    </div>
  );
}
