# Handoff — Auditoría landing Boreas → plan de ejecución

**Fecha:** 2026-07-13
**Origen:** auditoría CRO (`/cro`) + crítica de diseño (`impeccable`, snapshot en `.impeccable/critique/2026-07-13T06-30-32Z__app-page-tsx.md`, score 27/40) + directivas del dueño.
**Ejecutor previsto:** modelo de implementación (p. ej. Sonnet). Este documento es autocontenido: no necesitas la conversación original.

---

## 0. Reglas de lectura antes de tocar nada

1. Lee `GUIDELINES.md` (fuente única de verdad), `DESIGN.md` y `PRODUCT.md` completos antes de editar código.
2. Este es **Next.js 16** — no es el Next de tu entrenamiento. Lee `node_modules/next/dist/docs/` antes de escribir código nuevo.
3. **Todo el copy vive en `content/boreas-home.ts`**, nunca en JSX.
4. **Tokens de color solo en `app/globals.css`**; los componentes consumen tokens vía clases Tailwind. Cero hex sueltos.
5. Animación: **framer-motion únicamente** (más CSS puro). gsap está retirado — no reinstalar ni importar.
6. `prefers-reduced-motion` es obligatorio en TODA animación nueva.
7. `app/actions/submit-contact.ts` persiste en Supabase y notifica por WhatsApp real (CallMeBot). No hagas submits de prueba casuales; si necesitas probar el form, coordina o mockea la action.
8. No toques `docs/internal/` (confidencial) ni `.next/`.
9. Verifica en browser (dev server `npm run dev`, puerto 3000): light + dark mode, móvil (375px) + desktop, y con `prefers-reduced-motion: reduce`.

---

## 1. Directivas del dueño (contexto de decisión — no negociables)

**D1 — La landing es el portafolio.** Boreas vende páginas que convierten; la landing debe demostrarlo visualmente. El gancho es el atractivo visual; lo funcional convence después. Enriquecer el aspecto visual de **todas** las secciones: más vida, más animación, set pieces tipo demo. Esto **anula** la regla "motion quieto" de `DESIGN.md`/`GUIDELINES.md §4` (ver tarea T1).

**D2 — La sección Transformación habla al dev, no al médico.** Problema viejo arrastrado. Reescritura completa de marco y labels (ver tarea T2).

Límites que SIGUEN vigentes aunque se enriquezca el visual (anti-slop):

- Sin bounce/elastic; ease-out exponencial.
- Sin glass/glow decorativo, sin gradient text, sin side-stripe borders, sin cards anidadas.
- Ningún efecto de scroll que oculte contenido a crawlers (contenido visible por defecto; la animación realza, no gatea visibilidad).
- Motion por sección debe ser **específico a lo que revela**, no el mismo fade+translate reflejo en todo.

---

## 2. Tareas priorizadas

Orden de ejecución recomendado: T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10.

### T1 — Enmendar los docs canónicos ANTES de tocar código

**Dónde:** `GUIDELINES.md` §4 ("Glass / motion") y §6; `DESIGN.md` (sección de motion).
**Qué:**
- Reemplazar la doctrina "Motion quieto: opacity + translate pequeños…" por la nueva dirección: *"La landing demuestra la capacidad visual de Boreas. Cada sección lleva motion coreografiado y específico a su contenido (set pieces tipo demo), manteniendo los bans anti-slop: sin bounce, sin glass/glow, ease-out exponencial, `prefers-reduced-motion` obligatorio, contenido nunca gateado por animación."*
- Corregir dato obsoleto en `GUIDELINES.md` §2 (línea ~47): dice que "hoy el hero dice 'clínica'" — ya no es cierto, el hero dice "consultorio digital". Actualizar la nota.
**Aceptación:** GUIDELINES/DESIGN ya no contradicen las tareas T3/T4; un agente frío que los lea no revertiría el nuevo motion.

### T2 — Reescribir la sección Transformación (copy para el médico) — CRÍTICO

