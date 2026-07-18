# Boreas V3 Design Context

> Fuente: `design_handoff_boreas_redesign/README.md` (rediseño "1c Vivo", junio 2026) — handoff
> **externo, no incluido en este repo**. Este documento es la versión resumida y canónica para
> uso diario dentro del repo; si se necesitan specs pixel-perfect por sección, pedir el handoff
> completo aparte.

## Design Direction

**Papel cálido + arcilla.** Migración del sistema dark-medical (teal frío sobre negro) a un
sistema editorial cálido inspirado en Claude desktop: fondo crema, acento terracota, tipografía
serif editorial, plano y mate — glass/glow solo como acento puntual, nunca wallpaper decorativo (ver Prohibiciones). Soporta light mode (default)
y dark mode vía toggle.

## Visual System

### Color — tokens en `app/globals.css` (única fuente)

| Rol | Token | Light | Dark | Uso |
|-----|-------|-------|------|-----|
| Fondo | `--bg-deep` / `--bg-surface` / `--bg-elevated` / `--bg-void` | `#FBF8F3` / `#FFFFFF` / `#F4F1EA` / `#EDE9DF` | `#1B1916` / `#252119` / `#201E1A` / `#131210` | Papel cálido. Nunca blanco/negro puro. |
| Texto | `--ink` / `--ink-muted` / `--clinical` | `#1E1B18` / `#6C675E` / `#9C978F` | `#F5F1E8` / `#A8A192` / `#706A5F` | Cuerpo en `--ink`/`--ink-muted`. `--clinical` solo terciario/placeholder. |
| **Acción** | `--accent` (arcilla) | `#D2674A` | `#E27F62` | CTA, foco, links activos. Único color de acción. |
| **Acentos vivos** | `--c-amber` / `--c-mint` / `--c-lav` / `--c-rose` | `#E2A33C` / `#4FB39A` / `#7E86E8` / `#E0617E` | `#EBB45A` / `#5FC4AA` / `#949BF0` / `#EC7791` | Estadísticas, badges, elementos dinámicos. Sistema deliberado multi-color — no es decoración accidental, está mapeado en `@theme inline` como `--color-amber/-mint/-lavender/-rose-acc`. |
| WhatsApp | `--whatsapp-green` | igual en ambos modos | | Identidad de marca de terceros. Reservado para UI de WhatsApp (badges, iconos de chat), nunca como acento genérico ni CTA. |
| Error | `--danger` | `#C0392B` | | Mensajes de error. |
| Líneas | `--line` (sutil) / `--border` (definida) | | | `--line` para dividers discretos; `--border` para contornos de cards/inputs. |

**Estrategia de color**: Committed/Full palette, no Restrained. El acento arcilla carga la
identidad de acción; los 4 acentos vivos son un sistema deliberado para datos y elementos
dinámicos (no se reduce a "un solo color de acento" como en el sistema anterior).

### Tipografía

- **Newsreader** (serif editorial, pesos 300–600 + italic) — display: h1–h3, wordmarks, cifras grandes.
- **Figtree** (sans, pesos 300–700) — body/UI: párrafos, labels, nav, botones.
- Cargadas vía `next/font/google` en `app/layout.tsx`, expuestas como `--font-newsreader` / `--font-figtree`, mapeadas a `--font-display` / `--font-sans` en `@theme inline`.
- **Satoshi quedó retirado.** No reintroducir.
- Escala: Display XL `clamp(2.2rem,5vw,4.6rem)` · Display LG `clamp(1.8rem,3.5vw,3.2rem)` · Display MD `clamp(1.4rem,2.5vw,2.2rem)` · Wordmark italic Newsreader 500 (excepción deliberada a cualquier límite de tracking — es marca, no headline de contenido). Body LG 18px / Base 15px / SM 13.5px, Figtree 400, lh 1.62–1.68. Eyebrow 11px mono uppercase tracking 0.14em (uso puntual, no por sección — ver Prohibiciones).

### Radio y sombra

```
--radius-xl: 16px   cards principales (hero card cluster)
--radius-md: 10px   cards secundarias, inputs anidados
--radius-sm:  8px   botones, inputs, step markers, mockups de contenido
--radius-pill: 999px badges, chips, toggles
--shadow / --shadow-sm  ver tokens en globals.css (distintos por modo)
```

