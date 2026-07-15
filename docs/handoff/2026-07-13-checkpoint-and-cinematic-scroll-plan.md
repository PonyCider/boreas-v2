# Checkpoint — landing completa + plan para scroll cinemático

**Fecha:** 2026-07-13
**Para:** sesión nueva, contexto fresco. Este doc reemplaza tener que releer toda la conversación anterior.
**No hay nada commiteado.** Todo lo descrito abajo vive en el working tree. Antes de empezar el scroll cinemático, decide si commiteas/shippeas este estado primero (recomendado — es un checkpoint estable y verificado).

---

## 1. Qué se hizo en esta sesión (resumen ejecutable)

Partiendo de una auditoría completa (`docs/handoff/2026-07-13-landing-audit-handoff.md`), se ejecutaron 10 tareas:

- **T1-T2:** GUIDELINES/DESIGN enmendados para autorizar motion enriquecido (override de "motion quieto"); sección Transformación reescrita a lenguaje del médico (sin jerga de agencia tachada).
- **T3:** Hero card cluster reconstruido — demo animado (no estático), versión móvil propia, tokens en vez de hex hardcodeado, hook compartido `lib/use-animated-number.ts` para todos los count-ups del sitio.
- **T4:** Las 7 secciones estáticas (Problema, Transformación, Proceso, Garantía, FAQ, Form, Relevo) recibieron motion específico por sección vía `framer-motion` (`whileInView`/`variants`) — cada una con receta distinta, FAQ y Form deliberadamente sobrios.
- **T5:** Tipografía display unificada (serif Newsreader en todos los h2 de sección).
- **T6:** CTA canónico consistente + header con CTA que aparece solo tras scroll (evita competir con el CTA del hero en el primer viewport).
- **T7-T8:** Mockups marcados como "Ejemplo ilustrativo"; auditoría de fuentes de todas las estadísticas — una eliminada por falta de fuente real, dos ajustadas a valores verificados.
- **T9:** Sección Relevo reencuadrada (dejó de ser una pregunta descalificadora).
- **Puerto del carrusel "Ejemplo real"** (fuera del plan original, pedido directo): 8 ejemplos dinámicos por industria portados de `relevo.chat`, retinteados a tokens de Boreas — con dos rondas de code review (Fable 5) que encontraron y corrigieron bugs reales de contraste WCAG y overflow horizontal en móvil.
- **T10:** Analytics wireado (`cta_click` en los 3 puntos de CTA primario, `diagnostic_submit`/`diagnostic_result` en el form), código huérfano eliminado (`clinic-builder.tsx` + dependencia `gsap`/`@gsap/react` completa), validación de WhatsApp server-side, contraste de placeholder corregido, microcopy de privacidad agregado, y un bug de lint preexistente arreglado de paso.

**Estado de verificación:** `npx tsc --noEmit` limpio, `npm run lint` limpio (cero errores, cero warnings — primera vez en toda la sesión), `npm run build` exitoso. Analytics confirmado disparando en browser real (no solo código). Validación de WhatsApp probada sin generar leads falsos ni notificaciones reales.

**Pendiente, no bloqueante:** P2 de la review del carrusel — aire muerto en la columna izquierda de Relevo en desktop, contraste del hint mint, sombra recortada por el clip-path, y analytics de interacción del carrusel (requiere decidir si se expande el tipo cerrado `AnalyticsEventName`, no lo hice unilateralmente).

---

## 2. Decisión tomada: scroll cinemático — alcance y secuencia

El dueño pidió scroll cinemático: objetos pineados mientras el fondo se mueve con el scroll, reorganización de elementos por fases a medida que se avanza. Se decidió:

- **Se construye en una sesión nueva, con contexto fresco** — no al final de esta. Motivo: es una arquitectura de motion distinta a la de T4 (scroll-linked, no trigger-por-viewport), necesita mucha verificación visual iterativa, y esta sesión ya viene cargada.
- **Alcance de secciones — todas las "vivas":** Hero, Problema, Prueba social, Transformación, Proceso, Garantía, Relevo. **Excluye FAQ y el formulario de contacto** — se mantienen sobrios a propósito (T4 ya lo decidió por carga cognitiva y para no meter fricción justo antes del cierre; esa razón sigue vigente y no se revisó para el scroll cinemático).
- **Empezar por Hero solamente** (4-5 fases, según lo planteado por el dueño), pulirlo completo, revisarlo, y recién ahí decidir si se extiende al resto — no comprometerse a las 8 secciones de entrada.
- Conteo de fases sugerido por el dueño como ejemplo (no es spec cerrada): Hero 4-5 fases, Prueba social 5-6 fases. El resto queda por definir en la sesión nueva.

