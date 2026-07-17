# Hero — Intro Reflow (desktop) + Mobile Richness — Design Spec

> **For agentic workers:** this spec feeds `superpowers:writing-plans`. Read fully before
> planning implementation.

**Rama:** `worktree-hero-cinematic-scroll` (PR #67, sin mergear), worktree en
`.claude/worktrees/hero-cinematic-scroll`. Segunda pasada de diseño sobre el Hero ya
construido (ver `docs/superpowers/specs/2026-07-16-hero-motion-system-and-redesign.md` y
su plan hermano — ya implementado y mergeado a esta rama).

## Contexto / Problema

Screenshots tomados contra el build actual (`localhost:3001`, commit `5028c56`) confirman
dos problemas reales:

1. **Desktop, scroll=0:** la columna derecha (card de la doctora) está en `opacity: 0`
   hasta 30% del scroll del pin (`PHASE_1_END = 0.3`). En reposo solo se ve un blob de
   glow y un chip flotante — se lee vacío/barato.
2. **Mobile, dark mode:** la card de la doctora (`HeroCardMobilePinned` /
   `HeroCardMobile`) nunca recibió el tratamiento de profundidad que sí tiene desktop —
   sin `StackedCards` (capa eco), sin `ClusterBackgroundTexture` (glow ambiental). El
   gradiente base en dark mode es apagado, y sin esas capas se ve plano/inacabado, con
   vacíos negros grandes arriba y abajo de la card.

## Restricción dura (no negociable, ya vigente en `DESIGN.md`)

> "Content is never gated behind animation — it must exist in the DOM and be visible by
> default; motion enhances an already-visible element, it doesn't reveal a hidden one."

El diseño original del owner (Boreas centrado solo, headline/CTA ocultos hasta scroll)
violaba esto. Resuelto vía decisión explícita del owner: **híbrido** — todo el contenido
primario (wordmark, H1, párrafo, CTAs, card de la doctora) vive en el DOM y es
`opacity: 1` desde el primer frame. El scroll anima **posición/escala** (transform), no
visibilidad. Los elementos secundarios decorativos (chips flotantes de "citas hoy",
"82%", "última respuesta") mantienen su comportamiento actual de aparecer con delay/scroll
— ya aceptados como "acento puntual" en la pasada anterior, fuera de alcance aquí.

## Sección A — Desktop: intro centrada → se separa

**Opción elegida (de 3 propuestas):** Opción 1 — columna única al cargar, se separa con
scroll.

### Fases (dentro del pin existente de `HERO_PIN_VH_DESKTOP = 280vh`)

Se inserta una fase nueva **antes** de las fases existentes (`PHASE_1_END = 0.3`,
`PHASE_2_END = 0.65`, sin cambios):

- **`INTRO_END = 0.16`** (nueva constante) — scroll 0 → 0.16 del pin (~45vh de scroll
  real).

**En `scrollYProgress = 0` (reposo):**
- El grid de dos columnas (`lg:grid-cols-[1fr_0.88fr]`) permanece estructuralmente
  intacto — no se reconstruye el layout, se **transforma** vía CSS.
- La columna de texto (wordmark + H1 + párrafo + CTAs) se desplaza y escala hacia el
  centro visual del viewport vía `transform: translate3d() scale()` — sigue siendo el
  mismo elemento interactivo real (mismo `id="hero-primary-cta"`, mismo `href`), no una
  copia decorativa.
- La columna de la card (`DoctorCardEntrance`) se desplaza hacia abajo y al centro,
  apilándose visualmente bajo el bloque de texto — `opacity: 1` siempre, sin fade. Puede
  llevar un `scale` ligeramente reducido (ej. 0.92) como acento de "asentamiento", no
  como ocultamiento.
- Los badges (`ExampleBadge`, `VerifiedBadge`) y el `DoctorCardSrOnlyTranscript` viajan
  con la card sin cambios de comportamiento.

**Entre `INTRO_END` y el inicio de `PHASE_1` (con solape breve o inmediato):**
- Ambos bloques transicionan a su posición final actual (texto a la izquierda en su
  tamaño normal, card a la derecha en su spot del cluster) — mismo mecanismo transform,
  interpolado por `useScrub`.
- A partir de aquí el comportamiento existente (crossfade de eyebrow/copy "Te
  busca→Te encuentra", chips con delay, `AppointmentsChipEntrance`, etc.) continúa sin
  cambios.

### Restricciones técnicas

- Transform-only (`translate3d()` + `scale()` en el string completo de `transform`, no
  los atajos `x`/`y`/`scale` de Framer Motion — evita que la animación caiga a
  `requestAnimationFrame` en el hilo principal en vez de acelerarse por hardware).
- Sin medición JS (`getBoundingClientRect`/`ResizeObserver`) — usar unidades de
  container query (`cqw`/`cqh`) atadas al contenedor del grid para que los cálculos de
  posición respondan de forma fluida entre 1024px y 1920px+ sin JS. Mismo principio ya
  usado en el fix de altura de Relevo (CSS puro, cero medición).
- Easing: se mantiene `ease-out-exponential` (`[0.22, 1, 0.36, 1]`) como default del
  proyecto — no se adopta `ease-in-out` aunque sea la recomendación genérica para
  "elementos que se mueven en pantalla", porque la regla dura del proyecto
  (`DESIGN.md` § Motion Rules) tiene precedencia.
- Si el crossfade entre el estado "intro" y el estado "final" se ve tosco en pruebas,
  recurso de reserva: `filter: blur(2-4px)` transitorio durante el tramo de
  transformación (no aplicar de entrada, solo si hace falta).
- `prefers-reduced-motion`: `HeroStatic` (el fallback ya existente) no implementa esta
  coreografía — mantiene el layout de dos columnas fijo desde siempre, sin intro
  centrada. Es aceptable: la regla exige que el contenido no dependa de la animación
  para ser visible, no que la coreografía exista en el modo reducido.

### Fuera de alcance

- No se toca `PHASE_1_END`/`PHASE_2_END` ni la lógica de esas fases.
- No se toca el pin de mobile (`HERO_PIN_VH_MOBILE`) — la coreografía de intro es
  exclusiva de desktop (`lg:` breakpoint), igual que el resto del cluster.

## Sección B — Mobile: profundidad + glow ambiental

**Decisiones ya aprobadas:** agregar `StackedCards` a la card de la doctora en mobile
(mismo componente que desktop) + glow ambiental tipo `ClusterBackgroundTexture` con
`ParallaxLayer`, intensidad **pronunciada** (mayor presencia que en desktop, ya que la
pantalla chica necesita más peso visual para no leerse vacía). Aplica en light y dark
por igual — el problema es más visible en dark porque el gradiente base ahí es más
apagado, pero el fix no es dark-mode-specific.

### Cambios

1. **`HeroCardMobilePinned`** (variante cinemática) y **`HeroCardMobile`** (fallback
   `HeroStatic`/reduced-motion): envolver el contenido de la card en `StackedCards`
   (mismo patrón que `DoctorCardEntrance`/`StackedCardsStaticDoctorCard` en desktop) —
   capa eco detrás, `ghostLayers` para altura estable, badges como hermanos no-clipeados
   con `z-20`, `DoctorCardSrOnlyTranscript` para no perder accesibilidad (mismo patrón
   ya establecido, sin inventar uno nuevo).
2. **Glow ambiental mobile:** nuevo layer decorativo (mismo patrón que
   `ClusterBackgroundTexture`, radial-gradient cálido con `color-mix(var(--accent)...)`
   + blur), posicionado detrás del encabezado (arriba) y otro cerca de la zona de la
   card, para no dejar vacíos negros grandes. Intensidad pronunciada: mayor tamaño/opacidad
   que la versión desktop existente — valores exactos a definir en el plan (partir de la
   versión desktop y escalar).
3. **Parallax:** en la variante cinemática (`HeroCinematic`), atar el glow al
   `mobileScrollYProgress` ya existente vía `ParallaxLayer` (mismo primitivo, sin nuevo
   código de motion). En `HeroStatic` (reduced-motion), el glow es estático — sin
   parallax, coherente con el resto del fallback.

### Restricciones técnicas

- Reusa primitivos existentes (`StackedCards`, `ParallaxLayer`, `ClusterBackgroundTexture`
  o una variante paramétrica de la misma función) — no se crean nuevos primitivos de
  motion para esto.
- `--shadow-depth` (token ya añadido en la pasada anterior) se reusa tal cual, ya es
  theme-adaptive (light/dark).

## Accesibilidad

- Ningún cambio a los patrones ya establecidos de `aria-hidden` + `sr-only` transcript
  para `StackedCards` — se replica el patrón existente, no se inventa uno nuevo.
- La coreografía de intro en desktop no puede introducir ningún elemento con
  `opacity: 0` en el DOM en su estado de reposo — verificación explícita en el plan
  (grep de `opacity: 0` / `opacity: [0,` en el diff de esta feature).

## Verificación esperada

- Desktop 1440px, scroll=0: bloque de texto+card centrado, visible, sin huecos negros ni
  glow-only en la columna derecha.
- Desktop, scroll gradual: transición fluida hasta el layout de dos columnas actual, sin
  saltos ni "pop" visibles.
- Mobile 390px, dark mode, scroll=0: sin vacío plano — glow visible detrás del
  encabezado.
- Mobile 390px, dark mode, scroll hasta la card: card con capa eco de profundidad
  (igual que desktop), glow cerca de la card, sin vacíos negros grandes.
- `prefers-reduced-motion`: ambos fallbacks (`HeroStatic` desktop y mobile) muestran
  contenido completo sin animación de posición: layout de dos columnas fijo en desktop,
  card con `StackedCards` + glow estático en mobile.
