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

### Nuevo primitivo, en dos partes (decisión revisada — ver tabla de evaluación de MCPs)

El owner eligió usar gsap `SplitText` para esto en vez de una implementación nativa con
framer-motion — política de librería de animación abierta desde 2026-07-17 (ver
`DESIGN.md` § "Animation library policy"; framer-motion + CSS sigue siendo el default
del resto del sitio, ya no es la única opción permitida). Se sigue partiendo en dos
componentes, no porque una regla lo exija, sino por buena práctica de arquitectura
(un import de gsap contenido en un solo archivo, resto del Hero sin tocar):

- **`components/motion/wordmark-letter-reveal.tsx`** (hoja, gsap-only): recibe el
  string, usa `SplitText` de gsap para el split a letras + stagger-in. No importa
  framer-motion. Expone un callback `onComplete` y respeta el flag `introSkipped` (si
  se activa a medio-timeline, gsap resuelve el resto del timeline a su estado final en
  ~150-180ms en vez de un `.progress(1)` instantáneo — mismo criterio de "nunca snap
  barato" de la Sección 1, solo que implementado con la API de gsap en vez de
  framer-motion).
- **Componente orquestador** (en `boreas-hero.tsx`, framer-motion): monta
  `WordmarkLetterReveal`, escucha su `onComplete`, y a partir de ahí anima la
  transición "Boreas sube + headline aparece" (reutiliza `TextReveal`). Coordina por
  callback/ref — mantiene el resto del Hero en framer-motion por consistencia, no por
  obligación.

Dependencias nuevas: `gsap` + `@gsap/react` (mismas que usa `SplitText` de React Bits —
ver tabla de evaluación de MCPs arriba, ahora aprobado en vez de descartado).

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
   (`opacity 0→1`, `translateY 12→0`) alineados con ese movimiento. El wordmark, mientras
   está centrado durante el intro, lleva `WordmarkOrbitAccent` (puntos orbitando) —se
   desvanece cuando arranca el reflow. El headline, al revelarse, lleva
   `HighlighterAccent` sobre la frase clave y `GradientAccentWord` en la palabra de
   acento (a definir cuál en el plan).
2. **Card (`REFLOW_END` → `CARD_END`):** la card de la doctora aparece (mismo mecanismo
   ya construido: `DoctorCardEntrance` + `StackedCards`), sin el gate quitado por Task 1
   — se reintroduce. Se agrega `backlight` (Magic UI) como glow extra detrás de la card,
   complementando `--shadow-depth`.
