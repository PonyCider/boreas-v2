export const problemHeading = {
  eyebrow: "El problema",
  heading: "Tus pacientes ya están buscando. ¿Qué encuentran?",
};

export type ProblemStat = {
  value: string;
  label: string;
};

export const problemStats: ProblemStat[] = [
  {
    value: "82%",
    label: "de los pacientes busca y evalúa tu presencia en línea antes de agendar su primera cita.",
  },
  {
    value: "40%",
    label: "de las citas y consultas ocurren fuera del horario de oficina. Tu web las captura 24/7.",
  },
];

export const problemStatsSource =
  "Accenture Health Consumer Survey · Kyruus Care Access Benchmark Report";

export type PainPoint = {
  text: string;
  emphasis: string;
};

export const painPoints: PainPoint[] = [
  {
    text: "Tu paciente te encuentra a las 11 de la noche, pero tu web sigue mostrando la misma información de hace dos años.",
    emphasis: "sigue mostrando la misma información de hace dos años",
  },
  {
    text: "Contestas mensajes de curiosos mientras el paciente decidido ya agendó con alguien más.",
    emphasis: "el paciente decidido ya agendó con alguien más",
  },
  {
    text: "Tienes buenas reseñas, pero nada en tu presencia digital las convierte en una cita agendada.",
    emphasis: "las convierte en una cita agendada",
  },
];

export type CompareMock = {
  eyebrow: string;
  heading: string;
  body: string;
  ctaLabel: string;
};

export const compareSlider: {
  label: string;
  generic: CompareMock;
  boreas: CompareMock;
} = {
  label: "Genérico vs. Boreas",
  generic: {
    eyebrow: "Sitio genérico",
    heading: "Bienvenido a nuestro consultorio",
    body: "Atendemos con calidad y profesionalismo.",
    ctaLabel: "Contáctenos",
  },
  boreas: {
    eyebrow: "Boreas",
    heading: "Tu presencia digital, abierta las 24 horas.",
    body: "Convierte cada búsqueda en un paciente agendado.",
    ctaLabel: "Quiero mi presencia digital",
  },
};
