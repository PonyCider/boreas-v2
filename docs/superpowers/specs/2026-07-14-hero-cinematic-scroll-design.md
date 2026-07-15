# Hero cinematic scroll — Boreas V3

**Date:** 2026-07-14
**Status:** Design approved, not yet implemented. Piloto: solo Hero. Las otras 6 secciones "vivas" (Prueba social, Transformación, Proceso, Garantía, Relevo) quedan fuera de esta spec — se evalúan después de validar este patrón, per `docs/handoff/2026-07-13-checkpoint-and-cinematic-scroll-plan.md`.

---

## Summary

`BoreasHero` (`components/hero/boreas-hero.tsx`) gana un scroll cinemático: el cluster derecho de tarjetas (doctor card, chips) se pinea (`position: sticky`) y coreografía en 3 fases mientras el usuario scrollea, contando una micro-historia — "Una noche, un paciente" — que dramatiza el arco Problema → Solución del negocio. La columna izquierda (wordmark, headline, subcopy, CTAs, proof points) permanece estática y visible desde scroll 0.

No es una página nueva de diseño de motion desde cero: es una extensión del Hero existente (T3 de la sesión previa), reemplazando las animaciones de entrada por fade-in con un pin scroll-linked en el cluster derecho.

---

## Background y decisiones heredadas

Este diseño parte de dos documentos previos que no se re-litigaron:

- `docs/handoff/2026-07-13-checkpoint-and-cinematic-scroll-plan.md` — decidió alcance (Hero primero), restricciones técnicas (framer-motion only, gsap retirado, anti-bans vigentes, mobile no-afterthought, reduced-motion necesita historia propia por sección).
- `docs/handoff/2026-07-14-fable-hero-scroll-copy-review.md` — review de Fable 5 (esfuerzo medio) sobre un esqueleto inicial de 5 fases que violaba dos reglas del proyecto (contenido gateado por animación, hero-metric template) y duplicaba trabajo narrativo de otras secciones. Este documento incorpora sus correcciones.

---

## Herramienta: framer-motion, no gsap

**Confirmado en esta sesión, no reabrir sin motivo técnico nuevo:**

- El proyecto tiene `framer-motion@^12.38.0` instalado; gsap fue removido por completo en T10 de la sesión anterior (`clinic-builder.tsx` era el único importador).
- Se usa `useScroll({ target, offset })` + `useTransform` para el pin y las transiciones scroll-linked. Pinning vía CSS `position: sticky`, no `position: fixed` + cálculo manual.
- Se instaló `skills/framer-motion/SKILL.md` (importado de `mindrally/skills`) como referencia de patrones. **Leer la sección "Boreas project overrides" al final de ese archivo antes de escribir código** — dos puntos del contenido upstream están anulados para este proyecto:
  - Import path: usar `"framer-motion"` (paquete instalado), no `"motion/react"` (paquete renombrado, no instalado, no migrar imports existentes).
  - Springs: no usar `type: "spring"` por defecto — GUIDELINES/DESIGN prohíben bounce/elástico. Usar duración + la curva ease-out exponencial estándar del proyecto (`[0.22, 1, 0.36, 1]`, ya definida como `EASE` en `boreas-hero.tsx`).

---

## Arco narrativo

**Problema → Solución**, contado como una sola escena continua ("Una noche, un paciente"), no como diapositivas etiquetadas. El journey respeta el orden causal real: el paciente busca → encuentra (confianza) → escribe y recibe respuesta → se agenda. (El esqueleto inicial invertía "responde" y "confianza"; corregido per review de Fable.)

---

## Estructura del pin

### Desktop

- Contenedor de ~280vh, `position: sticky` en el cluster derecho.
- **Columna izquierda estática todo el pin:** wordmark "Boreas", H1 (`heroHeadline`), subcopy (`heroSubcopy`), ambos CTAs, proof points — todo visible y clicable desde scroll 0. Nunca gateado por animación ni por progreso de scroll. Solo el eyebrow crossfadea una vez (ver Copy).
- Toda la coreografía vive en el cluster derecho (el "escenario").

### Mobile

- 2 escenas comprimidas (no 3): "busca+encuentra" / "responde+agenda".
- Pin ≤150vh sobre la card in-flow existente (`HeroCardMobile`).
- **Plan B obligatorio:** validar en dispositivo real. Si el sticky jankea (jank de scroll táctil, cambios de viewport height por la barra de direcciones), degradar a la coreografía T4 actual — fade-in simple, sin pin — en vez de forzar un pin roto. Esta decisión se toma en dispositivo real, no en devtools.

---

## Las 3 fases (desktop)

### Fase 1 — Te busca (0–30%)

- Eyebrow (reemplaza `heroCredibility` en esta fase): **"El 40% de las búsquedas ocurre fuera de horario laboral."** — tamaño chico, no protagonista de viewport (evita el hero-metric template prohibido en GUIDELINES §4). Nota: este stat ya aparece en `problemStats` y en la secuencia de `socialProof` — la triple repetición es una decisión consciente del dueño, no un descuido.
- Chip de hora: **`11:47 PM · tu paciente sigue esperando`** (estado *problema* — nueva copy, ver abajo). Mismo componente visual que el chip `lastReplyTime` actual, estado inicial invertido.
- Search% chip visible, tamaño normal (no se agranda ni centra — el 82% queda reservado para la sección Problema, no se repite en el Hero).
- Doctor card y appointments chip: no visibles todavía, o presentes en estado mínimo/desenfocado (a definir en implementación — no deben aparecer como "pop" abrupto en fase 2, sino como transform continuo).

