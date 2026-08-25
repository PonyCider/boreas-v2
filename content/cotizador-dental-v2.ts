import type { MotorDefinition } from "@/lib/motors/runtime/types";
import {
  dentalQuoteV2Identity,
  type DentalQuoteConfig,
} from "@/lib/motors/cotizador-dental-v2";

export const boreasDentalQuoteV2Config = {
  clientId: "boreas-demo-dental",
  locale: "es-MX",
  currency: "MXN",
  reviewedAt: "2026-08-03",
  validUntil: "2026-11-03",
  copy: {
    resultEyebrow: "Rango de referencia antes de la valoración",
    ctaLabel: "Quiero una valoración",
    disclaimer:
      "El rango es informativo y no constituye una oferta. El precio final depende de una valoración clínica.",
    specialistNextStep:
      "Revisar el contexto y ofrecer una valoración; no renegociar un precio automático.",
  },
  contextFields: {
    concern: {
      label: "¿Qué te preocupa más?",
      options: [
        { id: "precio", label: "Entender el precio" },
        { id: "dolor", label: "Evitar dolor" },
        { id: "tiempo", label: "Saber cuánto tomará" },
        { id: "incertidumbre", label: "Entender el proceso" },
      ],
    },
    startHorizon: {
      label: "¿Cuándo te gustaría iniciar?",
      options: [
        { id: "pronto", label: "Lo antes posible" },
        { id: "este-mes", label: "Este mes" },
        { id: "uno-tres-meses", label: "En uno a tres meses" },
        { id: "explorando", label: "Solo estoy explorando" },
      ],
    },
  },
  treatments: [
    {
      id: "limpieza",
      label: "Limpieza dental",
      patientNeed: "Mantenimiento o sarro visible",
      range: { min: 500, max: 1500 },
      visits: "1 cita",
      inclusions: [
        "Ultrasonido y pulido",
        "Revisión general",
        "Indicaciones de higiene",
      ],
      priceFactors: ["Cantidad de sarro", "Estado de las encías"],
    },
    {
      id: "limpieza-profunda",
      label: "Limpieza profunda",
      patientNeed: "Encías que sangran o se retraen",
      range: { min: 1500, max: 6000 },
      visits: "2 citas",
      inclusions: [
        "Raspado bajo la encía",
        "Alisado radicular",
        "Control a las semanas",
      ],
      priceFactors: ["Número de cuadrantes", "Profundidad periodontal"],
      note:
        "Se cobra por cuadrante: el rango cubre desde uno hasta la boca completa.",
    },
    {
      id: "resina",
      label: "Resina (empaste)",
      patientNeed: "Caries o un diente astillado",
      range: { min: 1200, max: 2500 },
      visits: "1 cita",
      inclusions: [
        "Anestesia local",
        "Retiro de caries",
        "Resina del color del diente",
      ],
      priceFactors: ["Extensión de la lesión", "Número de superficies"],
      note: "Precio por pieza.",
    },
    {
      id: "endodoncia",
      label: "Endodoncia",
      patientNeed: "Dolor fuerte o nervio dañado",
      range: { min: 2000, max: 8000 },
      visits: "2 citas",
      inclusions: ["Radiografías", "Limpieza de conductos", "Sellado"],
      priceFactors: ["Pieza tratada", "Complejidad de los conductos"],
      note: "No incluye la corona que suele necesitarse después.",
    },
    {
      id: "corona",
      label: "Corona",
      patientNeed: "Diente muy destruido o post-endodoncia",
      range: { min: 3000, max: 10000 },
      visits: "2 citas",
      inclusions: [
        "Tallado y molde",
        "Corona provisional",
        "Colocación definitiva",
      ],
      priceFactors: ["Material elegido", "Preparación necesaria"],
      note: "El material manda: resina abajo, zirconia arriba.",
    },
    {
      id: "extraccion",
      label: "Extracción simple",
      patientNeed: "Pieza que ya no se puede salvar",
      range: { min: 400, max: 1500 },
      visits: "1 cita",
      inclusions: ["Anestesia local", "Extracción", "Sutura si hace falta"],
      priceFactors: ["Posición de la pieza", "Necesidad de sutura"],
    },
    {
      id: "muela-juicio",
      label: "Muela del juicio",
      patientNeed: "Presión, dolor o muela retenida",
      range: { min: 1500, max: 7000 },
      visits: "1 cita",
      inclusions: [
        "Radiografía panorámica",
        "Cirugía",
        "Revisión de sutura",
      ],
      priceFactors: ["Posición de la muela", "Grado de retención"],
      note: "Precio por muela. Una retenida cuesta más que una brotada.",
    },
    {
      id: "implante",
      label: "Implante dental",
      patientNeed: "Reponer un diente que falta",
      range: { min: 8000, max: 25000 },
      visits: "3 o más citas",
      inclusions: [
        "Implante y pilar",
        "Corona sobre el implante",
        "Controles de integración",
      ],
      priceFactors: ["Disponibilidad de hueso", "Sistema de implante"],
      note:
        "El proceso completo toma meses: el hueso necesita integrar el implante.",
    },
    {
      id: "blanqueamiento",
      label: "Blanqueamiento",
      patientNeed: "Dientes más oscuros de lo que quisieras",
      range: { min: 3000, max: 7000 },
      visits: "1 cita",
      inclusions: [
        "Limpieza previa",
        "Sesión en consultorio",
        "Indicaciones de cuidado",
      ],
      priceFactors: ["Técnica elegida", "Número de sesiones"],
    },
    {
      id: "ortodoncia",
      label: "Ortodoncia (brackets)",
      patientNeed: "Dientes chuecos o mordida despareja",
      range: { min: 15000, max: 35000 },
      visits: "18 a 30 meses",
      inclusions: ["Estudios y plan", "Brackets metálicos", "Ajustes mensuales"],
      priceFactors: ["Complejidad del caso", "Duración del tratamiento"],
      note: "Rango de tratamiento completo, normalmente en mensualidades.",
    },
  ],
} as const satisfies DentalQuoteConfig;

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
