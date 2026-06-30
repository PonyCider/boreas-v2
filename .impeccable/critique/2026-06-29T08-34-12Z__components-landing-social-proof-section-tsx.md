---
target: social-proof-section
total_score: 30
p0_count: 0
p1_count: 2
timestamp: 2026-06-29T08-34-12Z
slug: components-landing-social-proof-section-tsx
---
## Design Health Score
| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static content |
| 2 | Match System / Real World | 4 | Copy médico correcto |
| 3 | User Control and Freedom | 3 | N/A |
| 4 | Consistency and Standards | 2 | Colores hardcoded fuera de tokens |
| 5 | Error Prevention | 4 | N/A |
| 6 | Recognition Rather Than Recall | 3 | Mockup legible |
| 7 | Flexibility and Efficiency | 3 | N/A |
| 8 | Aesthetic and Minimalist Design | 2 | 01/02/03 ban + hero-metric ban violados |
| 9 | Error Recovery | 3 | N/A |
| 10 | Help and Documentation | 3 | Fuentes de stats presentes |
| **Total** | | **30/40** | Good — bans bloqueantes |

## P1: Numbered scaffolding 01/02/03
FrictionRows usa padStart("0") en grid-cols-[3rem_1fr]. GUIDELINES prohíbe explícitamente.

## P1: StatsBlock = hero-metric template
clamp(3.5rem,9vw,7.5rem) número + label + closer × 3. Patrón prohibido.

## P2: Mockup genérico (Dr. Martínez, Medicina General, iniciales)
Caption promete "Esto encontró" pero entrega placeholder.

## P2: Colores hardcodeados en MockupContent
oklch(0.13_0.009_245), oklch(0.62_0.18_145), oklch(0.82_0.1_95) — fuera de tokens.

## P2: Heading "Esto pasa todos los días." vago
No orienta al médico; podría ser cualquier sección de cualquier landing.
