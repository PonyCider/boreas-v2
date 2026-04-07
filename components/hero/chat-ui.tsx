"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ReactNode, Ref } from "react";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type ChatUIMode = "static" | "simulator";
type StepStatus = "idle" | "loading" | "done";

const INCOMING_MESSAGE = "Hola, ¿tienen disponibilidad para esta semana?";
const BOREAS_REPLY =
  "Sí, tengo disponibilidad este jueves a las 4:30pm. ¿Te lo agendo?";

const ENGINE_STEPS = [
  "Analizando intención...",
  "Extrayendo datos...",
  "Consultando agenda...",
  "Optimizando horario...",
  "Confirmando disponibilidad...",
];

function createInitialStepStates(): StepStatus[] {
  return ENGINE_STEPS.map(() => "idle");
}

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

function EngineStepRow({
  label,
  status,
  rowRef,
}: {
  label: string;
  status: StepStatus;
  rowRef?: Ref<HTMLDivElement>;
}) {
  const statusLabel =
    status === "loading" ? "procesando" : status === "done" ? "completo" : "pendiente";

  return (
    <div
      ref={rowRef}
      className={`flex h-[4.5rem] min-w-0 items-center justify-between gap-3 overflow-hidden rounded-2xl border px-3.5 py-3 transition-colors duration-300 ${
        status === "done"
          ? "border-[#d4c0a1]/16 bg-[#1a1f24]"
          : status === "loading"
            ? "border-white/12 bg-black/28"
            : "border-white/8 bg-black/18"
      }`}
    >
      <p className="min-w-0 flex-1 truncate whitespace-nowrap pr-2 text-sm text-[#f5f1ea]">
        {label}
      </p>
      <div
        className={`inline-flex min-w-[8.8rem] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.22em] ${
          status === "done"
            ? "bg-[#d4c0a1]/12 text-[#d4c0a1]"
            : status === "loading"
              ? "bg-white/[0.06] text-white/54"
              : "bg-white/[0.04] text-white/24"
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            status === "done"
              ? "bg-[#d4c0a1]"
              : status === "loading"
                ? "bg-white/70"
                : "bg-white/18"
          }`}
        />
        {statusLabel}
      </div>
    </div>
  );
}

