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
  { short: "Agendamiento", name: "Inteligente" },
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
        <div className="flex justify-between text-[10px] font-mono text-white/40 px-0.5">
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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * 7;
    const rotateY = (mouseX / (rect.width / 2)) * 7;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  const activeScreen = motorScreens[activeIndex];
  const activeIcon = motorIcon[activeScreen.icon];
  const Icon = activeIcon;
  const accent = accentVar[activeScreen.accent];

  return (
    <div
      ref={ref}
      className="relative flex w-full flex-col items-center lg:items-end justify-center py-4 lg:py-0 min-w-0 overflow-visible"
    >
      {/* Main Container Shell for 3D Tilt */}
      <div
        className="relative w-full max-w-[480px] sm:max-w-[520px] perspective-1000"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            transform: isTouchDevice
              ? "none"
              : `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transition: "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
          }}
          className="relative w-full max-w-[480px] sm:max-w-[520px] shadow-2xl rounded-2xl border border-white/15 bg-[#1B1916]/95 p-5 backdrop-blur-xl transition-all duration-300"
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
          <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 shadow-inner transition-colors duration-300"
                style={{ backgroundColor: `color-mix(in oklch, ${accent} 20%, transparent)` }}
              >
                <Icon className="h-5 w-5 transition-colors duration-300" style={{ color: accent }} />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Dashboard Médico 24/7
                </h3>
                <p className="text-xs text-white/50 font-sans">Boreas Clinical Command Center</p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              24/7 Activo
            </span>
          </div>

          {/* Engine Selector Tabs */}
          <div className="relative z-10 my-4 grid grid-cols-4 gap-1.5 rounded-xl border border-white/10 bg-black/40 p-1.5">
            {motorScreens.map((screen, idx) => {
              const TabIcon = motorIcon[screen.icon];
              const tabAccent = accentVar[screen.accent];
              const isActive = activeIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleTabClick(idx)}
                  className={`relative flex flex-col items-center justify-center rounded-lg py-2 px-1 text-center transition-colors duration-200 ${
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
                    className="relative z-10 h-4 w-4 mb-1 transition-colors"
                    style={{ color: isActive ? tabAccent : "currentColor" }}
                  />
                  <span className="relative z-10 text-[11px] leading-tight block truncate w-full font-medium">
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
          <div className="relative z-10 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-300">
            <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: accent }}
                />
                <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {activeScreen.title}
                </h4>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
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
          <div className="relative z-10 flex items-center justify-between pt-3 mt-3 border-t border-white/10 text-[11px] text-white/50">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/60">
              {activeScreen.body}
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Auto-Conversión ON
            </span>
          </div>
        </div>
      </div>

      {/* HeroFeed Overlay - Live Notifications Ribbon */}
      <div className="w-full max-w-[480px] mt-4 lg:mt-0 lg:absolute lg:-bottom-8 lg:-left-10 lg:w-[300px] z-20">
        <div className="rounded-2xl border border-white/15 bg-[#131210]/95 p-3.5 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-white tracking-tight">Actividad en tiempo real</span>
            </div>
            <span className="text-[10px] font-mono text-white/40">Boreas Feed</span>
          </div>
          <div className="h-[180px] w-full">
            <HeroFeed />
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-clinical lg:hidden">{heroContent.proofBadge}</p>
    </div>
  );
});

HeroVisual.displayName = "HeroVisual";
