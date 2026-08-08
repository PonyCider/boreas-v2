export type RelevoMessage =
  | { role: "patient"; text: string; time: string }
  | { role: "assistant"; text: string; time: string }
  | { role: "handoff"; to: string; reason: string }
  | {
      role: "specialist";
      text: string;
      time: string;
      name: string;
      initial: string;
      isInternalContext?: boolean;
    }
  | { role: "resolved"; text: string };

export type RelevoExample = {
  chipIcon: string;
  chipLabel: string;
  practice: {
    name: string;
    initials: string;
    channel: string;
  };
  quote: string;
  context: {
    text: string;
    emphasis: string;
  };
  metrics: {
    conversation: string;
    outcome: string;
    team: string;
  };
  messages: RelevoMessage[];
};

export type RelevoTestimonial = {
  quote: string;
  author: string;
  role: string;
  initials: string;
};

export const relevoContent = {
  eyebrow: "Siguiente capa",
  heading:
    "Cuando tu presencia digital empieza a generar demanda, Relevo responde por ti.",
  subheading: "El asistente de WhatsApp que acompaña tu práctica entre consultas.",
  body:
    "Responde preguntas frecuentes, identifica intención, ayuda a agendar y pasa la conversación a tu equipo cuando hace falta — sin sustituir el criterio clínico.",
  ctaLabel: "Conocer Relevo",
  ctaHref: "https://relevo.chat",
  exampleLabel: "Ejemplo ilustrativo",
  interactionHint: "Explora otro ejemplo",
} as const;

// Contenido provisional: sustituir por testimonios autorizados antes de publicar.
export const relevoTestimonials: RelevoTestimonial[] = [
  {
    quote: "Las preguntas frecuentes se resuelven sin interrumpir cada consulta.",
    author: "Especialista beta 01",
    role: "Odontología · provisional",
    initials: "E1",
  },
  {
    quote: "Cuando intervengo, la conversación ya llega con el contexto ordenado.",
    author: "Especialista beta 02",
    role: "Psicología · provisional",
    initials: "E2",
  },
  {
    quote: "El paciente recibe respuesta y mi equipo conserva el control.",
    author: "Especialista beta 03",
    role: "Nutrición · provisional",
    initials: "E3",
  },
];

