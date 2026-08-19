"use client";

import { forwardRef, useEffect, useRef, useState, useCallback } from "react";
import {
  Activity,
  Brain,
  CalendarCheck,
  NotebookPen,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BorderBeam } from "@/components/ui/border-beam";
import { HeroFeed } from "./hero-feed";
import { motorScreens, heroContent, type Accent, type MotorScreen } from "@/content/hero";

const accentVar: Record<Accent, string> = {
  amber: "var(--c-amber, #E2A33C)",
  mint: "var(--c-mint, #4FB39A)",
  lav: "var(--c-lav, #7E86E8)",
  rose: "var(--c-rose, #E0617E)",
};

const motorIcon: Record<MotorScreen["icon"], LucideIcon> = {
  brain: Brain,
  "notebook-pen": NotebookPen,
  activity: Activity,
  "calendar-check": CalendarCheck,
};

const engineTabLabels = [
  { short: "GAD-7", name: "Ansiedad" },
  { short: "Diario", name: "Emocional" },
  { short: "IMC", name: "Calculadora" },
  { short: "Citas", name: "Agendamiento inteligente" },
];

function EngineGad7View({ accent }: { accent: string }) {
  return (
    <div className="h-full flex flex-col justify-between py-0.5">
      <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Puntaje Obtenido</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-extrabold font-mono text-white">6</span>
            <span className="text-sm text-white/50 font-mono">/ 21</span>
          </div>
        </div>
        <div
          className="rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold border shadow-sm shrink-0"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 18%, transparent)`,
            borderColor: `color-mix(in oklch, ${accent} 35%, transparent)`,
            color: accent,
          }}
        >
          Ansiedad Leve
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 px-0.5">
        <div className="flex justify-between text-[11px] text-white/60">
          <span>Escala de Evaluación</span>
          <span style={{ color: accent }} className="font-mono font-medium">28% Nivel</span>
        </div>
        <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: "28%", backgroundColor: accent }}
          />
        </div>
      </div>

      {/* Sample item */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs leading-relaxed text-white/80">
        <div className="flex items-center gap-2 text-[11px] text-white/50 mb-1">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
          <span>Pregunta 3 de 7</span>
        </div>
        <p className="font-medium text-white/90 text-[11px] sm:text-xs line-clamp-2">&ldquo;¿Se ha sentido preocupado/a en exceso por diferentes cosas?&rdquo;</p>
        <span className="inline-block mt-1.5 text-[11px] font-mono text-emerald-400">✓ Respondido: Varios días (+1)</span>
      </div>
    </div>
  );
}

function EngineDiarioView({ accent }: { accent: string }) {
  const days = [
    { day: "L", level: 80 },
    { day: "M", level: 90 },
    { day: "X", level: 70 },
    { day: "J", level: 85 },
    { day: "V", level: 95 },
    { day: "S", level: 80 },
    { day: "D", level: 90 },
  ];

  return (
    <div className="h-full flex flex-col justify-between py-0.5">
      <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Registro Semanal</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-bold text-white">7 Días Consecutivos</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          </div>
        </div>
        <div
          className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg border shrink-0"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 15%, transparent)`,
            borderColor: `color-mix(in oklch, ${accent} 30%, transparent)`,
            color: accent,
          }}
        >
          <TrendingUp className="h-3.5 w-3.5 shrink-0" />
          <span>Ánimo estable</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
        <div className="flex items-end justify-between h-20 pt-1 px-1">
          {days.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 flex-1">
              <div className="w-full max-w-[18px] rounded-t-md bg-white/10 h-full flex items-end overflow-hidden">
                <div
                  className="w-full rounded-t-md transition-all duration-500"
                  style={{ height: `${item.level}%`, backgroundColor: accent }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/50">{item.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5 flex items-center justify-between text-xs text-white/80">
        <span className="flex items-center gap-1.5 truncate text-[11px] sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 shrink-0" style={{ color: accent }} />
          <span className="truncate">+45% Adherencia Pacientes</span>
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] text-white/50 shrink-0 ml-2">Sync Automático</span>
      </div>
    </div>
  );
}

