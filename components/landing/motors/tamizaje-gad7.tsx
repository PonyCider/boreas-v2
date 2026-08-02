"use client";

import { QuizMotor } from "./quiz-motor";
import { tamizajeMotor } from "@/content/motors";
import {
  GAD7_BANDS,
  GAD7_POBLACION,
  GAD7_QUESTIONS,
  GAD7_SOURCE,
  gad7Lead,
} from "@/lib/motors/gad7";

export function TamizajeGad7Motor() {
  return (
    <QuizMotor
      {...tamizajeMotor}
      footnote={`${GAD7_SOURCE}. ${GAD7_POBLACION} Es un tamizaje, no un diagnóstico.`}
      questions={GAD7_QUESTIONS}
      bands={GAD7_BANDS}
      leadFor={gad7Lead}
    />
  );
}
