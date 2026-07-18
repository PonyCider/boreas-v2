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
> internos, scripts de cold call. Eso vive en [`docs/internal/boreas-master.md`](docs/internal/boreas-master.md), **nunca**
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
  (ya unificado — el hero dice "consultorio digital"; verificar con grep antes de dar por hecho
  que no hay regresiones si se toca copy).
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
  > Estado actual del código: orden ya correcto (FAQ antes que Form). `final-cta-section.tsx`
  > sigue existiendo pero huérfano (no se importa en `boreas-landing-sections.tsx`) — ver §7.
- **Prueba antes del pedido:** el visitante debe ver prueba real (reseña/testimonio/demo) **antes**
  de llegar al form. Hoy no hay ninguna — es el hueco #1 de conversión.
- **El form es sagrado:** cada lead debe persistir y disparar notificación. Ya cumplido — ver §6.

---

## 4. Sistema de diseño

> **Fuente canónica dentro de este repo:** [`DESIGN.md`](./DESIGN.md) (rediseño "1c Vivo", junio
> 2026). `DESIGN.md` referencia un handoff externo (`design_handoff_boreas_redesign/README.md`)
> que **no vive en este repo** — si se necesita el detalle pixel-perfect completo, pedirlo aparte;
> no asumir que existe en el checkout. El sistema "dark medical editorial" (teal sobre negro,
> Satoshi, glass/glow en hero) queda **retirado**. Lo que sigue es el sistema vigente.

**Papel cálido + arcilla:** premium, editorial, plano y mate. Light mode por defecto, dark mode
vía toggle (`data-theme="dark"` / clase `.dark`, persistido en `localStorage`). Mobile-first.

### Color (tokens en `app/globals.css` — única fuente)
| Rol | Token | Light | Dark | Uso |
|-----|-------|-------|------|-----|
| Fondo | `--bg-deep`/`--bg-surface`/`--bg-elevated`/`--bg-void` | `#FBF8F3`/`#FFF`/`#F4F1EA`/`#EDE9DF` | `#1B1916`/`#252119`/`#201E1A`/`#131210` | Papel cálido. Nunca blanco/negro puro. |
| Texto | `--ink`/`--ink-muted`/`--clinical` | `#1E1B18`/`#6C675E`/`#9C978F` | `#F5F1E8`/`#A8A192`/`#706A5F` | Cuerpo en `--ink`/`--ink-muted`. |
| **Acción** | `--accent` (arcilla) | `#D2674A` | `#E27F62` | CTA, foco. Único color de acción. |
| **Acentos vivos** | `--c-amber`/`--c-mint`/`--c-lav`/`--c-rose` | ámbar/menta/lavanda/rosa | tonos claros equivalentes | Stats, badges, elementos dinámicos. Sistema deliberado multi-color — **ya no aplica "un solo color" fuera de acción**. |
| WhatsApp | `--whatsapp-green` | igual ambos modos | | Identidad de marca de terceros. Reservado para UI de WhatsApp, nunca acento genérico. |
| Error | `--danger` | `#C0392B` | | Mensajes de error. |
| Líneas | `--line` (sutil) / `--border` (definida) | | | `--line` dividers discretos; `--border` contornos de cards/inputs. |

- **Contraste:** cuerpo ≥4.5:1, texto grande ≥3:1. Placeholders también ≥4.5:1.
- Glass está **desactivado** (`--glass-*` quedan transparentes para compatibilidad, no se usan).

### Tipografía
- **Newsreader** (serif editorial, display: h1–h3, wordmarks, cifras grandes) + **Figtree** (sans, body/UI). Cargadas vía `next/font/google` en `app/layout.tsx`. **Satoshi quedó retirado** — no reintroducir.
- `text-wrap: balance` en h1–h3; `pretty` en prosa larga. Línea de cuerpo 65–75ch.
- Wordmark "Boreas" en Newsreader italic 500 es una excepción deliberada a cualquier límite de tracking/tamaño — es marca, no headline de contenido.
- Escala completa por sección: ver `DESIGN.md` o el handoff.

### Layout
- Mobile-first. Primer viewport muestra la oferta y sugiere la siguiente sección.
- **Filas editoriales, dividers y columnas** sobre cards repetidas.
- Radio por escala (`--radius-xl` 16px solo cluster del hero, `--radius-md` 10px cards secundarias, `--radius-sm` 8px botones/inputs/mockups de contenido, `--radius-pill` 999px badges). **Nunca card dentro de card.**
- Espaciado de sección generoso; distancia de scan razonable en móvil.
- **Disciplina de líneas horizontales:** un `border-t` de `SectionFrame` por sección, un divider de anclaje por bloque. Nunca combinar `divide-y` + `border-y`, ni `border-bottom` por ítem sobre un contenedor con `border-top` — eso genera N+1 líneas para N ítems. Listas de prosa (pain points, bullets) usan espaciado (`gap`/`py-*`), no reglas; las reglas son para filas estructuradas de 2+ columnas (transformación, garantía, FAQ). Detalle en `DESIGN.md → Horizontal line discipline`.

### Glass / motion
- **Glass y glow quedan retirados de todo el sitio, incluido el hero.** `.liquid-header`/`.liquid-menu` ya no existen en `globals.css` — no reintroducir.
- **Motion (actualizado 2026-07-13, directiva del dueño):** la landing es el portafolio visual de
  Boreas — debe demostrar la misma capacidad que la empresa vende. Cada sección lleva motion
  coreografiado y específico a su contenido (set pieces tipo demo), no el mismo fade+translate
  repetido. Esto reemplaza la regla anterior de "motion quieto" como default. Ver detalle y
  ejemplos en `DESIGN.md → Motion Rules` y `docs/handoff/2026-07-13-landing-audit-handoff.md`.
  Siguen vigentes sin excepción: ease-out exponencial (sin bounce/elastic), sin glass/glow
  decorativo, contenido nunca gateado por animación (visible por defecto, la animación realza).
