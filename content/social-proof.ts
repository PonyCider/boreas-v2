export type SocialProofSpecialty =
  | "odontologia-integral"
  | "psicologia"
  | "implantologia"
  | "nutricion"
  | "ortodoncia"
  | "fisioterapia"
  | "odontopediatria"
  | "medicina-general";

export type SocialProofCase = {
  id: `case-${string}`;
  index: string;
  lane: "primary" | "secondary";
  specialty: SocialProofSpecialty;
  quote: string;
  project: string;
  qualitySignals: readonly [string, string, ...string[]];
  role: string;
};

export const socialProofHeadingLines = [
  "Así se ve una presencia",
  "construida con criterio.",
] as const;

export const socialProofHeading = {
  eyebrow: "Voces profesionales",
  heading: socialProofHeadingLines.join(" "),
  body: "Distintas especialidades. El mismo estándar de claridad, rigor y cuidado en cada entrega.",
  disclosure:
    "Escenarios representativos basados en necesidades comunes de profesionales de la salud. No corresponden a testimonios de clientes identificables.",
} as const;

export const socialProofCases = [
  {
    id: "case-01",
    index: "01",
    lane: "primary",
    specialty: "odontologia-integral",
    quote:
      "La página ordena todo lo que hacemos sin convertir los tratamientos en un catálogo. Se siente clara, profesional y fácil de recorrer.",
    project: "Sitio para clínica dental integral",
    qualitySignals: ["Arquitectura de tratamientos", "Agendamiento", "Navegación móvil"],
    role: "Directora clínica · Odontología integral",
  },
  {
    id: "case-02",
    index: "02",
    lane: "primary",
    specialty: "psicologia",
    quote:
      "El sitio explica mi enfoque sin simplificarlo ni sonar distante. Las personas pueden entender cómo trabajo antes de solicitar una sesión.",
    project: "Presencia digital para consulta psicológica",
    qualitySignals: ["Copy profesional", "Servicios claros", "Agenda integrada"],
    role: "Psicóloga clínica · Psicología",
  },
  {
    id: "case-03",
    index: "03",
    lane: "primary",
    specialty: "implantologia",
    quote:
      "Necesitábamos explicar tratamientos complejos con precisión, sin promesas exageradas. El resultado transmite experiencia y criterio clínico.",
    project: "Sitio de implantología y rehabilitación oral",
    qualitySignals: ["Copy clínico", "Jerarquía de tratamientos", "Revisión publicitaria"],
    role: "Director clínico · Implantología",
  },
  {
    id: "case-04",
    index: "04",
    lane: "primary",
    specialty: "nutricion",
    quote:
      "La página dejó de girar alrededor de dietas y empezó a comunicar un proceso de acompañamiento serio, estructurado y personalizado.",
    project: "Sitio para consulta de nutrición",
    qualitySignals: ["Metodología de atención", "Calculadora orientativa", "Experiencia móvil"],
    role: "Nutrióloga clínica · Nutrición",
  },
  {
    id: "case-05",
    index: "05",
    lane: "secondary",
    specialty: "ortodoncia",
    quote:
      "El proceso de ortodoncia ahora se explica por etapas y con expectativas claras. La página responde dudas antes del primer contacto.",
    project: "Landing especializada en ortodoncia",
    qualitySignals: ["Proceso visual", "Preguntas frecuentes", "Llamada a valoración"],
    role: "Ortodoncista · Ortodoncia",
  },
  {
    id: "case-06",
    index: "06",
    lane: "secondary",
    specialty: "fisioterapia",
    quote:
      "Ahora podemos mostrar cómo evaluamos, tratamos y damos seguimiento sin reducir la práctica a una lista de lesiones.",
    project: "Sitio para centro de fisioterapia",
    qualitySignals: ["Rutas de atención", "Evaluación inicial", "Agendamiento"],
    role: "Director de práctica · Fisioterapia",
  },
  {
    id: "case-07",
    index: "07",
    lane: "secondary",
    specialty: "odontopediatria",
    quote:
      "La nueva presencia habla con claridad a madres y padres sin perder el tono profesional. Cada decisión se siente pensada para la consulta infantil.",
    project: "Sitio para práctica de odontopediatría",
    qualitySignals: ["Lenguaje accesible", "Experiencia móvil", "Agendamiento"],
    role: "Odontopediatra · Odontología infantil",
  },
  {
    id: "case-08",
    index: "08",
    lane: "secondary",
    specialty: "medicina-general",
    quote:
      "La información importante quedó ordenada para que cada paciente sepa qué atendemos, cómo prepararse y cuál es el siguiente paso.",
    project: "Presencia digital para consulta médica",
    qualitySignals: ["Servicios", "Indicaciones previas", "Contacto estructurado"],
    role: "Médica responsable · Medicina general",
  },
] as const satisfies readonly SocialProofCase[];
