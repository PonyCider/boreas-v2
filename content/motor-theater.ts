import type { MotorDefinition } from "@/lib/motors/runtime/types";
import type { SpecialtyId } from "@/content/motors";
import { dentalQuoteV2Definition } from "@/content/cotizador-dental-v2-definition";

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

export type ConversionTheaterAct = {
  id: "visit" | "motor" | "faces" | "control";
  position: `0${number}`;
  eyebrow: string;
  title: string;
  body: string;
  proof: string;
};

export const conversionTheaterCopy = {
  eyebrow: "La solución",
  title: "Convierte visitas en pacientes preparados.",
  description:
    "Una web puede responder dudas, ordenar intención y preparar la siguiente conversación antes de que abras WhatsApp.",
  stageLabel: "Teatro de conversión",
  controlEyebrow: "Toma el control",
  controlTitle: "Ahora pruébalo como lo haría un paciente.",
  controlDescription:
    "Elige una especialidad y completa el recorrido. Cada motor entrega valor antes de pedirte iniciar una conversación.",
  controlPreviewDescription:
    "Elige una especialidad y completa un motor real. Dental usa el dominio portable; los otros cinco conservan su versión actual.",
} as const;

export const conversionTheaterActs = [
  {
    id: "visit",
    position: "01",
    eyebrow: "La visita",
    title: "Llega con una duda. Todavía no es un paciente.",
    body:
      "Busca precio, tiempo y certeza. Si la web solo informa, esa intención vuelve a convertirse en mensajes sueltos o abandono.",
    proof: "Señal anónima → intención todavía dispersa",
  },
  {
    id: "motor",
    position: "02",
    eyebrow: "El motor trabaja",
    title: "La duda se convierte en contexto útil.",
    body:
      "El paciente elige un tratamiento. El motor devuelve rango, visitas, incluidos y factores que pueden modificar el precio.",
    proof: "Tratamiento + reglas aprobadas → resultado estructurado",
  },
  {
    id: "faces",
    position: "03",
    eyebrow: "Las dos caras",
    title: "Claridad para avanzar. Contexto para responder mejor.",
    body:
      "El paciente recibe valor primero. El especialista recibe intención, señales relevantes y un siguiente paso sin respuestas crudas innecesarias.",
    proof: "Resultado paciente ↔ resumen especialista",
  },
  {
    id: "control",
    position: "04",
    eyebrow: "Toma el control",
    title: "La demostración termina. El motor queda vivo.",
    body:
      "La misma interfaz queda disponible para explorarla. No es un video ni una simulación decorativa: puedes completar el recorrido.",
    proof: "Narrativa → interacción real",
  },
] as const satisfies readonly ConversionTheaterAct[];

export type TheaterMotorItem = {
  id: SpecialtyId;
  position: `0${number}`;
  specialty: string;
  motor: string;
  result: string;
  definition: MotorDefinition;
};

const legacyPreviewConsent = {
  required: false,
  version: "legacy-preview-v1",
  purpose: "Comparar la navegación sin cambiar el flujo del motor existente.",
} as const;

export const theaterMotorItems = [
  {
    id: "todas",
    position: "01",
    specialty: "Todas",
    motor: "Agendamiento en línea",
    result: "Fecha y hora confirmadas",
    definition: {
      motorId: "agenda-cal",
      version: "1.0.0",
      family: "booking",
      specialties: ["todas"],
      label: "Agendamiento en línea",
      promise: "Reservar una cita sin intercambio de mensajes.",
      capabilities: ["specialist-summary"],
      consent: legacyPreviewConsent,
    },
  },
  {
    id: "salud-mental",
    position: "02",
    specialty: "Salud mental",
    motor: "Test de tamizaje",
    result: "Lectura y contexto",
    definition: {
      motorId: "tamizaje-gad7",
      version: "1.0.0",
      family: "quiz",
      specialties: ["salud-mental"],
      label: "Test de tamizaje",
      promise: "Dar una lectura clara antes de solicitar contacto.",
      capabilities: [
        "patient-result",
        "specialist-summary",
        "contact-after-result",
        "urgent-interruption",
      ],
      consent: legacyPreviewConsent,
    },
  },
  {
    id: "nutricion",
    position: "03",
    specialty: "Nutrición",
    motor: "Calculadora metabólica",
    result: "Gasto energético estimado",
    definition: {
      motorId: "calculadora-metabolica",
      version: "1.0.0",
      family: "calculator",
      specialties: ["nutricion"],
      label: "Calculadora metabólica",
      promise: "Estimar el gasto energético con rangos validados.",
      capabilities: [
        "patient-result",
        "specialist-summary",
        "contact-after-result",
      ],
      consent: legacyPreviewConsent,
    },
  },
  {
    id: "fisioterapia",
    position: "04",
    specialty: "Fisioterapia",
    motor: "Evaluador de dolor",
    result: "Prioridad y siguiente paso",
    definition: {
      motorId: "evaluador-dolor",
      version: "1.0.0",
      family: "quiz",
      specialties: ["fisioterapia"],
      label: "Evaluador de dolor",
      promise: "Ordenar el nivel de prioridad y orientar el siguiente paso.",
      capabilities: [
        "patient-result",
        "specialist-summary",
        "contact-after-result",
        "urgent-interruption",
      ],
      consent: legacyPreviewConsent,
    },
  },
  {
    id: "medicina-general",
    position: "05",
    specialty: "Medicina general",
    motor: "Pre-triage",
    result: "Prioridad y señales de alarma",
    definition: {
      motorId: "pre-triage",
      version: "1.0.0",
      family: "quiz",
      specialties: ["medicina-general"],
      label: "Pre-triage",
      promise: "Separar una consulta programable de una urgencia real.",
      capabilities: [
        "patient-result",
        "specialist-summary",
        "contact-after-result",
        "urgent-interruption",
      ],
      consent: legacyPreviewConsent,
    },
  },
  {
    id: "dental",
    position: "06",
    specialty: "Dental",
    motor: "Cotizador de tratamiento",
    result: "Rango, visitas e incluidos",
    definition: dentalQuoteV2Definition,
  },
] as const satisfies readonly TheaterMotorItem[];
