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
  { id: "salud-mental", label: "Salud mental", motor: "Test de tamizaje", status: "live" },
  { id: "nutricion", label: "Nutrición", motor: "Calculadora metabólica", status: "live" },
  { id: "fisioterapia", label: "Fisioterapia", motor: "Evaluador de dolor", status: "live" },
  { id: "medicina-general", label: "Medicina general", motor: "Pre-triage", status: "live" },
  { id: "dental", label: "Dental", motor: "Cotizador de tratamiento", status: "live" },
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

export const tamizajeMotor = {
  badge: "Motor · Salud mental y terapia",
  title: "Test de tamizaje",
  description:
    "El paciente responde siete preguntas en menos de un minuto y recibe una lectura clara de cómo ha estado. Tú recibes ese contexto antes de la primera sesión.",
  bullets: [
    "Instrumento real, no un cuestionario inventado.",
    "Resultado inmediato, sin pedirle sus datos antes.",
    "En banda alta muestra la Línea de la Vida antes que cualquier CTA.",
  ],
  leadNote: "Generado con las respuestas que acabas de dar",
  upsell: {
    intro:
      "Tu paquete incluye este motor. Con Profesional y Deluxe se suman los otros de tu especialidad:",
    items: [
      { nombre: "Diario emocional", que: "una bitácora breve que el paciente se lleva en PDF" },
      { nombre: "Termómetro de burnout", que: "seis ítems que ubican qué se está agotando" },
      { nombre: "Test de estilo de apego", que: "diez ítems para abrir la conversación de pareja" },
    ],
  },
  crisis: {
    titulo: "Si estás en crisis, esto va primero",
    texto:
      "Si estás pensando en hacerte daño o sientes que no puedes con esto ahora mismo, llama a la Línea de la Vida. Es gratuita, confidencial y atiende las 24 horas.",
    telefono: "800 911 2000",
    telefonoHref: "tel:8009112000",
  },
};

export const nutricionMotor = {
  badge: "Motor · Nutrición",
  title: "Calculadora metabólica",
  description:
    "El paciente descubre cuánta energía gasta al día y por qué su plan anterior no funcionaba. Tú recibes el número con el que va a llegar a consulta.",
  bullets: [
    "Mifflin-St Jeor, la ecuación de referencia en consulta.",
    "Valida rangos: un dedo resbalado no produce un número absurdo.",
    "Deja claro que es estimación poblacional, no valoración.",
  ],
  leadNote: "Generado con los datos que acabas de capturar",
  upsell: {
    intro:
      "Tu paquete incluye este motor. Con Profesional y Deluxe se suman los otros de tu especialidad:",
    items: [
      { nombre: "IMC y rango", que: "peso y estatura con lectura honesta del indicador" },
      { nombre: "Evaluador de hábitos", que: "cinco preguntas que apuntan al hábito a corregir" },
    ],
  },
};

export const fisioterapiaMotor = {
  badge: "Motor · Fisioterapia",
  title: "Evaluador de dolor",
  description:
    "Cuatro preguntas ordenan al paciente entre lo que aguanta unos días y lo que necesita revisión hoy. Tú sabes a quién adelantar en la agenda.",
  bullets: [
    "Intensidad, tiempo, limitación y banderas rojas.",
    "Las banderas neurológicas mandan a valoración médica, no a terapia.",
    "Orientación declarada: no finge ser un instrumento validado.",
  ],
  leadNote: "Generado con las respuestas que acabas de dar",
  upsell: {
    intro:
      "Tu paquete incluye este motor. Con Profesional y Deluxe se suman los otros de tu especialidad:",
    items: [
      { nombre: "Auto-test de movilidad", que: "cinco movimientos que revelan banderas rojas" },
      { nombre: "Estimador de sesiones", que: "un rango realista de cuánto tomará recuperarse" },
    ],
  },
  crisis: {
    titulo: "Esto lo tiene que ver un médico antes que un fisioterapeuta",
    texto:
      "Lo que describes puede indicar compromiso de un nervio. No empieces terapia física sin una valoración médica: acude hoy mismo con un médico o a urgencias si empeora.",
  },
};

