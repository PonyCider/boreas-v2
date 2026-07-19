export const sectionIds = {
  hero: "hero",
  problema: "problema",
  motores: "motores",
  socialProof: "social-proof",
  pricing: "pricing",
  relevo: "relevo",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export const navLinks: Array<{ label: string; href: string }> = [
  { label: "Problema", href: `#${sectionIds.problema}` },
  { label: "Motores", href: `#${sectionIds.motores}` },
  { label: "Resultados", href: `#${sectionIds.socialProof}` },
  { label: "Contacto", href: `#${sectionIds.pricing}` },
];

// Provisional — Epic 1 may finalize this string once the Hero copy is written.
// Kept audience-neutral ("presencia digital") rather than "consultorio digital"
// (V3's medico-specific term) per design spec §6.
export const primaryCta = "Quiero mi presencia digital";

export const sectionStubs: Record<SectionId, { eyebrow: string; heading: string }> = {
  [sectionIds.hero]: {
    eyebrow: "Epic 1",
    heading: "Hero — pendiente de pulir",
  },
  [sectionIds.problema]: {
    eyebrow: "Epic 2",
    heading: "El problema — pendiente de pulir",
  },
  [sectionIds.motores]: {
    eyebrow: "Epic 3",
    heading: "Motores de conversión — pendiente de pulir",
  },
  [sectionIds.socialProof]: {
    eyebrow: "Epic 4",
    heading: "Prueba social — pendiente de pulir",
  },
  [sectionIds.pricing]: {
    eyebrow: "Epic 5",
    heading: "Empecemos — pendiente de pulir",
  },
  [sectionIds.relevo]: {
    eyebrow: "Epic 6",
    heading: "Relevo — pendiente de pulir",
  },
};