**Dónde:** `content/boreas-home.ts:46-63` (`transformations[]`) y `components/landing/transformation-section.tsx:12-16` (h2 + subcopy).
**Problema:** H2 "Deja de vender una página. Vende el siguiente paso." se dirige a quien VENDE páginas, no al médico. Subcopy "Boreas convierte términos técnicos…" es meta-copy sobre el método. Los labels tachados ("Diseño Web Responsivo / Landing Page", "Calificación de Leads / Filtro de Prospectos", "Call to Action Optimizado") obligan al médico a leer jerga de agencia. Viola GUIDELINES §2 y §6.
**Qué:** reescribir marco + labels dirigidos al médico y su resultado. Los 4 textos de `benefit` actuales SÍ funcionan — consérvalos o ajústalos mínimamente. Elimina el dispositivo "término técnico tachado". Puntos de partida aprobados en auditoría (elige/afina uno):
- H2: "Tu página no es el producto. Es tu filtro de pacientes." / "No te vendemos una página. Te entregamos pacientes decididos." / "Lo que tu consultorio digital hace por ti mientras consultas."
- Labels nuevos en vocabulario del médico: "Tu consultorio en línea" · "El paciente llega convencido" · "Tu asistente deja de filtrar curiosos" · "Un toque y te escriben".
- Subcopy: resultado del médico, no método de Boreas.
**Aceptación:** cero términos de marketing/dev visibles en la sección (ni tachados); un médico sin contexto técnico entiende cada fila; copy en `content/`, no en JSX.

### T3 — Hero: convertir el card cluster en demo viva + versión móvil — CRÍTICO

**Dónde:** `components/hero/boreas-hero.tsx` (todo el `HeroCardCluster`, líneas 11-201).
**Problemas:** (a) cluster estático — tres chips con loop `float` de CSS; no demuestra nada; (b) `hidden lg:block` → **en móvil el hero es solo texto**, y el ICP busca desde celular; (c) construido con `style={{}}` inline y valores hardcodeados (`#2a8068`, `rgba(79,179,154,…)`, `#fff`) — viola regla de tokens; (d) rating 4.9 en `boreas-hero.tsx:106` vs 4.8 en `content/boreas-home.ts:175`.
**Qué:**
1. Coreografía narrativa con framer-motion (~10–15 s, loop suave): p. ej. estrellas de la reseña se llenan → llega mensaje de paciente ("11:47 PM") → el consultorio responde → chip "3 citas hoy" incrementa. Una miniatura del producto haciendo su trabajo. Dirección aprobada por el dueño; tienes libertad creativa dentro de los bans de §1.
2. Versión móvil propia (no el cluster desktop encogido): stack compacto o secuencia vertical con la misma narrativa. El hero móvil NO puede quedar solo-texto.
3. Migrar estilos inline a clases Tailwind + tokens de `globals.css`. Si falta un token (p. ej. verde WhatsApp suave), créalo en `globals.css`, no inline.
4. Unificar rating: usa el dato de `content/boreas-home.ts` (una sola fuente); decide 4.8 y que el componente lo importe.
5. Etiquetar el card como ejemplo (ver T7).
**Aceptación:** hero móvil tiene elemento visual demo; la secuencia corre en desktop y móvil; con `prefers-reduced-motion: reduce` se muestra estado final estático completo; cero hex/rgba hardcodeados en el componente; rating único importado de content.

### T4 — Motion por sección (toda la página)

**Dónde:** todas las secciones en `components/landing/*.tsx`.
**Problema:** hoy toda sección usa el mismo fade+translate. Reflejo uniforme = página inerte.
**Qué:** motion específico por sección, ligado a lo que revela. Sugerencias (libertad creativa dentro de bans):
- Problem: los 3 stats cuentan hacia arriba al entrar en viewport; pain points aparecen en secuencia con pausa.
- Social proof (WhatsApp mockup): los mensajes del chat aparecen uno a uno como conversación real, "Sin respuesta · 9:12 AM" aparece al final con peso.
- Transformación: cada fila revela label → beneficio en dos tiempos.
- Proceso: los 3 pasos se encadenan (01 termina → 02 empieza).
- Form: reveal sobrio — es la zona de conversión, no distraer.
**Aceptación:** ninguna sección comparte la misma receta exacta de entrada; contenido visible sin JS/animación (realce, no gate); reduced-motion muestra todo estático; 60fps (solo transform/opacity para lo continuo).

### T5 — Unificar tipografía display

**Dónde (h2 sans a migrar):** `transformation-section.tsx:12`, `guarantee-section.tsx:12`, `faq-section.tsx:9`, `contact-form-section.tsx:21`, `relevo-curiosity-section.tsx:12`, y heading de `social-proof-section.tsx:114`.
**Problema:** problem/process usan Newsreader serif 400 (clamp →4.75rem) y el resto Figtree sans 600 (clamp →3.8rem). Dos voces sin regla. DESIGN.md manda serif en h1–h3.
**Qué:** migrar todos los h2 al registro serif de problem-section (Newsreader 400, tracking -0.016em, escala consistente). Idealmente extraer una clase compartida (p. ej. `.display-h2` en `globals.css` o clase Tailwind compuesta) y usarla en todas las secciones.
**Aceptación:** todos los h2 de sección comparten familia, peso y escala; cero `font-semibold` en h2 de sección.

### T6 — Consistencia CTA + nav

