---
target: components/landing/problem-section.tsx
total_score: 29
p0_count: 1
p1_count: 2
timestamp: 2026-06-29T16-43-45Z
slug: components-landing-problem-section-tsx
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static section; no status gaps |
| 2 | Match System / Real World | 4 | Copy usa vocabulario exacto del médico privado |
| 3 | User Control and Freedom | 3 | N/A para contenido estático |
| 4 | Consistency and Standards | 2 | font-mono en los stats rompe el sistema Satoshi-only |
| 5 | Error Prevention | 3 | N/A |
| 6 | Recognition Rather Than Recall | 3 | Contenido escaneable, sin demanda de memoria |
| 7 | Flexibility and Efficiency | 3 | N/A |
| 8 | Aesthetic and Minimalist Design | 2 | Patrón de borde prohibido + foto genérica + grid de cards idénticas |
| 9 | Error Recovery | 3 | N/A |
| 10 | Help and Documentation | 3 | N/A |
| **Total** | | **29/40** | **Good — base sólida, ejecución visual la traiciona** |

## Anti-Patterns Verdict

**AI slop**: Sí, en tres lugares: border-l-2 border-danger (ban absoluto), grid de 3 stats idénticas (template SaaS), foto de clínica genérica que contradice el argumento emocional.

**Detector**: reportó [] — false negative. El border-l-2 es un ban que requiere análisis contextual.

## Priority Issues

**[P0] border-l-2 border-danger — ban absoluto** (línea 40): borde lateral como acento de color. Fix: eliminar borde, usar font weight o color upgrade en lugar.

**[P1] Foto contradice argumento emocional**: clínica bien iluminada en una sección sobre perder pacientes. Fix: reemplazar con artefacto del problema (WhatsApp saturado, pantalla nocturna) o eliminar imagen.

**[P1] font-mono en stats**: off-brand para medical authority. Fix: font-sans font-semibold.

**[P2] Grid de 3 stats idénticas aplana jerarquía**: 84% es el stat principal, debería tener más peso visual.

**[P2] Pain points como lista idéntica aplana escalada emocional**: misma tipografía para los tres; considerar diferenciación de frase clave.

## Persona Red Flags

**Jordan**: stats de 12-16 palabras densos en móvil. Imagen contradice el pain — disonancia cognitiva.

**Casey**: borde rojo del blockquote parece error del sistema. Pain points en gris muted requieren atención activa.

**Dr. Alejandro (médico escéptico)**: foto genérica confirma cinismo. Copy convence; imagen lo frena.

## Minor Observations

- alt de imagen genérico
- border-y ya incluye border-top en el contenedor de pain points
- Ratio de columna imagen podría ser 0.9fr en lg

## Questions to Consider

- ¿Artefacto del problema (WhatsApp sin responder) en lugar de foto?
- ¿Orden de pain points correcto?
- ¿Imagen necesaria o el espacio funciona mejor como stat/interactivo?
