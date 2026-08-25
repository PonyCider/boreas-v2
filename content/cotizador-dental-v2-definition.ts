import { dentalQuoteV2Identity } from "@/lib/motors/cotizador-dental-v2";
import type { MotorDefinition } from "@/lib/motors/runtime/types";

export const dentalQuoteV2Definition = {
  ...dentalQuoteV2Identity,
  family: "calculator",
  specialties: ["dental"],
  label: "Cotizador de tratamiento",
  promise: "Mostrar rango, visitas e incluidos antes de la valoración.",
  capabilities: [
    "patient-result",
    "specialist-summary",
    "contact-after-result",
  ],
  consent: {
    required: true,
    version: "dental-v2-demo",
    purpose:
      "Entregar al consultorio el resumen mínimo después de mostrar el rango.",
  },
} as const satisfies MotorDefinition;
