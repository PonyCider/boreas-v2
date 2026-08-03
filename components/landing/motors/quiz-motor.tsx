"use client";

import { useEffect, useRef, useState } from "react";
import { MotorShell } from "./motor-shell";
import type { SpecialistLead } from "@/content/motors";
import { bandForScore, maxScore, scoreQuiz, type QuizBand, type QuizQuestion } from "@/lib/motors/quiz";

/** Bloque de alto contraste que se muestra encima de todo en la banda más grave. */
export type CrisisBlock = {
  titulo: string;
  texto: string;
  telefono?: string;
  telefonoHref?: string;
  lista?: string[];
};

export type QuizMotorProps = {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  footnote: string;
  leadNote: string;
  upsell?: { intro: string; items: { nombre: string; que: string }[] };
  questions: QuizQuestion[];
  bands: QuizBand[];
  crisis: CrisisBlock;
  leadFor: (score: number) => SpecialistLead;
  /** Etiqueta del puntaje en el resultado, p. ej. "de 21". */
  resultSuffix?: string;
};

/**
 * UI compartida de los tres motores quiz-banda (tamizaje, dolor, pre-triage). Cada uno
 * trae sus preguntas, bandas y textos; lo idéntico vive aquí: auto-avance, progreso,
 * manejo de foco, resultado anunciado y bloque de crisis.
 */
export function QuizMotor({
  badge,
  title,
  description,
  bullets,
  footnote,
  leadNote,
  upsell,
  questions,
  bands,
  crisis,
  leadFor,
}: QuizMotorProps) {
  const [answers, setAnswers] = useState<number[]>([]);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const questionRef = useRef<HTMLLegendElement>(null);

  const index = answers.length;
  const done = index >= questions.length;
  const score = done ? scoreQuiz(answers) : 0;
  const band = done ? bandForScore(bands, score) : null;
  const total = maxScore(questions);

  // El foco sigue al contenido que reemplaza a la pregunta: sin esto, quien navega con
  // teclado o lector de pantalla se queda parado en un botón que ya no existe.
  useEffect(() => {
    if (answers.length === 0) return;
    (done ? resultRef.current : questionRef.current)?.focus();
  }, [answers.length, done]);

  const question = done ? null : questions[index];

  return (
    <MotorShell
      badge={badge}
      title={title}
      description={description}
      bullets={bullets}
      lead={done ? leadFor(score) : null}
      leadNote={leadNote}
      upsell={upsell}
      footnote={footnote}
    >
      <div className="rounded-[10px] border border-line bg-elevated p-6 sm:p-8">
        {done && band ? (
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
              Tu resultado
            </p>
            <p
              ref={resultRef}
              tabIndex={-1}
              aria-live="polite"
              className="mt-3 font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-normal leading-tight text-foreground outline-none"
            >
              {band.label} · {score} de {total}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">{band.resumen}</p>

            {band.crisis ? (
              <div className="mt-6 rounded-[10px] bg-danger p-5 text-white">
                <p className="font-medium">{crisis.titulo}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/90">{crisis.texto}</p>
                {crisis.lista ? (
                  <ul className="mt-4 space-y-1.5 text-sm text-white/90">
                    {crisis.lista.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {crisis.telefono && crisis.telefonoHref ? (
                  <a
                    href={crisis.telefonoHref}
                    className="mt-4 inline-block text-lg font-medium underline underline-offset-4"
                  >
                    {crisis.telefono}
                  </a>
                ) : null}
              </div>
            ) : null}

            <button
              type="button"
              onClick={() => setAnswers([])}
              className="mt-6 rounded-[999px] border border-border px-5 py-2.5 text-sm font-medium text-foreground"
            >
              Responder de nuevo
            </button>
          </div>
        ) : question ? (
          <fieldset>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-clinical">
              Pregunta {index + 1} de {questions.length}
            </p>
            <legend
              ref={questionRef}
              tabIndex={-1}
              className="mt-3 font-display text-[clamp(1.2rem,2vw,1.6rem)] font-normal leading-snug text-foreground outline-none"
            >
              {question.prompt ? `${question.prompt} ` : ""}
              {question.text}
            </legend>

            <div className="mt-6 flex flex-col gap-2">
              {question.options.map((option) => (
                <label
                  key={option.label}
                  className="flex cursor-pointer items-center gap-3 rounded-[10px] border border-border bg-surface px-4 py-3 text-[15px] text-foreground has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
                >
                  <input
                    type="radio"
                    name={`${question.id}`}
                    value={option.value}
                    checked={false}
                    onChange={() => setAnswers((prev) => [...prev, option.value])}
                    className="h-4 w-4 shrink-0 accent-[var(--accent)]"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <div
              className="mt-6 h-1 w-full overflow-hidden rounded-full bg-void"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={questions.length}
              aria-valuenow={index}
              aria-label="Avance del test"
            >
              <div
                className="h-full bg-accent transition-[width] duration-300"
                style={{ width: `${(index / questions.length) * 100}%` }}
              />
            </div>
          </fieldset>
        ) : null}
      </div>
    </MotorShell>
  );
}