function StaticChatUI() {
  return (
    <>
      <div className="grid flex-1 gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]">
        <div className="flex flex-col gap-4">
          <MessageBubble align="right" sender="Clienta" text="Hola, ¿tienen citas?" />
          <MessageBubble
            sender="Boreas"
            text="Sí, te muestro horarios disponibles para hoy y mañana."
          />

          <div className="flex flex-wrap gap-2 pl-1">
            <QuickReply label="Hoy 5:30 PM" />
            <QuickReply label="Mañana 11:00 AM" />
            <QuickReply label="Ver más horarios" />
          </div>

          <MessageBubble
            sender="Boreas"
            text="También puedo confirmar el servicio, enviar recordatorio y pedir anticipo si lo necesitas."
          />
        </div>

        <div className="rounded-[1.65rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
          <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
            Reserva sugerida
          </p>

          <div className="mt-4 rounded-[1.35rem] border border-[#d4c0a1]/12 bg-[#171b20] px-4 py-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#f5f1ea]">
                  Lifting de pestañas
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/28">
                  55 min · Confirmación automática
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

          <div className="mt-4 rounded-[1.35rem] border border-white/8 bg-black/18 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#f5f1ea]">Seguimiento post cita</p>
              <span className="rounded-full bg-[#d4c0a1]/12 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#d4c0a1]">
                activo
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-white/44">
              Mensaje automático 24 horas después para pedir reseña y ofrecer
              rebooking.
            </p>
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

function InteractiveChatUI() {
  const simulatorRef = useRef<HTMLDivElement>(null);
  const userBubbleRef = useRef<HTMLDivElement>(null);
  const typingBubbleRef = useRef<HTMLDivElement>(null);
  const replyBubbleRef = useRef<HTMLDivElement>(null);
  const inputCursorRef = useRef<HTMLSpanElement>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);
  const typingDotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const typingLoopRef = useRef<gsap.core.Tween | null>(null);
  const autoTriggerRef = useRef<gsap.core.Tween | null>(null);
  const cursorTweenRef = useRef<gsap.core.Tween | null>(null);
  const startSimulationRef = useRef<(() => void) | null>(null);

  const [phase, setPhase] = useState<"idle" | "running" | "typing" | "done">("idle");
  const [stepStates, setStepStates] = useState<StepStatus[]>(createInitialStepStates);
  const [engineSummary, setEngineSummary] = useState(
    "Esperando el mensaje para iniciar el flujo.",
  );

  useGSAP(
    (_context, contextSafe) => {
      if (!simulatorRef.current) {
        return;
      }

      const wrapContextSafe =
        contextSafe ?? ((callback: () => void) => callback);

      const stepElements = stepRefs.current.filter(
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
        setStepStates(createInitialStepStates());
        setEngineSummary("Esperando el mensaje para iniciar el flujo.");

        gsap.set(userBubbleRef.current, {
          autoAlpha: 0,
          y: 18,
          clearProps: "scale",
        });
        gsap.set(typingBubbleRef.current, {
          autoAlpha: 0,
          y: 12,
        });
        gsap.set(replyBubbleRef.current, {
          autoAlpha: 0,
          y: 18,
          filter: "blur(4px)",
        });
        gsap.set(inputCursorRef.current, {
          autoAlpha: 1,
        });
        gsap.set(stepElements, {
          autoAlpha: 0,
          y: 14,
        });
      });

      const setSingleStepStatus = (targetIndex: number, status: StepStatus) => {
        setStepStates((currentStates) =>
          currentStates.map((currentStatus, index) =>
            index === targetIndex ? status : currentStatus,
          ),
        );
      };

      typingLoopRef.current = gsap.to(typingDots, {
        y: -2,
        opacity: 1,
        duration: 0.32,
        ease: "power1.inOut",
        stagger: {
          each: 0.08,
          repeat: -1,
          yoyo: true,
        },
        paused: true,
      });

      const startSimulation = wrapContextSafe(() => {
        if (timelineRef.current?.isActive()) {
          return;
        }

        resetSimulation();
        setPhase("running");
        setEngineSummary("Mensaje recibido. Boreas está procesando la conversación.");
        cursorTweenRef.current?.pause(0);
        gsap.set(inputCursorRef.current, {
          autoAlpha: 0,
        });

        const timeline = gsap.timeline({
          defaults: {
            overwrite: "auto",
          },
          onComplete: () => {
            setPhase("done");
            setEngineSummary("Disponibilidad confirmada y lista para agendar.");
          },
        });

        timelineRef.current = timeline;

        timeline.to(userBubbleRef.current, {
          autoAlpha: 1,
          y: 0,
          duration: 0.42,
          ease: "power2.out",
        });

        ENGINE_STEPS.forEach((step, index) => {
          timeline
            .add(() => {
              setEngineSummary(step);
              setSingleStepStatus(index, "loading");
            }, ">0.08")
            .to(
              stepElements[index],
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.3,
                ease: "power2.out",
              },
              "<",
            )
            .to(
              {},
              {
                duration: 0.5,
              },
            )
            .add(() => {
              setSingleStepStatus(index, "done");
            });
        });

        timeline
          .add(() => {
            setPhase("typing");
            setEngineSummary("Boreas redactando la mejor respuesta disponible.");
            typingLoopRef.current?.play(0);
          }, ">0.12")
          .to(typingBubbleRef.current, {
            autoAlpha: 1,
            y: 0,
            duration: 0.25,
            ease: "power2.out",
          })
          .to(
            {},
            {
              duration: 0.82,
            },
          )
          .add(() => {
            typingLoopRef.current?.pause(0);
          })
          .to(typingBubbleRef.current, {
            autoAlpha: 0,
            y: 10,
            duration: 0.2,
            ease: "power2.in",
          })
          .to(replyBubbleRef.current, {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.46,
            ease: "power2.out",
          });
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
    phase === "done" ? "Repetir demo" : phase === "running" || phase === "typing" ? "Procesando" : "Enviar";
  const inputPreview = phase === "idle" ? INCOMING_MESSAGE : "";

  return (
    <>
      <div
        ref={simulatorRef}
        className="grid flex-1 gap-4 px-5 py-5 sm:px-6 lg:grid-cols-[1.25fr_0.75fr]"
      >
        <div className="flex min-h-0 flex-col">
          <div className="mt-auto flex max-w-[31rem] flex-col gap-2.5">
            <MessageBubble
              align="right"
              sender="Clienta"
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
              text={BOREAS_REPLY}
            />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4 lg:min-w-[24rem]">
          <div className="rounded-[1.65rem] border border-white/8 bg-white/[0.03] p-4 shadow-[0_18px_60px_rgba(0,0,0,0.16)]">
            <p className="text-[0.62rem] uppercase tracking-[0.34em] text-white/28">
              AI Engine Activity
            </p>

            <div className="mt-4 space-y-3">
              {ENGINE_STEPS.map((step, index) => (
                <EngineStepRow
                  key={step}
                  label={step}
                  status={stepStates[index]}
                  rowRef={(element) => {
                    stepRefs.current[index] = element;
                  }}
                />
              ))}
            </div>
          </div>

          <div className="min-h-[8.25rem] rounded-[1.35rem] border border-white/8 bg-black/18 px-4 py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#f5f1ea]">Estado del motor</p>
              <span className="rounded-full bg-[#d4c0a1]/12 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.24em] text-[#d4c0a1]">
                {phase === "done"
                  ? "listo"
                  : phase === "running" || phase === "typing"
                    ? "activo"
                    : "espera"}
              </span>
            </div>
            <p className="mt-2 min-h-[3rem] text-sm leading-6 text-white/44">
              {engineSummary}
            </p>
          </div>
        </div>
      </div>

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
            disabled={phase === "running" || phase === "typing"}
            className="rounded-full bg-[#d4c0a1] px-3.5 py-2 text-[0.62rem] font-medium uppercase tracking-[0.24em] text-[#0f1215] transition-colors duration-300 hover:bg-[#dfcfb8] disabled:cursor-not-allowed disabled:bg-[#d4c0a1]/45 disabled:text-[#0f1215]/55"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </>
  );
}

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