> Nota: la regla histórica "cards ≤ 8px" del sistema anterior queda reemplazada por esta
> escala de 4 niveles. Usa `--radius-xl` solo para el cluster de cards del hero; cualquier
> mockup o card de contenido (ej. WhatsApp mockup en problem-section) usa `--radius-sm`.

## Layout Rules

- Mobile-first.
- Hero: gradiente cálido sutil (`linear-gradient` con `color-mix` hacia `#FFF8EC`) como base; un acento de glow puntual (fondo con parallax) es aceptable ahí — ver Prohibiciones. Card cluster flotante a la derecha en desktop (oculto en mobile) con animación `float` suave por CSS (no gsap).
- Glass/backdrop-filter y glow/orbes decorativos: ver reglas relajadas en Prohibiciones (acento puntual, no wallpaper). `.liquid-header`/`.liquid-menu` (el sistema "clinical light" del hero anterior) quedaron retirados — no reintroducir esos componentes específicos, aunque la técnica general ya no está prohibida.
- Primer viewport muestra la oferta y sugiere la siguiente sección.
- Filas editoriales, dividers y columnas sobre cards repetidas.
- Cards permitidas para herramientas enmarcadas reales o ítems repetidos — usar la escala de radio de arriba, nunca cards anidadas.
- Espaciado de sección generoso (ver specs por sección en el handoff); distancia de scan razonable en móvil.

### Horizontal line discipline

- `SectionFrame` carries one `border-t border-line` per section. That is the structural separator. Do not add more borders at the same level.
- Within a section: one anchor divider per content block maximum. Never combine `divide-y` + `border-y` (or per-item `border-bottom` stacked on a container `border-top`) on the same list — that produces N+1 lines for N items.
- Prose lists (pain points, bullets, short paragraphs): use spacing (`gap`, `space-y`, `py-*`) not rules. Lines are for structured two-column rows (transformation table, guarantee rows, FAQ entries) where each row genuinely needs a visual boundary — not for separated paragraphs of running text.
- If a block has `border-t` as its anchor, omit `border-b` on the same edge. The closing line is noise.
- This rule holds regardless of which token system is active — it is a usability constraint, not a brand-color decision.

## Motion Rules

> **2026-07-13 update — owner directive, supersedes the old "quiet motion" doctrine below.**
> The landing is Boreas's own portfolio piece: it must visually demonstrate the same
> capability Boreas sells to clients. Every section carries choreographed, section-specific
> motion — set pieces that demonstrate, not decorate. This overrides "motion is quiet" as
> the default; it does not override the anti-slop bans, which stay binding:
> - Ease-out exponential remains the default; a subtle spring/overshoot is allowed only for punctual micro-interactions (see Prohibitions § Easing — relaxed 2026-07-16).
> - Glass/glow allowed only as a punctual accent per section, never decorative wallpaper (see Prohibitions § Glass/glow/gradient — relaxed 2026-07-16).
> - `prefers-reduced-motion` still mandatory on every animation, no exceptions.
> - Content is never gated behind animation — it must exist in the DOM and be visible by
>   default; motion enhances an already-visible element, it doesn't reveal a hidden one.
> - Motion must be specific to what each section reveals — the same fade+translate applied
>   uniformly to every section is the failure mode this update exists to fix.
>
> Reference implementation: `docs/handoff/2026-07-13-landing-audit-handoff.md` (tasks T3, T4).

- No gsap. framer-motion + CSS only, project-wide.
- The hero card cluster is being reworked into a choreographed sequence (was: static CSS `@keyframes float` loop). See handoff T3.
- **gsap is retired.** The previous `clinic-builder.tsx` widget (infinite gsap bot-construction loop) is superseded by the new hero card cluster and should not run. The file is currently orphaned (unused import) — pending removal, see backlog in `GUIDELINES.md`.
- Respect `prefers-reduced-motion` on every animation: provide a static/instant equivalent, not just "skip the keyframe."
- No scroll effects that hide content from screenshots, crawlers, or impatient users.
- Dark mode toggle transition: `transition: background .28s, color .28s` on `body`.

