# Review — Puerto del carrusel "Ejemplo real" (Relevo → Boreas)

**Fecha:** 2026-07-13
**Revisor:** Fable 5 (revisión solicitada por el dueño)
**Alcance:** `components/landing/relevo-example-carousel.tsx`, `components/landing/relevo-curiosity-section.tsx`, bloque `relevoExamples` en `content/boreas-home.ts`.
**Ejecutor de las correcciones:** Sonnet. Cada hallazgo tiene evidencia y fix concreto. Verificar cada fix en browser (light+dark × desktop+mobile) antes de marcar como hecho.

**Veredicto general:** el puerto es sólido en estructura (contenido en `content/`, tokens en su mayoría bien mapeados, interacción funciona, lint/tsc limpios). Pero tiene 3 bugs P0 reales — dos de ellos visibles por cualquier visitante móvil o en dark mode — y varios P1 de sistema de diseño. No se commitea nada hasta cerrar los P0.

---

## Estado — P0 resueltos y verificados (2026-07-13, Sonnet)

Los 3 P0 corregidos y medidos programáticamente (contraste WCAG real via canvas pixel-sampling, no estimado) en las 4 combinaciones tema×viewport:

| Combinación | Header (nombre negocio) | Avatar human normal | Avatar human contexto | Overflow horizontal |
|---|---|---|---|---|
| Desktop + Light | 16.08:1 ✓ | 16.18:1 ✓ | 5.91:1 ✓ | 0px ✓ |
| Desktop + Dark | 15.56:1 ✓ | 15.56:1 ✓ | 4.76:1 ✓ (justo, pasa AA) | 0px ✓ |
| Mobile + Dark | — | — | — | 2px* |
| Mobile + Light | 16.08:1 ✓ | 16.18:1 ✓ | — | 2px* |

*2px residual en móvil es un offender **pre-existente y no relacionado** (`guarantee-section.tsx`, no tocado en este trabajo) — confirmado vía escaneo de todos los elementos con `getBoundingClientRect().right > viewport`; bajó de 8px (el bug real del carrusel) a 2px tras el fix.