3. **Elementos decorativos — primera tanda (`CARD_END` → ~0.6):** los 4
   `heroProofPoints` ("Reseñas de Google", "Agenda por WhatsApp", "Pacientes
   decididos", "Sin trabajo técnico") — hoy una fila de texto plano bajo los botones —
   se convierten en mini-chips flotantes que aparecen uno por uno (stagger ~0.03-0.05
   de progreso entre cada uno), reusando contenido ya aprobado, cero cifras nuevas.
4. **Elementos decorativos — ilustrativos (repartidos a lo largo de todo el
   recorrido, no en un solo punto):** `AccentOrbField`, `DrawnPathAccent` y
   `GrainTexture` (ver Sección 4) aparecen/se dibujan progresivamente conforme avanza
   el scroll — dan sensación de escena viva sin agregar más información.
5. **A lo largo de todo el pin:** `scroll-progress` (Magic UI) — barra delgada de
   avance, fija, independiente de las fases de contenido.
6. **Fases existentes (`PHASE_1_END=0.3` en adelante, renumeradas si hace falta):** el
   crossfade "Te busca→Te encuentra→Te escribe" y sus chips (`AppointmentsChipEntrance`,
   `SearchPercentChip`, `TimeChip`) siguen exactamente igual en espíritu — solo se
   recorren un poco más adelante en el scroll para dar espacio a los pasos 1-4.

## Sección 3 — Mobile: intro + scroll-away + pin-to-top

1. Mismo intro de la Sección 1 (mismo componente `WordmarkReveal`, mismos tiempos),
   incluido `WordmarkOrbitAccent` a menor escala (menos puntos que desktop).
2. **Para "hacer desaparecer" Boreas+H1 y revelar la card:** el usuario scrollea. Boreas
   +H1 se desvanecen/deslizan fuera (`opacity`+`translateY`) conforme la card entra.
   `HighlighterAccent`/`GradientAccentWord` del headline se desvanecen con el resto del
   bloque, no por separado.
3. **Pin-to-top:** al llegar la card a la parte superior del viewport, se queda pineada
   ahí (`sticky`, mismo patrón que `HeroCardMobilePinned` ya usa hoy con
   `sticky top-[88px]` — se reusa la mecánica existente, no se inventa una nueva). Lleva
   `backlight` igual que desktop.
4. **Debajo de la card pineada, con scroll adicional:** salen los elementos decorativos
   e informativos — mismos `heroProofPoints` como chips + `AccentOrbField`/
   `DrawnPathAccent`/`GrainTexture` a menor escala (mobile usa menos orbes / línea más
   corta que desktop, mismo primitivo con props distintas).
5. `scroll-progress` presente también en mobile, mismo componente que desktop.

## Sección 4 — Nuevos primitivos decorativos (puramente ilustrativos, reutilizables)

Pedido explícito del owner: no solo reusar contenido informativo existente, agregar
también elementos **sin información**, puramente visuales, diseñados para reusarse a
menor escala en otras secciones del sitio (no exclusivos del Hero).

### Uso obligatorio de Magic UI MCP + React Bits MCP (auditoría completa, no instalación ciega)

Por instrucción explícita del owner, se auditaron **los dos catálogos completos**
(`mcp__magicuidesign-mcp__*` — 77 componentes — y `mcp__shadcn__*` contra `@react-bits`
— 139 componentes, configurado en `components.json`) antes de cerrar esta sección. No
todo lo encontrado califica — se documenta qué se usa, qué ya está cubierto, qué se
descarta y por qué, y qué queda anotado para después.

**Se usan (nuevo, ver primitivos abajo):**

| Necesidad | Fuente | Nota |
| --- | --- | --- |
| Reveal de letras | React Bits `SplitText` (gsap) | Ver Sección 1 — política de librería abierta desde 2026-07-17 |
| Orbes/glow ambiental | React Bits `Orb` | Base para `AccentOrbField`, en vez de construirlo 100% desde cero |
| Línea que se dibuja con scroll | React Bits `Beams`/`Threads`/`Strands` | Referencias visuales para `DrawnPathAccent` — se elige la que mejor se vea en pruebas, atada a `useScrub` |
| Grano/textura de papel | React Bits `Noise` **y** Magic UI `noise-texture` (SVG `feTurbulence`) | Ambos sin dependencias — se comparan las dos implementaciones en la fase de implementación, se porta la que se vea mejor |
| Subrayado tipo marcador | Magic UI `highlighter` (dep: `rough-notation`) | Nuevo — resalta una frase clave del headline, efecto trazo-a-mano |
| Palabra de acento con gradiente | React Bits `GradientText`/`ShinyText` | Nuevo — una palabra del headline en su momento de impacto (regla ya permitida en `DESIGN.md`) |
| Barra de progreso del scroll | Magic UI `scroll-progress` (dep: `motion`, compatible) | Nuevo — detalle funcional, no solo decorativo |
| Glow detrás de la card de la doctora | Magic UI `backlight` | Nuevo — complementa el `StackedCards` ya existente |
| Puntos orbitando el wordmark | Magic UI `orbiting-circles` / React Bits `OrbitImages` | Nuevo — acento puramente ilustrativo durante el intro |

**Ya construido, no se duplica:** `CountUp`/`Counter`/`number-ticker` (→ `useAnimatedNumber`
ya existe) · `ScrollReveal`/`AnimatedContent`/`FadeContent`/`blur-fade`/Magic UI
`text-reveal` (→ `TextReveal` ya existe) · `ScrollStack`/`Stack`/`CardSwap` (→
`StackedCards` ya existe) · `avatar-circles` (→ stack de avatares ya existe) ·
`Carousel` (→ carrusel de Relevo ya existe).

**Descartado — no encaja con la marca (papel cálido, editorial, audiencia de médicos +
pacientes 40+, sitio que genera confianza):**
- Todo lo de cursor/puntero (16 de React Bits + `smooth-cursor`/`pointer`/`lens` de
  Magic UI) — cursores custom confunden a esta audiencia, tono equivocado.
- Fondos WebGL/shader pesados (~40 de React Bits: `Aurora`, `Plasma`, `LiquidChrome`,
  `Balatro`, etc.) — rompen "papel cálido, plano, mate" y la regla
  transform/opacity-only (son canvas/WebGL).
- Efectos glitch/hacker de texto (`DecryptedText`, `GlitchText`, `ASCIIText`, etc.) —
  tono equivocado para confianza médica.
- 3D/WebGL de showcase (`Cubes`, `Lanyard`, `DomeGallery`, etc.) — medio equivocado,
  pesado.
- `confetti`/`rainbow-button`/`cool-mode` — demasiado juguetón.
- Magic UI `particles` y `animated-beam` tal cual (ver detalle técnico abajo) —
  chocan con medición JS / transform-opacity-only, no con la librería que usen.

**Guardado para después (no es para el Hero, otra tarea):** mockups de dispositivo
(`android`/`iphone`/`safari` de Magic UI) · `shimmer-button`/`border-beam`/`shine-border`
(pulir el CTA) · `PillNav`/`StaggeredMenu` (rediseño de header) · `SpotlightCard`/
`TiltedCard` (hover en cards de otras secciones) · `confetti` (estado de éxito del
form) · `animated-theme-toggler` (mejorar el toggle actual) · `GradualBlur` de React
Bits (técnica de reserva si el crossfade del intro se ve tosco, ver Sección 1 §
skip-on-scroll).

**Detalle técnico de los 2 descartes con "casi encaja" (heredado de la evaluación
anterior):** Magic UI `particles` es canvas+`requestAnimationFrame`+mouse-tracking,
100 partículas por default — textura equivocada (denso/interactivo) para un "acento
puntual" y choca con la regla de solo animar `transform`/`opacity`. Magic UI
`animated-beam` usa un `<path>` SVG con gradiente animado (buena referencia visual,
curva easeOutExpo `[0.16,1,0.3,1]` cercana a la constante `EASE` del proyecto
`[0.22,1,0.36,1]`) pero está diseñado para conectar dos elementos del DOM vía
`ResizeObserver` (choca con "sin medición JS") con loop infinito por tiempo, no por
scroll — se prefieren `Beams`/`Threads`/`Strands` de React Bits como referencia en su
lugar, igual atados a `useScrub`.

### Primitivos nuevos

Todos van en `components/motion/`, mismo patrón de export/props que
`parallax-layer.tsx`/`stacked-cards.tsx` — no rompen la convención existente. Los que
usan gsap (`wordmark-letter-reveal.tsx`) lo contienen en su propio archivo, sin
mezclarlo con framer-motion en el mismo componente (buena práctica, ya no regla
obligatoria — ver `DESIGN.md` § "Animation library policy").

- **`components/motion/accent-orb-field.tsx`** — círculos suaves y borrosos (`blur`
  20-40px, `opacity` 0.15-0.3, `pointer-events-none`, `aria-hidden`) en los 4 acentos
  vivos ya definidos (`--c-amber`, `--c-mint`, `--c-lav`, `--c-rose` — "sistema
  deliberado" según el propio `DESIGN.md`). Base: React Bits `Orb`, adaptado a usar
  `ParallaxLayer` (primitivo ya existente) por orbe. Props: `count`, rango de tamaño,
  rango de velocidad — Hero usa versión "grande" (5-6 orbes), otras secciones pueden
  usar 1-2.
- **`components/motion/drawn-path-accent.tsx`** — línea curva delgada (SVG `path`,
  gradiente en color de acento) que se "dibuja" con el scroll vía `stroke-dashoffset`
  atado a `useScrub` (lineal). Referencia visual: React Bits `Beams`/`Threads`/
  `Strands`. Puramente decorativo, `aria-hidden`, reutilizable a menor escala.
- **`components/motion/grain-texture.tsx`** — grano de papel. Se compara React Bits
  `Noise` (CSS) vs Magic UI `noise-texture` (SVG `feTurbulence`) en implementación, se
  porta la que se vea mejor — ambas sin dependencias. `aria-hidden`,
  `pointer-events-none`, opacidad baja.
- **`components/motion/highlighter-accent.tsx`** — envuelve Magic UI `highlighter`
  (dep: `rough-notation`, sin conflicto con framer-motion). Subraya una frase corta del
  headline con trazo tipo marcador a mano, en el momento en que el headline se revela.
  Reutilizable en otras secciones para resaltar una frase clave.
- **`components/motion/gradient-accent-word.tsx`** — envuelve la técnica de React Bits
  `GradientText`/`ShinyText`. Una sola palabra del headline (a definir en el plan) con
  gradiente animado en el momento de impacto — ya permitido por la regla de gradiente
  relajada en `DESIGN.md`, no en body copy ni labels repetidos.
- **`components/motion/wordmark-orbit-accent.tsx`** — puntos pequeños orbitando el
  wordmark durante el intro (referencia: Magic UI `orbiting-circles` / React Bits
  `OrbitImages`), puramente ilustrativo, se detiene/desvanece cuando el wordmark se
  desplaza a su posición final.
- **Barra de scroll:** se integra Magic UI `scroll-progress` (dep: `motion`,
  compatible) directamente, sin wrapper propio — indicador delgado del avance por el
  pin del Hero.
- **Glow de la card:** se integra Magic UI `backlight` como capa extra dentro de
  `DoctorCardEntrance`/`StackedCardsStaticDoctorCard`, complementando (no
  reemplazando) la sombra `--shadow-depth` ya existente.

## Restricciones técnicas (heredadas del spec anterior, siguen vigentes)

- `ease-out-exponential` (`[0.22, 1, 0.36, 1]`) como default de cualquier transición por
  tiempo. Los `useScrub` atados a scroll siguen lineales. Dentro de
  `wordmark-letter-reveal.tsx` (gsap), usar el equivalente de gsap (`"expo.out"`) —
  misma familia de curva, sintaxis propia de esa librería.
- Transform + opacity únicamente para lo animado; `transform:` como string completo
  (`translate3d()`), nunca los atajos `x`/`y`/`scale` de Framer Motion.
- Sin medición JS (`getBoundingClientRect`/`ResizeObserver`) para posicionamiento —
  unidades de container query donde se necesite fluidez entre breakpoints. `backlight`
  no mide nada vía JS (glow puramente CSS/SVG) — confirmar en el plan.
- Los registries de Magic UI declaran su dependencia de framer-motion como `motion`
  (nombre nuevo del paquete). Este proyecto fija `framer-motion` como nombre de paquete
  (ver `skills/framer-motion/SKILL.md` § "Boreas project overrides") — al portar
  `scroll-progress`/`highlighter`/`backlight`, reescribir esos imports a
  `from "framer-motion"`, no instalar el paquete `motion` aparte (evita dos copias del
  mismo runtime).
- `prefers-reduced-motion` (`HeroStatic` y su rama mobile): sin intro de letras, sin
  gate por scroll — mismo criterio de siempre, todo visible de inmediato, sin
  coreografía. Todos los primitivos puramente decorativos (`AccentOrbField`,
  `DrawnPathAccent`, `GrainTexture`, `WordmarkOrbitAccent`, `backlight`) en modo
  reducido: estáticos, sin parallax ni dibujo animado (aparecen ya completos, o se
  omiten si eso es más simple). `HighlighterAccent`/`GradientAccentWord` en modo
  reducido: el texto se ve completo y legible de inmediato, sin el trazo/gradiente
  animándose (puede quedar el estado final estático, nunca oculto).

## Accesibilidad

- El wordmark y headline deben seguir siendo texto real (no imágenes/canvas) —
  `WordmarkReveal` anima opacidad/posición de spans reales, el texto completo sigue
  presente en el DOM y seleccionable en todo momento (incluso letra por letra, mientras
  se revela). `HighlighterAccent`/`GradientAccentWord` decoran texto real existente,
  nunca lo reemplazan por imagen/canvas.
- Elementos puramente decorativos (`AccentOrbField`, `DrawnPathAccent`, `GrainTexture`,
  `WordmarkOrbitAccent`, `backlight`, `scroll-progress`): `aria-hidden="true"`,
  `pointer-events-none` — cero impacto en el árbol de accesibilidad.
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
  la card, luego los 4 proof-points como chips uno por uno, orbes, línea decorativa y
  grano presentes a lo largo, glow (`backlight`) detrás de la card, barra de scroll
  visible, y al final el crossfade de fases ya existente sigue intacto.
- Desktop, durante el intro: puntos orbitando el wordmark, frase clave del headline
  subrayada tipo marcador, una palabra con gradiente animado — todo antes de scroll.
- Mobile: mismo intro (con orbit-accent a menor escala); scroll hace desaparecer
  Boreas+H1 y aparecer la card con su glow; la card se pinea arriba al llegar; más abajo
  aparecen los chips + orbes/línea/grano a menor escala; barra de scroll presente.
- `prefers-reduced-motion`: contenido completo, sin animación de letras, sin gate, sin
  trazo/gradiente animado (texto legible de inmediato), coherente con el fallback ya
  existente.