function EngineImcView({ accent }: { accent: string }) {
  return (
    <div className="h-full flex flex-col justify-between py-0.5">
      <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Índice de Masa Corporal</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-3xl font-extrabold font-mono text-white">23.4</span>
            <span className="text-xs text-white/50 font-mono">kg/m²</span>
          </div>
        </div>
        <div
          className="rounded-lg px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-semibold border shadow-sm shrink-0"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 18%, transparent)`,
            borderColor: `color-mix(in oklch, ${accent} 35%, transparent)`,
            color: accent,
          }}
        >
          Rango Saludable
        </div>
      </div>

      {/* IMC Spectrum bar */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 space-y-2">
        <div className="h-3.5 w-full rounded-full bg-white/10 relative overflow-hidden flex p-0.5 gap-0.5">
          <div className="h-full rounded-l-full bg-sky-400/40 w-[25%]" />
          <div className="h-full bg-emerald-400/80 w-[35%] relative">
            {/* Marker */}
            <div className="absolute top-0 bottom-0 left-[60%] w-1.5 bg-white rounded-full shadow-md animate-pulse" />
          </div>
          <div className="h-full bg-amber-400/40 w-[25%]" />
          <div className="h-full rounded-r-full bg-rose-400/40 w-[15%]" />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-white/60 px-0.5">
          <span>18.5 (Bajo)</span>
          <span style={{ color: accent }} className="font-semibold">24.9 (Normo)</span>
          <span>30.0 (Sobre)</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
          <span className="text-[10px] text-white/50 uppercase tracking-wider font-mono block">Estatura</span>
          <span className="font-mono font-semibold text-white text-sm">172 cm</span>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
          <span className="text-[10px] text-white/50 uppercase tracking-wider font-mono block">Peso Actual</span>
          <span className="font-mono font-semibold text-white text-sm">69.2 kg</span>
        </div>
      </div>
    </div>
  );
}

function EngineAgendamientoView({ accent }: { accent: string }) {
  return (
    <div className="h-full flex flex-col justify-between py-0.5">
      <div className="flex items-center justify-between rounded-xl bg-white/[0.04] p-3 border border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono">Próxima Cita Reservada</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xl font-bold text-white">Mañana · 10:30 AM</span>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold px-2.5 py-1.5 rounded-lg border shadow-sm shrink-0"
          style={{
            backgroundColor: `color-mix(in oklch, ${accent} 18%, transparent)`,
            borderColor: `color-mix(in oklch, ${accent} 35%, transparent)`,
            color: accent,
          }}
        >
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>Confirmada</span>
        </div>
      </div>

      {/* Patient card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3 flex items-center gap-3">
        <div className="h-10 w-10 rounded-full border border-white/20 bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center font-bold text-white text-sm shrink-0">
          MC
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-white truncate">María Camila Ortiz</p>
          <p className="text-[11px] text-white/50 truncate">Primera Consulta Presencial</p>
        </div>
        <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-400" />
      </div>

      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 flex items-center justify-between text-xs text-emerald-300">
        <span className="flex items-center gap-2 truncate text-[11px] sm:text-xs">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="truncate">Recordatorio enviado por WhatsApp</span>
        </span>
        <ChevronRight className="h-3.5 w-3.5 text-emerald-400 shrink-0 ml-1" />
      </div>
    </div>
  );
}

export const HeroVisual = forwardRef<HTMLDivElement>((_, ref) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tiltFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });

  // Check mobile / coarse pointer for 3D tilt disabling
  useEffect(() => {
    const checkTouch = () => {
      const isCoarse = window.matchMedia("(pointer: coarse)").matches;
      const isSmallScreen = window.innerWidth < 768;
      setIsTouchDevice(isCoarse || isSmallScreen);
    };
    checkTouch();
    window.addEventListener("resize", checkTouch);
    return () => window.removeEventListener("resize", checkTouch);
  }, []);

  // Auto-rotate tabs every 4.5 seconds
  const startAutoRotation = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % motorScreens.length);
    }, 4500);
  }, []);

  useEffect(() => {
    startAutoRotation();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoRotation]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    startAutoRotation();
  };

  // 3D Tilt handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice || !cardRef.current) return;
    pointerRef.current = { x: e.clientX, y: e.clientY };
    if (tiltFrameRef.current !== null) return;

    tiltFrameRef.current = requestAnimationFrame(() => {
      tiltFrameRef.current = null;
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const mouseX = pointerRef.current.x - (rect.left + rect.width / 2);
      const mouseY = pointerRef.current.y - (rect.top + rect.height / 2);
      const rotateX = (-mouseY / (rect.height / 2)) * 7;
      const rotateY = (mouseX / (rect.width / 2)) * 7;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  };

  const handleMouseLeave = () => {
    if (tiltFrameRef.current !== null) {
      cancelAnimationFrame(tiltFrameRef.current);
      tiltFrameRef.current = null;
    }
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  };

  useEffect(
    () => () => {
      if (tiltFrameRef.current !== null) cancelAnimationFrame(tiltFrameRef.current);
    },
    []
  );

  const activeScreen = motorScreens[activeIndex];
  const activeIcon = motorIcon[activeScreen.icon];
  const Icon = activeIcon;
  const accent = accentVar[activeScreen.accent];

  return (
    <div
      ref={ref}
      className="relative flex min-w-0 w-full flex-col items-center justify-center py-4 lg:items-end lg:py-0"
    >
      {/* Main Container Shell for 3D Tilt */}
      <div
        className="relative w-full max-w-[480px] sm:max-w-[520px] lg:perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            transform: isTouchDevice
              ? "none"
              : "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
          }}
          className="relative w-full max-w-[480px] rounded-2xl border border-white/15 bg-[#1B1916]/95 p-3.5 shadow-xl sm:max-w-[520px] lg:p-5 lg:shadow-2xl lg:backdrop-blur-xl"
        >
          {/* Magic UI BorderBeam */}
          <BorderBeam size={280} duration={12} delay={0} colorFrom="var(--accent, #E27F62)" />

          {/* Ambient Glow matching active screen accent */}
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full blur-3xl opacity-20 transition-all duration-700"
            style={{ backgroundColor: accent }}
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full blur-3xl opacity-15 transition-all duration-700"
            style={{ backgroundColor: accent }}
          />

          {/* Dashboard Header */}
          <div className="relative z-10 flex items-center justify-between gap-2 border-b border-white/10 pb-3 lg:pb-4">
            <div className="flex min-w-0 items-center gap-2.5 lg:gap-3">
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/15 shadow-inner transition-colors duration-300 lg:size-10"
                style={{ backgroundColor: `color-mix(in oklch, ${accent} 20%, transparent)` }}
              >
                <Icon className="h-5 w-5 transition-colors duration-300" style={{ color: accent }} />
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-bold text-white lg:text-base">
                  Dashboard Médico 24/7
                </h3>
                <p className="truncate font-sans text-[10px] text-white/50 lg:text-xs">Boreas Clinical Command Center</p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-medium text-emerald-400 lg:px-3 lg:text-[11px]">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="lg:hidden">Activo</span>
              <span className="hidden lg:inline">24/7 Activo</span>
            </span>
          </div>

          {/* Engine Selector Tabs */}
          <div className="relative z-10 my-3 grid grid-cols-4 gap-1 rounded-xl border border-white/10 bg-black/40 p-1 lg:my-4 lg:gap-1.5 lg:p-1.5">
            {motorScreens.map((screen, idx) => {
              const TabIcon = motorIcon[screen.icon];
              const tabAccent = accentVar[screen.accent];
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleTabClick(idx)}
                  className={`relative flex min-h-11 min-w-0 flex-col items-center justify-center rounded-lg px-0.5 py-1.5 text-center transition-colors duration-200 lg:px-1 lg:py-2 ${
                    isActive
                      ? "text-white font-semibold"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                  }`}
                  style={{
                    borderColor: isActive ? `color-mix(in oklch, ${tabAccent} 40%, transparent)` : "transparent",
                  }}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeEngineTab"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/20 shadow-md z-0"
                    />
                  )}
                  <TabIcon
                    className="relative z-10 mb-0.5 size-3.5 transition-colors lg:mb-1 lg:size-4"
                    style={{ color: isActive ? tabAccent : "currentColor" }}
                  />
                  <span className="relative z-10 block w-full truncate text-[9px] font-medium leading-tight lg:text-[11px]">
                    {engineTabLabels[idx].short}
                  </span>
                  {isActive && (
                    <span
                      className="relative z-10 absolute bottom-0.5 h-1 w-6 rounded-full"
                      style={{ backgroundColor: tabAccent }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dynamic Active Engine Content */}
          <div className="relative z-10 rounded-xl border border-white/10 bg-white/[0.03] p-3 lg:p-4 lg:backdrop-blur-md">
            <div className="mb-2.5 flex items-center justify-between border-b border-white/10 pb-2 lg:mb-3 lg:pb-2.5">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {activeScreen.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/60">
                Motor #{activeIndex + 1}
              </span>
            </div>

            <div className="h-[245px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="h-full"
                >
                  {activeIndex === 0 && <EngineGad7View accent={accent} />}
                  {activeIndex === 1 && <EngineDiarioView accent={accent} />}
                  {activeIndex === 2 && <EngineImcView accent={accent} />}
                  {activeIndex === 3 && <EngineAgendamientoView accent={accent} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer status */}
          <div className="relative z-10 mt-2.5 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5 text-[11px] text-white/50 lg:mt-3 lg:pt-3">
            <span className="min-w-0 truncate font-mono text-[9px] uppercase text-white/60 lg:text-[10px]">
              {activeScreen.body}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-[9px] font-medium text-emerald-400 lg:text-[10px]">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              <span className="lg:hidden">Auto ON</span>
              <span className="hidden lg:inline">Auto-Conversión ON</span>
            </span>
          </div>
        </div>
      </div>

      {/* HeroFeed Overlay - Live Notifications Ribbon */}
      <div className="z-20 mt-3 w-full max-w-[480px] sm:mt-4 lg:absolute lg:-bottom-8 lg:-left-10 lg:mt-0 lg:w-[300px]">
        <div className="rounded-2xl border border-white/15 bg-[#131210]/95 p-3 shadow-xl sm:p-3.5 sm:shadow-2xl lg:backdrop-blur-xl">
          <div className="mb-2 flex items-center justify-between border-b border-white/10 pb-2 sm:mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-white tracking-tight">Actividad en tiempo real</span>
            </div>
            <span className="text-[10px] font-mono text-white/60">Boreas Feed</span>
          </div>
          <div className="h-[132px] w-full sm:h-[156px] lg:h-[180px]">
            <HeroFeed />
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-foreground lg:hidden">{heroContent.proofBadge}</p>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
