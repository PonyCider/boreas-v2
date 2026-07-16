export const heroHeadline = "Tu consultorio digital, abierto las 24 horas.";

export const heroSubcopy = "Mientras consultas, tus pacientes ya están revisando reseñas, comparando opciones y decidiendo a quién escribir. Boreas convierte esa primera búsqueda en confianza y contacto directo por WhatsApp.";

export const heroCredibility = "Para médicos privados con pacientes buscando en línea";

export const heroProofPoints = [
  "Reseñas de Google",
  "Agenda por WhatsApp",
  "Pacientes decididos",
  "Sin trabajo técnico",
];

// Hero card cluster — reuses socialProof.mockupDoctor as the single source of
// truth for name/specialty/rating/testimonial (avoids drift like the old 4.9 vs 4.8).
export const heroCardStats = {
  appointmentsToday: 3,
  appointmentsTodayLabelSingular: "cita hoy",
  appointmentsTodayLabelPlural: "citas hoy",
  searchPercent: "82%",
  searchLabel: "busca en línea antes de agendar",
  searchStatTitle: "Pacientes digitales",
  reviewCountLabel: "reseñas",
  lastReplyTime: "11:47 PM",
  lastReplyLabel: "tu consultorio respondió",
};

// Cinematic hero sequence (docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md):
// the 11:47 PM chip starts in this "problem" state and flips to `lastReplyLabel`
// (above) partway through the scroll-linked sequence — same object, same
// timestamp, inverted meaning.
export const lastReplyProblemLabel = "tu paciente sigue esperando";

// Eyebrow shown only during the cinematic sequence's first phase, before it
// crossfades to `heroCredibility`. Sourced stat (40%, fuera de horario) is
// the same one already used in `problemStats` and `socialProof` — repeated
// here by deliberate choice, not oversight (see spec, "Fase 1").
export const heroEyebrowProblem = "El 40% de las búsquedas ocurre fuera de horario laboral.";

export const exampleBadgeLabel = "Ejemplo ilustrativo";

export const heroVerifiedLabel = "Verificado";

// Reuses socialProof.mockupDoctor's own city context — CDMX is already the
// city used for other example businesses in this file (relevoExamples),
// kept consistent rather than inventing a new one.
export const heroLocationLabel = "CDMX";

// Problem section data points
// Sourced and value-checked 2026-07-13 (see statsSources): "3×" (GMB own-site vs
// social-redirect clicks) had no verifiable source and was removed per GUIDELINES
// §2's hard rule, rather than kept unsourced or backed by a loosely-related stat.
export const problemStats = [
  {
    value: "82%",
    label: "de los pacientes busca y evalúa tu presencia en línea antes de agendar su primera cita.",
  },
  {
    value: "40%",
    label: "de las citas y consultas ocurren fuera del horario de oficina. Tu web las captura 24/7.",
  },
];

export const problemStatsSources = "Accenture Health Consumer Survey · Kyruus Care Access Benchmark Report";

export const painPoints = [
  {
    text: "El paciente llega con intención, pero WhatsApp lo recibe como otro mensaje más.",
    emphasis: "otro mensaje más",
  },
  {
    text: "Tu asistente filtra curiosos que solo preguntan precio mientras los pacientes decididos esperan.",
    emphasis: "los pacientes decididos esperan",
  },
  {
    text: "Tus reseñas ya generan confianza, pero no siempre empujan al paciente al siguiente paso.",
    emphasis: "no siempre empujan al paciente al siguiente paso",
  },
];

// Transformation section (Bloque 3 - what each part does for the doctor, no dev/agency jargon)
export const transformationHeading = "No te vendemos una página. Te entregamos pacientes decididos.";
export const transformationSubcopy = "Cada parte de tu consultorio digital tiene un trabajo: que el paciente correcto te escriba, ya convencido.";

