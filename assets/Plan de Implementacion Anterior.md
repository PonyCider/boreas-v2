# Boreas V3 — Critique del Plan Anterior + Plan de Acción Robusto

Este documento aplica la metodología **impeccable critique** al plan de acción anterior, identificando fallas estructurales, de diseño y de narrativa. Luego presenta un plan de acción completamente nuevo, más robusto y alíneado con el [Documento Maestro Boreas](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/assets/Documento%20Maestro%20Boreas.pdf).

---

## PARTE 1: CRITIQUE DEL PLAN ANTERIOR

### Design Health Score (Evaluación del Plan como Diseño de Landing)

| # | Heurística | Score | Problema clave |
|---|-----------|-------|----------------|
| 1 | Visibilidad del estado del sistema | 2 | No se planea ningún indicador de progreso en formularios, ni confirmación post-envío |
| 2 | Correspondencia sistema ↔ mundo real | 2 | El plan dice "evitar tecnicismos" pero el propio plan usa términos como "CTA transaccional", "Auditoría de Confianza", "outreach". No hay copy real redactado |
| 3 | Control y libertad del usuario | 1 | No se planea navegación ancla visible, ni manera de salir del formulario, ni volver al inicio fácilmente |
| 4 | Consistencia y estándares | 2 | Mezcla de componentes heredados de la versión SaaS (MacbookShowcase, ChatUI) sin definir cuáles se eliminan y cuáles se recontextualizan |
| 5 | Prevención de errores | 1 | No se planea validación de formularios, ni estados vacíos, ni manejo de errores |
| 6 | Reconocimiento sobre memoria | 2 | La navegación propuesta (Servicio, El Problema, Proceso, Garantía, Contacto, Relevo) son 6 ítems — aceptable, pero sin jerarquía visible entre ellos |
| 7 | Flexibilidad y eficiencia | 2 | No se planea responsive behavior, ni se menciona mobile-first. La audiencia médica mexicana navega desde el celular |
| 8 | Estética y diseño minimalista | 1 | Se hereda toda la complejidad visual del sitio SaaS sin limpiar. TopographicBackdrop, contour paths SVG, AmbientLights, RotatingHeadline — ninguno tiene relación con el nuevo propósito. Se dice "Supabase dark mode" sin definir un sistema de tokens |
| 9 | Recuperación de errores | 0 | No se planea ningún estado de error ni mensaje de falla |
| 10 | Ayuda y documentación | 1 | No se planea tooltip, hint ni ayuda contextual en formularios |
| **Total** | | **14/40** | **Poor — Se requiere rediseño profundo del plan** |

### Anti-Patterns Verdict

**¿Este plan produciría algo que se vea generado por IA?** Sí. Hay varios tells:

1. **Tiny uppercase tracked eyebrow above every section** (BAN): El código actual de [boreas-landing-sections.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/boreas-landing-sections.tsx) usa `SectionEyebrow` en CADA sección. El plan anterior no menciona eliminar este patrón. Es el scaffold AI más identificable de 2025-2026.

2. **Numbered section markers (01/02/03/04)** (BAN): Los `onboardingSteps` y `playbookPhases` en [boreas-home.ts](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/content/boreas-home.ts) usan este patrón. El plan anterior los hereda sin criticarlos.

3. **Identical card grids** (BAN): Las secciones de `metricCards`, `playbookCards`, y los `onboardingSteps` son grids idénticos de tarjetas con el mismo layout. El plan no propone romper este patrón.

4. **Ghost-card pattern** (BAN): Los cards actuales usan `border border-white/8` + `shadow-[0_24px_80px_rgba(0,0,0,0.18)]` — exactamente el patrón prohibido de border + box-shadow con blur ≥16px.

5. **Over-rounded cards**: `rounded-[2rem]` (32px) en los card containers. La skill marca como ban `border-radius: 32px+` en cards.

6. **Letter-spacing floor violation**: El H1 actual usa `tracking-[-0.075em]` (-0.075em). El piso absoluto de impeccable es `-0.04em`. Los títulos se ven comprimidos.

7. **Paleta "Supabase dark mode" sin profundidad**: El plan dice "Fondo Zinc oscuro + Verde `#3ecf8e`" sin definir un sistema real de tokens. "Verde sobre oscuro para tech" es exactamente el reflex de segunda orden que impeccable advierte ("fintech que no es navy-and-gold → terminal-native dark mode").

### Cognitive Load Issues

