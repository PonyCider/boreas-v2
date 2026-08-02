"use client";

import { QuizMotor } from "./quiz-motor";
import { fisioterapiaMotor } from "@/content/motors";
import {
  DOLOR_BANDS,
  DOLOR_POBLACION,
  DOLOR_QUESTIONS,
  DOLOR_SOURCE,
  dolorLead,
} from "@/lib/motors/dolor";

export function EvaluadorDolorMotor() {
  return (
    <QuizMotor
      {...fisioterapiaMotor}
      footnote={`${DOLOR_SOURCE}. ${DOLOR_POBLACION}`}
      questions={DOLOR_QUESTIONS}
      bands={DOLOR_BANDS}
      leadFor={dolorLead}
    />
  );
}