export const transformations = [
  {
    label: "Tu consultorio en línea",
    benefit: "Tener tu consultorio, con tu tono y esencia, pero en línea. Abierto las 24 horas del día, sin descanso, adaptado para que se vea impecable en el celular de cualquier paciente.",
  },
  {
    label: "El paciente llega convencido",
    benefit: "Hacer que el paciente que ya vio tus estrellas en Google Maps no se quede con la duda, sino que dé el paso firme y llegue contigo bien convencido de tu experiencia, listo para pagar tu consulta.",
  },
  {
    label: "Tu asistente deja de filtrar curiosos",
    benefit: "Ahorrarle tiempo a tu asistente. Que en lugar de contestar 20 mensajes de curiosos que solo buscan 'precios baratos', le heredes mensajes de pacientes que ya saben qué haces y van directo a agendar.",
  },
  {
    label: "Un toque y te escriben",
    benefit: "Un botón claro y directo que conecta al paciente con tu WhatsApp Business en un solo toque, eliminando cualquier distracción en el camino.",
  },
];

// Process section (Bloque 4 - Onboarding steps, only 3)
export const processSteps = [
  {
    title: "Nos envías un audio de 1 minuto",
    description: "Cuáles son tus tratamientos más rentables, qué atmósfera visual prefieres y por qué te eligen tus pacientes actuales. Nada más.",
    badge: "1 audio de WhatsApp",
  },
  {
    title: "Diseñamos tu consultorio digital",
    description: "En 48 a 72 horas tendrás tu espacio profesional en línea con redacción especializada, tus reseñas de Google Maps integradas y conexión directa a tu WhatsApp.",
    badge: "48–72 h de entrega",
  },
  {
    title: "Lo conectamos y lo lanzamos",
    description: "Enlazamos tu perfil de Google Maps a tu nuevo consultorio digital. Un toque para que el paciente te contacte.",
    badge: "Sin formularios",
  },
];

// Guarantee section (Bloque 4 - Post-sale psychological shield)
export const guarantees = [
  {
    title: "Documento de respaldo",
    description: "Recibes un documento ejecutivo de inmediato que resume los beneficios reales en dinero y tiempo para tu consultorio, validando tu decisión.",
  },
  {
    title: "Cero esfuerzo de tu parte",
    description: "No llenas formularios ni redactas textos. Solo envías un audio de voz con lo básico y nosotros nos encargamos de todo.",
  },
  {
    title: "Tus propias reseñas integradas",
    description: "Extraemos las mejores reseñas reales de tus pacientes en Google Maps y las integramos en tu diseño. Ver sus palabras plasmadas genera confianza inmediata.",
  },
];

// FAQ section
export const faqs = [
  {
    question: "¿Qué necesito para empezar?",
    answer: "Solo un audio de un minuto por WhatsApp. Nos cuentas tus tratamientos principales, el ambiente visual que prefieres y por qué te eligen tus pacientes. Nosotros nos encargamos de todo lo demás.",
  },
  {
    question: "¿Cuánto tiempo tarda en estar lista mi página?",
    answer: "Entre 48 y 72 horas. Trabajamos con plazos agresivos porque sabemos que cada día sin presencia digital es un paciente que se va con la competencia.",
  },
  {
    question: "¿Tengo que redactar los textos de mi página?",
    answer: "No. Contamos con redacción médica especializada. A partir de tu audio, creamos todo el contenido profesional de tu consultorio digital.",
  },
  {
    question: "¿Qué incluye el servicio?",
    answer: "Diseño profesional, redacción médica, hosting por un año, dominio (con costo adicional), mantenimiento mensual, optimización para Google y para búsquedas de inteligencia artificial.",
  },
  {
    question: "¿Funciona en celulares?",
    answer: "Tu consultorio digital se adapta automáticamente a cualquier pantalla. La mayoría de tus pacientes te buscarán desde su celular; tu página se verá impecable ahí.",
  },
  {
    question: "¿Se puede conectar a mi WhatsApp Business?",
    answer: "Sí. Incluimos un botón directo que conecta al paciente con tu WhatsApp Business en un solo toque, sin distracciones ni formularios largos.",
  },
];

