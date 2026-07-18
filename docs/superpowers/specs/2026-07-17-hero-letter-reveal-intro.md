# Hero — Letter-Reveal Intro + Scroll-Gated Reflow + Decorative Primitives

> **For agentic workers:** this spec feeds `superpowers:writing-plans`. Read fully before
> planning implementation.

**Rama:** `worktree-hero-cinematic-scroll` (PR #67), worktree en
`.claude/worktrees/hero-cinematic-scroll`. Tercera pasada de diseño sobre el Hero.

**Supersede:** este spec **reemplaza la Sección A (desktop intro reflow) y la Sección
"nueva composición de reposo"** del spec anterior
(`2026-07-17-hero-intro-reflow-and-mobile-richness.md`, Tasks 1/3, commits `e29ce5b` +
`ed3bc03`). El owner probó esa versión ("todo visible desde el inicio, centrado") y no
convenció — "se ve amontonado, barato y sin estructura". La Sección B de ese spec
(profundidad + glow en mobile, Task 2, commit `27db9c8`) **se mantiene intacta, no se
toca** — sigue siendo la base sobre la que este spec construye.

**Rollback disponible:** tag `hero-before-letter-reveal-intro` (= `ed3bc03`, ya en
`origin`) regresa exactamente al estado post-pasada-anterior si esta no convence tampoco.

## Contexto / Decisión del owner

Cambio de dirección explícito: en vez de mostrar todo de golpe al cargar, ahora la
entrada es una secuencia presentada — "Boreas" se revela letra por letra, se sostiene un
instante, sube para dar paso al headline, y **recién ahí** el usuario puede seguir
construyendo la escena con scroll (párrafo, CTAs, card de la doctora, elementos
decorativos).

## Excepción a la regla de "no gating" (ya aplicada en `DESIGN.md`)

Ya documentada como excepción acotada, solo para el intro del Hero (ver `DESIGN.md` §
Prohibitions → "Content gating — narrow exception..."). Resumen:

- El scroll **nunca se bloquea** — el usuario puede scrollear de inmediato.
- Wordmark + H1 siguen revelándose automático por tiempo (no dependen de scroll).
- Párrafo, CTAs y card de la doctora **sí** quedan detrás de scroll — elección explícita
  del owner, con el trade-off mostrado y aceptado.
- Excepción exclusiva al intro del Hero — no precedente para el resto del sitio.

## Sección 1 — Intro (automático por tiempo, nunca atado a scroll)

### Secuencia

1. **Delay inicial:** 250ms tras el mount, sin nada visible aún del wordmark (el resto
   de la página — header, fondo — ya está pintado normalmente).
2. **Reveal letra por letra de "Boreas"** (6 letras): cada letra anima
   `translateY(12px→0) + opacity(0→1)`, `ease-out-exponential`, duración ~400ms por
   letra. Las letras se **traslapan** — cada una arranca ~60ms después de la anterior
   (no espera a que la previa termine). Con 6 letras: la última arranca en
   `250 + 5×60 = 550ms`, termina en `~950ms`. Evita el efecto "letras sueltas
   apareciendo una por una" — se lee como una palabra ensamblándose.
3. **Sostenida:** "Boreas" solo, presentado, ~400ms de pausa (hasta ~1350ms).
4. **Transición a headline:** "Boreas" se desplaza hacia arriba (dentro del stack, no
   sale de pantalla) mientras el H1 (`heroHeadline`) se revela (reutiliza el componente
   `TextReveal` ya existente). Duración ~500ms, `ease-out-exponential`. Termina en
   ~1850ms — dentro del rango "~1-2s" que pidió el owner.

### Skip-on-scroll (nunca bloquea, nunca "snap barato")

Si el usuario scrollea **antes** de que el intro termine su timeline natural: todo lo
que falte de la secuencia (letras pendientes, sostenida, o la transición a headline)
resuelve a su estado final vía una transición corta con easing —
**~150-180ms, `ease-out-exponential`** — no un salto a 0ms. Mecanismo: un listener de
scroll de una sola vez (`{ once: true }`) marca `introSkipped = true`; los componentes de
intro, al recibir ese flag, cambian su target de animación al estado final con esa
duración corta en vez de continuar su timeline de varios cientos de ms.

**Restricción dura:** el listener de scroll NUNCA llama `preventDefault()` ni retrasa el
scroll real de la página — solo lee el evento para decidir el estado visual del intro.

### Nuevo primitivo: `components/motion/wordmark-reveal.tsx`

Componente reutilizable (no hardcoded solo para "Boreas") — recibe el string, hace el
split a letras, aplica el stagger, expone el flag `introSkipped` vía prop o contexto
interno. Vive junto a `text-reveal.tsx`/`parallax-layer.tsx`, mismo patrón de imports.

## Sección 2 — Desktop: qué se revela con scroll, después del intro

Dentro del pin existente (`HERO_PIN_VH_DESKTOP = 280vh`). Los umbrales de fase existentes
(`PHASE_1_END`, `PHASE_2_END` — el crossfade "Te busca→Te encuentra→Te escribe" y sus
chips) **se conservan en espíritu** (mismo orden narrativo), pero se insertan fases
nuevas antes; los valores numéricos exactos de los nuevos umbrales se afinan en el plan
de implementación probando en vivo (mismo criterio ya usado en la pasada anterior).

**Reemplaza el comportamiento de `enableIntroReflow`/`DoctorCardEntrance` de la Task 1
anterior** (que hacía todo visible sin gate) — se vuelve a un gate por opacidad para
párrafo/CTA/card, pero reusando el código visual ya construido (StackedCards, badges,
avatares, `ClusterBackgroundTexture`), no se reconstruye desde cero.

1. **Reflow (scroll 0 → `REFLOW_END`):** el bloque Boreas+H1 (ya revelado por el intro)
   se desliza del centro a la posición izquierda actual. Párrafo + CTAs aparecen
   (`opacity 0→1`, `translateY 12→0`) alineados con ese movimiento.
2. **Card (`REFLOW_END` → `CARD_END`):** la card de la doctora aparece (mismo mecanismo
   ya construido: `DoctorCardEntrance` + `StackedCards`), sin el gate quitado por Task 1
   — se reintroduce.
3. **Elementos decorativos — primera tanda (`CARD_END` → ~0.6):** los 4
   `heroProofPoints` ("Reseñas de Google", "Agenda por WhatsApp", "Pacientes
   decididos", "Sin trabajo técnico") — hoy una fila de texto plano bajo los botones —
   se convierten en mini-chips flotantes que aparecen uno por uno (stagger ~0.03-0.05
   de progreso entre cada uno), reusando contenido ya aprobado, cero cifras nuevas.
4. **Elementos decorativos — ilustrativos (repartidos a lo largo de todo el
   recorrido, no en un solo punto):** `AccentOrbField`, `DrawnPathAccent` y `GrainTexture` (ver Sección
   4) aparecen/se dibujan progresivamente conforme avanza el scroll — dan sensación de
   escena viva sin agregar más información.
5. **Fases existentes (`PHASE_1_END=0.3` en adelante, renumeradas si hace falta):** el
   crossfade "Te busca→Te encuentra→Te escribe" y sus chips (`AppointmentsChipEntrance`,
   `SearchPercentChip`, `TimeChip`) siguen exactamente igual en espíritu — solo se
   recorren un poco más adelante en el scroll para dar espacio a los pasos 1-4.

## Sección 3 — Mobile: intro + scroll-away + pin-to-top

1. Mismo intro de la Sección 1 (mismo componente `WordmarkReveal`, mismos tiempos).
2. **Para "hacer desaparecer" Boreas+H1 y revelar la card:** el usuario scrollea. Boreas
   +H1 se desvanecen/deslizan fuera (`opacity`+`translateY`) conforme la card entra.
3. **Pin-to-top:** al llegar la card a la parte superior del viewport, se queda pineada
   ahí (`sticky`, mismo patrón que `HeroCardMobilePinned` ya usa hoy con
   `sticky top-[88px]` — se reusa la mecánica existente, no se inventa una nueva).
4. **Debajo de la card pineada, con scroll adicional:** salen los elementos decorativos
   e informativos — mismos `heroProofPoints` como chips + `AccentOrbField`/
   `DrawnPathAccent`/`GrainTexture` a menor escala (mobile usa menos orbes / línea más corta que
   desktop, mismo primitivo con props distintas).

## Sección 4 — Nuevos primitivos decorativos (puramente ilustrativos, reutilizables)

Pedido explícito del owner: no solo reusar contenido informativo existente, agregar
también elementos **sin información**, puramente visuales, diseñados para reusarse a
menor escala en otras secciones del sitio (no exclusivos del Hero).

### Uso obligatorio de Magic UI MCP + React Bits MCP (evaluación, no instalación ciega)

Por instrucción explícita del owner, se consultaron ambos registries
(`mcp__magicuidesign-mcp__*` y `mcp__shadcn__*` contra `@react-bits`, configurado en
`components.json`) antes de diseñar los primitivos de esta sección. No todo lo
encontrado califica — se documenta qué se usa, qué se descarta, y por qué:

| Necesidad | Candidato evaluado | Veredicto |
| --- | --- | --- |
| Reveal de letras | React Bits `SplitText` (las 4 variantes: TS/JS × TW/CSS) | **Descartado.** Las 4 variantes dependen de `gsap`+`@gsap/react` — choca con la regla dura y ya reafirmada del proyecto ("No gsap. framer-motion + CSS only, project-wide", `DESIGN.md` § Motion Rules). Incluso la variante "-CSS" depende de gsap (usa el plugin `SplitText` de GSAP internamente, no es cuestión de empaquetado). Se reusa la técnica (split a caracteres + stagger) reimplementada nativa con framer-motion en `wordmark-reveal.tsx` — mismo patrón que el `TextReveal` ya existente en el repo. |
| Orbes/glow ambiental | Magic UI `particles` | **Descartado.** Es un sistema canvas + `requestAnimationFrame` con seguimiento de mouse y 100 partículas por default — textura equivocada (denso/interactivo) para un "acento puntual" (regla de glow relajada en `DESIGN.md` es explícita: acento, no wallpaper), y un loop de canvas por frame choca con la regla de solo animar `transform`/`opacity` (mismo principio de rendimiento de la skill `emil-design-eng` ya aplicada en esta pasada). React Bits no tiene un match directo (orb/blob) tampoco. Se mantiene el diseño original: pocos círculos con `blur` CSS + `ParallaxLayer` (primitivo ya existente). |
| Línea que se dibuja con scroll | Magic UI `animated-beam` | **Parcial — técnica sí, componente no.** Usa un `<path>` SVG con gradiente animado vía `motion.linearGradient` y una curva easeOutExpo (`[0.16,1,0.3,1]`, cercana pero no idéntica a la constante `EASE` del proyecto `[0.22,1,0.36,1]`) — buena referencia visual. Pero está diseñado para conectar dos elementos del DOM vía `ResizeObserver` (choca con la regla "sin medición JS") y su animación es un loop infinito por tiempo, no por scroll. `DrawnPathAccent` toma la técnica del trazo con gradiente pero la ata a `useScrub` (scroll, lineal) en vez de instalar el componente tal cual. |
| Textura de grano/papel | React Bits `Noise-TS-CSS` | **Usado — aprobado por el owner.** CSS puro, sin dependencias (confirmado vía `view_items_in_registries` — a diferencia de `SplitText`, este sí es dependency-free). Encaja con la identidad "papel cálido" ya descrita en `DESIGN.md` § Visual System. Se porta a `components/motion/grain-texture.tsx` (se ajusta al patrón de exports del resto de `components/motion/`, no se deja tal cual llega del registry). |

**Conclusión práctica:** ambos MCPs sí aportaron valor — como fuente de búsqueda/evaluación
y como referencia técnica (SVG+gradiente, split-de-caracteres), y en un caso (grano) como
fuente directa de un componente aprobado. Ninguno se instala a ciegas cuando choca con una
regla dura ya vigente del proyecto (gsap, medición JS, transform/opacity-only) — mismo
criterio que se ha aplicado toda esta pasada a cualquier fuente externa.

### `components/motion/accent-orb-field.tsx`

Conjunto de círculos suaves y borrosos (`blur` 20-40px, `opacity` 0.15-0.3,
`pointer-events-none`, `aria-hidden`) en los 4 acentos vivos ya definidos en
`DESIGN.md`/`globals.css` (`--c-amber`, `--c-mint`, `--c-lav`, `--c-rose` — "sistema
deliberado", no decoración accidental, ya lo dice el propio `DESIGN.md`). Cada orbe usa
`ParallaxLayer` (primitivo ya existente) con su propia velocidad, dando sensación de
profundidad/deriva sutil. Props: `count`, rango de tamaño, rango de velocidad — así el
Hero usa una versión "grande" (5-6 orbes) y otras secciones pueden usar una versión
"quieta" (1-2 orbes) sin duplicar código.

### `components/motion/drawn-path-accent.tsx`

Una línea curva delgada (SVG `path`, `stroke` en color de acento) que se "dibuja" con el
scroll vía `stroke-dashoffset` atado a `useScrub` (lineal, mismo primitivo ya existente,
sin curva de easing nueva). Puramente decorativo, `aria-hidden`. Reutilizable como
elemento conector/textura en otras secciones a menor escala (path más corto, un solo
trazo).

### `components/motion/grain-texture.tsx`

Portado desde React Bits `Noise-TS-CSS` (CSS puro, sin dependencias — ver tabla de
evaluación arriba), ajustado al patrón de exports del proyecto. Textura de grano sutil
sobre el Hero completo, refuerza la identidad "papel cálido" ya descrita en
`DESIGN.md`. `aria-hidden`, `pointer-events-none`, opacidad baja (no debe leerse como
ruido/artefacto, es textura táctil de fondo). Reutilizable en otras secciones del sitio
a la misma o menor intensidad.

Los tres primitivos van en `components/motion/`, mismo patrón de export/props que
`parallax-layer.tsx`/`stacked-cards.tsx` — no rompen la convención existente.

## Restricciones técnicas (heredadas del spec anterior, siguen vigentes)

- `ease-out-exponential` (`[0.22, 1, 0.36, 1]`) como default de cualquier transición por
  tiempo. Los `useScrub` atados a scroll siguen lineales.
- Transform + opacity únicamente para lo animado; `transform:` como string completo
  (`translate3d()`), nunca los atajos `x`/`y`/`scale` de Framer Motion.
- Sin medición JS (`getBoundingClientRect`/`ResizeObserver`) para posicionamiento —
  unidades de container query donde se necesite fluidez entre breakpoints.
- `prefers-reduced-motion` (`HeroStatic` y su rama mobile): sin intro de letras, sin
  gate por scroll — mismo criterio de siempre, todo visible de inmediato, sin
  coreografía. `AccentOrbField`/`DrawnPathAccent`/`GrainTexture` en modo reducido: estáticos, sin
  parallax ni dibujo animado (aparecen ya completos, o se omiten si eso es más simple).

## Accesibilidad

- El wordmark y headline deben seguir siendo texto real (no imágenes/canvas) —
  `WordmarkReveal` anima opacidad/posición de spans reales, el texto completo sigue
  presente en el DOM y seleccionable en todo momento (incluso letra por letra, mientras
  se revela).
- `AccentOrbField`/`DrawnPathAccent`/`GrainTexture`: `aria-hidden="true"`, `pointer-events-none` — cero
  impacto en el árbol de accesibilidad.
- Los chips de `heroProofPoints` mantienen el texto real (no solo iconos) — si el
  usuario nunca scrollea, ese contenido no está disponible para lectores de pantalla;
  esto es aceptable bajo la misma excepción ya documentada (contenido gateado tras
  scroll, exclusivo al intro del Hero, decisión ya tomada por el owner) — no requiere
  transcript oculto adicional porque no hay duplicación de DOM aquí (a diferencia de
  `StackedCards`), solo un retraso de aparición.

## Verificación esperada

- Desktop, carga inicial: delay de 250ms, luego "Boreas" se ensambla letra por letra
  (traslapado, no secuencial estricto), pausa, sube, aparece el headline — todo antes de
  cualquier scroll.
- Desktop, si se scrollea a la mitad del intro: el resto resuelve suave en ~150-180ms,
  sin salto brusco, sin quedar a medias.
- Desktop, scroll continuo: texto se acomoda a la izquierda, aparece párrafo+CTA, luego
  la card, luego los 4 proof-points como chips uno por uno, orbes, línea decorativa y grano
  presentes a lo largo, y al final el crossfade de fases ya existente sigue intacto.
- Mobile: mismo intro; scroll hace desaparecer Boreas+H1 y aparecer la card; la card se
  pinea arriba al llegar; más abajo aparecen los chips + orbes/línea/grano a menor escala.
- `prefers-reduced-motion`: contenido completo, sin animación de letras, sin gate,
  coherente con el fallback ya existente.