**Dónde:** `components/hero/header.tsx:138` y `:197` (CTA "Quiero mi consultorio" → canónico "Quiero mi consultorio digital"); `header.tsx:8-10` nav labels.
**Qué:** CTA al texto canónico exacto. Nav: "Prueba" es ambiguo — renombrar a algo inequívoco ("Lo que pasa hoy", "La prueba" o "Resultados"; decide con criterio, máx 2 palabras). "Confianza" → considerar "Garantía" (apunta a #garantia). Opcional recomendado: header CTA aparece solo tras scroll (~600px) para no competir con el CTA del hero en el primer viewport (GUIDELINES §3: un CTA primario por viewport).
**Aceptación:** texto CTA idéntico en header/hero/form; labels de nav describen su destino sin ambigüedad.

### T7 — Honestidad de la prueba (persona ficticia)

**Dónde:** hero card (`boreas-hero.tsx`) y mockup de social-proof (`social-proof-section.tsx` + `boreas-home.ts:172-180`).
**Problema:** "Dra. Sofía Ramírez" es ficticia pero se presenta como reseña real. Un médico real puede googlearla → destruye confianza.
**Qué:** etiqueta visible pero discreta tipo "Ejemplo ilustrativo" / "Demostración" en ambos mockups (badge pequeño, token `--ink-muted`). NO inventar más credenciales. Cuando exista primer cliente real, se sustituirá (fuera de alcance de este handoff).
**Aceptación:** ambos mockups llevan la etiqueta visible en light/dark y móvil/desktop.

### T8 — Stats con fuente visible en todas partes

**Dónde:** `components/landing/problem-section.tsx` (stats 84%/3×/40%) y chip "84%" del hero.
**Problema:** GUIDELINES §2 exige fuente citable en toda stat mostrada; hoy solo social-proof la renderiza (`statsSources` en `boreas-home.ts:168`).
**Qué:** añadir línea de fuentes (mismo patrón discreto que social-proof) bajo los stats de problem-section; en el chip del hero basta un title/aria o nota al pie del cluster. Si una stat no tiene fuente real en `statsSources`, quítala (regla dura de GUIDELINES).
**Aceptación:** ninguna stat visible sin fuente citable renderizada o accesible.

### T9 — Relevo: reencuadrar heading

**Dónde:** `components/landing/relevo-curiosity-section.tsx:12` (+ copy en `content/boreas-home.ts` si está ahí; si el copy está en JSX, muévelo a content).
**Problema:** "¿Ya tienes tu página web?" al final de una página que vende páginas confunde/descalifica al visitante que ya scrolleó todo.
**Qué:** reencuadre como siguiente capa sin pregunta descalificadora, p. ej. "Cuando tu consultorio ya tiene demanda, Relevo contesta por ti." Mantener discreto: Relevo nunca compite con el CTA principal (GUIDELINES §2).
**Aceptación:** heading no descalifica al lector principal; sección sigue en voz baja al final.

### T10 — Higiene técnica (backlog conocido, cerrar de paso)

1. **Analytics (P0 de GUIDELINES):** invocar `trackAnalyticsEvent` (`lib/analytics.ts`) en click de CTA primario (hero, header, form submit) y en submit exitoso. Sin esto, nada de lo anterior es medible.
2. **Huérfanos (P2):** eliminar `components/hero/clinic-builder.tsx` y la dependencia `gsap`/`@gsap/react` de `package.json` (`npm uninstall gsap @gsap/react`). Decidir `final-cta-section.tsx`: si T4/T6 no lo rescatan como CTA final post-FAQ, eliminarlo también.
3. **Form (P3):** validación de formato WhatsApp (10+ dígitos, prefijo +52 tolerante) con error en español que explique qué corregir; subir contraste de placeholder a ≥4.5:1 (hoy `placeholder:text-muted/70`); microcopy de privacidad junto al submit ("Solo usamos tus datos para contactarte por WhatsApp.").
**Aceptación:** eventos visibles en el destino de analytics al hacer click/submit; `npm run build` limpio sin gsap; form rechaza WhatsApp inválido con mensaje claro; contraste verificado.

---

## 3. Verificación final (obligatoria antes de dar por terminado)

1. `npm run lint` y `npm run build` limpios.
2. Browser en 375px y 1280px, light y dark: recorrer la página completa; screenshot de cada sección.
3. `prefers-reduced-motion: reduce`: toda la página legible y completa sin animación.
4. Grep de regresiones: `grep -rn "clínica digital" components content` (cero resultados); cero hex hardcodeados nuevos fuera de `globals.css`; "Quiero mi consultorio digital" idéntico en las 3 ubicaciones.
5. No commitear `docs/internal/` ni datos sensibles. Commits pequeños por tarea (T1…T10) para revisión.
