# Boreas V4 — Landing page redesign (design)

Fecha: 2026-07-19

## Contexto

Boreas V4 es un proyecto nuevo y vacío. El objetivo es rehacer por completo la landing page de
Boreas (negocio de desarrollo web para especialistas de la salud) como código 100% nuevo, pero
reutilizando lo validado en `Boreas V3` (design system, voz de copy, header/footer/Relevo) y en
`boreas-template` (lógica de los motores de conversión, aún sin mergear a `main`).

La landing tiene dos objetivos simultáneos:

1. **Convertir visitantes en leads calificados** — especialistas de la salud (psicólogos,
   terapeutas, nutriólogos, fisioterapeutas, médicos) que quieran contratar a Boreas.
2. **Ser living proof de capacidad técnica** — la landing debe verse tan pulida, fluida y
   "no-genérica" que el visitante piense "si su propia página se ve así, la mía va a ser increíble".

## Alcance de este documento

Cubre: fundación técnica del proyecto, estrategia de reuso de código existente, arquitectura de
los 5 motores de conversión interactivos, estructura de secciones (Epics + subtareas), estrategia
de contenido/copy, backend de captura de leads, y reglas heredadas del design system de V3.

No cubre: copy final palabra por palabra de cada sección (se escribe al pulir cada Epic), specs
pixel-perfect de cada motor, ni el detalle de implementación (eso vive en los planes que genera
`writing-plans`, uno por Epic).

## Decisiones

### 1. Fundación técnica

- Proyecto nuevo, código escrito desde cero. Stack idéntico a V3: Next.js 16 (App Router),
  React 19, Tailwind v4 (`@theme inline`), TypeScript.
- Tokens de color/tipografía: se porta `app/globals.css` de V3 tal cual (papel cálido + arcilla,
  Newsreader display + Figtree body, light/dark vía `data-theme`) — ya validado, no se rediseña.
- Animación — **estrategia mixta por componente** (nunca dos librerías en el mismo componente):
  - **framer-motion**: piezas portadas de V3 (header, footer, Relevo) — ya funcionan bien así.
  - **GSAP + ScrollTrigger**: piezas nuevas de alto impacto visual (hero, slider antes/después,
    motores, carrusel infinito de social proof). V3 había retirado gsap del proyecto; esa regla
    no aplica a V4 — es un proyecto nuevo con su propia decisión de motion.
  - Se mantienen las reglas anti-slop de V3 que no dependen de la librería: sin bounce/elastic
    (ease-out exponencial), `prefers-reduced-motion` obligatorio con equivalente estático en
    cada animación, contenido nunca gateado por animación (existe en el DOM, visible por
    default; la animación realza, no revela).
- Componentes: shadcn MCP (ya conectado) + Magic UI MCP (ya conectado) desde el día uno.
  React Bits se suma vía el mismo shadcn MCP — no tiene servidor propio, solo requiere agregar
  el registry `"@react-bits": "https://reactbits.dev/r/{name}.json"` en `components.json`. Se
  agrega en Epic 0, sin bloqueo.

### 2. Reuso de V3 y boreas-template

| Elemento | Origen | Tratamiento |
|---|---|---|
| Tokens de color/tipografía (`globals.css`) | V3 | Se porta tal cual |
| `header.tsx` (nav + dark toggle) | V3 | Se porta y adapta (nav links a nuevas secciones) |
| `site-footer.tsx` | V3 | Se porta y adapta |
| `relevo-curiosity-section.tsx` + `relevo-example-carousel.tsx` | V3 | Se porta y adapta copy |
| `SectionFrame` pattern (un `border-t` por sección) | V3 | Se mantiene la disciplina de líneas |
| Voz/reglas de copy (PRODUCT.md, GUIDELINES.md §2) | V3 | Se mantienen las reglas duras, audiencia ampliada |
| Lógica de motores (`quiz-engine`, `calculator-engine`, `lead-magnet-engine`) | boreas-template, branch `worktree-category-mechanism-engines` | Se porta solo la **lógica** (scoring, fórmulas, validación); UI 100% nueva a medida del design system de la landing |
| Estructura `content/site.ts` multi-cliente, `lib/mechanisms/*` completo | boreas-template | No se porta — es infraestructura para clonar-por-cliente, over-engineering para una landing bandera única |

Todo lo demás (hero, problema, motores, social proof, pricing/CTA) se escribe desde cero: la
audiencia de V4 sigue siendo exclusivamente profesionales de la salud — se amplía el rango de
especialidades dentro de ese mismo vertical (psicólogos, terapeutas, nutriólogos, fisioterapeutas,
médicos), no sale de él, así que el copy se adapta, no se copia literal.

### 3. Motores de conversión — arquitectura

Cada motor es un componente cliente autocontenido, sin persistencia (`useState` local, sin
llamadas a Supabase/API). Razón: son demos vivas dentro de la landing, no herramientas de
producción — el único punto que persiste leads reales es el form de Epic 5.