// Social proof section (Bloque: Esto pasa todos los días)
export const socialProof = {
  heading: "Tu paciente buscó anoche. No te encontró.",

  frictions: [
    {
      body: "Tu paciente buscaba agendar a altas horas de la noche. Nadie contesta llamadas a esa hora.",
      closer: "Agendó en línea con quien sí tenía página.",
    },
    {
      body: "Tu asistente contesta lo mismo todos los días antes de cada primera cita: ¿cuánto cuesta?, ¿atienden mi caso?, ¿tienen lugar esta semana?",
      closer: "Una página lo resuelve antes de que marquen.",
    },
    {
      body: "Alguien leyó tus reseñas en Google Maps y quería ir contigo. Buscó más información. No encontró nada.",
      closer: "\"Lo pienso\" casi siempre es \"lo descarto.\"",
    },
  ],

  stats: [
    {
      connector: null,
      value: "2 de cada 3",
      label: "pacientes prefiere agendar en línea antes que llamar.",
      closer: "El teléfono ya es el plan B.",
    },
    {
      connector: "Y de los que sí llaman, el",
      value: "77%",
      label: "busca en línea antes de marcar.",
      closer: "Si no encuentran nada, no marcan.",
    },
    {
      connector: "Y el",
      value: "40%",
      label: "de esas búsquedas ocurren fuera de horario.",
      closer: "Tu celular no contesta. Tu consultorio sí.",
    },
  ],

  statsSources: "Accenture Health Consumer Survey · Think with Google · Kyruus",

  mockupCaption: "Tu paciente te buscó ayer a las 11 de la noche. Esto encontró.",

  mockupDoctor: {
    name: "Dra. Sofía Ramírez",
    specialty: "Cardiología Clínica",
    rating: "4.8",
    reviewCount: "127",
    testimonial:
      "Llegué con muchas dudas y salí con todo claro. Lo recomiendo ampliamente.",
    reviewerName: "Paciente verificado · Google Maps",
  },
} as const;

// Relevo section (Bloque: siguiente capa — nunca compite con el CTA principal)
export const relevoKicker = "Siguiente capa";
export const relevoHeading = "Cuando tu consultorio ya tiene demanda, Relevo contesta por ti.";
export const relevoSubheading = "El asistente de WhatsApp de Boreas.";
export const relevoBody = "Relevo contesta, califica y agenda automáticamente — para cuando ya no quieras hacerlo tú mismo.";
export const relevoCtaLabel = "Ir a Relevo.chat";
export const relevoCtaHref = "https://relevo.chat";
export const relevoExampleLabel = "Ejemplo real";

// Ported from relevo.chat's own landing (components/landing/how-it-works.tsx).
// 8 real-shaped conversations across industries — shows Relevo's range, not
// just medical (the "Dental" case doubles as a doctor-relevant example).
export type RelevoMessage =
  | { role: "customer"; text: string; time: string }
  | { role: "ai"; text: string; time: string }
  | { role: "handoff"; to: string; reason: string }
  | { role: "human"; text: string; time: string; name: string; initial: string; isContext?: boolean }
  | { role: "resolved"; text: string };

export type RelevoExample = {
  chipIcon: string;
  chipLabel: string;
  business: { name: string; initials: string; channel: string };
  quote: string;
  context: { text: string; emphasis: string };
  stats: { time: string; sale: string; effort: string };
  messages: RelevoMessage[];
};