### Fase 2 — Te encuentra (30–65%)

- Doctor card entra/se traslada al centro del cluster (translate con `EASE` del proyecto, sin bounce): rating 4.8 (exacto, no "4.x" — fuente: `socialProof.mockupDoctor`), 127 reseñas, testimonial con fade-in.
- Rating cuenta de 0 a 4.8 **una sola vez** (no se re-dispara si el usuario scrollea hacia atrás y adelante dentro del rango de fase — a resolver en implementación con `useMotionValueEvent` o guard similar).
- Proof points (`heroProofPoints`, 4 items) entran como **un solo beat**, no goteados 2+2 entre fases — evita el patrón de relleno mecánico señalado en la review.

### Fase 3 — Te escribe y agenda (65–100%)

- Chip de hora **flipea**: `11:47 PM · tu paciente sigue esperando` → `11:47 PM · tu consultorio respondió` (estado actual, sin cambios de copy). Mismo objeto, mismo timestamp, significado invertido — mecanismo de payoff central de toda la secuencia.
- Botón WhatsApp de la doctor card toma foco visual (jerárquico: el resto del cluster se asienta y el ojo cae ahí — no aparición ni glow/pulse nuevo, eso violaría anti-bans).
- Appointments chip cuenta a 3 citas.
- Último ~10%: nada nuevo entra, el cluster se asienta visualmente, el pin suelta y el scroll normal continúa hacia `ProblemSection`.

---

## Reglas fijas (no negociables, ya decididas)

- **CTA primario del hero visible y clicable desde scroll 0 hasta que el pin suelta.** Sin aparición, sin refuerzo animado al final — el lead que ya conoce el sitio y quiere ir directo al form no debe pagar fricción.
- **Headline visible desde scroll 0.** En un pin sticky, el estado de scroll 0 ES el estado de carga de la página — no puede depender de que el usuario scrollee para ver la oferta (DESIGN.md Motion Rules + GUIDELINES §4).
- **Ningún número nuevo sin fuente citable.** Disciplina T7-T8 de la sesión anterior sigue vigente.
- **Anti-bans vigentes sin excepción:** sin bounce/elástico (motiva el override de springs arriba), ease-out exponencial, sin glass/glow decorativo, sin gradient text, sin cards anidadas, sin labels de fase visibles en pantalla ("Fase 1", "Confianza", etc. — la coreografía se entiende por lo que hacen los objetos, no por narración de tutorial).

---

## Copy nuevo

Todo el copy nuevo vive en `content/boreas-home.ts`, no hardcodeado en JSX (convención existente del proyecto).

- Nueva key sugerida `heroEyebrowProblem` (o similar): `"El 40% de las búsquedas ocurre fuera de horario laboral."`
- Nueva key sugerida `lastReplyProblemLabel`: `"tu paciente sigue esperando"` (se combina con `heroCardStats.lastReplyTime` igual que `lastReplyLabel` hoy).
- `heroCredibility` actual se mantiene, pero pasa a mostrarse después de la fase 1 (el eyebrow crossfadea de framing-de-problema a `heroCredibility` — punto de crossfade exacto a definir en implementación, sugerido ~fin de fase 1 / inicio de fase 2).

---

## Reduced motion

Colapsa al comportamiento **actual (T4)**: fade-in simple sin reorganización, sin pin, sin sticky, sin transforms atados a `scrollYProgress`. No intenta representar el arco Problema→Solución para estos usuarios — decisión explícita del dueño, no un fallback genérico. El mecanismo CSS global existente (`app/globals.css`, colapsa `animation-duration`/`transition-duration` a 0.01ms) no cubre esto por sí solo; la sección debe ramificar explícitamente en `useReducedMotion()` (patrón que `boreas-hero.tsx` ya usa hoy) para saltarse el pin y los `useTransform` por completo, no solo acortar sus duraciones.

---

## Header CTA

Regla operativa (más simple que un threshold en px fijo, corrección de Fable sobre el diseño inicial de "600px → altura dinámica del hero"):

> **Mientras el CTA del hero esté en viewport (pineado o no), el CTA del header no aparece. Cuando el pin suelta y el hero sale de viewport, el CTA del header aparece.**

Implementación sugerida: `IntersectionObserver` sobre el CTA del hero (o el contenedor del pin) en vez del actual `window.scrollY > HEADER_CTA_SCROLL_THRESHOLD` en `components/hero/header.tsx`. Mantiene la regla "un CTA primario por viewport" sin coordinar números mágicos entre dos componentes.

---

## Fuera de alcance de esta spec

- Coreografía de las otras 6 secciones vivas (Prueba social, Transformación, Proceso, Garantía, Relevo) — se diseña en una spec separada después de implementar y validar este piloto.
- Edición de `problemStats` / `socialProof` para reducir la triple repetición del 40% — el dueño decidió aceptar la duplicación conscientemente por ahora; si se revisa, es tarea aparte.
- Analytics de interacción con las fases del scroll (requiere decidir si se expande `AnalyticsEventName`, no se decide unilateralmente per el pendiente ya anotado en el checkpoint).

---

## Testing / verificación esperada

- `npx tsc --noEmit`, `npm run lint`, `npm run build` limpios (mismo estándar que el checkpoint anterior).
- Verificación visual manual en browser real: las 3 fases en desktop, degradación en reduced-motion, comportamiento en mobile (dispositivo real, no solo devtools) — decisión de pin-vs-no-pin en mobile se toma ahí.
- Confirmar que el CTA del hero es clicable en cada punto del pin (no solo visualmente presente).