| Motor | Para quién | Base de lógica | UI |
|---|---|---|---|
| Test GAD-7 / PHQ-9 | Psicólogos, psiquiatras | Lógica de `quiz-engine` (preguntas → puntaje → resultado) | Nueva |
| Diario Emocional | Terapeutas | Lógica de `lead-magnet-engine` (mini-form → resultado simulado) | Nueva |
| Calculadora IMC / Nutricional | Nutriólogos | Lógica de `calculator-engine` (inputs → fórmula → resultado) | Nueva |
| Evaluador de Dolor | Fisioterapeutas | Sin engine equivalente — slider bespoke | Nueva |
| Agendamiento inteligente | Todos | Embed real (Cal.com u otro proveedor) | N/A — widget del proveedor |

El Agendamiento requiere una cuenta/link público del proveedor elegido — eso lo provee el usuario
cuando se llegue a esa subtarea (Epic 3.5); mientras tanto esa subtarea queda bloqueada/al final
del Epic 3.

### 4. Estructura de secciones (Epics)

Orden de construcción: Epic 0 primero (skeleton completo, no funcional), luego cada sección en
el orden del funnel, puliendo una antes de pasar a la siguiente.

- **Epic 0 — Setup & Skeleton:** scaffold Next 16, tokens, `components.json` (shadcn + registry
  React Bits), gsap + framer-motion instalados, header/footer/Relevo portados, `SectionFrame`,
  stubs de las 6 secciones con anchors de nav funcionando, `content/` con tipos + copy esqueleto.
- **Epic 1 — Hero.**
- **Epic 2 — Problema ("Entiendo tu dolor"):** pain points + slider drag interactivo
  genérico-vs-Boreas.
- **Epic 3 — Solución / Motores de Conversión:** 5 subtareas, una por motor (ver tabla arriba).
- **Epic 4 — Social Proof:** testimonios inventados (marcados como ejemplo ilustrativo, mismo
  patrón que V3 usa en el hero — evita afirmar métricas falsas sin decirlo), carrusel infinito
  (Magic UI / React Bits).
- **Epic 5 — Pricing/CTA final:** sección de pricing público con 4 paquetes (Esencial,
  Profesional, Deluxe, Organizaciones) + 2 toggles por card (Entrega Express, Chatbot IA), y
  form con validación en tiempo real (zod) + animación de éxito, backend Resend (email, sin
  Supabase). El form recibe el paquete y los toggles seleccionados como contexto. Detalle
  completo de paquetes, precios, escalera, tiempos de entrega y candados de alcance en
  `2026-07-31-boreas-v4-pricing-design.md`.
- **Epic 6 — Relevo (upsell):** port de V3, copy adaptado.
- **Epic 7 — Footer:** port de V3.

Cada Epic (excepto el 0) sigue el mismo ciclo: construir → iterar visualmente con el usuario hasta
quedar pulido → pasar al siguiente.

### 5. Backend / captura de datos

- Único punto de persistencia real: form de Epic 5, vía Resend (email de notificación). Sin
  Supabase en V4.
- Motores: sin backend, estado local únicamente.
- Agendamiento: el estado de la reserva lo maneja el widget embebido del proveedor (Cal.com u
  otro) — Boreas V4 no construye backend de calendario propio.

### 6. Reglas heredadas de V3 (siguen vigentes en V4)

- Español claro, "consultorio digital" como término (adaptado a "presencia digital"/vocabulario
  del especialista si aplica fuera de medicina — se decide por sección al escribir copy).
- Un CTA primario por viewport.
- **Precio público sí** (regla de V3 derogada el 2026-07-31, ver
  `2026-07-31-boreas-v4-pricing-design.md`). Sin escasez semanal: nada de countdowns, "quedan N
  lugares", ni presión artificial de tiempo.
- Toda estadística mostrada necesita fuente citable o badge de "ejemplo ilustrativo".
- Sin glass/glow decorativo, sin gradient text, sin side-stripe borders, sin cards anidadas.
- **Hairlines solo como límite estructural** (regla añadida el 2026-08-01 tras revisión visual):
  una línea marca el borde de una sección o de una card, nunca separa ítems de una lista ni
  párrafos dentro de un bloque. Separar con espacio y jerarquía tipográfica, no con líneas. Si un
  bloque ya tiene borde o fondo propio, no lleva líneas internas encima.
- Contraste de texto ≥4.5:1 cuerpo, ≥3:1 texto grande.
- `prefers-reduced-motion` obligatorio en toda animación, con equivalente estático.

## Pendientes / bloqueos conocidos

- Cal.com (u otro proveedor) para Epic 3.5 — requiere cuenta y link público del usuario, no se
  resuelve en este documento.
- React Bits — requiere que el usuario agregue el registry en `components.json` durante Epic 0
  (paso mecánico, sin fricción real).
