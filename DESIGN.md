# Boreas V3 Design Context

## Design Direction

Dark medical editorial. The page should feel premium, calm, and legible at night, with enough clinical light to avoid looking like a generic dark SaaS product.

## Visual System

- Background: off-black with a cool medical tint, never pure black.
- Foreground: high-contrast off-white for all core copy.
- Muted text: readable gray-blue, never below WCAG contrast for body text.
- Accent: one teal-green used for action and proof, not decoration.
- Secondary signal: restrained clinical white and steel-gray, used through imagery and dividers.
- Typeface: Satoshi local. Use weight, scale, and spacing for hierarchy. No destructive negative tracking.

## Layout Rules

- Mobile-first.
- Hero uses a real medical image as full-bleed context with text over it.
- First viewport must show the offer and hint at the next section.
- Prefer editorial rows, dividers, and columns over repeated cards.
- Cards are allowed only for true framed tools or repeated items, with radius 8px or less.
- Avoid cards inside cards.
- Use generous section spacing but keep mobile scan distance reasonable.

## Motion Rules

- Motion is quiet: opacity and small translate only.
- Respect `prefers-reduced-motion`.
- No scroll effects that hide content from screenshots, crawlers, or impatient users.
- No decorative glow/orb systems.

## Conversion Rules

- One primary CTA: "Quiero mi consultorio digital".
- Form submit uses the same action language.
- Confirmation: "Te escribimos por WhatsApp en las próximas 2 horas."
- Relevo never competes with the main CTA.

## Copy Rules

- Plain Spanish.
- No feature labels as the sell. Translate every technical term into business outcome.
- Labels name what the user recognizes.
- Errors explain what to fix.
