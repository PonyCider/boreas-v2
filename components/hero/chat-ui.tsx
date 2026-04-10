"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode, Ref } from "react";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ChatUIMode = "static" | "simulator";
type LogEntryStatus = "idle" | "running" | "done";

const INCOMING_MESSAGE = "Me encantaría. ¿Qué día tienen disponible?";
const BOREAS_REPLY =
  "¡Claro! Tengo un espacio este domingo 21 de junio a las 4:30 PM. ¿Te lo confirmo?";

/* ─── Activity Log data (telemetry-style) ─── */
interface LogEntry {
  tag: string;
  label: string;
  output: string;
}

const ENGINE_LOG: LogEntry[] = [
  { tag: "INTENT",   label: "Clasif. intención",  output: "scheduling · 0.97" },
  { tag: "EXTRACT",  label: "Extracción",         output: "periodo: semana" },
  { tag: "QUERY",    label: "Disponibilidad",      output: "3 slots" },
  { tag: "MATCH",    label: "Match horario",       output: "dom 21/06 16:30" },
  { tag: "COMPOSE",  label: "Respuesta",           output: "42 tok · brand_v2" },
];

function createInitialLogStates(): LogEntryStatus[] {
  return ENGINE_LOG.map(() => "idle");
}

/* ─── Timestamp generator (fake real-time) ─── */
function formatTimestamp(offsetMs: number): string {
  const base = new Date(2025, 6, 11, 9, 14, 2, 331);
  const t = new Date(base.getTime() + offsetMs);
  const hh = String(t.getHours()).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  const ss = String(t.getSeconds()).padStart(2, "0");
  const ms = String(t.getMilliseconds()).padStart(3, "0");
  return `${hh}:${mm}:${ss}.${ms}`;
}

/* ─── Shared UI primitives ─── */

function MessageBubble({
  align = "left",
  sender,
  text,
  containerRef,
  children,
  muted = false,
}: {
  align?: "left" | "right";
  sender: string;
  text?: string;
  containerRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
  muted?: boolean;
}) {
  const isRight = align === "right";

  return (
    <div
      ref={containerRef}
      className={`flex w-full ${isRight ? "justify-end" : "justify-start"} ${
        muted ? "opacity-60" : ""
      }`}
    >
      <div
        className={`max-w-[24rem] rounded-[1.5rem] px-4 py-3 ${
          isRight
            ? "rounded-br-md bg-[#d4c0a1] text-[#0f1215]"
            : "rounded-bl-md border border-white/8 bg-white/[0.04] text-[#f5f1ea]"
        } ${muted ? "border-white/6 bg-white/[0.025]" : ""}`}
      >
        <p
          className={`text-[0.68rem] uppercase tracking-[0.28em] ${
            isRight ? "text-black/55" : "text-white/35"
          }`}
        >
          {sender}
        </p>
        {children ?? <p className="mt-2 text-sm leading-6">{text}</p>}
      </div>
    </div>
  );
}

