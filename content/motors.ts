export const motorsHeading = {
  eyebrow: "La solución",
  heading: "Tu página no informa: agenda.",
  body: "Un motor de conversión es la pieza interactiva que convierte a un visitante curioso en un paciente con cita. El agendamiento ya lo puedes probar aquí mismo; los de cada especialidad se van sumando.",
};

export type SpecialtyId =
  | "todas"
  | "salud-mental"
  | "nutricion"
  | "fisioterapia"
  | "medicina-general"
  | "dental";

export type Specialty = {
  id: SpecialtyId;
  label: string;
  /** Motor estelar de la categoría — el que se demuestra vivo en la landing. */
  motor: string;
  status: "live" | "soon";
};

export const specialties: Specialty[] = [
  { id: "todas", label: "Agendamiento", motor: "Para toda especialidad", status: "live" },
  { id: "salud-mental", label: "Salud mental", motor: "Test de tamizaje", status: "soon" },
  { id: "nutricion", label: "Nutrición", motor: "Calculadora metabólica", status: "soon" },
  { id: "fisioterapia", label: "Fisioterapia", motor: "Evaluador de dolor", status: "soon" },
  { id: "medicina-general", label: "Medicina general", motor: "Pre-triage", status: "soon" },
  { id: "dental", label: "Dental", motor: "Simulador de sonrisa", status: "soon" },
];

/** Lo que le llega al especialista cuando un paciente completa el motor. */
export type SpecialistLead = {
  titulo: string;
  senales: string[];
  siguientePaso: string;
};

export const agendaMotor = {
  badge: "Motor · Todas las especialidades",
  title: "Agendamiento en línea",
  description:
    "El paciente elige día y hora sin escribirte un solo mensaje. Tu calendario se bloquea solo, la confirmación sale sola y el recordatorio también.",
  bullets: [
    "Disponibilidad real, sincronizada con tu calendario.",
    "Confirmación y recordatorio automáticos por correo.",
    "Sin ida y vuelta de mensajes para cuadrar un horario.",
  ],
  /** Este embed es el calendario real de Boreas: agendar aquí reserva de verdad. */
  calUrl: "https://cal.com/jafet-de-la-cruz-ponycider/demo",
  calPrivacyUrl: "https://cal.com/privacy",
  liveNote:
    "Este calendario es real: si agendas aquí, la llamada queda apartada con Boreas. Lo opera Cal.com, y los datos que escribas al reservar los procesa ese servicio.",
  lead: {
    titulo: "Cita agendada — Martes 12, 10:00 a.m.",
    senales: [
      "Primera consulta · 45 min",
      "Motivo: ansiedad y problemas de sueño",
      "Contacto: correo y teléfono confirmados",
    ],
    siguientePaso: "Ya está en tu calendario. No tuviste que contestar nada.",
  } satisfies SpecialistLead,
  leadNote: "Ejemplo ilustrativo",
};

export const motorsPrivacyNote =
  "Los motores de especialidad son demos: corren en tu navegador y no guardan ni envían nada. El calendario es la excepción — reserva de verdad y sus datos los procesa Cal.com.";
