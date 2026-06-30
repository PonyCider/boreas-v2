"use client";

import { SectionFrame } from "./boreas-landing-sections";
import { painPoints, problemStats } from "@/content/boreas-home";

const statAccents = [
  { color: "var(--c-amber)", borderColor: "var(--c-amber)" },
  { color: "var(--accent)",  borderColor: "var(--accent)" },
  { color: "var(--c-lav)",   borderColor: "var(--c-lav)" },
];

const waMessages = [
  { text: "Buenas noches, ¿cuánto cuesta la primera consulta? 🙏", time: "11:43" },
  { text: "¿Atienden casos de dolor crónico?", time: "11:44" },
  { text: "¿Tienen lugar disponible esta semana?", time: "11:47" },
];

function WhatsAppMockup() {
  return (
    <figure
      className="overflow-hidden rounded-[var(--radius-xl)] border bg-void"
      style={{ borderColor: "var(--border)" }}
      aria-label="Conversación de WhatsApp a las 11:47 PM sin respuesta del consultorio"
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 border-b px-4 py-3"
        style={{ borderColor: "var(--border)", background: "rgba(79,179,154,.1)" }}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-xs font-semibold text-muted">
          NP
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-medium text-foreground">Paciente nuevo</p>
          <p className="text-[11px] text-muted">visto por última vez ayer</p>
        </div>
        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-mint px-1.5 text-[10px] font-bold text-white">
          3
        </span>
      </div>

      {/* Chat area */}
      <div className="flex flex-col gap-2 p-4">
        <div className="mb-1 flex justify-center">
          <span className="rounded-full bg-elevated/50 px-3 py-0.5 text-[10px] uppercase tracking-wide text-muted">
            Ayer · 11 PM
          </span>
        </div>

        {waMessages.map((msg) => (
          <div
            key={msg.time}
            className="flex max-w-[85%] flex-col rounded-lg rounded-tl-none bg-surface px-3 py-2"
          >
            <p className="text-[13px] leading-snug text-foreground">{msg.text}</p>
            <p className="mt-1 self-end text-[10px] text-muted">{msg.time} PM · ✓</p>
          </div>
        ))}

        <p className="mt-3 text-center text-[11px] italic text-muted">
          Sin respuesta · 9:12 AM del día siguiente
        </p>
      </div>

      {/* Input bar */}
      <div className="flex items-center gap-2 border-t bg-surface/30 px-3 py-2.5" style={{ borderColor: "var(--border)" }}>
        <div className="flex-1 rounded-full bg-elevated/60 px-4 py-1.5 text-[12px] text-muted/30">
          Escribe un mensaje…
        </div>
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" aria-hidden="true">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </div>
      </div>

      {/* Caption */}
      <figcaption className="border-t px-4 py-3 text-[11px] text-muted" style={{ borderColor: "var(--border)" }}>
        Tu paciente buscó anoche a las 11 PM. Esto encontró.
      </figcaption>
    </figure>
  );
}

export function ProblemSection() {
  return (
    <SectionFrame id="problema" className="border-t border-line bg-background">
      <div className="relative mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
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
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {problemStats.map((stat, i) => (
              <div
                key={stat.value}
                className="pt-5"
                style={{ borderTop: `2px solid ${statAccents[i].borderColor}` }}
              >
                <span
                  className="block font-display font-medium leading-none"
                  style={{
                    color: statAccents[i].color,
                    fontFamily: "var(--font-newsreader), Georgia, serif",
                    fontSize: i === 0
                      ? "clamp(3.2rem, 7vw, 5.8rem)"
                      : "clamp(2.5rem, 5vw, 4.2rem)",
                  }}
                >
                  {stat.value}
                </span>
                <p className={`leading-relaxed text-muted ${i === 0 ? "mt-5 text-base" : "mt-4 text-sm"}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid items-center gap-10 border-t pt-14 lg:grid-cols-[1fr_0.78fr] lg:gap-20" style={{ borderColor: "var(--border)" }}>
          <div className="order-2 lg:order-1">
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

            <div className="mt-9" style={{ borderTop: "1px solid var(--border)" }}>
              {painPoints.map((point) => {
                const [before, after] = point.text.split(point.emphasis);
                return (
                  <p
                    key={point.emphasis}
                    className="py-5 text-[15px] leading-relaxed text-muted"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    {before}
                    <strong className="font-medium text-foreground">{point.emphasis}</strong>
                    {after}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <WhatsAppMockup />
          </div>
        </div>
      </div>
    </SectionFrame>
  );
}
