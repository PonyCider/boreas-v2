# Epic 2 — Problema ("Entiendo tu dolor") (design)

Fecha: 2026-07-20

## Contexto

Sigue a `2026-07-19-boreas-v4-landing-design.md` (Epic 2, líneas 95-96): pain points + slider drag
interactivo genérico-vs-Boreas. Corrige además una imprecisión de esa spec: la audiencia de V4
**no se amplía fuera del vertical salud** — sigue siendo exclusivamente profesionales de la salud
(psicólogos, terapeutas, nutriólogos, fisioterapeutas, médicos); lo que crece respecto a V3 es el
rango de especialidades dentro de ese mismo vertical, no el mercado.

Stub actual: `components/landing/problem-section.tsx` (solo eyebrow + heading desde
`content/site.ts → sectionStubs`). Debe unirse visualmente al Hero (Epic 1: `hero-section.tsx` +
`hero-visual.tsx`, CardSwap + AnimatedList) mediante un efecto de scroll-pin que invita a bajar.

## Alcance de este documento

Cubre: estructura de la sección Problema, elección de librerías de comparación/animación de texto
(con trade-offs evaluados), mecánica del efecto de scroll-pin del slider, y archivos a crear.

No cubre: copy final palabra por palabra (se escribe al implementar), ni el detalle línea por
línea de la implementación (vive en el plan que genera `writing-plans`).

## Decisiones

### 1. Estructura de la sección

Dentro de `SectionFrame` (mismo `border-t border-line`, mismo `max-w-[1460px]` que el resto del
sitio — la unión visual con el Hero ya está resuelta por esta convención compartida):

1. **Header** — eyebrow + heading (reemplaza el placeholder actual).
2. **Fila de stats** — 2 stats numéricos animados. Se reutiliza el par de V3 (`82%` búsqueda
   previa online, `40%` citas fuera de horario — fuente Accenture Health Consumer Survey / Kyruus
   Care Access Benchmark Report), aplicable a salud en general, no solo médicos. Conteo animado
   vía GSAP (extiende el patrón de `gsap-counter.tsx` del Hero), trigger por ScrollTrigger.
3. **Pain points** — 3 líneas (patrón V3: texto + frase en `<strong>`), copy adaptada a
   vocabulario neutro de salud (paciente/consulta/agenda, sin hardcodear "médico"). Stagger
   reveal al entrar en viewport.
4. **Comparison slider genérico-vs-Boreas** — pieza nueva (detalle en §2-§3).

### 2. Comparison slider — librería

Opciones evaluadas:

| Opción | Trade-off |
|---|---|
| **`img-comparison-slider`** (elegida) | Web component, ~4kB gzip, cero deps de framework. Usa `slot="first"`/`slot="second"` — acepta **cualquier contenido JSX**, no solo `<img>` (confirmado en su README/attrs). Wrapper oficial `@img-comparison-slider/react`. |
| `react-compare-slider` (nerdyman) | También acepta contenido arbitrario, zero deps — descartada solo porque el equipo prefirió la opción elegida. |
| React Bits Pro "Comparison Slider" | Requiere licencia de pago ($99-$299 único, pro.reactbits.dev) — descartada, no se compra licencia para este proyecto. |
| `img-comparison-slider` alternativas basadas solo en `<img>` (react-compare-image, etc.) | Descartadas — nuestros dos lados son mini-mockups JSX (mini-hero simulado), no imágenes estáticas. |

Nueva dependencia npm: `@img-comparison-slider/react` — única dependencia nueva del Epic,
justificada porque nada de lo ya instalado soporta comparación drag con slots de contenido React
arbitrario.

**Contenido de cada lado** (mini-hero completo simulado, a escala reducida, dentro de un frame de
navegador falso con barra de 3 dots + url bar):
- **Slot `first` (genérico)**: tipografía default, botón plano, layout deliberadamente mediocre —
  plantilla gris de consultorio genérico.
- **Slot `second` (Boreas)**: reusa tokens reales del Hero (Newsreader, papel cálido,
  `InteractiveHoverButton` a escala reducida).

### 3. Mecánica de scroll-pin (unión con el Hero)

Confirmado con el usuario: el slider asoma bajo el borde inferior del Hero, enmascarado por un
`GradualBlur` (React Bits, `@react-bits`, ya en el registry de `components.json`) que desvanece su
borde superior — visualmente "emerge" del Hero. Al hacer scroll:

1. Estado inicial: slider parcialmente visible al fondo del viewport durante el Hero, borde
   difuminado por `GradualBlur`.
2. Al hacer scroll, el slider se **fija en pantalla** (GSAP ScrollTrigger, `pin: true`) — no se
   mueve con el resto del contenido, que sigue desplazándose debajo/alrededor.
3. Se **suelta** cuando el scroll alcanza el punto donde el slider vive en su posición natural
   dentro del layout de la Sección 2 (`start`/`end` del `ScrollTrigger` calculados contra esa
   posición) — a partir de ahí es un elemento normal del flujo, sin pin.

Este patrón invita al usuario a hacer scroll (el slider "atrapado" en pantalla es la señal de que
hay más contenido interactivo abajo) y refuerza el objetivo "living proof" de capacidad técnica.

### 4. Animación de texto — librerías

| Elemento | Librería | Trade-off |
|---|---|---|
| Títulos / texto grande (headings, heading de pain points) | **React Bits `SplitText`** | Ya en el registry `@react-bits` conectado, reveal por carácter, coherente con el motivo blur/reveal del resto del Epic. |
| Body / letras pequeñas (párrafos, labels de stats, fuente citable) | **Motion Primitives `TextEffect`** | Copy-paste (sin registry MCP propio), usa `motion` (ya instalado) — no agrega dependencia nueva. Efecto más sutil, apropiado para texto pequeño. |

Regla heredada de V3 respetada: nunca dos librerías de animación en el mismo componente — cada
elemento de texto usa una sola.

### 5. Reduced motion

- `prefers-reduced-motion`: `SplitText`/`TextEffect` caen a fade simple sin stagger ni reveal por
  carácter.
- GSAP ScrollTrigger pin se desactiva — el slider aparece directo en su posición final del layout,
  sin scroll-jack.
- Contadores de stats muestran el valor final estático, sin conteo.
- El slider en sí (drag) se mantiene funcional siempre — es interacción del usuario, no motion
  decorativo, y no está cubierto por la regla de reduced-motion.

### 6. Archivos

- `content/problem.ts` — nuevo, tipado (stats, pain points, copy de los dos mockups del slider) —
  mismo patrón que `content/hero.ts`.
- `components/landing/problem-section.tsx` — reescribe el stub actual.
- `components/landing/problem-compare-slider.tsx` — nuevo: wrapper del `img-comparison-slider` +
  los dos mini-mockups + `GradualBlur` + lógica de pin (GSAP ScrollTrigger).
- Reusa `gsap-counter.tsx` para los stats (o se extrae un hook si la lógica diverge).

## Pendientes / bloqueos conocidos

Ninguno — a diferencia de Epic 3.5 (Cal.com), este Epic no depende de cuentas ni recursos
externos del usuario.