export const relevoExamples: RelevoExample[] = [
  {
    chipIcon: "🍴",
    chipLabel: "Restaurante",
    business: { name: "La Trattoria MX", initials: "LT", channel: "Restaurante · CDMX" },
    quote: "«¿Tienen algo sin gluten? Mi hijo es celíaco.»",
    context: {
      text: "La IA respondió menú, precios y horarios sola. Cuando llegó una pregunta sobre ingredientes específicos por alergia, reconoció que no tenía esa información y pasó al chef en segundos — con todo el hilo.",
      emphasis: "ingredientes específicos por alergia",
    },
    stats: { time: "5 min", sale: "mesa + dieta especial", effort: "2 min" },
    messages: [
      { role: "customer", text: "Hola, ¿cuál es el menú de hoy y a qué hora cierran?", time: "13:02" },
      { role: "ai", text: "¡Hola! Hoy tenemos pasta al pesto, risotto de champiñones o filete en salsa. Todo $220/persona con sopa y postre. Cerramos a las 23:00. ¿Te interesa reservar?", time: "13:02" },
      { role: "customer", text: "Sí para 3. Pero mi hijo es celíaco, ¿tienen algo sin gluten? ¿La pasta tiene trazas?", time: "13:04" },
      { role: "handoff", to: "Chef Mario", reason: "Información de alérgenos — verificación requerida" },
      { role: "human", text: "¡Hola! Soy Mario, chef. El risotto es libre de gluten y lo preparamos en zona separada. La pasta sí tiene. Reservo los 3 a qué hora.", time: "13:05", name: "Mario H.", initial: "M" },
    ],
  },
  {
    chipIcon: "✂️",
    chipLabel: "Barbería",
    business: { name: "Barbería El Corte", initials: "BC", channel: "Barbería · Monterrey" },
    quote: "«¿Tienen lugar para corte y barba mañana en la tarde?»",
    context: {
      text: "El cliente preguntó, eligió horario, confirmó nombre y la cita quedó en Calendar sin que el barbero tocara el teléfono. El equipo solo llegó a trabajar.",
      emphasis: "la cita quedó en Calendar",
    },
    stats: { time: "3 min", sale: "cita agendada $280", effort: "0 min" },
    messages: [
      { role: "customer", text: "Buenas, ¿tienen lugar mañana para corte y barba? Prefiero en la tarde.", time: "10:14" },
      { role: "ai", text: "¡Claro! Mañana tengo 15:30 y 17:00 disponibles. Corte + barba: $280, dura 45 min. ¿Cuál hora te queda?", time: "10:14" },
      { role: "customer", text: "Las 5 perfecto. Me llamo Carlos.", time: "10:15" },
      { role: "ai", text: "Listo Carlos, cita confirmada mañana 17:00. Te mando recordatorio una hora antes. ¡Nos vemos!", time: "10:15" },
      { role: "resolved", text: "Cita en Calendar · El equipo no intervino" },
    ],
  },
  {
    chipIcon: "🦷",
    chipLabel: "Dental",
    business: { name: "Clínica Dental Sonríe", initials: "CS", channel: "Dental · Guadalajara" },
    quote: "«¿Cuánto cuesta una limpieza? Tengo MetLife.»",
    context: {
      text: "La IA respondió precios generales y convenios conocidos. Al llegar a la cobertura específica de MetLife más una urgencia médica, reconoció su límite y escaló — Ana tomó con el historial completo.",
      emphasis: "reconoció su límite y escaló",
    },
    stats: { time: "6 min", sale: "cita urgente confirmada", effort: "2 min" },
    messages: [
      { role: "customer", text: "Hola, ¿cuánto cuesta una limpieza dental? Tengo seguro MetLife.", time: "9:12" },
      { role: "ai", text: "¡Hola! La limpieza es $350 MXN. Trabajamos con GNP y AXA con convenio. Para MetLife necesito verificar cobertura — ¿también tienes algún otro tema dental?", time: "9:12" },
      { role: "customer", text: "Sí, además me duele una muela desde ayer y quiero saber si MetLife me cubre la extracción.", time: "9:15" },
      { role: "handoff", to: "Ana · Recepción", reason: "Cobertura MetLife + urgencia médica — verificación en sistema" },
      { role: "human", text: "Hola, soy Ana. MetLife cubre extracción al 70% con el Dr. Ramírez. Tengo hoy a las 15:30 si tienes urgencia. ¿Lo bloqueo?", time: "9:16", name: "Ana P.", initial: "A" },
    ],
  },
  {
    chipIcon: "👗",
    chipLabel: "Boutique",
    business: { name: "Boutique Lunar", initials: "BL", channel: "Ropa · Mérida" },
    quote: "«Vi el vestido verde en IG, ¿tienen talla M?»",
    context: {
      text: "De la consulta de disponibilidad al apartado confirmado con datos de pago — todo resuelto por la IA. El equipo no recibió una sola notificación.",
      emphasis: "apartado confirmado con datos de pago",
    },
    stats: { time: "5 min", sale: "$1,290 MXN", effort: "0 min" },
    messages: [
      { role: "customer", text: "Hola! Vi el vestido verde en IG. ¿Siguen teniendo talla M?", time: "19:40" },
      { role: "ai", text: "¡Sí! Nos queda una M en verde jade a $1,290. Lo puedo apartar 24 horas. ¿Lo tomas?", time: "19:40" },
      { role: "customer", text: "Sí por favor. ¿Hacen envíos a Guadalajara?", time: "19:41" },
      { role: "ai", text: "Claro, envío a GDL $120 MXN, llega en 2-3 días hábiles. ¿Tu nombre para el apartado?", time: "19:41" },
      { role: "customer", text: "Sofía Ruiz", time: "19:42" },
      { role: "ai", text: "Listo Sofía, vestido apartado. Te mando los datos de transferencia — en cuanto confirmes lo enviamos.", time: "19:42" },
      { role: "resolved", text: "Venta iniciada · Equipo no intervino" },
    ],
  },
  {
    chipIcon: "💪",
    chipLabel: "Gym",
    business: { name: "Gym Pulso", initials: "GP", channel: "Fitness · Puebla" },
    quote: "«Quiero cancelar mi membresía.»",
    context: {
      text: "La IA respondió la primera pregunta normal. Al detectar \"cancelar\" en el siguiente mensaje, notificó a retención de inmediato — Diego entró antes de que el cliente terminara de leer la respuesta.",
      emphasis: "\"cancelar\"",
    },
    stats: { time: "3 min", sale: "retención activa", effort: "5 min" },
    messages: [
      { role: "customer", text: "Hola, ¿cuánto es la mensualidad actualmente?", time: "17:03" },
      { role: "ai", text: "¡Hola! Mensualidad $650, plan trimestral $1,650 (ahorras $300). También tenemos clase de prueba gratis. ¿Qué entrenamiento buscas?", time: "17:03" },
      { role: "customer", text: "Ya tengo membresía pero quiero cancelarla, no he podido ir en meses.", time: "17:05" },
      { role: "handoff", to: "Diego · Retención", reason: "Keyword detectada: «cancelar»" },
      { role: "human", text: "Hola, soy Diego. Entiendo que no has podido venir. ¿Y si pausamos tu membresía 30 días sin costo? Así no pierdes tu lugar mientras te reacomodas.", time: "17:05", name: "Diego M.", initial: "D" },
    ],
  },
  {
    chipIcon: "🏨",
    chipLabel: "Hotel",
    business: { name: "Casa Brisa Hotel", initials: "CB", channel: "Hotel · Tulum" },
    quote: "«Somos 6 adultos para aniversario de bodas en Semana Santa.»",
    context: {
      text: "La IA recopiló fechas, número de personas y detectó ocasión especial + presupuesto abierto. Escaló al momento exacto en que el equipo agrega más valor que cualquier respuesta automática.",
      emphasis: "ocasión especial + presupuesto abierto",
    },
    stats: { time: "8 min", sale: "paquete $9,400+", effort: "10 min" },
    messages: [
      { role: "customer", text: "Buenas, somos 6 adultos para Semana Santa, del 13 al 17 de abril. ¿Hay disponibilidad?", time: "11:12" },
      { role: "ai", text: "¡Hola! Sí tenemos. Suite familiar (6 personas) a $6,800 las 4 noches, o 2 habitaciones dobles por $5,200. ¿Tienen alguna ocasión especial?", time: "11:12" },
      { role: "customer", text: "Es aniversario de bodas de mis papás. Queremos algo especial, el presupuesto es flexible.", time: "11:14" },
      { role: "handoff", to: "Fernanda · Eventos", reason: "Lead calificado — ocasión especial + presupuesto abierto" },
      { role: "human", text: "¡Hola, soy Fernanda! Para aniversarios tenemos paquete premium: suite + cena romántica + decoración + cava desde $9,400. ¿Lo platicamos?", time: "11:16", name: "Fernanda T.", initial: "F" },
    ],
  },
  {
    chipIcon: "💆",
    chipLabel: "Spa",
    business: { name: "Aura Studio", initials: "AS", channel: "Spa · Querétaro" },
    quote: "«Quiero regalarle un día de spa a mi mamá el domingo.»",
    context: {
      text: "La IA explicó paquetes, verificó disponibilidad, tomó el nombre y confirmó la cita de $1,580 — todo en una conversación fluida. El spa solo se enteró cuando llegó la reserva al sistema.",
      emphasis: "confirmó la cita de $1,580",
    },
    stats: { time: "5 min", sale: "$1,580 MXN", effort: "0 min" },
    messages: [
      { role: "customer", text: "Hola, quiero regalarle un día de spa a mi mamá el domingo. ¿Qué paquetes tienen?", time: "20:07" },
      { role: "ai", text: "¡Qué bonito detalle! Tenemos Paquete Relajación (masaje + facial) $980, o Paquete Completo (masaje + facial + manicure + pedicure) $1,580. ¿Cuál prefieren?", time: "20:07" },
      { role: "customer", text: "El completo. ¿Tienen el domingo a las 10:30?", time: "20:08" },
      { role: "ai", text: "Domingo 10:30 disponible. El paquete dura aprox. 3 horas. ¿A nombre de quién es la cita?", time: "20:09" },
      { role: "customer", text: "Para Rosa, mi mamá. Yo soy Laura.", time: "20:09" },
      { role: "ai", text: "Listo Laura, cita reservada para Rosa el domingo 10:30. Paquete Completo $1,580. Pueden liquidar en caja el día del servicio. 🌿", time: "20:10" },
      { role: "resolved", text: "Cita confirmada · Equipo no intervino" },
    ],
  },
  {
    chipIcon: "🏢",
    chipLabel: "Inmobiliaria",
    business: { name: "Norte Inmobiliaria", initials: "NI", channel: "Inmobiliaria · CDMX" },
    quote: "«Me interesa el depa en Narvarte, ¿se puede ver mañana?»",
    context: {
      text: "La IA respondió características, precio y agendó la visita completa. Javier recibió la notificación con el contexto — nombre, teléfono y fecha — sin escribir un solo mensaje. Solo tiene que llegar.",
      emphasis: "Javier recibió la notificación con el contexto",
    },
    stats: { time: "6 min", sale: "visita agendada", effort: "0 msg" },
    messages: [
      { role: "customer", text: "Hola, vi el depa en Narvarte en Lamudi. ¿Sigue disponible y se puede ver mañana?", time: "14:28" },
      { role: "ai", text: "¡Hola! Sí disponible. 85m², 2 recámaras, piso 8 con balcón. Precio $3,950,000 MXN. Mañana tengo 11:00 y 16:00. ¿Cuál te funciona?", time: "14:28" },
      { role: "customer", text: "Las 11, perfecto. Soy Marco Vega, 55-1234-5678.", time: "14:30" },
      { role: "ai", text: "Visita confirmada Marco, mañana 11:00 en Narvarte. Nuestro asesor Javier te recibirá con la ficha completa. ¡Hasta mañana!", time: "14:31" },
      { role: "handoff", to: "Javier · Asesor", reason: "Solo contexto — sin acción requerida en chat" },
      { role: "human", text: "Marco Vega · 55-1234-5678 · Visita mañana 11:00 · Depa Narvarte $3.95M · Preparando ficha técnica.", time: "14:31", name: "Javier L.", initial: "J", isContext: true },
    ],
  },
];