## 3. Cómo construirlo — restricciones técnicas ya decididas

- **Framer-motion únicamente** (`useScroll` + `useTransform`, pinning vía `position: sticky`). **gsap NO** — está retirado del proyecto (dependencia eliminada esta sesión, `clinic-builder.tsx` era el único importador). No reinstalar aunque el patrón "objetos pineados" sea el caso de uso clásico de GSAP ScrollTrigger — framer-motion lo resuelve igual de bien con `useScroll({target, offset})`.
- **`prefers-reduced-motion` sigue obligatorio.** El patrón actual (fallback estático instantáneo) no traslada limpio a scroll-linked pinning — con reduced-motion, un usuario no puede "saltarse" una secuencia pineada simplemente saltando el keyframe, porque el contenido está atado a la posición de scroll, no a un timer. Hay que diseñar explícitamente qué significa "reduced motion" para una sección pineada: probablemente colapsar toda la sección a su estado final sin pin (contenido apilado normal, sin sticky, sin scroll-linked transform) en vez de solo acortar duraciones. Esto es una decisión de diseño que la sesión nueva debe resolver por sección, no asumir que el CSS global existente (`app/globals.css`, colapsa `animation-duration`/`transition-duration` a 0.01ms) alcanza — ese mecanismo no cubre transforms atados a `scrollYProgress`.
- **Regla de "un CTA primario por viewport" sigue vigente** dentro de una secuencia pineada — si el hero pinea 4-5 fases, el CTA no debe aparecer/desaparecer de forma que compita consigo mismo o quede ambiguo cuál es el CTA activo en cada fase.
- **Los anti-bans siguen vigentes:** sin bounce/elástico, ease-out exponencial, sin glass/glow decorativo, sin gradient text, sin cards anidadas. El scroll cinemático es permiso para MÁS movimiento y reorganización, no para relajar el resto del sistema de diseño.
- **Mobile no es un afterthought.** Pinned/scroll-linked es notoriamente más frágil en mobile (jank, cambios de viewport height por la barra de direcciones del navegador, física de scroll táctil distinta). Boreas es mobile-first por stats propios (82%/71% del tráfico es móvil, ver GUIDELINES). La sesión nueva debe diseñar el comportamiento móvil de cada fase explícitamente — no heredar el desktop reducido.

## 4. Lo que la sesión nueva SÍ tiene que definir (no está decidido aún)

- **Coreografía exacta por fase, por sección:** qué objeto entra, qué sale, qué se reposiciona, en qué orden, con qué progreso de scroll dispara cada transición. Esto es diseño de motion real, no un ajuste mecánico — recomendado arrancar con una fase de planeación (brainstorming o similar) ANTES de tocar código, sección por sección, empezando por Hero.
- **Presupuesto de profundidad de scroll:** cuánto más alto puede volverse cada sección antes de que el "cierre rápido" (GUIDELINES: "Fase del negocio 0→1, prioridad absoluta es el primer cierre, no la perfección") empiece a sufrir por fatiga de scroll en un médico evaluando si confiar su negocio a Boreas.
- **Historia de reduced-motion específica para pinning** (ver §3 arriba) — necesita resolverse por sección, no asumir el mecanismo genérico actual.
- **Si se toca el header sticky actual** (con su CTA que aparece tras scroll, T6) — un hero pineado con múltiples fases puede necesitar coordinarse con cuándo aparece ese CTA del header, para no competir ni sentirse desincronizado.

## 5. Dónde está todo (mapa rápido para la sesión nueva)

- `GUIDELINES.md` — fuente única de verdad, ya actualizada con el override de motion enriquecido (§4).
- `DESIGN.md` — sistema visual, tokens, escalas.
- `content/boreas-home.ts` — todo el copy, incluido `relevoExamples` (8 ejemplos del carrusel).
- `lib/use-animated-number.ts` — hook compartido de count-up, reutilizable para cualquier número que necesite animarse durante una fase pineada.
- `components/landing/*.tsx` — una sección = un archivo, cada una con su motion actual (T4) que probablemente se reemplace o extienda para las secciones "vivas" listadas en §2.
- `components/hero/boreas-hero.tsx` — hero actual, punto de partida del piloto.
- `docs/handoff/` — esta carpeta acumula todos los handoffs de la sesión (auditoría original, review del carrusel, este checkpoint).
