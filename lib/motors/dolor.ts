/**
 * Evaluador de dolor musculoesquelético (fisioterapia).
 *
 * No es un instrumento validado y no lo finge: es una orientación construida sobre la
 * escala EVA de intensidad (0-10, referencia estándar en clínica) más tiempo de
 * evolución, limitación funcional y banderas rojas. Por eso no reporta una "categoría
 * clínica", sino una prioridad de atención — la regla del spec §6 para motores sin
 * instrumento detrás.
 *
 * Las banderas rojas son las de consenso para dolor lumbar y de extremidades: déficit
 * neurológico progresivo, alteración de esfínteres (síndrome de cauda equina) y dolor
 * tras traumatismo de alta energía. Cualquiera de ellas manda a valoración médica el
 * mismo día, sin importar el puntaje.
 */

import { bandForScore, maxScore, type QuizBand, type QuizQuestion } from "./quiz";

export const DOLOR_SOURCE =
  "Escala visual análoga (EVA) de intensidad del dolor · orientación, no instrumento diagnóstico";

export const DOLOR_POBLACION = "Pensado para personas de 18 años o más sin lesión aguda evidente.";

export const DOLOR_QUESTIONS: QuizQuestion[] = [
  {
    id: "intensidad",
    text: "¿Qué tan fuerte es el dolor en su peor momento del día?",
    options: [
      { label: "Leve (1-3): lo noto, pero sigo con lo mío", value: 0 },
      { label: "Moderado (4-6): me distrae y me limita", value: 2 },
      { label: "Intenso (7-8): me cuesta pensar en otra cosa", value: 4 },
      { label: "Insoportable (9-10): no puedo con él", value: 6 },
    ],
  },
  {
    id: "tiempo",
    text: "¿Desde cuándo lo tienes?",
    options: [
      { label: "Menos de una semana", value: 0 },
      { label: "Entre una semana y un mes", value: 1 },
      { label: "Entre uno y tres meses", value: 2 },
      { label: "Más de tres meses", value: 3 },
    ],
  },
  {
    id: "funcion",
    text: "¿Qué tanto te limita en el día a día?",
    options: [
      { label: "Nada: hago todo igual", value: 0 },
      { label: "Poco: evito algunos movimientos", value: 1 },
      { label: "Bastante: dejé de hacer cosas que hacía", value: 3 },
      { label: "Mucho: me cuesta lo básico, como vestirme o dormir", value: 5 },
    ],
  },
  {
    id: "banderas",
    text: "¿Tienes alguno de estos: pérdida de fuerza que va en aumento, hormigueo que no cede, o dificultad para controlar orina o excremento?",
    options: [
      { label: "Ninguno", value: 0 },
      { label: "Hormigueo que va y viene", value: 2 },
      { label: "Pérdida de fuerza o sensibilidad", value: 8 },
      { label: "Dificultad para controlar orina o excremento", value: 12 },
    ],
  },
];

export const DOLOR_MAX_SCORE = maxScore(DOLOR_QUESTIONS);

export const DOLOR_BANDS: QuizBand[] = [
  {
    id: "manejable",
    label: "Dolor manejable",
    min: 0,
    resumen:
      "Lo que describes suena a una molestia que todavía no te está quitando función. Una valoración temprana suele resolverlo en pocas sesiones y evita que se vuelva crónico.",
    crisis: false,
  },
  {
    id: "atencion",
    label: "Conviene revisarlo pronto",
    min: 5,
    resumen:
      "El dolor ya te está cambiando la forma de moverte. Entre más tiempo pasa, más se adapta el cuerpo alrededor de la lesión y más larga es la recuperación.",
    crisis: false,
  },
  {
    id: "prioritario",
    label: "Valoración prioritaria",
    min: 10,
    resumen:
      "La combinación de intensidad, tiempo y limitación que describes merece revisión pronta, no una espera de semanas.",
    crisis: false,
  },
  {
    id: "medica",
    label: "Necesitas valoración médica hoy",
    min: 14,
    resumen:
      "Describes señales que no corresponden a una molestia muscular común. Antes de cualquier terapia física, esto lo tiene que ver un médico.",
    crisis: true,
  },
];

export function dolorLead(score: number) {
  const band = bandForScore(DOLOR_BANDS, score);
  return {
    titulo: `Evaluación de dolor — ${band.label}`,
    senales: [
      `Puntaje de orientación: ${score} de ${DOLOR_MAX_SCORE}`,
      band.crisis ? "Reportó banderas rojas neurológicas" : "Sin banderas rojas reportadas",
      "Orientación, no diagnóstico",
    ],
    siguientePaso: "Sabes qué tan urgente es antes de que llegue al consultorio.",
  };
}
