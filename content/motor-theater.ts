import type { MotorDefinition } from "@/lib/motors/runtime/types";

export const runtimeContractDemoDefinition = {
  motorId: "runtime-contract-demo",
  version: "1.0.0",
  family: "calculator",
  specialties: ["dental"],
  label: "Contrato portable · Demo",
  promise: "Entregar valor antes del contacto y estructurar las dos caras.",
  capabilities: [
    "patient-result",
    "specialist-summary",
    "contact-after-result",
    "urgent-interruption",
  ],
  consent: {
    required: true,
    version: "demo-v1",
    purpose: "Probar el flujo con una identidad sintética y sin enviar datos.",
  },
} as const satisfies MotorDefinition;

export const theaterMotorDefinitions = [runtimeContractDemoDefinition] as const;