- **`prefers-reduced-motion` obligatorio** en toda animación — no solo saltar el keyframe, dar
  un equivalente estático/instantáneo.
- Ningún efecto de scroll que oculte contenido a crawlers/screenshots.
- **Librería de animación:** framer-motion + CSS es el default del proyecto, pero ya
  no es la única opción permitida — política abierta desde 2026-07-17 (ver
  `DESIGN.md → Animation library policy`), decisión del owner para no bloquear
  herramientas necesarias. El widget `clinic-builder.tsx` (loop de bots IDE con gsap)
  sigue huérfano y sin usarse — pendiente eliminarlo como código muerto (ver §7),
  independiente de la política de librerías.
- Toggle de dark mode: transición `background .28s, color .28s` en `body`.

### Prohibiciones (cross-register)
Side-stripe borders (`border-left/right` de color como acento), gradient text, hero-metric template,
grids de cards idénticas, eyebrow tracked en uppercase sobre cada sección, marcadores 01/02/03 por reflejo,
glass/glow decorativo en cualquier parte del sitio (incluido el hero).

---

## 5. Arquitectura técnica

- **Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 (`@theme inline`) · Newsreader + Figtree
  (`next/font/google`) · framer-motion. Server Actions para el form.
- ⚠️ **Next 16 NO es el Next que conoces.** APIs/convenciones pueden diferir del entrenamiento.
  Lee `node_modules/next/dist/docs/` antes de escribir código nuevo (regla de AGENTS.md).
- **Animación:** framer-motion + CSS es el default; otras librerías (incluido gsap) se
  permiten cuando el caso lo justifica — ver `DESIGN.md → Animation library policy`
  (abierta 2026-07-17). `clinic-builder.tsx` sigue sin importarse desde
  `boreas-hero.tsx`; el archivo es código muerto pendiente de eliminar (§7), aparte de
  la política de librerías.

### Estructura
```
app/            layout, page, globals.css, fonts/, actions/ (server actions)
components/
  hero/         header.tsx, boreas-hero.tsx   (sin glass/glow — retirados del rediseño)
  landing/      una sección = un archivo; SectionFrame en boreas-landing-sections.tsx
  layout/       site-footer.tsx
content/        boreas-home.ts   ← TODO el copy vive aquí, no en JSX
lib/            analytics.ts
public/brand/   logos/lockups
```
- **Regla de copy:** el texto vive en `content/boreas-home.ts`, no incrustado en componentes.
- **Una sección = un archivo** dentro de `components/landing/`, compuesto en `BoreasLandingSections`.
- **Tokens solo en `globals.css`.** Componentes consumen tokens vía clases Tailwind, no hex sueltos.

### Estado de captura de leads
`app/actions/submit-contact.ts` **ya persiste leads en Supabase y notifica por WhatsApp** (CallMeBot)
— no es mock. Este dato estaba desactualizado en versiones previas de este documento.
- `lib/analytics.ts` existe pero **nunca se invoca** → KPIs (CTR, leads, cierres) siguen inmedibles hoy.
- Pendiente antes de mandar tráfico real: llamar `trackAnalyticsEvent` en CTA-click y submit.

---

## 6. Do / Don't (resumen accionable)

**DO**
- Vender resultados, no características. Español claro. "Consultorio digital".
- Prueba real antes del form. Stats con fuente. Un CTA primario por viewport.
- Tokens para color (incluido el sistema de acentos vivos). `reduced-motion` siempre.
- Copy en `content/`. Una sección = un archivo. Leer docs de Next 16 antes de codear.

**DON'T**
- ❌ Precio/escasez públicos. ❌ Jerga técnica como gancho.
- ❌ Hex de color hardcodeado. ❌ Glass/glow en cualquier parte del sitio, incluido el hero. ❌ Side-stripe borders, gradient text.
- ❌ Cards anidadas.
- ❌ Dejar leads sin medir (analytics sigue sin invocarse — ver §7).
- ❌ `divide-y + border-y` juntos en listas de texto, o `border-bottom` por ítem sobre un contenedor con `border-top` — genera N+1 líneas para N ítems. Listas de prosa usan espaciado (`gap`/`py-*`), no reglas. Regla en detalle: `DESIGN.md → Horizontal line discipline`.

---

## 7. Backlog conocido

| Prio | Item | Dónde |
|------|------|-------|
| **P0** | Analytics nunca se llama (`trackAnalyticsEvent` no se invoca en CTA-click/submit) — KPIs inmedibles | `lib/analytics.ts` |
| **P1** | Cero prueba social independiente del mockup de problem-section (testimonios/demo/fuente de stats) | nueva sección + `content/boreas-home.ts` |
| **P2** | `clinic-builder.tsx` huérfano (ya no se importa) — eliminar archivo. gsap en `package.json` ya no aplica para limpieza: es dependencia activa desde 2026-07-17 (Hero wordmark reveal) | `components/hero/clinic-builder.tsx` |
| **P2** | `final-cta-section.tsx` huérfano — decidir si se usa como CTA final tras FAQ o se elimina | `final-cta-section.tsx`, `boreas-landing-sections.tsx` |
| **P3** | Contraste de placeholder (`placeholder:text-muted/70` probablemente <4.5:1) | `contact-form-section.tsx` |
| **P3** | Validación de WhatsApp en el form; `package.json` name=`boreas-v2` | varios |