## Conversion Rules

- One primary CTA: "Quiero mi consultorio digital".
- Form submit uses the same action language.
- Confirmation: "Te escribimos por WhatsApp en las próximas 2 horas." (success state replaces the form, check icon in `--c-mint`).
- Relevo never competes with the main CTA.

## Copy Rules

- Plain Spanish.
- "Consultorio digital" everywhere — "clínica digital" is being retired (see `GUIDELINES.md` backlog for remaining occurrences).
- No feature labels as the sell. Translate every technical term into business outcome.
- Labels name what the user recognizes.
- Errors explain what to fix.

## Prohibitions (carried over, still binding)

- No hardcoded color hex outside `globals.css` tokens.
- No side-stripe borders (`border-left/right` of color as accent).
- No mixing gsap + framer-motion in the same component (gsap is retired project-wide; framer-motion is the only animation library in active use).
- No cards anidadas (see radius scale above) — still banned even where the rules below relax: nesting reads as generic/templated, the opposite of the direction those rules exist to serve.
- No visible phase labels on screen ("Fase 1", "Confianza", etc.) — choreography is understood by what elements do, not by tutorial-style narration.

### Glass/glow/gradient — relaxed 2026-07-16 (owner directive)

> Previously fully banned. Now allowed **as a punctual accent at a single moment of
> impact per section** — not as decorative wallpaper repeated throughout. This is a
> narrower rule than "banned," not "anything goes":
> - Glass/backdrop-filter: allowed for one deliberate surface per section at most.
> - Decorative glow/orbs: allowed as an atmospheric background layer (e.g. Hero's
>   parallax background texture), not stacked on every card.
> - Gradient text: allowed on headline-scale text at a moment of impact, not on
>   body copy or repeated UI labels.

### Easing — relaxed 2026-07-16 (owner directive)

> Ease-out exponential (`[0.22, 1, 0.36, 1]`) remains the default for everything.
> A subtle spring/overshoot is now allowed, but only for punctual micro-interactions
> (e.g. a card settling into place) — never a full bounce/elastic keyframe, and never
> the default for section-level reveals.

### gsap — narrow exception, Hero wordmark letter-reveal only, relaxed 2026-07-17 (owner directive)

> "gsap is retired project-wide" stays binding everywhere else. **Narrow, named
> exception:** `components/motion/wordmark-letter-reveal.tsx` (the Hero's "Boreas"
> letter-by-letter reveal) may use gsap's `SplitText` plugin, on the owner's explicit
> choice after being shown the tradeoff (bundle size, dual-engine maintenance cost, vs.
> a robust battle-tested utility for a simple-looking effect that's fussier than it
> looks). Conditions that keep this from becoming precedent creep:
> - gsap lives ONLY inside that one leaf component — it does the character split and
>   stagger-in, nothing else.
> - The "no mixing gsap + framer-motion in the same component" rule still holds at the
>   component-file level: the orchestrating parent (which sequences the hold →
>   move-up → headline reveal, all framer-motion) coordinates with this leaf via a
>   completion callback/ref, never by importing both libraries into one file.
> - Do not cite this entry to justify gsap anywhere else in the codebase — every other
>   component stays framer-motion + CSS only.

### Content gating — narrow exception, Hero intro only, relaxed 2026-07-17 (owner directive)

> The general rule stays binding everywhere else: primary content must exist and be
> visible without requiring scroll. **Narrow, named exception:** the Hero's subcopy,
> CTAs, and doctor card may be revealed by scroll (not visible at rest) as part of the
> wordmark→headline timed intro sequence, on the owner's explicit choice after being
> shown the tradeoff. Conditions that keep this from becoming a precedent creep:
> - Scroll itself is never blocked/locked — the user can always scroll immediately;
>   the intro's own timer never delays or captures scroll input.
> - The wordmark ("Boreas") and H1 headline still reveal automatically on a timer
>   (not gated behind scroll) — only the CTA/subcopy/card wait for scroll.
> - This exception is scoped to the Hero's first-viewport intro only. Do not cite this
>   entry to justify gating content elsewhere in the site.
