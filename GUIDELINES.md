# Boreas V3 — Guidelines del proyecto

> **Fuente única de verdad.** Si entras a esta carpeta, lee esto primero. Resuelve qué es
> el proyecto, cómo se escribe, cómo se ve, cómo convierte y cómo está construido.
> Complementa (no reemplaza) a [`PRODUCT.md`](./PRODUCT.md) (negocio/copy), [`DESIGN.md`](./DESIGN.md)
> (sistema visual) y [`AGENTS.md`](./AGENTS.md) (reglas para agentes). Si hay conflicto entre
> docs, **gana este archivo** y hay que arreglar el otro.

---

## 1. Qué es Boreas

Agencia de presencia digital para **médicos privados en México**. No vendemos "una página web":
vendemos un **consultorio digital abierto 24/7** que filtra, convence y agenda pacientes — un
filtro de confianza que convierte la primera búsqueda en línea en un contacto directo por WhatsApp.

- **Fase del negocio:** 0→1. La prioridad absoluta es **el primer cierre**, no la perfección.
- **Entrega:** 48–72 h. **Esfuerzo del médico:** un audio de WhatsApp de 1 minuto. Nada más.
- **Upsell secundario:** Relevo (relevo.chat, IA para WhatsApp+agenda). Aparece al final, en voz baja.

### Oferta Hormozi (los 4 ejes)
- **Dream outcome:** consultorio digital 24/7 con su esencia, que filtra pacientes decididos.
- **Certeza:** su reputación de Google Maps, reseñas reales, redacción médica profesional.
- **Tiempo:** entrega en 48–72 h.
- **Esfuerzo:** un audio de 1 min. Sin formularios, sin redactar, sin trabajo técnico.

### ICP
Consultorio particular (no hospitales/IMSS/ISSSTE), Google Maps ≥4.3★ con actividad reciente,
sin web o con web rota, en zona metropolitana o capital.

> **Confidencial — no público:** precios, anticipos, "modelo mensualidad", scraping/Apify, KPIs
> internos, scripts de cold call. Eso vive en `assets/Boreas_Documento_Maestro_Uso_Interno`, **nunca**
> en la página ni en commits públicos.

---

## 2. Voz y copy

- **Español primero.** Claro antes que ingenioso. Calmado, profesional, directo.
- **Vocabulario del médico:** agenda, pacientes, WhatsApp, Google Maps, reseñas, **consultorio**.
- **Traduce cada término técnico a resultado de negocio.** Nunca vendas la característica.
  (Ver `content/boreas-home.ts → transformations[]` como referencia canónica del patrón.)
- **Errores explican qué arreglar**, no códigos ni "algo salió mal".

### Reglas de copy duras
- ✅ Usar **"consultorio digital"** en todo el sitio. ❌ **No mezclar con "clínica digital"**
  (hoy el hero dice "clínica" — corregir; es la única excepción y debe unificarse a "consultorio").
- ❌ No mostrar precio público, escasez semanal, ni "último lugar".
- ✅ Urgencia atada a comportamiento del paciente: noches, fines de semana, búsqueda previa.
- ✅ Toda estadística mostrada (84%, 3×, 40%) **debe tener fuente citable** o se quita.

### CTA canónico
- Primario: **"Quiero mi consultorio digital"** (mismo texto en hero, header y submit del form).
- Confirmación post-form: **"Te escribimos por WhatsApp en las próximas 2 horas."**
- Relevo nunca compite con el CTA principal.

---

## 3. Reglas de conversión

- **Un solo CTA primario por viewport.** El secundario del hero ("Ver cómo funciona") es un
  ancla de navegación, no una segunda oferta — mantenerlo discreto.
- **Orden objetivo de secciones:** Hero → Problema → Transformación → Proceso → Garantía →
  **FAQ → Form/CTA final** → Relevo.
  > Estado actual del código: el Form va **antes** que la FAQ y no hay CTA tras la FAQ
  > (`final-cta-section.tsx` existe pero está huérfano). Pendiente reordenar — ver §7 backlog.
- **Prueba antes del pedido:** el visitante debe ver prueba real (reseña/testimonio/demo) **antes**
  de llegar al form. Hoy no hay ninguna — es el hueco #1 de conversión.
- **El form es sagrado:** cada lead debe persistir y disparar notificación. Hoy es mock (§6).

