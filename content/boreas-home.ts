export const heroWords = ["salud", "belleza", "inmobiliario"];

export const platformLayers = [
  {
    title: "Adquisición",
    status: "Futuro",
    description:
      "Boreas ordenará la generación de tráfico e intención cuando la capa de conversión ya esté dominada.",
  },
  {
    title: "Conversión",
    status: "Activo ahora",
    description:
      "Relevo responde, califica y empuja leads a acciones concretas con playbooks diseñados por industria.",
  },
  {
    title: "Retención",
    status: "Siguiente fase",
    description:
      "Seguimiento, reactivación y fidelización se activarán sobre una base ya medida de revenue y conversiones.",
  },
];

export const playbookPhases = [
  {
    number: "01",
    title: "Apertura",
    description:
      "Relevo toma la intención entrante sin sonar a bot y abre la conversación con el tono correcto.",
  },
  {
    number: "02",
    title: "Calificación mínima",
    description:
      "Obtiene la información indispensable para separar curiosidad, urgencia y lead realmente accionable.",
  },
  {
    number: "03",
    title: "Micro venta",
    description:
      "Aclara valor, reduce fricción y orienta la conversación hacia una decisión concreta.",
  },
  {
    number: "04",
    title: "Push a acción",
    description:
      "Conduce al lead hacia agenda, visita, consulta o siguiente paso sin dejar la conversación abierta.",
  },
  {
    number: "05",
    title: "Objeciones y cierre",
    description:
      "Maneja dudas comunes, refuerza contexto y cierra con una acción medible para el negocio.",
  },
];

export const playbookCards = [
  {
    title: "Playbook por industria",
    description:
      "La lógica de conversación no se improvisa. Cada vertical activa una estructura distinta de preguntas, filtros y cierres.",
    accent: "main",
  },
  {
    title: "Contexto del negocio",
    description:
      "Relevo usa horarios, precios, ubicación, servicios y reglas comerciales para responder con precisión operativa.",
    accent: "neutral",
  },
  {
    title: "Estilo y tono",
    description:
      "La personalización sucede sobre el estilo, no sobre la lógica de conversión. Eso mantiene consistencia y control.",
    accent: "neutral",
  },
  {
    title: "Resultados medibles",
    description:
      "Cada playbook está diseñado para mejorar tiempos de respuesta, avance conversacional y citas agendadas.",
    accent: "accent",
  },
];

export const comparisonFlows = {
  manual: [
    "El lead pregunta y entra en espera.",
    "La respuesta depende del tiempo y del ancho de banda humano.",
    "La conversación se enfría o se va con la competencia.",
    "El negocio pierde revenue sin verlo claramente.",
  ],
  relevo: [
    "La intención se captura al instante.",
    "Relevo califica, ordena contexto y reduce fricción.",
    "El playbook empuja a una acción concreta.",
    "La conversación termina en un resultado medible.",
  ],
};

export const verticals = [
  {
    vertical: "Salud",
    pain: "Consultas perdidas, pacientes sin respuesta y recepción saturada.",
    lead: "Pacientes que preguntan por disponibilidad, valoración o siguiente paso.",
    action: "Consulta, triage comercial o cita agendada.",
  },
  {
    vertical: "Belleza",
    pain: "Reservas que se enfrían por demora, cambios de horario y seguimiento irregular.",
    lead: "Clientes que buscan servicio, precio, agenda o recomendación.",
    action: "Reserva confirmada o conversación reencaminada a agenda.",
  },
  {
    vertical: "Inmobiliario",
    pain: "Leads sin priorización, visitas mal filtradas y agentes reaccionando tarde.",
    lead: "Prospectos que preguntan por propiedad, presupuesto, zona o visita.",
    action: "Visita, llamada de calificación o siguiente acción comercial.",
  },
];

export const onboardingSteps = [
  {
    number: "01",
    title: "Eliges industria",
    description:
      "Salud, belleza o inmobiliario para activar el marco correcto de conversación y prioridad comercial.",
  },
  {
    number: "02",
    title: "Compartes contexto",
    description:
      "Servicios, horarios, ubicación, precios y reglas operativas. Tú no diseñas la lógica; solo aportas datos del negocio.",
  },
  {
    number: "03",
    title: "Activamos el playbook",
    description:
      "Relevo ajusta tono, contexto y objetivos sobre una estructura de conversión ya definida.",
  },
  {
    number: "04",
    title: "Empiezas a medir",
    description:
      "El sistema se evalúa por tiempos de respuesta, avance de conversación y acciones cerradas.",
  },
];

export const metricCards = [
  {
    label: "Tiempo de respuesta",
    description:
      "Qué tan rápido entra el sistema a la conversación cuando aparece intención real.",
  },
  {
    label: "Tasa de respuesta",
    description:
      "Cuántos leads reciben atención efectiva antes de enfriarse o desaparecer.",
  },
  {
    label: "Tasa de avance",
    description:
      "Cuántas conversaciones superan la etapa superficial y se mueven hacia una decisión.",
  },
  {
    label: "Citas agendadas",
    description:
      "Cuántas interacciones terminan en una acción concreta y medible para el negocio.",
  },
];

export const faqs = [
  {
    question: "¿Qué diferencia hay entre Boreas y Relevo?",
    answer:
      "Boreas es la plataforma operativa de revenue. Relevo es el primer módulo activo dentro de ese sistema y se encarga específicamente de la conversión: responder, calificar y empujar leads a una acción concreta.",
  },
  {
    question: "¿Por qué trabajan tres verticales al mismo tiempo?",
    answer:
      "Porque Boreas no se adapta con un discurso genérico, sino con playbooks por industria. La estructura comercial es compartida, pero cada vertical activa preguntas, filtros y cierres distintos.",
  },
  {
    question: "¿El negocio tiene que diseñar la conversación?",
    answer:
      "No. El negocio solo comparte información operativa como horarios, precios, ubicación y servicios. La lógica de conversión ya vive dentro del playbook que activa Relevo.",
  },
  {
    question: "¿Esto es un bot con prompts y respuestas sueltas?",
    answer:
      "No. Relevo opera con una arquitectura de playbook, contexto y estilo. El prompt es solo una capa; la conversión depende de la estructura completa del sistema.",
  },
  {
    question: "¿Qué se mide para saber si está funcionando?",
    answer:
      "Tiempo de respuesta, tasa de respuesta, tasa de avance en conversación y acciones cerradas como citas agendadas, visitas o llamadas calificadas.",
  },
  {
    question: "¿El CTA final ya está cerrado en v2.1?",
    answer:
      "No del todo. En esta versión Boreas elimina la dependencia de mailto y prueba un flujo de diagnóstico de bajo roce para aprender qué formato convierte mejor sin aumentar fricción innecesaria.",
  },
];
