# Sistema de motion maximalista + rediseño de Hero — Boreas V3

**Date:** 2026-07-16
**Status:** Diseño aprobado, pendiente de plan de implementación.
**Piloto:** Hero (`components/hero/boreas-hero.tsx`), sobre el trabajo ya mergeable de `docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md` (PR #67, sin mergear). El sistema de primitivos se diseña para las 7 secciones del sitio, pero su *implementación* hoy es exclusivamente Hero — las otras 6 quedan fuera de alcance de esta spec (ver "Fuera de alcance").

---

## Motivación

El dueño del producto ve el Hero actual (desktop y mobile) como "tremendamente barato y vacío". Se decidió una pasada de diseño explícitamente maximalista — "ALL-IN con animaciones y efectos, todo lo que diga premium" — usando referencias concretas en vez de iterar a ciegas, para evitar el ritmo lento de la sesión anterior.

---

## Referencias

- **Apple** (`apple.com/mx/iphone-17-pro`, `apple.com/mx/macbook-pro`) — 100% DOM, sin GSAP expuesto. Tipografía editorial gigante que domina el viewport, una sola foto de producto enorme por sección (a veces con bleed fuera del canvas), un solo color de acento contra negro puro, stats grandes con número en el color de acento, nav bar pineada que aparece solo después del hero. Se toma: escala tipográfica, negative space disciplinado, un acento de color, sticky nav pattern (ya lo tenemos vía el header CTA observer).
- **Cuberto** (`cuberto.com`) — headlines con mezcla de 2 pesos/estilos tipográficos en una misma línea, insignia circular rotando en loop, transición de fondo entre secciones, grids con stagger y offsets tipo masonry. Se toma: mezcla tipográfica en headline, energía de agencia sin perder pulido.
- **Lusion** (`lusion.co`) — **no se replica literalmente.** Es Three.js/WebGL real con shaders, no DOM+CSS (confirmado: el navegador headless no pudo crear el contexto WebGL). Meterlo significaría GSAP + Three.js, revirtiendo la decisión de stack. Se toma solo el *lenguaje*: ritmo cinematográfico, minimalismo tipográfico, transiciones dramáticas — logrado con capas de parallax en 2D, no con motor 3D.

---

## 1. Sistema de motion (primitivos compartidos)

Nuevos módulos, framer-motion puro (sin dependencias nuevas), pensados para que Hero los consuma hoy y las otras 6 secciones los reutilicen después sin reinventar el mecanismo:

- **`lib/motion/use-scroll-pin.ts`** — generaliza `lib/use-hero-scroll-phases.ts` (hoy específico de Hero) para que cualquier sección pueda pinear su contenedor.
- **`lib/motion/use-scrub.ts`** — formaliza el patrón `useTransform` + `useMotionValueState` (el workaround al bug de framer-motion encontrado en la sesión anterior: `style={{opacity: motionValue}}` en un elemento `motion.*` no escribe al DOM de forma confiable en este stack) para animar opacity/x/y/scale atado al progreso exacto del scroll.
- **`components/motion/parallax-layer.tsx`** — envuelve una capa y la mueve a una velocidad relativa al scroll (`speed` prop). Dos capas con distinto `speed` bajo el mismo `scrollYProgress` generan profundidad, sin WebGL.
- **`components/motion/text-reveal.tsx`** — palabras/líneas que van de `opacity: 0.2 → 1`. **Nunca 0 → 1**: el piso de 0.2 mantiene el texto legible desde el primer frame, cumpliendo la regla fija "headline visible desde scroll 0" (`docs/superpowers/specs/2026-07-14-hero-cinematic-scroll-design.md`, regla no negociable).
- **`components/motion/horizontal-scroll-section.tsx`** — pinea verticalmente y traduce el progreso de scroll en desplazamiento horizontal de una pista interna. Se diseña hoy para que el sistema esté completo; no se usa en Hero (candidato natural: una futura galería en Transformación o testimonios).

**Regla de construcción, aplica a los 5:** solo animan `transform` (x/y/scale/rotate) y `opacity` — nunca `width`/`height`/`top`/`left`. `will-change: transform` se aplica dentro del primitivo, no repartido a mano por componente consumidor. Cada uno acepta `reduceMotion` y en ese modo es un no-op (sin transform, contenido a su valor final fijo) — la lógica de apagado vive en el primitivo, no se reimplementa por sección.

---

## 2. Reglas de motion actualizadas (reemplazan parcialmente el bloque "Anti-bans" de `DESIGN.md`)

Se mantienen (no tienen que ver con restricción visual, sino con qué es lo que causaba la queja de "barato" o son reglas de conversión/accesibilidad):
- Sin cards anidadas.
- Sin labels de fase visibles en pantalla ("Fase 1", "Confianza", etc.).
- Un CTA primario por viewport.
- Reduced motion completo + solo animar `transform`/`opacity` (no negociable).

Se sueltan (esto es lo que el dueño pidió explícitamente):
- Glow/glass decorativo: permitido como acento puntual en momentos de impacto — no como fondo repetido en todo el sitio.
- Gradient text: permitido en headlines de impacto.
- Ease-out exponencial (`[0.22, 1, 0.36, 1]`) deja de ser la única curva permitida: se admite un overshoot/spring sutil en micro-interacciones puntuales (una card asentándose), pero no bounce tipo caricatura — ninguna de las 3 referencias elegidas usa ese tipo de bounce.

Una tarea del plan de implementación debe reflejar este bloque en `DESIGN.md` directamente (no se edita en esta spec).

---

## 3. Rediseño concreto del Hero

Se **reutiliza** el esqueleto de pin ya construido y probado en dispositivo real (3 fases desktop / 2 fases mobile, `HeroCinematic` en `components/hero/boreas-hero.tsx`) — no se reconstruye. El problema reportado no es el mecanismo de scroll, es lo que hay dentro de él.

Cambios de contenido/composición dentro del esqueleto existente:
- **Escala tipográfica agresiva** (estilo Apple): el H1 pasa a dominar el viewport, no a ser un bloque de texto más entre otros elementos. Posible tratamiento de 2 pesos/estilos en la misma línea (estilo Cuberto) para dar textura sin romper la jerarquía.
- **`TextReveal` en el headline**: opacity 0.2 → 1 al aparecer (en mount o ligado al arranque de fase 1). Cumple la regla fija de headline visible desde scroll 0 (ver primitivo arriba).
- **Composición del cluster derecho más grande y con jerarquía real**: la doctor card + chips dejan de ser 3 elementos chicos flotando sueltos — se agrandan y se les da profundidad real vía `ParallaxLayer` (fondo, card, chip, cada uno a su propio `speed`).
- **Mobile recalibrado, no "desktop encogido"**: mismo tratamiento pero compuesto para su propio tamaño — regla ya fija del proyecto, se refuerza acá.

---

## 4. Reduced motion

`HeroStatic` no se toca — sigue siendo el fallback byte-for-byte de siempre. Los primitivos nuevos absorben su propio modo `reduceMotion` (ver sección 1), así que no hace falta ramificar manualmente dentro de `HeroCinematic` más de lo que ya se ramifica hoy.

---

## 5. Alcance y decisiones operativas

- **Branch:** se trabaja sobre `worktree-hero-cinematic-scroll` (PR #67, sin mergear), agregando commits nuevos ahí. Al terminar, se actualiza el mismo PR en vez de abrir uno nuevo.
- **Hoy se entrega:** los 5 primitivos de la sección 1 + el Hero rediseñado (secciones 2-4).
- **No se entrega hoy:** la aplicación del sistema a Prueba social, Transformación, Proceso, Garantía, Relevo, FAQ, Contacto. Quedan como trabajo de seguimiento, usando los mismos primitivos.

---

## Fuera de alcance de esta spec

- Coreografía de las otras 6 secciones vivas — spec y tarea aparte, después de validar este piloto.
- `HorizontalScrollSection` no se usa en Hero; queda diseñado y disponible para cuando se decida qué sección lo necesita.
- Reescritura de `DESIGN.md` en sí (se hace como tarea del plan de implementación, no en esta spec).

---

## Testing / verificación esperada

- `npx tsc --noEmit`, `npm run lint`, `npm run build` limpios.
- Verificación visual manual en browser: desktop y mobile, real device para mobile (mismo estándar que la spec del 2026-07-14).
- Confirmar que el CTA del hero sigue siendo clicable en cada punto del pin.
- Confirmar reduced-motion: `HeroStatic` sin cambios de comportamiento.