---

## 4. Sistema de diseño

Dark medical editorial: premium, calmado, legible de noche, con luz clínica suficiente para no
parecer un dark-SaaS genérico. Mobile-first.

### Color (tokens en `app/globals.css` — única fuente)
| Rol | Token | Uso |
|-----|-------|-----|
| Fondo | `--bg-deep` / `--bg-surface` / `--bg-elevated` | Off-black con tinte frío. Nunca negro puro. |
| Texto | `--ink` (alto contraste) / `--clinical` / `--ink-muted` | Cuerpo en `--ink`/`--clinical`. |
| **Acción/prueba** | `--accent` (teal, hue ~174) | CTA, foco, señales de prueba. **Un solo teal.** |
| **Glow decorativo** | `--glow-clinic` (verde salvia, hue ~154) | Glow/orbes del hero. **Decorativo, no acción.** |
| Error | `--danger` | Mensajes de error. |
| Líneas/glass | `--line`, `--glass-*` | Dividers, superficies glass. |

> **Regla de los dos verdes:** `--accent` (teal) y `--glow-clinic` (salvia) son roles distintos
> y **deben venir de tokens**, nunca hardcodeados. Hoy el hero riega `rgba(119,168,139)` y
> `oklch(0.68 0.08 154)` en hex sueltos — migrarlos a `--glow-clinic`. Acción nunca usa el salvia;
> decoración nunca usa el teal como si fuera CTA.

- **Contraste:** cuerpo ≥4.5:1, texto grande ≥3:1. **Placeholders también ≥4.5:1**
  (hoy `placeholder:text-muted/70` probablemente falla — subir).

### Tipografía
- **Satoshi local** (`app/fonts`), una familia, jerarquía por peso/escala/spacing.
- `text-wrap: balance` en h1–h3; `pretty` en prosa larga. Línea de cuerpo 65–75ch.
- **Límites:** display clamp max ≤ 6rem; letter-spacing piso ≥ -0.04em.
  > El wordmark "Boreas" del hero hoy usa max 13.5rem y tracking -0.055em (fuera de límite) y
  > además duplica el logo del header + el h1 → triple branding. Pendiente acotar — ver §7.

### Layout
- Mobile-first. Primer viewport muestra la oferta y sugiere la siguiente sección.
- **Filas editoriales, dividers y columnas** sobre cards repetidas.
- Cards solo para herramientas enmarcadas reales o ítems repetidos, radius ≤ 8px. **Nunca card dentro de card.**
- Espaciado de sección generoso; distancia de scan razonable en móvil.

### Glass / motion — **decisión Boreas (anula el default de impeccable)**
> Impeccable prohíbe glassmorphism y glow/orbes por defecto. **Boreas los permite como sistema
> de marca deliberado en el hero** — es la identidad "clinical light", no decoración accidental.
- ✅ Permitido: `liquid-header`, glow blobs — **confinados al hero/header**, derivados de tokens, suaves.
- ❌ Fuera del hero/header: nada de glass/glow decorativo. El resto del sitio es editorial plano.
- **Motion quieto:** opacity + translate pequeños; ease-out exponencial, sin bounce.
- **`prefers-reduced-motion` obligatorio** en toda animación (ya implementado en `globals.css`).
- Ningún efecto de scroll que oculte contenido a crawlers/screenshots.
- ✅ **Hero clinic-builder widget** (`components/hero/clinic-builder.tsx`): override deliberado del
  "motion quieto" — loop animado infinito de bots IDE que construyen el consultorio. Permitido SOLO
  en este widget del hero. Bots usan paleta decorativa (`--bot-amber/-coral/-violet/-cyan`); el teal
  `--accent` sigue reservado a acción/prueba. Animación con **gsap** (única excepción a framer-motion,
  confinada aquí). `prefers-reduced-motion` → frame final estático.

### Prohibiciones (cross-register)
Side-stripe borders (`border-left/right` de color como acento), gradient text, hero-metric template,
grids de cards idénticas, eyebrow tracked en uppercase sobre cada sección, marcadores 01/02/03 por reflejo.
> Hoy presente: `relevo-curiosity-section.tsx` usa `border-l border-accent/40` (side-stripe) — corregir.

---

## 5. Arquitectura técnica