- **Formulario de Auditoría + Formulario de Contacto** en la misma página sin jerarquía: el usuario no sabe cuál elegir → decisión de 2 caminos sin guía.
- **6 ítems de navegación** sin agrupación ni jerarquía visual.
- **Secciones heredadas** del sitio SaaS (Problem, Comparison, Mechanism, BentoGrid, Platform, Diagnostic, Guarantee, Trust, FAQ) — son **9 secciones** antes de llegar a Relevo. Demasiada carga para un servicio de una sola página.

### Persona Red Flags

**Jordan (Primera vez, médico)**: Un médico de 45 años, dueño de consultorio privado en Monterrey, viendo la página desde su iPhone después de la última consulta del día.
- La navegación tiene 6 ítems sin jerarquía → confusión sobre dónde hacer clic.
- "Auditoría de Confianza" es jerga de marketing digital que un médico no entiende.
- No hay prueba social visible (ni una sola reseña o número) en el plan.
- No hay imagen de un consultorio, un médico, o algo tangible.

**Casey (Móvil, distraído)**: El mismo médico pero en su celular entre pacientes.
- El plan no menciona mobile-first en absoluto.
- Animaciones GSAP pesadas en scroll van a matar el rendimiento en móvil.
- Formularios sin autofill ni defaults inteligentes.

### Lo que SÍ funciona del plan anterior

1. **La estrategia de Hormozi está bien identificada**: Dream Outcome, Certeza, Tiempo, Esfuerzo. Estos 4 ejes son sólidos.
2. **El posicionamiento Boreas ≠ Relevo está claro**: Boreas vende webs, Relevo es producto separado al final.
3. **La extracción de copy del Documento Maestro** (Bloque 3: Beneficio Vivo) es buena materia prima.

---

## PARTE 2: PLAN DE ACCIÓN ROBUSTO

### Filosofía de Diseño

**Escena física (test de tema dark vs light)**: *Un médico especialista de 42 años, cansado después de un día de consultas, revisando su celular a las 10pm en la cama antes de dormir. La pantalla brilla en la oscuridad del cuarto. Está evaluando si vale la pena invertir en su presencia digital. Necesita sentir profesionalismo y tranquilidad, no agresividad ni complejidad.*

→ **Dark mode justificado**: el contexto nocturno y la fatiga visual lo demandan. Pero no "Supabase terminal green". El verde saturado a las 10pm sobre fondo negro es agresivo.

**Color strategy**: **Committed** — un color identitario lleva el 30-40% de la superficie, pero no es verde terminal.

**Paleta propuesta** (OKLCH, no hex arbitrarios):

| Rol | OKLCH | Hex aprox. | Uso |
|-----|-------|-----------|-----|
| `--bg-deep` | `oklch(0.13 0.005 260)` | `#111318` | Fondo principal |
| `--bg-surface` | `oklch(0.17 0.008 260)` | `#1a1d24` | Cards, paneles elevados |
| `--bg-elevated` | `oklch(0.22 0.01 260)` | `#252830` | Hover, formularios |
| `--ink` | `oklch(0.93 0.005 260)` | `#eceef1` | Texto principal |
| `--ink-muted` | `oklch(0.62 0.01 260)` | `#8b8f98` | Texto secundario (≥4.5:1 contra bg-deep) |
| `--accent` | `oklch(0.72 0.14 175)` | `#3bc9a0` | Acento primario — verde azulado, no "Supabase green" |
| `--accent-soft` | `oklch(0.72 0.14 175 / 0.15)` | — | Fondos tintados con acento |
| `--danger` | `oklch(0.65 0.2 25)` | `#e05545` | Errores, urgencia |

