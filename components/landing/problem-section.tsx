"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { SectionFrame } from "./boreas-landing-sections";
import { painPoints, problemStats, problemStatsSources } from "@/content/boreas-home";
import { useAnimatedNumber } from "@/lib/use-animated-number";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const statAccents = [
  { color: "var(--c-amber)", borderColor: "var(--c-amber)" },
  { color: "var(--c-lav)",   borderColor: "var(--c-lav)" },
];

// A stat value like "84%" or "3×" — split into an animatable number and its suffix.
function splitStatValue(raw: string) {
  const match = raw.match(/^([\d.]+)(.*)$/);
  if (!match) return { num: null, suffix: raw };
  return { num: parseFloat(match[1]), suffix: match[2] };
}

function StatNumber({ raw, reduceMotion }: { raw: string; reduceMotion: boolean | null }) {
  const { num, suffix } = splitStatValue(raw);
  const { ref, value } = useAnimatedNumber<HTMLSpanElement>(num ?? 0, {
    reduceMotion,
    duration: 1,
    ease: EASE,
    trigger: { mode: "inView", margin: "-60px" },
  });
  if (num === null) return <span ref={ref}>{raw}</span>;
  return (
    <span ref={ref}>
      <motion.span className="tabular-nums">{value}</motion.span>
      {suffix}
    </span>
  );
}

const statColumn: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const painPointsList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

const painPointItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const messageList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.22, delayChildren: 0.1 } },
};

const messageBubble: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE } },
};

const waMessages = [
  { text: "Buenas noches, ¿cuánto cuesta la primera consulta? 🙏", time: "11:43" },
  { text: "¿Atienden casos de dolor crónico?", time: "11:44" },
  { text: "¿Tienen lugar disponible esta semana?", time: "11:47" },
];

function WhatsAppMockup({ reduceMotion }: { reduceMotion: boolean | null }) {
  return (
    <motion.figure
      initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="overflow-hidden rounded-[var(--radius-sm)] border border-line bg-void"
      aria-label="Conversación de WhatsApp a las 11:47 PM sin respuesta del consultorio"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-line bg-whatsapp/10 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-semibold text-muted">
          NP
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">Paciente nuevo</p>
          <p className="text-[11px] text-muted">visto por última vez ayer</p>
        </div>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-whatsapp px-1.5 text-[10px] font-bold text-white">
          3
        </span>
      </div>

      {/* Chat area */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={messageList}
        className="flex flex-col gap-2 p-4"
      >
        <div className="mb-1 flex justify-center">
          <span className="rounded-full bg-elevated/50 px-3 py-0.5 text-[10px] uppercase tracking-wide text-muted">
            Ayer · 11 PM
          </span>
        </div>

        {waMessages.map((msg) => (
          <motion.div
            key={msg.time}
            variants={messageBubble}
            className="flex max-w-[85%] flex-col rounded-lg rounded-tl-none bg-surface px-3 py-2"
          >
            <p className="text-[13px] leading-snug text-foreground">{msg.text}</p>
            <p className="mt-1 self-end text-[10px] text-muted">{msg.time} PM · ✓</p>
          </motion.div>
        ))}

        <motion.p
          variants={messageBubble}
          transition={{ duration: 0.5, ease: EASE, delay: reduceMotion ? 0 : 0.3 }}
          className="mt-3 text-center text-[11px] font-medium italic text-muted"
        >
          Sin respuesta · 9:12 AM del día siguiente
        </motion.p>
      </motion.div>

      {/* Input bar */}
      <div className="flex items-center gap-2 border-t border-line bg-surface/30 px-3 py-2.5">
        <div className="flex-1 rounded-full bg-elevated/60 px-4 py-1.5 text-[12px] text-muted/30">
          Escribe un mensaje…
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-whatsapp">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>

      {/* Caption */}
      <figcaption className="border-t border-line px-4 py-3 text-[11px] text-muted">
        Tu paciente buscó anoche a las 11 PM. Esto encontró.
      </figcaption>
    </motion.figure>
  );
}

export function ProblemSection() {
  const reduceMotion = useReducedMotion();

  return (
    <SectionFrame id="problema" className="border-t border-line bg-background">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h2
              className="text-balance leading-none text-foreground"
              style={{
                fontFamily: "var(--font-newsreader), Georgia, serif",
                fontWeight: 400,
                fontSize: "clamp(2.2rem, 5vw, 4.75rem)",
                letterSpacing: "-0.016em",
                lineHeight: 1.02,
              }}
            >
              Tus pacientes ya están buscando.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-relaxed" style={{ color: "var(--ink-muted)" }}>
              La pregunta no es si necesitan encontrarte. Es si llegan a un lugar que les da confianza suficiente para escribirte hoy.
            </p>
          </motion.div>

          <div>
            <div className="grid gap-6 sm:grid-cols-2">
              {problemStats.map((stat, i) => (
                <motion.div
                  key={stat.value}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: "-60px" }}
                  variants={statColumn}
                  transition={{ duration: 0.5, ease: EASE, delay: reduceMotion ? 0 : i * 0.12 }}
                  className="pt-5"
                  style={{ borderTop: `2px solid ${statAccents[i].borderColor}` }}
                >
                  <span
                    className="block font-display font-medium leading-none"
                    style={{
                      color: statAccents[i].color,
                      fontFamily: "var(--font-newsreader), Georgia, serif",
                      fontSize: "clamp(3rem, 6vw, 5rem)",
                    }}
                  >
                    <StatNumber raw={stat.value} reduceMotion={reduceMotion} />
                  </span>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <p className="mt-6 text-xs text-muted/70">{problemStatsSources}</p>
          </div>
        </div>

        <div className="mt-16 grid items-center gap-10 border-t border-line pt-14 lg:grid-cols-[1fr_0.78fr] lg:gap-20">
          <div className="order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <h3
                className="text-balance leading-tight text-foreground"
                style={{
                  fontFamily: "var(--font-newsreader), Georgia, serif",
                  fontWeight: 400,
                  fontSize: "clamp(2rem, 4.4vw, 4rem)",
                  letterSpacing: "-0.010em",
                  lineHeight: 1.12,
                }}
              >
                Tu agenda no está vacía por falta de pacientes.
              </h3>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-foreground">
                Está vacía porque los pacientes llegan, preguntan por WhatsApp y mueren esperando mientras tu asistente contesta mensajes de curiosos.
              </p>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={painPointsList}
              className="mt-9 border-t border-line"
            >
              {painPoints.map((point) => {
                const [before, after] = point.text.split(point.emphasis);
                return (
                  <motion.p key={point.emphasis} variants={painPointItem} className="py-5 text-[15px] leading-relaxed text-muted">
                    {before}
                    <strong className="font-medium text-foreground">{point.emphasis}</strong>
                    {after}
                  </motion.p>
                );
              })}
            </motion.div>
          </div>

          <div className="order-1 lg:order-2">
            <WhatsAppMockup reduceMotion={reduceMotion} />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