export const medicinaGeneralMotor = {
  badge: "Motor · Medicina general",
  title: "Pre-triage",
  description:
    "Cinco preguntas que separan la consulta programada de la urgencia real. El paciente sabe qué hacer ahora; tú dejas de contestar mensajes para averiguarlo.",
  bullets: [
    "Prioridad baja, media o alta en menos de un minuto.",
    "En prioridad alta manda al 911 antes que a tu consultorio.",
    "Lista los síntomas de alarma en pantalla, no en letra chica.",
  ],
  leadNote: "Generado con las respuestas que acabas de dar",
  upsell: {
    intro:
      "Tu paquete incluye este motor. Con Profesional y Deluxe se suman los otros de tu especialidad:",
    items: [
      { nombre: "Chequeos que te tocan", que: "estudios sugeridos según edad y sexo" },
      { nombre: "Riesgo cardiometabólico", que: "una estimación que abre la conversación" },
    ],
  },
  crisis: {
    titulo: "Esto no espera: llama al 911",
    texto:
      "Tus respuestas describen señales que se atienden ahora, no mañana. Llama al 911 o acude a la sala de urgencias más cercana. Cualquiera de estos síntomas exige atención inmediata:",
    telefono: "911",
    telefonoHref: "tel:911",
  },
};

/**
 * Motor estelar de dental. Sustituyó al simulador de sonrisa el 2026-08-03: el simulador
 * solo sirve a ortodoncia, que es una fracción del consultorio dental, mientras que "¿cuánto
 * me va a costar?" es el bloqueo de todo paciente dental sin importar el tratamiento.
 */
export const dentalMotor = {
  badge: "Motor · Dental",
  title: "Cotizador de tratamiento",
  description:
    "La pregunta que detiene la llamada es cuánto va a costar. El paciente la contesta solo, en tu página, y llega con el precio ya asumido.",
  bullets: [
    "Rango, número de visitas y qué incluye, por tratamiento.",
    "Rango de referencia, no oferta: el precio final sale de la valoración.",
    "Cada consultorio carga sus propios números.",
  ],
  leadNote: "Generado con el tratamiento que elegiste",
  upsell: {
    intro:
      "Tu paquete incluye este motor. Con Profesional y Deluxe se suman los otros de tu especialidad:",
    items: [
      {
        nombre: "Triage dental",
        que: "separa la urgencia de hoy de la cita que puede esperar",
      },
      {
        nombre: "Primera cita sin sorpresas",
        que: "el paso a paso para el paciente que le teme al dentista",
      },
      {
        nombre: "Simulador de sonrisa",
        que: "para consultorios de ortodoncia: proyección de alineación y tono",
      },
    ],
  },
};

/**
 * El simulador de sonrisa dejó de ser el motor estelar de dental, pero sigue construido y
 * vive en el catálogo como motor de ortodoncia. Su contenido se separa aquí para que el
 * componente siga compilando sin colgarse de `dentalMotor`.
 */
export const simuladorSonrisaMotor = {
  badge: "Motor · Ortodoncia",
  title: "Simulador de sonrisa",
  description:
    "El paciente mueve dos controles y ve a dónde puede llegar su sonrisa. Ese es el momento en que decide agendar la valoración.",
  bullets: [
    "Render procedural: sin fotos de pacientes, sin derechos de imagen.",
    "El aviso de que es una proyección está visible mientras juega.",
    "Termina invitando a la valoración, no prometiendo un resultado.",
  ],
  leadNote: "Ejemplo ilustrativo",
  disclaimer:
    "Proyección ilustrativa. No es un resultado garantizado: el plan real sale de una valoración presencial.",
  lead: {
    titulo: "Interés en valoración — Ortodoncia estética",
    senales: [
      "Probó el simulador y llegó al máximo de alineación",
      "Interés declarado: alineación y tono",
      "Proyección ilustrativa, sin promesa de resultado",
    ],
    siguientePaso: "Llega sabiendo qué quiere cambiar. Tú defines si es posible.",
  } satisfies SpecialistLead,
};

export const motorsPrivacyNote =
  "Los motores de especialidad son demos: corren en tu navegador y no guardan ni envían nada. El calendario es la excepción — reserva de verdad y sus datos los procesa Cal.com.";
