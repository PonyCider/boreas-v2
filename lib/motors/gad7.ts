/**
 * GAD-7 completo. Instrumento de tamizaje de ansiedad generalizada de dominio público
 * (Pfizer permite reproducir, traducir y distribuir sin permiso previo).
 *
 * Fuente: Spitzer RL, Kroenke K, Williams JBW, Löwe B. "A brief measure for assessing
 * generalized anxiety disorder: the GAD-7". Arch Intern Med. 2006;166(10):1092-7.
 *
 * Los 7 ítems y la escala 0-3 son los originales; solo se adaptó el trato de usted a tú
 * para la voz del sitio. Los cortes (5 / 10 / 15) son los del instrumento — no se tocan:
 * un corte movido cambia la categoría clínica que ve la persona.
 */

import { bandForScore, maxScore, type QuizBand, type QuizQuestion } from "./quiz";

export const GAD7_SOURCE =
  "GAD-7 · Spitzer, Kroenke, Williams y Löwe (2006), Arch Intern Med 166(10):1092-7";

/** Población para la que el instrumento está validado. Va visible en la UI. */
export const GAD7_POBLACION = "Validado en personas de 18 años o más.";

const PROMPT = "En las últimas 2 semanas, ¿con qué frecuencia te ha molestado…";

const FRECUENCIA = [
  { label: "Ningún día", value: 0 },
  { label: "Varios días", value: 1 },
  { label: "Más de la mitad de los días", value: 2 },
  { label: "Casi todos los días", value: 3 },
];

export const GAD7_QUESTIONS: QuizQuestion[] = [
  { id: "nervioso", text: "sentirte nervioso, ansioso o con los nervios de punta?" },
  { id: "preocupacion", text: "no poder dejar de preocuparte o no poder controlar la preocupación?" },
  { id: "exceso", text: "preocuparte demasiado por diferentes cosas?" },
  { id: "relajarse", text: "tener dificultad para relajarte?" },
  { id: "inquietud", text: "estar tan inquieto que te cuesta quedarte sentado tranquilo?" },
  { id: "irritable", text: "molestarte o ponerte irritable con facilidad?" },
  { id: "miedo", text: "sentir miedo, como si algo terrible pudiera pasar?" },
].map((question) => ({ ...question, prompt: PROMPT, options: FRECUENCIA }));

/** Cortes originales del GAD-7: 0-4 mínima, 5-9 leve, 10-14 moderada, 15-21 severa. */
export const GAD7_BANDS: QuizBand[] = [
  {
    id: "minima",
    label: "Ansiedad mínima",
    min: 0,
    resumen:
      "Tus respuestas no describen síntomas de ansiedad significativos en estas dos semanas. Sigue prestando atención a cómo te sientes.",
    crisis: false,
  },
  {
    id: "leve",
    label: "Ansiedad leve",
    min: 5,
    resumen:
      "Tus respuestas muestran señales leves de ansiedad. No es alarmante, pero vale la pena platicarlo con alguien antes de que crezca.",
    crisis: false,
  },
  {
    id: "moderada",
    label: "Ansiedad moderada",
    min: 10,
    resumen:
      "Tus respuestas describen síntomas que probablemente ya te están costando trabajo en el día a día. Una valoración con un profesional puede ayudarte a ordenarlos.",
    crisis: false,
  },
  {
    id: "severa",
    label: "Ansiedad severa",
    min: 15,
    resumen:
      "Tus respuestas describen síntomas intensos y sostenidos. Ponerles nombre ya es un paso; hablar con un profesional es el siguiente.",
    crisis: true,
  },
];

export const GAD7_MAX_SCORE = maxScore(GAD7_QUESTIONS);

/** Lo único que viaja al especialista: banda y puntaje, nunca las respuestas ítem por ítem. */
export function gad7Lead(score: number) {
  const band = bandForScore(GAD7_BANDS, score);
  return {
    titulo: `Tamizaje completado — ${band.label}`,
    senales: [
      `GAD-7: ${score} de ${GAD7_MAX_SCORE} puntos`,
      band.crisis
        ? "Banda alta: se le mostraron recursos de crisis"
        : "Sin indicadores de crisis en el tamizaje",
      "Instrumento de tamizaje, no diagnóstico",
    ],
    siguientePaso: "Llega a la primera sesión sabiendo de qué hablar.",
  };
}
