import { sectionIds } from "./site";

export type Accent = "amber" | "mint" | "lav" | "rose";

export type MotorScreen = {
  icon: "brain" | "notebook-pen" | "activity" | "calendar-check";
  title: string;
  metric: { value: number; decimals: number; suffix: string } | null;
  body: string;
  accent: Accent;
};

export type FeedEvent = {
  icon: "star" | "calendar-check" | "clipboard-check" | "message-circle" | "user-plus";
  title: string;
  meta: string;
  accent: Accent;
};

export const heroContent = {
  eyebrow: "Presencia digital para especialistas de la salud",
  headline: "Tu presencia digital, abierta las 24 horas.",
  subheadline:
    "Mientras atiendes, tus pacientes ya están buscando reseñas, comparando opciones y decidiendo a quién escribir. Boreas convierte esa primera búsqueda en un paciente agendado.",
  ctaSecondaryLabel: "Ver los motores en acción",
  ctaSecondaryHref: `#${sectionIds.motores}`,
  proofBadge: "Ejemplo ilustrativo",
};

// Mock screens cycled through the Hero's CardSwap — one per motor de conversión.
export const motorScreens: MotorScreen[] = [
  {
    icon: "brain",
    title: "GAD-7 · Ansiedad",
    metric: { value: 6, decimals: 0, suffix: "/21" },
    body: "Ansiedad leve — seguimiento recomendado",
    accent: "mint",
  },
  {
    icon: "notebook-pen",
    title: "Diario emocional",
    metric: null,
    body: "7 registros esta semana · ánimo estable",
    accent: "lav",
  },
  {
    icon: "activity",
    title: "Calculadora IMC",
    metric: { value: 23.4, decimals: 1, suffix: "" },
    body: "Rango saludable",
    accent: "amber",
  },
  {
    icon: "calendar-check",
    title: "Agendamiento inteligente",
    metric: null,
    body: "Cita confirmada · mañana 10:30am",
    accent: "rose",
  },
];

// Fake live-activity feed for the Hero's AnimatedList (desktop only).
export const feedEvents: FeedEvent[] = [
  { icon: "star", title: "Nueva reseña · 5★ en Google", meta: "hace 2 min", accent: "amber" },
  { icon: "calendar-check", title: "Cita confirmada · 10:30am", meta: "hace 4 min", accent: "mint" },
  { icon: "clipboard-check", title: "GAD-7 completado · Ana G.", meta: "hace 9 min", accent: "lav" },
  { icon: "message-circle", title: "Recordatorio enviado · WhatsApp", meta: "hace 12 min", accent: "rose" },
  { icon: "user-plus", title: "Nuevo paciente registrado", meta: "hace 18 min", accent: "mint" },
  { icon: "clipboard-check", title: "Diario emocional actualizado", meta: "hace 24 min", accent: "amber" },
];
