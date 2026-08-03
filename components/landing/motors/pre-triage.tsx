"use client";

import { QuizMotor } from "./quiz-motor";
import { medicinaGeneralMotor } from "@/content/motors";
import {
  SINTOMAS_DE_ALARMA,
  TRIAGE_BANDS,
  TRIAGE_POBLACION,
  TRIAGE_QUESTIONS,
  TRIAGE_SOURCE,
  triageLead,
} from "@/lib/motors/pre-triage";

export function PreTriageMotor() {
  return (
    <QuizMotor
      {...medicinaGeneralMotor}
      footnote={`${TRIAGE_SOURCE}. ${TRIAGE_POBLACION}`}
      questions={TRIAGE_QUESTIONS}
      bands={TRIAGE_BANDS}
      // Los síntomas de alarma se listan dentro del bloque rojo, no en el pie.
      crisis={{ ...medicinaGeneralMotor.crisis, lista: SINTOMAS_DE_ALARMA }}
      leadFor={triageLead}
    />
  );
}