export const relevoExamples: RelevoExample[] = [
  {
    chipIcon: "🧠",
    chipLabel: "Psicología",
    practice: {
      name: "Consulta Horizonte",
      initials: "CH",
      channel: "Psicología · WhatsApp",
    },
    quote: "«¿La primera sesión puede ser en línea y cuánto dura?»",
    context: {
      text: "Relevo explicó el proceso autorizado por la especialista y mostró horarios. Cuando la conversación mencionó una situación urgente, dejó de automatizar y pasó el hilo completo a la psicóloga.",
      emphasis: "dejó de automatizar y pasó el hilo completo",
    },
    metrics: {
      conversation: "4 min",
      outcome: "orientación + solicitud",
      team: "solo al escalar",
    },
    messages: [
      {
        role: "patient",
        text: "Hola, ¿la primera sesión puede ser en línea y cuánto dura?",
        time: "20:41",
      },
      {
        role: "assistant",
        text: "Sí. La primera sesión puede ser por videollamada y dura 50 minutos. Tengo espacios el martes a las 18:00 y el jueves a las 17:30. ¿Quieres revisar alguno?",
        time: "20:41",
      },
      {
        role: "patient",
        text: "El jueves me funciona. También quisiera contarle algo urgente que pasó hoy.",
        time: "20:43",
      },
      {
        role: "handoff",
        to: "Lic. Andrea · Psicóloga",
        reason: "La conversación requiere valoración humana",
      },
      {
        role: "specialist",
        text: "Hola, soy Andrea. Ya tengo el contexto de la conversación. Te escribo personalmente para orientarte sobre el siguiente paso.",
        time: "20:44",
        name: "Andrea",
        initial: "A",
      },
    ],
  },
  {
    chipIcon: "🥑",
    chipLabel: "Nutrición",
    practice: {
      name: "Nutrición Balance",
      initials: "NB",
      channel: "Nutrición · WhatsApp",
    },
    quote: "«¿Trabajan en línea? Quiero empezar un plan nutricional.»",
    context: {
      text: "Relevo respondió modalidad, duración y preparación para la primera consulta con información aprobada por la nutrióloga. Después recopiló los datos mínimos y dejó la cita lista.",
      emphasis: "dejó la cita lista",
    },
    metrics: {
      conversation: "3 min",
      outcome: "cita confirmada",
      team: "sin intervención",
    },
    messages: [
      {
        role: "patient",
        text: "Hola, ¿trabajan en línea? Quiero empezar un plan nutricional.",
        time: "19:12",
      },
      {
        role: "assistant",
        text: "Sí, hay consulta en línea y presencial. La primera sesión dura 60 minutos e incluye evaluación inicial. ¿Qué modalidad prefieres?",
        time: "19:12",
      },
      {
        role: "patient",
        text: "En línea. ¿Tienen espacio el viernes por la tarde?",
        time: "19:13",
      },
      {
        role: "assistant",
        text: "Tengo viernes a las 16:30 o 18:00. Para reservar solo necesito tu nombre y correo.",
        time: "19:13",
      },
      {
        role: "resolved",
        text: "Cita confirmada · Indicaciones enviadas",
      },
    ],
  },
  {
    chipIcon: "🦵",
    chipLabel: "Fisioterapia",
    practice: {
      name: "Fisio Movimiento",
      initials: "FM",
      channel: "Fisioterapia · WhatsApp",
    },
    quote: "«Me lastimé la rodilla. ¿Qué ejercicio puedo hacer?»",
    context: {
      text: "Relevo no improvisó una recomendación clínica. Recopiló información básica, explicó que el fisioterapeuta debía valorar el caso y transfirió la conversación con el contexto ordenado.",
      emphasis: "no improvisó una recomendación clínica",
    },
    metrics: {
      conversation: "2 min",
      outcome: "valoración solicitada",
      team: "contexto completo",
    },
    messages: [
      {
        role: "patient",
        text: "Ayer me lastimé la rodilla corriendo. ¿Qué ejercicio puedo hacer para que se me quite?",
        time: "08:26",
      },
      {
        role: "assistant",
        text: "Para recomendar ejercicios, el fisioterapeuta necesita valorar tu caso. Puedo ayudarte a solicitar una revisión. ¿La molestia comenzó por una caída o apareció mientras corrías?",
        time: "08:26",
      },
      {
        role: "patient",
        text: "Fue después de una caída y hoy me cuesta apoyar.",
        time: "08:27",
      },
      {
        role: "handoff",
        to: "Carlos · Fisioterapeuta",
        reason: "Síntomas que requieren valoración profesional",
      },
      {
        role: "specialist",
        text: "Hola, soy Carlos. Ya vi lo que pasó y que te cuesta apoyar. Te haré unas preguntas antes de definir la atención adecuada.",
        time: "08:28",
        name: "Carlos",
        initial: "C",
      },
    ],
  },
  {
    chipIcon: "🦷",
    chipLabel: "Dental",
    practice: {
      name: "Clínica Dental Sonríe",
      initials: "CS",
      channel: "Odontología · WhatsApp",
    },
    quote: "«¿Cuánto cuesta una limpieza? También me duele una muela.»",
    context: {
      text: "Relevo respondió la información general disponible. Al detectar dolor y una pregunta específica sobre cobertura, reconoció el límite y escaló a recepción con todo el historial.",
      emphasis: "reconoció el límite y escaló a recepción",
    },
    metrics: {
      conversation: "5 min",
      outcome: "cita prioritaria",
      team: "respuesta dirigida",
    },
    messages: [
      {
        role: "patient",
        text: "Hola, ¿cuánto cuesta una limpieza? También me duele una muela desde ayer.",
        time: "09:12",
      },
      {
        role: "assistant",
        text: "La limpieza tiene un precio base de $650. Por el dolor es importante que el equipo revise disponibilidad para valoración. ¿Tienes algún seguro dental?",
        time: "09:12",
      },
      {
        role: "patient",
        text: "Tengo seguro, pero no sé si cubre una extracción.",
        time: "09:14",
      },
      {
        role: "handoff",
        to: "Ana · Recepción",
        reason: "Dolor dental + verificación de cobertura",
      },
      {
        role: "specialist",
        text: "Hola, soy Ana. Ya tengo el contexto. Voy a revisar tu cobertura y los espacios de valoración disponibles hoy.",
        time: "09:15",
        name: "Ana",
        initial: "A",
      },
    ],
  },
  {
    chipIcon: "🩺",
    chipLabel: "Medicina",
    practice: {
      name: "Cardiología Norte",
      initials: "CN",
      channel: "Consulta médica · WhatsApp",
    },
    quote: "«¿Necesito ayuno para mi estudio del lunes?»",
    context: {
      text: "Relevo compartió las indicaciones generales configuradas por el consultorio. Cuando el paciente preguntó si debía suspender un medicamento, derivó la decisión al equipo médico sin responder por su cuenta.",
      emphasis: "derivó la decisión al equipo médico",
    },
    metrics: {
      conversation: "3 min",
      outcome: "indicaciones confirmadas",
      team: "solo la decisión clínica",
    },
    messages: [
      {
        role: "patient",
        text: "Tengo un estudio el lunes. ¿Necesito ir en ayunas?",
        time: "17:34",
      },
      {
        role: "assistant",
        text: "Para ese estudio, el consultorio indica ayuno de 8 horas y llevar la orden médica. Puedes tomar agua simple. ¿Tienes otra duda sobre la preparación?",
        time: "17:34",
      },
      {
        role: "patient",
        text: "Sí. ¿Debo suspender mi medicamento para la presión?",
        time: "17:35",
      },
      {
        role: "handoff",
        to: "Equipo médico",
        reason: "Pregunta sobre medicación",
      },
      {
        role: "specialist",
        text: "Hola. Ya vi tu pregunta y revisaré las indicaciones de tu expediente antes de responderte.",
        time: "17:36",
        name: "Equipo médico",
        initial: "M",
        isInternalContext: true,
      },
    ],
  },
];
