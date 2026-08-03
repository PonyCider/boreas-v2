/**
 * Núcleo compartido de los motores tipo quiz-banda: N preguntas de opción única, suma
 * de puntajes, y una banda por umbral. Los tres motores que lo usan (GAD-7, evaluador
 * de dolor, pre-triage) traen sus propias preguntas, bandas y textos — aquí solo vive
 * lo que era idéntico en los tres.
 */

export type QuizOption = { label: string; value: number };

export type QuizQuestion = {
  id: string;
  /** Encabezado común de la pregunta, si el motor lo usa. */
  prompt?: string;
  text: string;
  options: QuizOption[];
};

export type QuizBand = {
  id: string;
  label: string;
  /** Puntaje mínimo para caer en esta banda. */
  min: number;
  resumen: string;
  /** true → la UI muestra el bloque de crisis o urgencia por encima de todo lo demás. */
  crisis: boolean;
};

export function scoreQuiz(answers: number[]): number {
  return answers.reduce((total, value) => total + value, 0);
}

/** Devuelve la banda de mayor umbral que el puntaje alcanza. */
export function bandForScore(bands: QuizBand[], score: number): QuizBand {
  return [...bands].reverse().find((band) => score >= band.min) ?? bands[0];
}

export function maxScore(questions: QuizQuestion[]): number {
  return questions.reduce(
    (total, question) => total + Math.max(...question.options.map((option) => option.value)),
    0
  );
}
