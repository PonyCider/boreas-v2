/**
 * Pre-triage de consulta general.
 *
 * Orientación, no instrumento validado: ordena a la persona entre "esto espera", "esto
 * es hoy" y "esto es ahora". Las preguntas y los cortes vienen del demo Urgencia Directa
 * de `boreas-portfolio`, ya revisados contra off-by-one.
 *
 * Regla dura del spec §6: en prioridad alta la acción primaria es el 911 y la lista de
 * síntomas de alarma, no el contacto con el consultorio.
 */

import { bandForScore, maxScore, type QuizBand, type QuizQuestion } from "./quiz";

export const TRIAGE_SOURCE =
  "Orientación de urgencia basada en síntomas autorreportados · no sustituye triage clínico";

export const TRIAGE_POBLACION =
  "Para personas adultas. En menores de edad, embarazo o enfermedad crónica descompensada, consulta directamente.";

/** Se muestran junto al resultado alto: son las que no admiten espera. */
export const SINTOMAS_DE_ALARMA = [
  "Dolor en el pecho que oprime o se extiende al brazo o la mandíbula",
  "Dificultad para respirar estando en reposo",
  "Debilidad o adormecimiento súbito de un lado del cuerpo, o dificultad para hablar",
  "Sangrado que no se detiene",
  "Confusión, desmayo o no poder despertar bien a la persona",
];

export const TRIAGE_QUESTIONS: QuizQuestion[] = [
  {
    id: "intensidad",
    text: "¿Qué tan intenso es el malestar principal ahora mismo?",
    options: [
      { label: "Leve, casi no lo noto", value: 0 },
      { label: "Molesto pero tolerable", value: 1 },
      { label: "Intenso", value: 2 },
      { label: "Insoportable", value: 3 },
    ],
  },
  {
    id: "respiracion",
    text: "¿Tienes dificultad para respirar o dolor en el pecho?",
    options: [
      { label: "No", value: 0 },
      { label: "Falta de aire leve al esfuerzo", value: 1 },
      { label: "Falta de aire estando en reposo", value: 2 },
      { label: "Dolor en el pecho, o no puedo respirar bien", value: 3 },
    ],
  },
  {
    id: "signos",
    text: "¿Hay sangrado, fiebre alta o vómito que no cede?",
    options: [
      { label: "Ninguno de estos", value: 0 },
      { label: "Fiebre moderada, menos de 39 °C", value: 1 },
      { label: "Fiebre alta o vómito repetido", value: 2 },
      { label: "Sangrado que no para, o fiebre muy alta", value: 3 },
    ],
  },
  {
    id: "funcionalidad",
    text: "¿Puedes mantenerte de pie, hablar y moverte con normalidad?",
    options: [
      { label: "Sí, sin problema", value: 0 },
      { label: "Con algo de esfuerzo", value: 1 },
      { label: "Con mucha dificultad", value: 2 },
      { label: "No puedo: me estoy desmayando o estoy muy confundido", value: 3 },
    ],
  },
  {
    id: "evolucion",
    text: "¿Desde cuándo tienes estos síntomas?",
    options: [
      { label: "Empezó hace unas horas y va mejorando", value: 0 },
      { label: "Empezó hoy y sigue igual", value: 1 },
      { label: "Lleva más de un día empeorando", value: 2 },
      { label: "Empeoró de golpe en los últimos minutos", value: 3 },
    ],
  },
];

export const TRIAGE_MAX_SCORE = maxScore(TRIAGE_QUESTIONS);

/** Cortes heredados del portafolio: <5 baja, 5-10 media, ≥11 alta. */
export const TRIAGE_BANDS: QuizBand[] = [
  {
    id: "baja",
    label: "Prioridad baja",
    min: 0,
    resumen:
      "Lo que describes puede esperar a una consulta programada en los próximos días. Si algo cambia o empeora, no lo dejes pasar.",
    crisis: false,
  },
  {
    id: "media",
    label: "Prioridad media",
    min: 5,
    resumen:
      "Conviene que un médico te revise hoy, aunque no necesariamente en una sala de urgencias.",
    crisis: false,
  },
  {
    id: "alta",
    label: "Prioridad alta",
    min: 11,
    resumen: "Esto no espera a mañana. Tus respuestas describen señales que se atienden ahora.",
    crisis: true,
  },
];

export function triageLead(score: number) {
  const band = bandForScore(TRIAGE_BANDS, score);
  return {
    titulo: `Pre-triage — ${band.label}`,
    senales: [
      `Puntaje de orientación: ${score} de ${TRIAGE_MAX_SCORE}`,
      band.crisis ? "Se le indicó acudir a urgencias o llamar al 911" : "Sin criterio de urgencia",
      "Orientación, no diagnóstico",
    ],
    siguientePaso: "Sabes a quién agendar hoy y a quién esta semana.",
  };
}