function QuickReply({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-left text-xs font-medium tracking-[0.08em] text-[#d8d0c4] transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.08]"
    >
      {label}
    </button>
  );
}

/* ─── Activity Log Entry (replaces old EngineStepRow) ─── */

function ActivityLogEntry({
  entry,
  status,
  timestamp,
  rowRef,
}: {
  entry: LogEntry;
  status: LogEntryStatus;
  timestamp: string;
  rowRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={rowRef}
      className={`flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-[10px] leading-4 transition-all duration-500 ${
        status === "done"
          ? "border-[#d4c0a1]/12 bg-[#14171a]"
          : status === "running"
            ? "border-white/10 bg-[#111418]"
            : "border-white/5 bg-transparent"
      }`}
    >
      {/* Timestamp */}
      <span className={`hidden shrink-0 tabular-nums sm:inline ${status === "idle" ? "text-white/15" : "text-white/30"}`}>
        {status !== "idle" ? timestamp : "──:──:──"}
      </span>

      {/* Tag */}
      <span
        className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
          status === "done"
            ? "bg-[#d4c0a1]/12 text-[#d4c0a1]"
            : status === "running"
              ? "bg-white/8 text-white/60"
              : "bg-white/4 text-white/18"
        }`}
      >
        {entry.tag}
      </span>

      {/* Label + Output (single line, truncated) */}
      <span className={`min-w-0 flex-1 truncate ${status === "idle" ? "text-white/20" : "text-white/60"}`}>
        {entry.label}
        {status === "done" && (
          <span className="ml-1 text-[#d4c0a1]/70">→ {entry.output}</span>
        )}
        {status === "running" && (
          <span className="ml-1 inline-block h-2.5 w-px animate-pulse bg-white/50" />
        )}
      </span>
    </div>
  );
}

/* ─── Confirmed Appointment Card (embedded in Boreas reply) ─── */

function AppointmentCard({ containerRef }: { containerRef?: Ref<HTMLDivElement> }) {
  return (
    <div ref={containerRef} className="mt-2.5 rounded-xl border border-[#d4c0a1]/15 bg-[#171b20] px-3.5 py-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-[#f5f1ea]">Consulta inicial</p>
        <span className="rounded-full bg-[#d4c0a1]/12 px-2 py-0.5 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-[#d4c0a1]">
          confirmada
        </span>
      </div>
      <div className="mt-2 flex items-center gap-3 text-[11px] text-white/40">
        <span>Dom 21 Jun</span>
        <span className="h-0.5 w-0.5 rounded-full bg-white/25" />
        <span>4:30 PM</span>
        <span className="h-0.5 w-0.5 rounded-full bg-white/25" />
        <span>30 min</span>
      </div>
    </div>
  );
}

/* ─── Progress Bar ─── */

function SimulationProgressBar({ progressRef }: { progressRef: Ref<HTMLDivElement> }) {
  return (
    <div className="relative h-0.5 w-full bg-white/5">
      <div
        ref={progressRef}
        className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-[#d4c0a1]/60 to-[#d4c0a1] shadow-[0_0_8px_rgba(212,192,161,0.4)]"
      />
    </div>
  );
}

/* ═══════════════════════════════════════
   STATIC CHAT UI (Hero)
   ═══════════════════════════════════════ */

function StaticChatUI() {
  return (
    <>
      <div className="grid flex-1 gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col gap-4">
          <MessageBubble align="right" sender="Cliente" text="Hola, ¿tienen citas disponibles?" />
          <MessageBubble
            sender="Boreas"
            text="Sí, te muestro los horarios disponibles para hoy y mañana."
          />

          <div className="flex flex-wrap gap-2 pl-1">
            <QuickReply label="Hoy 5:30 PM" />
            <QuickReply label="Mañana 11:00 AM" />
            <QuickReply label="Ver más horarios" />
          </div>

          <MessageBubble sender="Boreas">
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/35">Boreas</p>
            <p className="mt-2 text-sm leading-6">
              Perfecto, te agendo para hoy a las 5:30 PM. Te envío confirmación y recordatorio automático.
            </p>
            <AppointmentCard />
          </MessageBubble>
        </div>

        {/* Reservation card (simplified) */}
        <div className="rounded-[1.65rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
            Reserva sugerida
          </p>

          <div className="mt-4 rounded-[1.35rem] border border-[#d4c0a1]/12 bg-[#171b20] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#f5f1ea]">
                  Consulta inicial
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.22em] text-white/28">
                  30 min · Confirmación automática
                </p>
              </div>
              <span className="rounded-full border border-[#d4c0a1]/18 px-3 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#d4c0a1]">
                hoy
              </span>
            </div>

            <div className="mt-5 space-y-3">
              {["5:30 PM", "6:15 PM", "7:00 PM"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="flex w-full items-center justify-between rounded-2xl border border-white/8 bg-black/20 px-3.5 py-3 text-sm text-[#f5f1ea] transition-colors duration-300 hover:border-[#d4c0a1]/25 hover:bg-black/35"
                >
                  <span>{slot}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/30">
                    reservar
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/6 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-[1.3rem] border border-white/8 bg-black/20 px-4 py-3">
          <p className="text-sm text-white/38">Responder como Boreas</p>
          <span className="rounded-full bg-[#d4c0a1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#0f1215]">
            Enviar horarios
          </span>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   INTERACTIVE CHAT UI (Simulator)
   ═══════════════════════════════════════ */

function InteractiveChatUI() {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const userBubbleRef = useRef<HTMLDivElement>(null);
  const typingBubbleRef = useRef<HTMLDivElement>(null);
  const replyBubbleRef = useRef<HTMLDivElement>(null);
  const appointmentCardRef = useRef<HTMLDivElement>(null);
  const inputCursorRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chatPanelRef = useRef<HTMLDivElement>(null);
  const enginePanelRef = useRef<HTMLDivElement>(null);
  const logRefs = useRef<Array<HTMLDivElement | null>>([]);
  const typingDotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const typingLoopRef = useRef<gsap.core.Tween | null>(null);
  const autoTriggerRef = useRef<gsap.core.Tween | null>(null);
  const cursorTweenRef = useRef<gsap.core.Tween | null>(null);
  const startSimulationRef = useRef<(() => void) | null>(null);

  const [phase, setPhase] = useState<"idle" | "engine" | "typing" | "done">("idle");
  const [logStates, setLogStates] = useState<LogEntryStatus[]>(createInitialLogStates);
  const [logTimestamps, setLogTimestamps] = useState<string[]>(ENGINE_LOG.map(() => ""));

  useGSAP(
    (_context, contextSafe) => {
      if (!simulatorRef.current) {
        return;
      }

      const wrapContextSafe =
        contextSafe ?? ((callback: () => void) => callback);

      const logElements = logRefs.current.filter(
        (element): element is HTMLDivElement => element !== null,
      );
      const typingDots = typingDotRefs.current.filter(
        (element): element is HTMLSpanElement => element !== null,
      );

      cursorTweenRef.current = gsap.to(inputCursorRef.current, {
        autoAlpha: 0.16,
        duration: 0.58,
        ease: "none",
        repeat: -1,
        yoyo: true,
      });

      const resetSimulation = wrapContextSafe(() => {
        timelineRef.current?.kill();
        autoTriggerRef.current?.kill();
        typingLoopRef.current?.pause(0);
        cursorTweenRef.current?.play(0);

        setPhase("idle");
        setLogStates(createInitialLogStates());
        setLogTimestamps(ENGINE_LOG.map(() => ""));

        gsap.set(userBubbleRef.current, { autoAlpha: 0, y: 18, clearProps: "scale" });
        gsap.set(typingBubbleRef.current, { autoAlpha: 0, y: 12 });
        gsap.set(replyBubbleRef.current, { autoAlpha: 0, y: 18, filter: "blur(4px)" });
        gsap.set(appointmentCardRef.current, { autoAlpha: 0, y: 10, scaleY: 0.9 });
        gsap.set(inputCursorRef.current, { autoAlpha: 1 });
        gsap.set(logElements, { autoAlpha: 0, y: 10 });
        gsap.set(progressBarRef.current, { width: "0%" });

        // Reset focus states
        gsap.set(chatPanelRef.current, { opacity: 1 });
        gsap.set(enginePanelRef.current, { opacity: 0.5 });
      });

      const setSingleLogStatus = (targetIndex: number, status: LogEntryStatus) => {
        setLogStates((current) =>
          current.map((s, i) => (i === targetIndex ? status : s)),
        );
      };

      const setSingleTimestamp = (targetIndex: number, offsetMs: number) => {
        setLogTimestamps((current) =>
          current.map((ts, i) => (i === targetIndex ? formatTimestamp(offsetMs) : ts)),
        );
      };

      typingLoopRef.current = gsap.to(typingDots, {
        y: -2,
        opacity: 1,
        duration: 0.32,
        ease: "power1.inOut",
        stagger: { each: 0.08, repeat: -1, yoyo: true },
        paused: true,
      });

      const startSimulation = wrapContextSafe(() => {
        if (timelineRef.current?.isActive()) {
          return;
        }

        resetSimulation();
        setPhase("engine");
        cursorTweenRef.current?.pause(0);
        gsap.set(inputCursorRef.current, { autoAlpha: 0 });

        const tl = gsap.timeline({
          defaults: { overwrite: "auto" },
          onComplete: () => {
            setPhase("done");
          },
        });

        timelineRef.current = tl;

        /* ── Phase 1: User message appears, chat in focus ── */
        tl.to(userBubbleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
        });

        /* ── Phase 2: Engine takes focus ── */
        tl.to(enginePanelRef.current, {
          opacity: 1,
          duration: 0.5,
          ease: "power2.inOut",
        }, ">0.3");

        // Progress bar starts
        tl.to(progressBarRef.current, {
          width: "85%",
          duration: 3.8,
          ease: "power1.inOut",
        }, "<");

        /* ── Log entries appear sequentially ── */
        let cumulativeOffset = 0;
        ENGINE_LOG.forEach((_entry, index) => {
          const stepOffset = cumulativeOffset;

          tl.add(() => {
            setSingleLogStatus(index, "running");
            setSingleTimestamp(index, stepOffset);
          }, ">0.06")
            .to(
              logElements[index],
              { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" },
              "<",
            )
            .to({}, { duration: 0.45 })
            .add(() => {
              setSingleLogStatus(index, "done");
            });

          cumulativeOffset += 380 + Math.floor(Math.random() * 200);
        });

        /* ── Phase 3: Chat back in focus, Boreas types ── */
        tl.to(enginePanelRef.current, {
          opacity: 0.6,
          duration: 0.5,
          ease: "power2.inOut",
        }, ">0.15");

        tl.add(() => {
          setPhase("typing");
          typingLoopRef.current?.play(0);
        }, ">0.1");
        tl.to(typingBubbleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.25,
          ease: "power2.out",
        });
        tl.to({}, { duration: 0.82 });
        tl.add(() => {
          typingLoopRef.current?.pause(0);
        });
        tl.to(typingBubbleRef.current, {
          autoAlpha: 0,
          y: 10,
          duration: 0.2,
          ease: "power2.in",
        });

        /* ── Boreas reply with appointment card ── */
        tl.to(replyBubbleRef.current, {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.46,
          ease: "power2.out",
        });
        tl.to(appointmentCardRef.current, {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
          duration: 0.35,
          ease: "back.out(1.7)",
        }, ">0.12");

        // Progress bar completes
        tl.to(progressBarRef.current, {
          width: "100%",
          duration: 0.4,
          ease: "power2.out",
        }, "<");
      });

      startSimulationRef.current = startSimulation;
      resetSimulation();

      const trigger = ScrollTrigger.create({
        trigger: simulatorRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          autoTriggerRef.current?.kill();
          autoTriggerRef.current = gsap.delayedCall(0.9, startSimulation);
        },
      });

      return () => {
        trigger.kill();
        autoTriggerRef.current?.kill();
        timelineRef.current?.kill();
        typingLoopRef.current?.kill();
        cursorTweenRef.current?.kill();
        startSimulationRef.current = null;
      };
    },
    { scope: simulatorRef, dependencies: [] },
  );

  const handleSend = () => {
    autoTriggerRef.current?.kill();
    startSimulationRef.current?.();
  };

  const buttonLabel =
    phase === "done"
      ? "Repetir demo"
      : phase === "engine" || phase === "typing"
        ? "Procesando"
        : "Enviar";
  const inputPreview = phase === "idle" ? INCOMING_MESSAGE : "";

  return (
    <>
      <SimulationProgressBar progressRef={progressBarRef} />

      <div
        ref={simulatorRef}
        className="grid flex-1 gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]"
      >
        {/* Chat panel */}
        <div ref={chatPanelRef} className="flex min-h-0 flex-col justify-end">
          <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[#d4c0a1]/60">Lo que ves</p>
          <div
            className="relative flex max-w-[31rem] flex-col gap-1.5"
            style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 12%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 12%)" }}
          >

            {/* Conversation history (pre-existing) */}
            <MessageBubble align="right" sender="Cliente" text="Me recomendaron con ustedes." muted />
            <MessageBubble sender="Boreas" text="Excelentes noticias. ¿Te gustaría agendar una cita?" muted />

            {/* Current demo flow */}
            <MessageBubble
              align="right"
              sender="Cliente"
              text={INCOMING_MESSAGE}
              containerRef={userBubbleRef}
            />

            <div ref={typingBubbleRef} className="flex justify-start">
              <div className="rounded-[1.5rem] rounded-bl-md border border-white/8 bg-white/[0.04] px-4 py-3 text-[#f5f1ea]">
                <p className="text-[0.68rem] uppercase tracking-[0.28em] text-white/35">
                  Boreas
                </p>
                <div className="mt-2 flex items-center gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <span
                      key={dot}
                      ref={(element) => {
                        typingDotRefs.current[dot] = element;
                      }}
                      className="h-2 w-2 rounded-full bg-white/55 opacity-35"
                    />
                  ))}
                </div>
              </div>
            </div>

            <MessageBubble
              sender="Boreas"
              containerRef={replyBubbleRef}
            >
              <p className="mt-2 text-sm leading-6">{BOREAS_REPLY}</p>
              <AppointmentCard containerRef={appointmentCardRef} />
            </MessageBubble>
          </div>
        </div>

        {/* Engine Activity Log */}
        <div ref={enginePanelRef} className="flex min-w-0 flex-col gap-3 transition-opacity duration-500 lg:min-w-[20rem]">
          <p className="mb-0 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[#d4c0a1]/60">La magia detrás</p>
          <div className="flex flex-1 flex-col rounded-[1.65rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
                Activity Log
              </p>
              <span className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[0.56rem] uppercase tracking-wider ${
                phase === "done"
                  ? "bg-[#d4c0a1]/12 text-[#d4c0a1]"
                  : phase === "engine"
                    ? "bg-white/6 text-white/50"
                    : "bg-white/4 text-white/20"
              }`}>
                {(phase === "engine" || phase === "typing") && (
                  <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
                {phase === "done" ? "complete" : phase === "engine" || phase === "typing" ? "processing" : "standby"}
              </span>
            </div>

            <div className="mt-4 flex-1 space-y-2">
              {ENGINE_LOG.map((entry, index) => (
                <ActivityLogEntry
                  key={entry.tag}
                  entry={entry}
                  status={logStates[index]}
                  timestamp={logTimestamps[index]}
                  rowRef={(element) => {
                    logRefs.current[index] = element;
                  }}
                />
              ))}
            </div>
          </div>

          {/* Engine Summary */}
          <div className="min-h-[5rem] rounded-[1.35rem] border border-white/8 bg-black/18 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="font-mono text-xs text-[#f5f1ea]/70">Estado</p>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  phase === "done"
                    ? "bg-[#d4c0a1]"
                    : phase === "engine" || phase === "typing"
                      ? "bg-white/50 animate-pulse"
                      : "bg-white/18"
                }`}
              />
            </div>
            <p className="mt-1.5 font-mono text-[11px] leading-5 text-white/40">
              {phase === "idle" && "Esperando mensaje entrante…"}
              {phase === "engine" && "Pipeline en ejecución — clasificando y extrayendo…"}
              {phase === "typing" && "Componiendo respuesta con voice model…"}
              {phase === "done" && "Flujo completado · respuesta entregada · cita confirmada"}
            </p>
          </div>
        </div>
      </div>

      {/* Input bar */}
      <div className="border-t border-white/6 px-5 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 rounded-[1.3rem] border border-white/8 bg-black/20 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[0.62rem] uppercase tracking-[0.24em] text-white/28">
              Mensaje entrante
            </p>
            <div className="mt-1 flex min-h-6 items-center gap-1 overflow-hidden">
              <span
                className={`truncate text-sm ${
                  phase === "idle" ? "text-[#f5f1ea]/72" : "text-white/18"
                }`}
              >
                {inputPreview || "\u00A0"}
              </span>
              <span
                ref={inputCursorRef}
                className={`h-4 w-px shrink-0 bg-[#d4c0a1] ${
                  phase === "idle" ? "" : "hidden"
                }`}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={phase === "engine" || phase === "typing"}
            className="rounded-full bg-[#d4c0a1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#0f1215] transition-colors duration-300 hover:bg-[#dfcfb8] disabled:cursor-not-allowed disabled:bg-[#d4c0a1]/45 disabled:text-[#0f1215]/55"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════ */

export function ChatUI({ mode = "static" }: { mode?: ChatUIMode }) {
  return (
    <div className="flex h-full flex-col bg-[linear-gradient(180deg,rgba(24,28,33,0.98),rgba(11,13,16,0.98))]">
      <div className="flex items-center justify-between border-b border-white/6 px-5 py-4 sm:px-6">
        <div>
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
            Boreas Flow
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#d4c0a1] shadow-[0_0_14px_rgba(212,192,161,0.5)]" />
            <span className="text-sm text-[#f5f1ea]">Concierge activo</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[0.62rem] uppercase tracking-[0.24em] text-white/28">
          <span className="rounded-full border border-white/8 px-3 py-1.5">
            WhatsApp
          </span>
          <span className="rounded-full border border-white/8 px-3 py-1.5">
            24/7
          </span>
        </div>
      </div>

      {mode === "simulator" ? <InteractiveChatUI /> : <StaticChatUI />}
    </div>
  );
}
