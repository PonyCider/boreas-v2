import { sectionIds } from "./site";

export type ProofStat =
  | { label: string; animated: false; staticValue: string }
  | { label: string; animated: true; value: number; decimals: number; suffix: string };

export const heroContent = {
  eyebrow: "Presencia digital para especialistas de la salud",
  headline: "Tu presencia digital, abierta las 24 horas.",
  subheadline:
    "Mientras atiendes, tus pacientes ya están buscando reseñas, comparando opciones y decidiendo a quién escribir. Boreas convierte esa primera búsqueda en un paciente agendado.",
  ctaSecondaryLabel: "Ver los motores en acción",
  ctaSecondaryHref: `#${sectionIds.motores}`,
  proofBadge: "Ejemplo ilustrativo",
  proofStats: [
    {
      label: "tiempo de entrega",
      animated: false,
      staticValue: "48–72h",
    },
    {
      label: "más agendamientos",
      animated: true,
      value: 3,
      decimals: 0,
      suffix: "×",
    },
    {
      label: "en Google Maps",
      animated: true,
      value: 4.8,
      decimals: 1,
      suffix: "★",
    },
  ] satisfies ProofStat[],
};