> [!IMPORTANT]
> La paleta NO es "Supabase dark mode" textual. Es una paleta propia de Boreas basada en el mismo ADN (zinc oscuro + verde) pero con identidad diferenciada. El verde es más cálido (hue 175 vs Supabase's ~155) para evitar el reflex "terminal developer dark mode".

**Tipografía**:
- Display/Headings: **Satoshi** (variable, grotesque con personalidad sin ser reflex-reject) o **General Sans**.
- Body: La misma familia, peso regular.
- Clamp max para H1: `clamp(2.4rem, 5vw, 4.5rem)` — nunca más de ~72px.
- Letter-spacing en display: `-0.02em` (dentro del piso de -0.04em).
- `text-wrap: balance` en h1-h3.

**Sin eyebrows repetitivos**: Eliminar `SectionEyebrow` como componente reutilizado en cada sección. Solo se permite un kicker textual máximo en 1-2 secciones donde realmente aporte (ej. la sección de proceso).

---

### Arquitectura de Secciones (Orden Narrativo)

La landing sigue el arco narrativo del Documento Maestro, no el del SaaS anterior:

| # | Sección | Propósito narrativo | Copy anchor del Documento Maestro |
|---|---------|--------------------|------------------------------------|
| 1 | **Hero** | Golpe emocional + promesa | "Consultorio digital abierto 24/7 que refleje tu esencia y te filtre pacientes decididos" |
| 2 | **Credibilidad (Dato duro)** | Validar la urgencia con data | Bloque 2: "84% busca en línea", "3x más conversiones", "40% fuera de horario" |
| 3 | **El Problema** | Dolor que el médico reconoce | "20 mensajes de curiosos que solo buscan precios baratos" vs pacientes que sí agendan |
| 4 | **Transformación (Antes/Después)** | Comparativa visual tangible | Bloque 3: tabla completa de "Término Técnico" vs "Beneficio Vivo" |
| 5 | **Cómo Funciona (Proceso)** | Eliminar miedo al esfuerzo | Bloque 4: Audio de 1 minuto → 3 ejes → entrega en 48-72h |
| 6 | **Garantía + Blindaje** | Destruir objeciones | Bloque 4: PDF de respaldo post-depósito + reseñas de Google Maps integradas |
| 7 | **Formulario de Contacto** | Captura del lead | Formulario único, simple, contextual |
| 8 | **FAQ** | Resolver dudas finales | Reescrito para médicos |
| 9 | **Relevo (Curiosidad)** | Upsell futuro | "¿Ya tienes tu página? Descubre cómo automatizar tus mensajes" → relevo.chat |

> [!WARNING]
> **Se eliminan** del sitio: `BentoGridSection`, `PlatformSystemSection`, `TrustAndProofSection`, `MechanismSectionB`, `MacbookShowcase`, `ChatUI`, `RotatingHeadline`, `DiagnosticCtaSection`. Son artefactos del modelo SaaS que no tienen lugar en un servicio de desarrollo web. Mantenerlos sería sumar ruido sin propósito.

---

### Proposed Changes (Detalle Técnico)

#### Sistema de Diseño

##### [MODIFY] [globals.css](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/app/globals.css)
- Definir CSS custom properties (tokens) con la paleta OKLCH completa.
- Establecer tipografía base: font-family, scale, letter-spacing, line-heights.
- Reset de estilos base para dark mode.
- Definir variables de spacing con escala `4px / 8px / 16px / 24px / 32px / 48px / 64px / 96px`.
- `@media (prefers-reduced-motion: reduce)` a nivel global.

##### [MODIFY] [layout.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/app/layout.tsx)
- Cambiar la fuente de Geist a Satoshi (o General Sans) via Google Fonts / local.
- Actualizar metadata: title, description, og tags para el nicho médico.

---

#### Componentes a Modificar

##### [MODIFY] [header.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/hero/header.tsx)
- Navegación reducida a **4 ítems máximo**: El Problema · Proceso · Garantía · Contacto.
- Logo "Boreas" a la izquierda, CTA "Quiero mi web" a la derecha.
- Sticky con backdrop-blur sutil (no glassmorphism decorativo — uso funcional, permitido).
- Mobile: hamburger que colapsa en drawer.

##### [MODIFY] [boreas-hero.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/hero/boreas-hero.tsx)
- **Eliminar**: `TopographicBackdrop` (SVG contour paths), `AmbientLights` (3 divs animados decorativos), `RotatingHeadline`, `MacbookShowcase`.
- **H1**: Copy directo del Documento Maestro Bloque 1: *"Tu consultorio. Abierto las 24 horas. Sin descanso."* — sin rotación, sin animación de palabras.
- **Subcopy**: *"Diseñamos tu espacio digital profesional en 48 a 72 horas. Sin formularios, sin redacción. Solo un audio de un minuto."* (Bloque 1 + Bloque 4 combinados).
- **CTA principal**: Botón que scrollea al formulario de contacto. Texto: *"Quiero mi consultorio digital"*.
- **CTA secundario**: Link discreto que scrollea a "El Problema" para los que necesitan más información.
- **Dato de credibilidad inline**: *"El 84% de tus pacientes te busca en línea antes de agendar."* (Bloque 2).
- **Motion**: Una sola entrada suave del H1 + subcopy (opacity + translateY, 600ms, ease-out-quart). Sin parallax, sin scroll-linked blur. Respeta `prefers-reduced-motion`.
- **Eliminar sticky behavior** del hero: la versión anterior tiene `min-h-[155svh]` con un div sticky interno — esto es sobreingeniería para una landing de servicio.

##### [MODIFY] [problem-section.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/problem-section.tsx)
- Reescribir completamente.
- **H2**: *"Tu agenda no está vacía por falta de pacientes."* (se mantiene, es bueno).
- **Subcopy**: *"Está vacía porque los pacientes llegan, preguntan por WhatsApp... y mueren esperando mientras tu asistente contesta 20 mensajes de curiosos que solo buscan precios baratos."* (Bloque 3 integrado).
- **Visual**: En lugar de burbujas de chat ghost, usar una composición asimétrica con los 3 datos duros del Bloque 2 como piezas de texto grandes con el número destacado:
  - `84%` busca en línea antes de agendar
  - `3×` más contactos con web propia vs redes sociales
  - `40%` de consultas ocurren fuera de horario
- Sin cards idénticas. Layout asimétrico: un dato grande a la izquierda, dos más pequeños apilados a la derecha.

##### [NEW] [transformation-section.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/transformation-section.tsx)
- **Nueva sección** que reemplaza `comparison-section.tsx`.
- Tabla visual antes/después usando el Bloque 3 completo del Documento Maestro:
  - "Diseño Web Responsivo" → "Tener tu consultorio, con tu tono y esencia, pero en línea."
  - "Filtro de Confianza" → "Hacer que el paciente que ya vio tus estrellas dé el paso firme."
  - "Calificación de Leads" → "Ahorrarle tiempo a tu asistente filtrando curiosos."
  - "Call to Action Optimizado" → "Un botón que conecta al paciente con tu WhatsApp en un toque."
- **No usar dos columnas idénticas**. Usar un layout de lista con la etiqueta técnica tachada o en color muted, y el beneficio vivo en texto prominente debajo.

##### [NEW] [process-section.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/process-section.tsx)
- Reemplaza `HowItWorksSection` con los pasos onboarding del Bloque 4.
- **Aquí sí se justifican números** porque ES una secuencia real:
  1. *"Nos envías un audio de 1 minuto"* — Foco comercial, atmósfera visual, diferenciador real.
  2. *"Diseñamos tu consultorio digital"* — En 48-72 horas, con redacción profesional.
  3. *"Lo conectamos a tu Google Maps y WhatsApp"* — Un toque para que el paciente te contacte.
- Solo 3 pasos (no 4). El cuarto paso del plan anterior ("Empezamos a medir") no aplica a este servicio.
- Layout: timeline vertical o stepper, no cards grid.

##### [NEW] [guarantee-section.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/guarantee-section.tsx) (reescritura completa)
- Del Bloque 4: "Blindaje Psicológico":
  - **Garantía 1**: *"Recibes un documento de respaldo inmediato"* — PDF ejecutivo que valida la decisión.
  - **Garantía 2**: *"Tus propias reseñas integradas"* — Se extraen las mejores reseñas de Google Maps y se muestran en el diseño.
  - **Garantía 3**: *"Entrega en 48-72 horas o no pagas"* (si aplica como promesa real).
- Sin el patrón de card grid. Usar una composición vertical con espaciado generoso.

##### [NEW] [contact-form-section.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/contact-form-section.tsx)
- **Un solo formulario**, no dos. Eliminar la ambigüedad de "Auditoría" vs "Contacto".
- Campos mínimos:
  - Nombre (text)
  - Especialidad médica (text o select con opciones comunes)
  - WhatsApp (tel, con validación)
  - Link a Google Maps de tu consultorio (url, opcional)
- CTA: *"Quiero mi consultorio digital"*
- Post-envío: pantalla de confirmación con mensaje claro: *"Listo. Te escribimos por WhatsApp en las próximas 2 horas."*
- Validación inline, no post-submit.
- `autocomplete` attributes en cada campo.
- Touch targets ≥44px.
- Font-size ≥16px en inputs (prevenir zoom en iOS).

##### [NEW] [relevo-curiosity-section.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/landing/relevo-curiosity-section.tsx)
- Sección final antes del footer.
- Copy: *"¿Ya tienes tu página web? Descubre cómo automatizar tus mensajes y agenda."*
- CTA: *"Descubre Relevo"* → botón que expande un panel descriptivo inline (no modal, no nueva página).
- Panel expandido: breve explicación de Relevo + botón externo *"Ir a Relevo.chat"* → `https://relevo.chat`.
- Sin simulador de MacBook. Relevo se vende en su propio dominio.

##### [MODIFY] [site-footer.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/components/layout/site-footer.tsx)
- Footer minimalista: Logo Boreas + "© 2026" + link a contacto.

##### [MODIFY] [page.tsx](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/app/page.tsx)
- Nuevo orden de componentes:
```tsx
<Header />
<Hero />
<ProblemSection />         // Dolor + datos duros
<TransformationSection />  // Antes/Después (Bloque 3)
<ProcessSection />         // 3 pasos (Bloque 4)
<GuaranteeSection />       // Blindaje (Bloque 4)
<ContactFormSection />     // Formulario único
<FaqSection />             // Reescrito
<RelevoCuriositySection /> // Upsell final
<SiteFooter />
```

##### [MODIFY] [boreas-home.ts](file:///Users/ponycider/Documents/SaaS/Boreas%20V3/content/boreas-home.ts)
- Reescribir completamente con copy real extraído del Documento Maestro.
- Eliminar: `heroWords`, `platformLayers`, `playbookPhases`, `playbookCards`, `comparisonFlows`, `verticals`, `metricCards`.
- Añadir: `transformations` (tabla Bloque 3), `processSteps` (3 pasos Bloque 4), `guarantees` (blindaje Bloque 4), `faqs` (nuevas para médicos).

##### [DELETE] Componentes obsoletos
- `components/hero/chat-ui.tsx` — no aplica
- `components/hero/macbook-showcase.tsx` — no aplica
- `components/hero/rotating-headline.tsx` — no aplica
- `components/landing/bento-grid-section.tsx` — patrón de card grid
- `components/landing/comparison-section.tsx` — reemplazado por `transformation-section.tsx`
- `components/landing/diagnostic-cta-section.tsx` — reemplazado por `contact-form-section.tsx`
- `components/landing/mechanism-section-b.tsx` — no aplica
- `components/landing/platform-system-section.tsx` — no aplica
- `components/landing/trust-proof-section.tsx` — sin prueba social real aún
- `components/analytics/diagnostic-cta-form.tsx` — reemplazado
- `components/analytics/diagnostic-analytics.tsx` — no aplica
- `components/analytics/diagnostic-submit-button.tsx` — no aplica
- `app/actions/` — evaluar si se mantiene o reescribe según nuevo formulario

---

### Motion Plan (Deliberado, no Decorativo)

| Elemento | Animación | Duración | Trigger | Reduced motion |
|----------|-----------|----------|---------|----------------|
| Hero H1 + copy | `opacity: 0→1, translateY: 24→0` | 600ms | Page load | Instant opacity |
| Hero CTA | `opacity: 0→1` | 400ms, delay 200ms | Page load | Instant |
| Datos duros (84%, 3×, 40%) | Stagger reveal con `translateY: 16→0` | 500ms each, 150ms stagger | ScrollTrigger `top: 80%` | Instant |
| Proceso steps | Timeline progressive reveal | 400ms each, 200ms stagger | ScrollTrigger | Instant |
| Garantías | Fade in simple | 500ms | ScrollTrigger | Instant |
| Formulario | Ya visible, sin gating | — | — | — |

**Bans de motion**:
- No parallax en ninguna sección.
- No blur-on-scroll.
- No scale transforms en scroll.
- No topographic SVG background.
- No floating ambient lights.
- Ease: `ease-out-quart` o `[0.22, 1, 0.36, 1]` (ya usada en el proyecto).

---

### Verification Plan

#### Automated
- `npm run build` — compilación sin errores TypeScript.
- `npm run lint` — sin warnings de eslint.

#### Manual
- **Mobile-first**: Probar en viewport 375px (iPhone SE) antes que en desktop.
- **Contrast check**: Verificar que `--ink-muted` contra `--bg-deep` cumpla ≥4.5:1.
- **Touch targets**: Todos los botones y inputs ≥44px de altura.
- **iOS zoom**: Verificar que inputs con font-size ≥16px no disparen auto-zoom.
- **Formulario**: Submit → confirmación visible → datos capturados correctamente.
- **Reduced motion**: Verificar con `prefers-reduced-motion: reduce` activado.
- **Lighthouse**: Score de Performance ≥90 en mobile (eliminar GSAP/Framer Motion innecesarios).