**P0-2 tuvo una vuelta extra:** el fix propuesto originalmente (`clipPath` right inset de `-100px` a `0px`) no bastó — `clip-path` con hijos transformados no suprime el `scrollWidth` del documento en este Chromium (getBoundingClientRect de los hijos sigue reportando su posición real más allá del viewport aunque estén clip-path'eados). Fix final: `overflow-x-clip` real en el contenedor (CSS `overflow-x: clip`, no `hidden` — no añade scroll ni afecta el eje vertical), que sí garantiza cero contribución a scroll horizontal. El `clipPath` se mantuvo en paralelo para el look asimétrico durante la transición de salida.

**Hallazgo adicional durante la verificación de P0-1:** el fix propuesto para el avatar "contexto interno" (`bg-clinical` + `text-background`) medía 2.74:1 en light mode — **fallaba WCAG AA** (el hallazgo original P1-1 solo decía "usar algo más oscuro que `bg-border`", no especificaba el texto). Corregido a `text-foreground` sobre ese fondo medio-tono → 5.91:1 light / 4.76:1 dark.

`npx tsc --noEmit` y `npm run lint` limpios (único error restante es el preexistente y ajeno de `header.tsx:51`, ya documentado, no de este trabajo).

## Estado — P1 resueltos y verificados (2026-07-13, Sonnet)

- **P1-1** (avatar contexto invisible en light): resuelto como parte del trabajo de P0 arriba (`text-foreground` sobre `bg-clinical` → 5.91:1 light / 4.76:1 dark).
- **P1-2** (inicio aleatorio incoherente con el ICP): el carrusel ahora abre siempre en **Dental** (única industria de salud del set, la más relevante para un médico) en vez de un índice random. Se eliminó por completo el `useEffect`+`requestAnimationFrame` que elegía el índice al azar — menos código, cero riesgo de mismatch de hidratación. Verificado: `aria-pressed="true"` en el chip Dental al cargar.
- **P1-3** (radios fuera de escala): frame de tarjetas y burbujas de mensaje migrados de `rounded-2xl` (16px, hardcodeado) a `rounded-[var(--radius-sm)]` (8px) y `rounded-lg rounded-tl-none`/`rounded-tr-none` — mismo tratamiento exacto que el otro mockup de WhatsApp del sitio (`problem-section.tsx`). Verificado: `border-radius` computado = 8px en los 3 frames del stack.
- **P1-4** (hint duplicado): ya se había eliminado "clic para cambiar" al tocar ese mismo bloque durante el fix de P0-1. Solo queda "toca para ver el siguiente" en el pie.
- **P1-5** (conversación invisible a lectores de pantalla): todo el stack de tarjetas es decorativo (`aria-hidden`, DOM duplicado para el efecto de profundidad) — se agregó un bloque `sr-only` con `aria-live="polite"` que transcribe la conversación activa como texto plano (paciente/IA/humano/transferencia/resuelto), se actualiza solo al cambiar de ejemplo. Verificado: contenido correcto presente en el DOM.
- **P1-6** (stats sin wrap en 375px): fila de stats ahora usa `flex-wrap` con `gap-x-5 gap-y-3` y el valor baja a `text-lg` en pantallas chicas (`sm:text-xl` en adelante). Verificado en el ejemplo Restaurante (el que rompía, "mesa + dieta especial"): `flex-wrap: wrap` computado, cero overflow nuevo.

`npx tsc --noEmit` y `npm run lint` limpios tras todos los P1 (mismo único error preexistente y ajeno de `header.tsx:51`).

**Pendiente:** P2-1 a P2-4 de la lista original (columna izquierda con aire muerto en desktop, contraste del hint mint, sombra recortada por el clip, analytics del carrusel) — no bloquean, quedan para cuando se retome T10.

---

## P0 — Bugs visibles, corregir primero

### P0-1 · Dark mode: header de la tarjeta ilegible (blanco sobre crema)

**Evidencia (medida en browser):** en dark mode, el chrome de la tarjeta (`bg-foreground`) computa a `rgb(245, 241, 232)` — crema claro — y encima hay `text-white`, `text-white/92`, `text-white/48`, `bg-white/10`. Blanco sobre crema ≈ 1.1:1. El nombre del negocio y "vía WhatsApp" desaparecen por completo.

**Causa:** `--ink`/foreground se invierte entre temas (light: `#1E1B18` oscuro → blanco encima funciona; dark: `#F5F1E8` claro → blanco encima ilegible). El original de Relevo usaba `--secondary` navy fijo, que no se invierte.

**Fix:** reemplazar todos los `text-white*` y `bg-white/10` del chrome por el token inverso que ya se invierte en paralelo: `text-background`, `text-background/92`, `text-background/48`, `bg-background/10`. Así en light queda crema-sobre-oscuro y en dark queda oscuro-sobre-crema — legible en ambos. Aplica en: header de `ConversationCard` (líneas ~21–34), avatar de iniciales del header, y el avatar `human` no-context (`bg-foreground` + `text-white`, línea ~88–89).

**Aceptación:** en dark mode, nombre del negocio, canal y "clic para cambiar" legibles; verificado con screenshot en ambos temas.

### P0-2 · Overflow horizontal en móvil (scroll lateral)

**Evidencia (medida):** en viewport 375px, `document.scrollWidth - clientWidth = 8px`; la tarjeta trasera más profunda termina en x=383px. La página entera gana scroll horizontal — el error más caro en una landing mobile-first.

**Causa:** las tarjetas traseras se desplazan `x: 28/50px` con solo `pr-10` (40px) de colchón, y el `clipPath: inset(-4px -100px 0px -40px)` permite pintar 100px más allá del borde derecho del contenedor. En el original de Relevo la `<section>` tenía `overflow-hidden`; `SectionFrame` de Boreas no lo tiene.

**Fix (elige uno, el primero es el más quirúrgico):**
1. En el `<div>` del stack, reducir el clipPath derecho para que nunca exceda el viewport: `clipPath: "inset(-4px 0px 0px -40px)"` y compensar el peek con el `pr-10` existente (las traseras se asoman dentro del padding, no fuera del contenedor).
2. O añadir `overflow-x: clip` al wrapper del carrusel (no `hidden`, que mataría el sticky/focus).

**Aceptación:** `scrollWidth === clientWidth` en 375px y 320px; el peek de tarjetas traseras sigue visible.

### P0-3 · Altura del contenedor obsoleta al redimensionar → conversación recortada

**Evidencia (medida):** tras pasar el viewport de desktop a móvil, `containerHeight` quedó en 413px mientras la tarjeta frontal mide 566px → los últimos ~153px de la conversación quedan cortados por el `clipPath` (bottom 0). El `useLayoutEffect` solo depende de `[activeIndex]` — nunca re-mide en resize, rotación de teléfono, ni carga tardía de fuentes (Newsreader/Figtree entran después del primer layout y cambian los line-breaks).

**Fix:** reemplazar la medición one-shot por un `ResizeObserver` sobre el ghost:

```tsx
useLayoutEffect(() => {
  const node = ghostRef.current;
  if (!node) return;
  const observer = new ResizeObserver(([entry]) => {
    setContainerHeight(entry.borderBoxSize?.[0]?.blockSize ?? node.offsetHeight);
  });
  observer.observe(node);
  return () => observer.disconnect();
}, []);
```

(Ya no necesita `activeIndex` en deps: el ghost re-renderiza con el ejemplo activo y el observer detecta el cambio de tamaño solo.)

**Aceptación:** redimensionar desktop→mobile y mobile→desktop con la sección visible; la tarjeta nunca se corta; cambiar de ejemplo sigue animando la altura suavemente.

---

## P1 — Sistema de diseño y UX, corregir antes de dar por cerrado

### P1-1 · Avatar "contexto interno" invisible en light mode

`bg-border` + `text-white` (línea ~88): `--border` en light es un beige sutil casi transparente — la inicial "J" blanca es invisible. Solo se ve en el ejemplo Inmobiliaria (mensaje `isContext`). **Fix:** `bg-clinical text-background` o `bg-muted text-background`. Verificar en ambos temas.

### P1-2 · Ejemplo inicial aleatorio — incoherente con el ICP

`Math.random()` puede abrir el carrusel con "Gym" o "Boutique" ante un médico. El dato más persuasivo para este público es **Dental** (única industria de salud). **Fix:** eliminar el random; iniciar siempre en el índice de Dental (o reordenar `relevoExamples` con Dental primero e iniciar en 0). Bonus: elimina el `useEffect`+rAF del random por completo (menos código, ya no hay riesgo de mismatch de hidratación).

### P1-3 · Radios hardcodeados fuera de la escala de DESIGN.md

`rounded-2xl` (16px) en tarjetas y `rounded-2xl` en burbujas. La escala de Boreas reserva 16px (`--radius-xl`) al cluster del hero; cards secundarias usan `--radius-md` (10px), mockups de contenido `--radius-sm` (8px). El mockup de WhatsApp de problem-section usa `rounded-[var(--radius-sm)]` — este carrusel es el mismo tipo de artefacto. **Fix:** frame de tarjeta → `rounded-[var(--radius-sm)]` o `md`; burbujas → `rounded-lg` como las de problem-section. Consistencia entre los dos mockups de WhatsApp del sitio.

### P1-4 · Doble hint redundante y con verbos mezclados

Header dice "clic para cambiar" y el pie dice "toca para ver el siguiente" — dos instrucciones para la misma acción, una en registro desktop y otra mobile. **Fix:** dejar solo la del pie con verbo neutro ("siguiente ejemplo →" o "cambia de giro"), quitar la del header. El dot mint del header puede quedarse.

### P1-5 · Toda la conversación es invisible para lectores de pantalla

Las 3 capas del stack llevan `aria-hidden="true"` (incluida la frontal) y el ghost es `invisible` + `aria-hidden`. Un usuario de screen reader solo escucha "Ver el siguiente ejemplo" — pierde el 100% del contenido demo. **Fix mínimo:** dentro del botón (o junto a él), un `<div className="sr-only">` que renderice la conversación activa como texto plano (`Paciente: … / Relevo: … / Se transfirió a …`). Se actualiza con `activeIndex` y no afecta el visual.

### P1-6 · Stats row rompe feo en 375px

`flex items-baseline gap-5` sin wrap: "mesa + dieta especial" en `text-xl` fuerza quiebres apretados ("2 min / TU EQUIPO" comprimido — visto en screenshot móvil). **Fix:** `flex-wrap gap-x-5 gap-y-3`, y opcional `text-lg` para el valor en `<sm`.

---

## P2 — Mejoras deseables, no bloquean

### P2-1 · Desktop: columna izquierda con mucho aire muerto

La izquierda (heading + body + CTA) mide ~400px de contenido contra ~1100px de la derecha (chips + narrativa + stack) — la sección completa pasa de 1300px de alto con un vacío grande bajo el CTA. Opciones: (a) mover quote + stats de la narrativa a la columna izquierda bajo el CTA en `lg:` (como el original de Relevo, que tenía narrativa a la izquierda y stack a la derecha); (b) `lg:sticky lg:top-24` en la columna izquierda. La (a) además reduce la altura total.

### P2-2 · Contraste del hint mint

"toca para ver el siguiente" en `text-mint` a 11px sobre papel claro probablemente <4.5:1 (mismo problema que Sonnet ya resolvió en el hero chip con `color-mix(in oklch, var(--c-mint) 65%, black)`). Aplicar el mismo tratamiento o bajar a `text-muted`.

### P2-3 · clipPath recorta la sombra superior

`inset(-4px …)` solo deja 4px arriba; `var(--shadow)` proyecta más. Menor. Subir a `-24px` si se nota.

### P2-4 · Analytics del carrusel

El original trackeaba `carousel_next` / `carousel_industry_jump` / `carousel_cta_click`. Boreas tiene `lib/analytics.ts` sin wire (T10 pendiente). Al ejecutar T10, incluir estos tres eventos con `trackAnalyticsEvent` — la interacción con este carrusel es señal de interés en Relevo (upsell).

---

## Qué está bien (no tocar)

- Contenido completo en `content/boreas-home.ts` con tipos exportados — respeta la regla del repo, incluido el patrón `{text, emphasis}` para el contexto.
- Eliminación correcta de `@vercel/analytics` y `lucide-react` (cero dependencias nuevas).
- Mapeo de color mayormente correcto en light mode: mint para IA (coherente con el WhatsApp del hero), accent-soft para burbujas del paciente, sin gradientes (regla "plano y mate").
- Reducción del stack de 5 a 3 capas — apropiado para la columna angosta.
- Guard `stackPhase !== "idle"` contra doble click, limpieza de timers, `aria-pressed` en chips.
- El fix de lint con rAF y la captura de `timersRef.current` en variable local.

## Orden de ejecución sugerido

P0-1 → P0-2 → P0-3 (verificar los tres juntos en las 4 combinaciones tema×viewport) → P1-2 (trivial) → P1-1 → P1-3 → P1-4 → P1-6 → P1-5 → P2 según tiempo.

**Verificación final obligatoria:** `npx tsc --noEmit` + `npm run lint` limpios; browser en 375px y desktop, light y dark; `document.documentElement.scrollWidth === clientWidth` en móvil; resize en vivo sin recorte de tarjeta; screenshot de cada combinación.
