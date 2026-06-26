---
name: design-taste-frontend
description: Anti-slop frontend skill for landing pages, portfolios, and redesigns. Reads the brief, infers the right design language, and pushes layout, type, motion, and density away from templated defaults.
---

# Design Taste Frontend

## 1. Read the brief first

Infer the page kind, audience, vibe words, references, and quiet constraints before designing.

Output a one-line design read before building:

`Reading this as: <page kind> for <audience>, with a <vibe> language, leaning toward <system or aesthetic>.`

## 2. Set the three dials

- `DESIGN_VARIANCE`: how asymmetric or surprising the layout should feel.
- `MOTION_INTENSITY`: how much motion the page should carry.
- `VISUAL_DENSITY`: how much information should fit in each viewport.

Use the brief to choose the values. Do not default to the same answer every time.

## 3. Pick the right foundation

- If a real design system fits the brief, use the official package.
- If the brief is an aesthetic, implement it honestly with native CSS, Tailwind, and a maintained component library.
- Do not pretend a trend is an official system.

## 4. Core defaults

- Use `next/font` or local fonts.
- Isolate any motion-heavy component in a client boundary.
- Prefer CSS Grid over flexbox math.
- Use `min-h-[100dvh]` for full-height heroes.
- Do not ship purple-glow defaults, centered hero defaults, or identical card grids unless the brief truly calls for them.

## 5. Design discipline

- Typography must feel chosen, not generic.
- Structure must encode meaning.
- Motion must support comprehension.
- Spend boldness in one place.
- Critique the plan before writing code.
