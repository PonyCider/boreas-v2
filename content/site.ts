export const sectionIds = {
  hero: "hero",
  problema: "problema",
  motores: "motores",
  socialProof: "social-proof",
  pricing: "pricing",
  relevo: "relevo",
} as const;

export type SectionId = (typeof sectionIds)[keyof typeof sectionIds];

export type NavCard = {
  label: string;
  bgColor: string;
  links: Array<{ label: string; href: string; ariaLabel: string }>;
};

// Capped at 3 — CardNav only ever renders the first 3 items it's given.
// "Contacto" isn't a 4th card: the nav's always-visible CTA (hidden only
// while the Hero itself is in view) already covers that action.
export const navCards: NavCard[] = [
  {
    label: "Problema",
    bgColor: "var(--bg-elevated)",
    links: [{ label: "Ver el problema", href: `#${sectionIds.problema}`, ariaLabel: "Ir a Problema" }],
  },
  {
    label: "Motores",
    bgColor: "var(--accent-soft)",
    links: [{ label: "Ver los motores", href: `#${sectionIds.motores}`, ariaLabel: "Ir a Motores" }],
  },
  {
    label: "Resultados",
    bgColor: "var(--bg-elevated)",
    links: [{ label: "Ver resultados", href: `#${sectionIds.socialProof}`, ariaLabel: "Ir a Resultados" }],
  },
];

// Kept audience-neutral ("presencia digital") rather than "consultorio digital"
// (V3's medico-specific term) per design spec §6. Confirmed in Epic 1.
export const primaryCta = "Quiero mi presencia digital";

export const sectionStubs: Record<
  Exclude<SectionId, "hero" | "problema" | "motores" | "pricing" | "relevo">,
  { eyebrow: string; heading: string }
> = {
  [sectionIds.socialProof]: {
    eyebrow: "Epic 4",
    heading: "Prueba social — pendiente de pulir",
  },
};
