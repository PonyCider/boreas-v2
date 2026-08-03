/**
 * Cotizador dental. El bloqueo número uno del paciente dental no es la estética: es no
 * saber cuánto va a costar antes de llamar. Este motor contesta esa pregunta sola.
 *
 * Los rangos son de referencia NACIONAL para consultorio privado en México, agosto 2026.
 * No son los precios de ningún consultorio en particular — en el sitio de cada cliente el
 * dentista carga los suyos. Publicar un rango sin esa aclaración sería información
 * engañosa bajo el art. 32 de la LFPC, porque el paciente lo leería como oferta.
 *
 * Fuentes de los rangos (consultadas 2026-08-03):
 * - Limpieza y limpieza profunda: DentistaMexico, "¿Cuánto cuesta una limpieza dental en
 *   México 2026?" — dentistamexico.com/blog/cuanto-cuesta-limpieza-dental-mexico-2026
 * - Extracciones y muela del juicio: DentistaMexico, "¿Cuánto cuesta una extracción dental
 *   en México 2026?" — dentistamexico.com/blog/cuanto-cuesta-extraccion-dental-mexico-2026
 * - Endodoncia: Dentalia — dentalia.com/es/endodoncia-precios
 * - Corona: Dentalia — dentalia.com/es/coronas-dentales-precios
 * - Implante: Dentalia — dentalia.com/es/precio-implantes-dentales-mexico
 * - Blanqueamiento: Dentalia — dentalia.com/es/blanqueamiento-dental-precios
 * - Brackets: Dentalia — dentalia.com/es/brackets-precios-mexico
 *
 * Las ciudades medias corren por debajo de la capital (la fuente de limpieza ubica ciudades
 * pequeñas y medias en torno al 60-70% del precio de CDMX), así que los rangos abren bajo
 * a propósito en vez de centrarse en el precio capitalino.
 */

export const COTIZADOR_FUENTE =
  "Rangos de referencia nacional para consultorio privado en México, agosto 2026. No son los precios de un consultorio en particular: cada clínica carga los suyos.";

export type Tratamiento = {
  id: string;
  nombre: string;
  /** Qué motiva al paciente a elegirlo, en sus palabras y no en las del dentista. */
  motivo: string;
  min: number;
  max: number;
  /** Texto libre porque hay tratamientos que se miden en meses, no en citas. */
  visitas: string;
  incluye: string[];
  /** Se muestra solo cuando el rango puede leerse como precio total y no lo es. */
  nota?: string;
};

export const TRATAMIENTOS: Tratamiento[] = [
  {
    id: "limpieza",
    nombre: "Limpieza dental",
    motivo: "Mantenimiento o sarro visible",
    min: 500,
    max: 1500,
    visitas: "1 cita",
    incluye: ["Ultrasonido y pulido", "Revisión general", "Indicaciones de higiene"],
  },
  {
    id: "limpieza-profunda",
    nombre: "Limpieza profunda",
    motivo: "Encías que sangran o se retraen",
    min: 1500,
    max: 6000,
    visitas: "2 citas",
    incluye: ["Raspado bajo la encía", "Alisado radicular", "Control a las semanas"],
    nota: "Se cobra por cuadrante: el rango cubre desde uno hasta la boca completa.",
  },
  {
    id: "resina",
    nombre: "Resina (empaste)",
    motivo: "Caries o un diente astillado",
    min: 1200,
    max: 2500,
    visitas: "1 cita",
    incluye: ["Anestesia local", "Retiro de caries", "Resina del color del diente"],
    nota: "Precio por pieza.",
  },
  {
    id: "endodoncia",
    nombre: "Endodoncia",
    motivo: "Dolor fuerte o nervio dañado",
    min: 2000,
    max: 8000,
    visitas: "2 citas",
    incluye: ["Radiografías", "Limpieza de conductos", "Sellado"],
    nota: "No incluye la corona que suele necesitarse después.",
  },
  {
    id: "corona",
    nombre: "Corona",
    motivo: "Diente muy destruido o post-endodoncia",
    min: 3000,
    max: 10000,
    visitas: "2 citas",
    incluye: ["Tallado y molde", "Corona provisional", "Colocación definitiva"],
    nota: "El material manda: resina abajo, zirconia arriba.",
  },
  {
    id: "extraccion",
    nombre: "Extracción simple",
    motivo: "Pieza que ya no se puede salvar",
    min: 400,
    max: 1500,
    visitas: "1 cita",
    incluye: ["Anestesia local", "Extracción", "Sutura si hace falta"],
  },
  {
    id: "muela-juicio",
    nombre: "Muela del juicio",
    motivo: "Presión, dolor o muela retenida",
    min: 1500,
    max: 7000,
    visitas: "1 cita",
    incluye: ["Radiografía panorámica", "Cirugía", "Revisión de sutura"],
    nota: "Precio por muela. Una retenida cuesta más que una brotada.",
  },
  {
    id: "implante",
    nombre: "Implante dental",
    motivo: "Reponer un diente que falta",
    min: 8000,
    max: 25000,
    visitas: "3 o más citas",
    incluye: ["Implante y pilar", "Corona sobre el implante", "Controles de integración"],
    nota: "El proceso completo toma meses: el hueso necesita integrar el implante.",
  },
  {
    id: "blanqueamiento",
    nombre: "Blanqueamiento",
    motivo: "Dientes más oscuros de lo que quisieras",
    min: 3000,
    max: 7000,
    visitas: "1 cita",
    incluye: ["Limpieza previa", "Sesión en consultorio", "Indicaciones de cuidado"],
  },
  {
    id: "ortodoncia",
    nombre: "Ortodoncia (brackets)",
    motivo: "Dientes chuecos o mordida despareja",
    min: 15000,
    max: 35000,
    visitas: "18 a 30 meses",
    incluye: ["Estudios y plan", "Brackets metálicos", "Ajustes mensuales"],
    nota: "Rango de tratamiento completo, normalmente en mensualidades.",
  },
];

export function tratamientoPorId(id: string): Tratamiento {
  return TRATAMIENTOS.find((t) => t.id === id) ?? TRATAMIENTOS[0];
}

/** Pesos mexicanos sin centavos: nadie cotiza un tratamiento en 1,234.56. */
export function formatearPeso(monto: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(monto);
}

export function formatearRango(tratamiento: Tratamiento): string {
  return `${formatearPeso(tratamiento.min)} – ${formatearPeso(tratamiento.max)}`;
}

export function cotizadorLead(tratamiento: Tratamiento) {
  return {
    titulo: `Interés en ${tratamiento.nombre.toLowerCase()} — ${formatearRango(tratamiento)}`,
    senales: [
      `Motivo declarado: ${tratamiento.motivo.toLowerCase()}`,
      `Ya sabe que son ${tratamiento.visitas.toLowerCase()}`,
      "Vio el rango antes de contactarte",
    ],
    siguientePaso: "Llega con el precio asumido. La llamada es para agendar, no para negociar.",
  };
}
