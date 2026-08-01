export type TierId = "esencial" | "profesional" | "deluxe" | "organizaciones";

export type Tier = {
  id: TierId;
  name: string;
  /** Una línea: para quién es este paquete. */
  tagline: string;
  /** null = precio bajo cotización (Organizaciones). */
  setup: number | null;
  monthly: number;
  /** true → la mensualidad se muestra como "desde $X". */
  monthlyIsFrom: boolean;
  /** Costo de activar Entrega Express. null = el toggle no aplica. */
  expressFee: number | null;
  /** Tiempos publicados hoy (spec §11: se publica el actual, no el objetivo). */
  delivery: { base: string; express: string | null };
  /** Lo que incluye, en orden de importancia percibida. Máx 8 por card. */
  features: string[];
  revisions: string;
  warranty: string;
  /** El toggle de Chatbot IA solo existe en Deluxe y Organizaciones (spec §3). */
  allowsIa: boolean;
  recommended: boolean;
  ctaLabel: string;
};

export const IA_SETUP = 6000;
export const IA_MONTHLY = 400;

export const tiers: Tier[] = [
  {
    id: "esencial",
    name: "Esencial",
    tagline: "Para empezar a existir en internet con algo que sí convierte.",
    setup: 12900,
    monthly: 590,
    monthlyIsFrom: false,
    expressFee: 7000,
    delivery: { base: "14 a 21 días", express: "7 a 10 días" },
    features: [
      "1 motor de conversión, el de tu especialidad",
      "Landing de una página",
      "SEO técnico y Google Business",
      "WhatsApp, redes y Google Maps",
      "Revisión de copy contra lineamientos COFEPRIS",
    ],
    revisions: "2 rondas de revisión",
    warranty: "3 meses de garantía",
    allowsIa: false,
    recommended: false,
    ctaLabel: "Quiero el Esencial",
  },
  {
    id: "profesional",
    name: "Profesional",
    tagline: "El que recomendamos: escribimos tu copy y agendas sin intermediarios.",
    setup: 19900,
    monthly: 890,
    monthlyIsFrom: false,
    expressFee: 13000,
    delivery: { base: "14 a 21 días", express: "7 a 10 días" },
    features: [
      "2 motores de conversión",
      "Landing con blog",
      "Copy escrito por nosotros",
      "Agendamiento en línea",
      "Logo vectorizado",
      "Analítica y reporte mensual",
      "Todo lo del Esencial",
    ],
    revisions: "3 rondas de revisión",
    warranty: "12 meses de garantía",
    allowsIa: false,
    recommended: true,
    ctaLabel: "Quiero el Profesional",
  },
  {
    id: "deluxe",
    name: "Deluxe",
    tagline: "Presencia completa, con dominio propio y chatbot opcional.",
    setup: 32900,
    monthly: 1490,
    monthlyIsFrom: false,
    expressFee: 13000,
    delivery: { base: "21 a 30 días", express: "14 a 18 días" },
    features: [
      "3 motores de conversión",
      "Hasta 6 páginas",
      "Dominio incluido el primer año",
      "Todo lo del Profesional",
    ],
    revisions: "4 rondas de revisión",
    warranty: "12 meses de garantía",
    allowsIa: true,
    recommended: false,
    ctaLabel: "Quiero el Deluxe",
  },
  {
    id: "organizaciones",
    name: "Organizaciones",
    tagline: "Clínicas con varias sedes o varios especialistas.",
    setup: null,
    monthly: 2900,
    monthlyIsFrom: true,
    expressFee: null,
    delivery: { base: "A definir contigo", express: null },
    features: [
      "Todos los motores de conversión",
      "Portal de pacientes con acceso",
      "Múltiples sedes y especialistas",
      "Tracking de errores y mapas de calor",
      "Integraciones a medida (CRM, expediente)",
      "SLA contractual",
      "Todo lo del Deluxe",
    ],
    revisions: "Revisiones ilimitadas",
    warranty: "SLA",
    allowsIa: true,
    recommended: false,
    ctaLabel: "Hablemos",
  },
];

export function getTier(id: TierId): Tier {
  const tier = tiers.find((t) => t.id === id);
  if (!tier) throw new Error(`Paquete desconocido: ${id}`);
  return tier;
}

export const pricingHeading = {
  eyebrow: "Precios",
  heading: "Cuánto cuesta y qué incluye.",
  body: "Sin cotizaciones sorpresa. El pago único construye tu sitio; la mensualidad lo mantiene vivo.",
};

export const mensualidadTooltip = {
  summary: "¿Qué es la mensualidad?",
  paragraphs: [
    "El pago único construye tu sitio. La mensualidad lo mantiene vivo.",
    "Incluye: hosting, certificado de seguridad, respaldos automáticos, actualizaciones de seguridad, monitoreo de caídas y soporte por WhatsApp.",
    "Arranca el mes siguiente a que tu sitio salga en vivo. El primer mes va incluido en el pago inicial.",
    "Sin permanencia forzosa. Puedes cancelar cuando quieras con 30 días de aviso; te entregamos el código y te ayudamos a migrar.",
  ],
};

export const garantiaTooltip = {
  summary: "¿Qué cubre la garantía?",
  paragraphs: [
    "Durante este periodo arreglamos sin costo cualquier error, bug o cosa que no funcione como se acordó.",
    "No cubre funciones nuevas ni rediseños.",
  ],
};

export const expressToggle = {
  label: "Entrega Express",
  help: "Reduce el tiempo de entrega.",
};

export const iaToggle = {
  label: "Chatbot IA",
  help: "Responde horarios, servicios y ubicación, y agenda citas.",
  unavailable: "Disponible desde Deluxe.",
};

/** Nota bajo las cards. El reloj de entrega es del spec §10. */
export const pricingFootnote =
  "El anticipo es 50% para arrancar y 50% contra entrega. El tiempo de entrega empieza a correr cuando recibimos tu anticipo y tu audio de un minuto: nada más depende de ti.";
