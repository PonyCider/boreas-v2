# Social proof section — Boreas V3

**Date:** 2026-06-26
**Status:** Approved, ready for implementation

---

## Summary

A new `SocialProofSection` inserted between `ProblemSection` and `TransformationSection`. Its job: first prove the problem is real (friction rows + stats), then make the deliverable tangible (CSS mockup). No testimonials, no fake personas, no stats without sources.

---

## Position in page

```
Hero → Problema → [SocialProofSection] → Transformación → Proceso → Garantía → FAQ → Form → Relevo
```

File: `components/landing/social-proof-section.tsx`
Mounted in: `components/landing/boreas-landing-sections.tsx`
Copy source: `content/boreas-home.ts` (new export `socialProof`)

---

## Section heading

> **"Esto pasa todos los días."**

Short, no drama. Introduces the friction rows. No uppercase eyebrow, no tracked kicker.

---

## Block 1 — Friction rows

Three editorial rows. No cards, no icons, no border-left accents. Plain text, two visual weights (scenario body + punchy closer).

### Friction 1 — Night / booking window
> Tu paciente buscaba agendar a altas horas de la noche. Nadie contesta llamadas a esa hora. Agendó en línea con quien sí tenía página.

### Friction 2 — Assistant overload
> Tu asistente contesta lo mismo todos los días antes de cada primera cita: ¿cuánto cuesta?, ¿atienden mi caso?, ¿tienen lugar esta semana? Una página lo resuelve antes de que marquen.

### Friction 3 — The unresolved doubt
> Alguien leyó tus reseñas en Google Maps y quería ir contigo. Buscó más información. No encontró nada. "Lo pienso" casi siempre es "lo descarto."

---

## Block 2 — Stats

Sequential narrative with "Y" connectors — flows as argument, not a list.

```
2 de cada 3 pacientes prefiere agendar en línea antes que llamar. El teléfono ya es el plan B.

Y de los que sí llaman, el 84% busca en línea antes de marcar. Si no encuentran nada, no marcan.

Y el 40% de esas búsquedas ocurren fuera de horario. Tu celular no contesta. Tu página sí.
```

**Sources (small print, color muted, below the stats):**
- Accenture Health Consumer Survey
- Think with Google / Salesforce Health Survey
- Kyruus / Accenture Health Consumer Survey

---

## Block 3 — CSS mockup

### Caption (above frame)
> Tu paciente te buscó ayer a las 11 de la noche. Esto encontró.

### Frame
- **Desktop:** browser-chrome frame (address bar, traffic lights) rendered in CSS/JSX. No external image.
- **Mobile:** phone frame variant (status bar + rounded corners).
- Max width ~900px, centered. Full-width on mobile.

### Mockup content (inside frame)
Simplified Boreas-styled consultorio with fictional doctor. Elements visible:
- Doctor name + specialty (e.g., "Dr. Martínez — Medicina General")
- Google Maps star rating (e.g., ★★★★★ 4.8 — 127 reseñas)
- One short patient testimonial (fictional, clearly a UI element)
- WhatsApp CTA button
- Boreas visual tokens (dark background, teal accent, Satoshi font)

No real patient data. No real doctor. No real phone number or address.

### Styling rules
- Frame border: `--line` token
- Frame background inside: `--bg-surface`
- No glass/glow (outside hero/header per GUIDELINES.md)
- Browser chrome: muted, neutral — doesn't compete with content

---

## Copy export shape (`content/boreas-home.ts`)

```ts
export const socialProof = {
  heading: "Esto pasa todos los días.",
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
      closer: '"Lo pienso" casi siempre es "lo descarto."',
    },
  ],
  stats: [
    {
      value: "2 de cada 3",
      label: "pacientes prefiere agendar en línea antes que llamar.",
      closer: "El teléfono ya es el plan B.",
      connector: null,
    },
    {
      value: "84%",
      label: "de los que sí llaman, busca en línea antes de marcar.",
      closer: "Si no encuentran nada, no marcan.",
      connector: "Y de los que sí llaman,",
    },
    {
      value: "40%",
      label: "de esas búsquedas ocurren fuera de horario.",
      closer: "Tu celular no contesta. Tu página sí.",
      connector: "Y el",
    },
  ],
  statsSources: "Accenture Health Consumer Survey · Think with Google · Kyruus",
  mockupCaption: "Tu paciente te buscó ayer a las 11 de la noche. Esto encontró.",
  mockupDoctor: {
    name: "Dr. Martínez",
    specialty: "Medicina General",
    rating: "4.8",
    reviewCount: "127",
    testimonial: "Llegué con muchas dudas y salí con todo claro. Lo recomiendo.",
  },
};
```

---

## Implementation notes

- One file: `components/landing/social-proof-section.tsx`
- Import `socialProof` from `content/boreas-home.ts`
- `SectionFrame` wrapper with `id="prueba"` (matches nav link "Prueba" in header)
- Browser-frame and phone-frame are self-contained sub-components in the same file
- No external images, no third-party deps
- framer-motion entrance: opacity fade only, `prefers-reduced-motion` respected

---

## Out of scope

- Real demo page (`demo.boreas.com`) — separate sprint
- Actual client testimonials — requires first paying client
- Source links (URLs) for stats — plain text citation is sufficient for now