- **Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 (`@theme inline`) · Satoshi local
  (`next/font/local`) · framer-motion. Server Actions para el form.
- ⚠️ **Next 16 NO es el Next que conoces.** APIs/convenciones pueden diferir del entrenamiento.
  Lee `node_modules/next/dist/docs/` antes de escribir código nuevo (regla de AGENTS.md).
- **Animación:** framer-motion por defecto. **gsap** se usa SOLO en `clinic-builder.tsx` (timeline
  del loop del hero) — justificado, confinado, sin solaparse con framer en un mismo componente.

### Estructura
```
app/            layout, page, globals.css, fonts/, actions/ (server actions)
components/
  hero/         header.tsx, boreas-hero.tsx   (único lugar con glass/glow)
  landing/      una sección = un archivo; SectionFrame en boreas-landing-sections.tsx
  layout/       site-footer.tsx
content/        boreas-home.ts   ← TODO el copy vive aquí, no en JSX
lib/            analytics.ts
public/brand/   logos/lockups
```
- **Regla de copy:** el texto vive en `content/boreas-home.ts`, no incrustado en componentes.
- **Una sección = un archivo** dentro de `components/landing/`, compuesto en `BoreasLandingSections`.
- **Tokens solo en `globals.css`.** Componentes consumen tokens vía clases Tailwind, no hex sueltos.

### Estado de captura de leads — **PENDIENTE CRÍTICO**
`app/actions/submit-contact.ts` es un **mock**: solo `console.log` + latencia falsa. **Los leads no
se guardan en ningún lado y no se notifica nada.** En fase 0→1 esto pierde el activo #1 del negocio.
- `lib/analytics.ts` existe pero **nunca se invoca** → KPIs (CTR, leads, cierres) inmedibles hoy.
- Antes de mandar tráfico real: wire persistencia (Supabase/Sheets/webhook) + notificación WhatsApp
  + llamar `trackAnalyticsEvent` en CTA-click y submit. (No tocado en esta sesión por decisión.)

---

## 6. Do / Don't (resumen accionable)

**DO**
- Vender resultados, no características. Español claro. "Consultorio digital".
- Prueba real antes del form. Stats con fuente. Un CTA primario por viewport.
- Tokens para color. Glass/glow solo en hero/header. `reduced-motion` siempre.
- Copy en `content/`. Una sección = un archivo. Leer docs de Next 16 antes de codear.

**DON'T**
- ❌ Precio/escasez públicos. ❌ Jerga técnica como gancho. ❌ "Clínica" (usar "consultorio").
- ❌ Hex de color hardcodeado. ❌ Glass/glow fuera del hero. ❌ Side-stripe borders, gradient text.
- ❌ Cards anidadas. ❌ Mezclar gsap+framer. ❌ Mandar tráfico con el form en modo mock.
- ❌ Dejar leads sin persistir ni medir.

---

## 7. Backlog conocido (del critique impeccable, 26/40)

| Prio | Item | Dónde |
|------|------|-------|
| **P0** | Form mock — leads se pierden; analytics nunca se llama | `app/actions/submit-contact.ts`, `lib/analytics.ts` |
| **P1** | Cero prueba social (testimonios/demo/fuente de stats) | nueva sección + `content/boreas-home.ts` |
| **P1** | Hero contradecía DESIGN.md → resuelto a favor de glass (este doc + DESIGN.md actualizado) | `boreas-hero.tsx`, `DESIGN.md` |
| **P1** | Dos verdes hardcodeados → migrar a `--accent` / `--glow-clinic` (hero visual migrado a `--glow-clinic`; resto de `globals.css` pendiente) | `globals.css`, `boreas-hero.tsx` |
| **P1** | Orden: Form antes que FAQ; sin CTA final; `final-cta-section` huérfano | `boreas-landing-sections.tsx` |
| **P2** | Wordmark fuera de límites tipográficos + triple branding | `boreas-hero.tsx` |
| **P2** | Side-stripe border | `relevo-curiosity-section.tsx:33` |
| **P2** | "clínica" vs "consultorio" en hero | `content/boreas-home.ts:1` |
| **P3** | Contraste de placeholder; validación de WhatsApp; deps gsap sin usar (gsap ahora justificado en clinic-builder); `package.json` name=`boreas-v2` | varios |
