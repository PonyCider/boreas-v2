# Epic 3 — Teatro de conversión: Implementation Plan

> Diseño aprobado: `docs/superpowers/specs/2026-08-20-epic-3-conversion-theater-design.md`

**Goal:** Convertir `#motores` en un Teatro de conversión que demuestre cómo Boreas transforma una
visita en un paciente preparado, usando el cotizador dental como motor de referencia y dejando un
núcleo portable para sitios de clientes.

**Architecture:** La landing tendrá un escenario narrativo con sticky solo en escritorio, una banda
expandible de seis especialidades y un runtime de motores independiente de presentación y
transporte. El cotizador dental entregará resultado antes de solicitar contacto. Boreas usará un
adaptador demo sin persistencia. La integración real se construirá como una fase separada y no
reutilizará `/api/lead`, que hoy está acoplado a pricing, envía correo antes de persistir y no tiene
idempotencia.

**Tech stack actual:** Next.js 16.2.12, React 19.2.4, TypeScript estricto, Tailwind v4,
`motion/react`, OGL disponible, Zod 4, Drizzle/PostgreSQL, Vitest.

## 0. Estado inicial confirmado

Fecha de preflight: 2026-08-20.

- Rama: `jafet`.
- Cambio presente antes de implementación: spec nuevo
  `docs/superpowers/specs/2026-08-20-epic-3-conversion-theater-design.md`.
- `npm test`: 10 archivos, 89 pruebas, todas pasan.
- `npx tsc --noEmit`: pasa.
- `npm run build`: pasa fuera del sandbox; Turbopack necesita abrir un puerto local durante
  PostCSS y falla dentro del sandbox con `Operation not permitted`.
- Lint focalizado: falla solo por tres errores heredados en `components/ui/option-wheel.tsx`.
- `OptionWheel` solo se consume desde `components/landing/motors-section.tsx`.
- `MotorTransition` solo se consume desde `components/landing/motors-section.tsx`.
- `/motores-preview` ya existe y monta el cotizador actual.
- `/api/lead` es email-first, no persiste antes de responder y no tiene idempotencia. No es base
  adecuada para leads de motores.
- Checkout sí contiene patrones útiles de idempotencia, persistencia y delivery reclamable, pero
  no se debe acoplar el dominio de motores al de pagos.
- `boreas-template` declara cuatro engines reutilizables implementados en la rama
  `worktree-category-mechanism-engines`, todavía sin merge a `main`. Ese trabajo debe auditarse
  antes de crear otro runtime.
- El worktree actual de `boreas-template` está en `main` y contiene cambios ajenos. La auditoría
  será solo lectura mediante `git show`; no se cambia de rama ni se edita ese repositorio.
- La raíz de Boreas carga Vercel Analytics y Speed Insights. “Sin requests del demo” significa que
  el motor dental no envía datos; no significa que la página completa carezca de telemetría.
- Agenda carga un iframe real de Cal.com. Es una excepción explícita y no debe confundirse con el
  adaptador demo de los motores de especialidad.

## 1. Reglas globales de ejecución

- Leer el spec aprobado completo al iniciar cada fase.
- No avanzar de fase sin resumen no técnico, evidencia y aprobación del usuario.
- Gate obligatorio: evidencia de fase → aprobación para commit → commit aislado → resumen del
  siguiente alcance → aprobación para iniciar la siguiente fase.
- No mezclar estabilización heredada con mejoras nuevas.
- Mantener `SectionFrame#motores` con tema oscuro fijo.
- No cambiar Hero, Problema, Prueba Social, Pricing o Relevo salvo el enlace existente hacia
  `#motores` y el CTA aprobado hacia `#pricing`.
- No modificar el comportamiento de los otros cinco motores hasta su fase de compatibilidad.
- La landing de Boreas no persistirá leads de motores.
- No ejecutar correos, CRM, WhatsApp, migraciones de producción ni pruebas externas sin explicar
  datos sintéticos y efectos, y obtener aprobación explícita.
- No añadir una dependencia npm sin detenerse, mostrar necesidad y pedir aprobación.
- Usar `motion/react` ya instalado. No añadir otra librería de animación.
- OGL solo puede entrar por la fase opcional y con comparación contra DOM.
- Toda animación requiere equivalente bajo `prefers-reduced-motion`.
- No usar scroll listeners que bloqueen, `preventDefault` sobre wheel ni scroll-jacking.
- No guardar payload clínico en texto plano, URLs, logs, analítica o session replay.
- Staging explícito por archivo. Nunca `git add .` o `git add -A`.
- No borrar `option-wheel.tsx` o `motor-transition.tsx` hasta repetir búsqueda de consumidores.
- Cada fase debe quedar como candidato a un commit aislado. No hacer commit sin aprobación.

## 2. Grafo de dependencias

```text
Fase 0 — Baseline visual y técnico
    ↓
Fase 0.5 — Auditoría cruzada de boreas-template
    ↓
Fase 1 — Contratos, runtime mínimo y harness aislado
    ↓
Fase 2 — Banda expandible y selección estable
    ↓
Fase 3A — Dominio V2 aislado del cotizador dental
    ↓
Fase 3B — Experiencia, contacto demo y dos caras
    ↓
Fase 4A — Estructura narrativa y sticky DOM
    ↓
Fase 4B — Movimiento, responsive y pulido
    ↓
Fase 5 — Spike Canvas/WebGL (opcional, se puede descartar)
    ↓
Fase 6A — Integración reversible con legado disponible
    ↓
Fase 6B — Activación pública controlada
    ↓
Fase 6C — Limpieza heredada posterior a validación
    ↓
Fase 7A.0 — Threat model y protocolo criptográfico
    ↓
Fase 7A.1 — Transporte portable y recuperación cifrada
    ↓
Fase 7B — Backend real de referencia (requiere decisión de repo y datos)
    ↓
Fase 8 — Portar los otros cinco motores, después de validación comercial
```

No hay fases de código seguras para ejecutar en paralelo sobre el mismo worktree: 1–6 comparten el
runtime y el escenario. La investigación visual de Fase 5 puede prepararse mientras se revisa Fase
4B, pero no debe integrarse antes de aprobar la versión DOM.

---

## Fase 0 — Baseline visual, interacción y rendimiento

**Tipo:** diagnóstico sin cambios funcionales.

**Objetivo:** fijar evidencia del estado actual para poder atribuir cada mejora o regresión.

**Contexto para ejecución en frío:** la sección actual vive en
`components/landing/motors-section.tsx`; usa `OptionWheel`, monta un motor a la vez y envuelve el
cambio en `MotorTransition`. El lint heredado falla dentro de `OptionWheel`; no repararlo en esta
fase.

### Acciones

1. Confirmar rama, estado y diff antes de tocar archivos.
2. Leer completos:
   - spec aprobado;
   - spec previo de Epic 3;
   - `motors-section.tsx`;
   - `motor-shell.tsx`;
   - `cotizador-dental.tsx`;
   - `content/motors.ts`;
   - `lib/motors/cotizador-dental.ts` y sus tests.
3. Levantar la landing y `/motores-preview` sin modificar código.
4. Capturar estado actual en 390, 768, 1024, 1440 y 2560 px.
5. Recorrer selector con mouse, trackpad, touch emulado y teclado.
6. Reproducir la desincronización documentada del wheel si todavía existe.
7. Registrar consola, overflow horizontal, altura de sección y comportamiento con movimiento
   reducido.
8. Medir línea base de LCP inicial, tareas largas al llegar a motores y estabilidad durante el
   cambio de especialidad.
9. Guardar el waterfall y los chunks cargados antes de acercarse a `#motores`.
10. Fijar estos presupuestos antes de Fase 1:
    - código exclusivo del teatro y motores ausente del critical path inicial;
    - aumento máximo de 10 KB gzip en JS inicial atribuible al wrapper de integración;
    - precarga del motor dental cerca del viewport, con `rootMargin` inicial de referencia de
      600 px y ajuste basado en medición;
    - otros motores cargados solo al activar o previsualizar con intención;
    - OGL/Canvas en chunk independiente y ausente si se descarta Fase 5.

### Verificación

```bash
npm test
npx tsc --noEmit
npx eslint components/landing/motors-section.tsx components/landing/motors content/motors.ts lib/motors
npm run build
```

El lint de `option-wheel.tsx` se registra aparte como deuda heredada. El build puede requerir
ejecución fuera del sandbox por la apertura de puerto local de Turbopack.

### Entregable y gate

- Informe breve con capturas y métricas.
- Lista exacta de comportamientos que deben preservarse en los cinco motores no rediseñados.
- Aprobación antes de crear el runtime.

### Rollback

No aplica: no modifica implementación.

---

## Fase 0.5 — Auditoría cruzada de `boreas-template`

**Tipo:** solo lectura, sin cambiar el worktree externo.

**Objetivo:** evitar construir un segundo runtime incompatible con los cuatro engines ya
implementados en la rama `worktree-category-mechanism-engines`.

**Contexto para ejecución en frío:** `boreas-template/PRODUCT.md` declara engines de quiz,
calculator, simulator y lead-magnet, más catálogo y resolución. La rama no está mergeada. El
worktree de `boreas-template` está sucio y no se debe cambiar de rama.

### Acciones

1. Leer `PRODUCT.md`, el spec de arquitectura y el plan de engines del template.
2. Inspeccionar la rama sin checkout mediante `git show worktree-category-mechanism-engines:<ruta>`.
3. Inventariar tipos, estado, validación, renderers, catálogo y tests.
4. Identificar cualquier payload `raw`, persistencia de respuestas completas o acoplamiento al
   sitio de cliente.
5. Comparar con los contratos aprobados: minimización, resultado antes de contacto, dos caras,
   consentimiento, idempotencia y transporte intercambiable.
6. Producir una matriz con tres opciones:
   - adaptar el engine del template;
   - migrarlo al nuevo contrato;
   - reemplazarlo, con motivo explícito.
7. Definir la frontera compartida antes de crear archivos en `lib/motors/runtime`.

### Entregable y gate

- Informe de compatibilidad V4 ↔ template.
- Decisión registrada de adaptar, migrar o reemplazar.
- Aprobación antes de Fase 1.

### Rollback

No aplica: no modifica ningún repositorio.

---

## Fase 1 — Contratos, runtime mínimo y harness aislado

**Tipo:** fundación sin cambio en la landing pública.

**Objetivo:** crear el contrato portable y un lugar seguro para iterar sin alterar `#motores`.

**Contexto para ejecución en frío:** el código actual separa lógica pura en `lib/motors`, pero cada
componente controla su estado y `MotorShell` mezcla copy, demo, resultado profesional y upsell. La
arquitectura nueva necesita compartir contratos, no una UI rígida.

### Archivos previstos

- Create: `lib/motors/runtime/types.ts`
- Create: `lib/motors/runtime/state.ts`
- Create: `lib/motors/runtime/state.test.ts`
- Create: `lib/motors/runtime/transport.ts`
- Create: `lib/motors/runtime/demo-transport.ts`
- Create: `content/motor-theater.ts`
- Create: `components/landing/motors/theater/motor-registry.tsx`
- Create: `components/landing/motors/theater/theater-preview.tsx`
- Create: `app/motores-preview/teatro/page.tsx`

Los nombres pueden ajustarse si el código revela una frontera mejor, pero no se debe mover lógica
existente sin necesidad.

### Contratos mínimos

- `MotorDefinition`: metadata pura — identidad, versión, especialidad, etiqueta y resultado
  prometido. No contiene renderer.
- `MotorViewRegistry`: registro React separado, fuera del runtime puro, con imports dinámicos por
  motor.
- `MotorRuntimeState`: unión discriminada completa para `inicio`, `captura`, `resultado-paciente`,
  `contacto`, `enviando`, `confirmado`, `demo-completada`, `pendiente`, `reintentando`,
  `error-recuperable`, `configuración-inválida` y `urgente`.
- `PatientResult`: salida segura para el paciente.
- `SpecialistSummary`: resumen derivado y minimizado.
- `LeadSubmission`: contacto, resumen, consentimiento y un único `submissionId` idempotente.
- `MotorLeadTransport`: contrato `submitLead(submission)`; la idempotencia no se duplica como
  argumento independiente.
- `DemoMotorLeadTransport`: devuelve `demo-completada`, nunca `confirmado` o `recibido`.

### Reglas

- El runtime no importa React, Next.js, Drizzle, Resend ni estilos.
- El registro visual no forma parte del paquete portable de lógica.
- Cada renderer se carga de forma dinámica. Dental puede precargarse cerca del viewport; los otros
  cinco no entran al chunk inicial.
- Las transiciones inválidas fallan de forma explícita.
- `tenantId` no forma parte de datos libres controlados por el navegador.
- La configuración de presentación no entra al payload.
- En Boreas, el paso de contacto usa una fixture sintética, visible y no editable. No invita a
  escribir nombre, teléfono o correo reales.
- `demo-completada` explica que nada fue recibido por un consultorio.
- No crear todavía IndexedDB, cifrado, API o tabla.

### Tests

- Estado inicial y transiciones válidas.
- Transiciones inválidas.
- Resultado antes de contacto.
- Error recuperable conserva resultado.
- Estado urgente impide una transición directa al CTA comercial.
- Configuración inválida no produce resultado.
- Demo transport no ejecuta `fetch`, almacenamiento ni efectos externos.
- Demo transport nunca produce `confirmado`.
- IDs y versiones del registro no se repiten.

### Verificación

```bash
npm test -- lib/motors/runtime
npx eslint lib/motors/runtime content/motor-theater.ts components/landing/motors/theater app/motores-preview/teatro
npx tsc --noEmit
npm run build
```

### Entregable y gate

- `/motores-preview/teatro` muestra un harness sin estilo final y sin alterar `/`.
- Diagrama real del contrato de datos.
- Aprobación antes de construir el selector.

### Rollback

Eliminar solo archivos nuevos de la fase. La landing pública no cambia.

---

## Fase 2 — Banda de motores expandible

**Tipo:** interacción aislada en preview.

**Objetivo:** reemplazar el modelo del wheel por navegación estable, clara y accesible.

**Contexto para ejecución en frío:** hay seis especialidades en `content/motors.ts` y seis
renderers en `motors-section.tsx`. La banda debe poder montar temporalmente los componentes
existentes para probar selección sin rediseñarlos.

### Archivos previstos

- Create: `components/landing/motors/theater/motor-band.tsx`
- Create: `components/landing/motors/theater/motor-stage.tsx`
- Create: `components/landing/motors/theater/motor-tab-label.tsx` si evita duplicación real
- Modify: `components/landing/motors/theater/motor-registry.tsx`
- Modify: `components/landing/motors/theater/theater-preview.tsx`
- Modify: `content/motor-theater.ts`
- Test: reducer/funciones puras de selección en `lib/motors/runtime`

### Comportamiento requerido

- Seis segmentos `01–06` con especialidad, motor y resultado.
- Segmento activo expandido; otros visibles.
- `tablist`, `tab`, `tabpanel`, `aria-controls` y `aria-selected` correctos.
- Flechas izquierda/derecha, Home y End.
- Clic y `Enter` activan.
- Hover o foco solo previsualiza; no cambia selección sin acción.
- La selección monta un motor inmediatamente, sin cola de salida.
- No hay listener de wheel ni `preventDefault` sobre scroll.
- Móvil usa scroll horizontal con `scroll-snap` y conserva foco visible.
- Cambio de motor desmonta estado previo, como hoy.

### Verificación visual

- 320, 390, 768, 1024, 1440 y 2560 px.
- Teclado completo sin perder foco.
- VoiceOver/NVDA anuncia nombre y posición.
- Movimiento reducido sin transición espacial.
- Ningún overflow horizontal de página.
- Cambios rápidos no desincronizan tab y panel.

### Verificación técnica

```bash
npm test
npx eslint components/landing/motors/theater content/motor-theater.ts lib/motors/runtime
npx tsc --noEmit
npm run build
```

### Entregable y gate

- Preview navegable con los seis motores actuales.
- Comparación visual con `OptionWheel`.
- Aprobación explícita de banda, densidad y comportamiento antes del cotizador V2.

### Rollback

Revertir archivos de la banda y restaurar el harness de Fase 1. La landing sigue intacta.

---

## Fase 3A — Dominio V2 aislado del cotizador dental

**Tipo:** lógica y configuración nuevas, sin tocar exports consumidos por la landing.

**Objetivo:** definir el motor dental portable y probarlo sin alterar el cotizador V1 público.

**Contexto para ejecución en frío:** `components/landing/motors/cotizador-dental.tsx` importa
directamente `content/motors.ts` y `lib/motors/cotizador-dental.ts`. Modificar esos exports puede
cambiar `/` aunque el renderer V2 solo viva en preview.

### Archivos previstos

- Create: `lib/motors/cotizador-dental-v2.ts`
- Create: `lib/motors/cotizador-dental-v2.test.ts`
- Create: `content/cotizador-dental-v2.ts`
- Modify: registro del teatro solo para apuntar al dominio V2

No modificar `lib/motors/cotizador-dental.ts`, `content/motors.ts` ni el componente V1. Si una
función pura merece compartirse, extraerla de forma aditiva y demostrar con tests que V1 conserva
exactamente su salida.

### Dominio y configuración

- Tratamientos por cliente.
- Moneda y locale.
- Rango mínimo/máximo.
- Visitas e inclusiones.
- Factores que pueden modificar precio.
- `reviewedAt` y `validUntil`.
- Copy y CTA configurables.
- Campos opcionales: preocupación y horizonte de inicio.
- Resultado paciente y resumen especialista como salidas separadas.

### Tests

- Validación de configuración y vigencia.
- Formato de moneda y rango.
- Resumen con y sin preguntas opcionales.
- Minimización del payload.
- Configuración vencida devuelve fallback seguro.
- Mismo input produce mismo resultado.
- Pruebas V1 existentes siguen pasando sin cambios.

### Verificación

```bash
npm test -- lib/motors/cotizador-dental.test.ts lib/motors/cotizador-dental-v2.test.ts
npx eslint lib/motors/cotizador-dental-v2.ts content/cotizador-dental-v2.ts
npx tsc --noEmit
npm run build
```

### Entregable y gate

- Dominio V2 probado y comparación de salidas V1/V2.
- Aprobación antes de crear su UI.

### Rollback

Eliminar los archivos V2. La landing nunca cambió.

---

## Fase 3B — Experiencia dental, contacto demo y dos caras

**Tipo:** vertical slice funcional dentro del preview.

**Objetivo:** implementar la experiencia completa aprobada sobre el dominio V2.

### Archivos previstos

- Create: `components/landing/motors/dental/dental-quote-experience.tsx`
- Create: `components/landing/motors/dental/dental-patient-result.tsx`
- Create: `components/landing/motors/dental/dental-specialist-summary.tsx`
- Create: `components/landing/motors/dental/dental-contact-step.tsx`
- Modify: registro y preview del teatro

### Micro-gate de copy y campos

Antes de código, presentar para aprobación el copy exacto y el esquema real recomendado:

- nombre;
- al menos uno entre teléfono y correo;
- canal preferido;
- consentimiento obligatorio;
- preocupación y horizonte como contexto opcional.

En Boreas esos campos se muestran con una fixture sintética no editable. El botón dice
`Simular entrega`; el estado final es `Demo completada`, nunca `Recibido`.

### Flujo

1. Promesa, duración y privacidad.
2. Tratamiento.
3. Contexto opcional.
4. Resultado inmediato.
5. CTA `Quiero una valoración`.
6. Vista del contacto mínimo y consentimiento.
7. Demo transport sin red.
8. Resultado paciente y resumen especialista visibles.

### Reglas

- El contacto nunca bloquea el resultado.
- Preguntas opcionales no alteran el rango.
- Configuración vencida o inválida no muestra precio.
- El resumen no incluye respuestas crudas innecesarias.
- Boreas no invita a escribir PII real.
- El foco solo cambia después de acción explícita.
- Vercel Analytics y Speed Insights pueden seguir enviando telemetría global, pero el motor no
  emite eventos ni requests con datos del demo.

### Verificación

```bash
npm test -- lib/motors/cotizador-dental-v2.test.ts lib/motors/runtime
npx eslint components/landing/motors/dental lib/motors/cotizador-dental-v2.ts content/cotizador-dental-v2.ts
npx tsc --noEmit
npm run build
```

Más navegador: teclado, lector, móvil, zoom 200 %, error simulado, `demo-completada` y ausencia de
requests originados por el motor dental.

### Entregable y gate

- Cotizador V2 completo dentro de `/motores-preview/teatro`.
- Revisión visual y funcional del usuario.
- Aprobación antes de construir sticky o ambientación.

### Rollback

Retirar el renderer V2 del registro. La landing aún usa el cotizador V1.

---

## Fase 4A — Estructura narrativa y sticky DOM

**Tipo:** composición visual principal en preview.

**Objetivo:** construir la estructura de los cuatro actos y validar ritmo, sticky y lectura sin
pulido de motion ni Canvas/WebGL.

**Contexto para ejecución en frío:** la banda y el cotizador V2 ya deben estar aprobados. El sticky
es solo de escritorio y dura aproximadamente tres alturas de viewport. La página nunca captura el
wheel.

### Archivos previstos

- Create: `components/landing/motors/theater/conversion-theater.tsx`
- Create: `components/landing/motors/theater/theater-scene.tsx`
- Create: `components/landing/motors/theater/theater-narrative.tsx`
- Create: `components/landing/motors/theater/use-theater-progress.ts`
- Modify: `content/motor-theater.ts`
- Modify: preview route/component

### Actos

1. Visita: señal anónima y pregunta `¿Cuánto me va a costar?`.
2. Motor: tratamiento, rango, visitas e inclusiones se estructuran.
3. Dos caras: resultado paciente y resumen especialista.
4. Control: la escena queda interactiva, aparecen banda, catálogo y CTA.

### Implementación

- CSS `position: sticky` dentro de un contenedor acotado.
- Progreso derivado del viewport con APIs existentes de `motion/react` o IntersectionObserver.
- Sin `setState` por frame si MotionValues/CSS variables resuelven la interpolación.
- Señales DOM con contenido fijo, `aria-hidden` si son decorativas.
- Contenido esencial presente sin esperar animación.
- Al interactuar con el formulario, el escenario deja de depender del scroll.
- Móvil y tablet chica usan composición apilada.

### Verificación y gate

- Scroll rápido, lento, reversa y salto por ancla.
- Recarga dentro de la ruta preview.
- Teclado mientras el sticky está activo.
- Móvil contiene la misma información en flujo normal.
- Mockup funcional, todavía sin pulido, aprobado antes de Fase 4B.

### Rollback

Volver al preview de Fase 3B, que conserva banda y cotizador sin narrativa sticky.

---

## Fase 4B — Movimiento, responsive y pulido DOM

**Tipo:** acabado visual del teatro aprobado en Fase 4A.

**Objetivo:** aplicar jerarquía final, transición de información y señal ambiental DOM.

### Archivos previstos

- Create: `components/landing/motors/theater/signal-field-dom.tsx`
- Modify: componentes de Fase 4A y `content/motor-theater.ts`

### Motion

- Opacidad, máscara y desplazamientos cortos.
- Líneas de conexión solo después de completar pasos.
- Resultado paciente antes del resumen especialista.
- Sin bounce, elasticidad o loops constantes.
- Ningún control se mueve con foco.

### Verificación

- Scroll rápido, lento, reversa y salto por ancla.
- Recarga dentro de la ruta preview.
- Teclado mientras el sticky está activo.
- Móvil y movimiento reducido contienen la misma información.
- Navegar hacia Pricing no deja scroll bloqueado.
- Consola limpia y sin warnings de hidratación.
- Medición de tareas largas y estabilidad de layout.

### Entregable y gate

- Teatro DOM aprobado en preview.
- Capturas y video corto de escritorio/móvil/reduced-motion.
- Decisión explícita: el DOM es suficiente o se autoriza el spike visual de Fase 5.

### Rollback

Volver a la estructura funcional aprobada en Fase 4A.

---

## Fase 5 — Capa ambiental Canvas/WebGL, opcional

**Tipo:** experimento desechable detrás de feature flag local.

**Objetivo:** comprobar si una capa gráfica mejora claramente la metáfora
`señal dispersa → contexto estructurado` sin dañar rendimiento o legibilidad.

**Precondición:** Fase 4B aprobada y autorización explícita para ejecutar el spike.

### Archivos previstos

- Create: `components/landing/motors/theater/signal-field-canvas.tsx` o
  `signal-field-webgl.tsx`, no ambos salvo comparación breve.
- Modify: preview para alternar DOM/gráfico solo en entorno de desarrollo.

### Reglas

- Usar Canvas 2D primero si alcanza el efecto.
- OGL ya está instalado; no añadir dependencia.
- Feature flag no aparece en producción.
- `aria-hidden`, pointer-events desactivados y sin contenido esencial.
- Pausa fuera de viewport, al ocultar documento y bajo reduced motion.
- DPR limitado y densidad adaptativa.
- Destruir contexto/listeners al desmontar.

### Criterio de decisión

Adoptar solo si:

- el usuario percibe mejora clara;
- no reduce legibilidad;
- no introduce tareas largas perceptibles;
- mantiene interacción fluida en móvil medio;
- no aumenta de forma injustificada el bundle inicial.

Si no cumple, borrar el spike y conservar `signal-field-dom.tsx`.

### Entregable y gate

- Comparación A/B DOM vs gráfico con métricas.
- Decisión documentada de conservar o descartar.

### Rollback

Eliminar el archivo gráfico y el flag. La versión DOM ya está completa.

---

## Fase 6A — Integración reversible con legado disponible

**Tipo:** integración local detrás de una selección reversible.

**Objetivo:** conectar el teatro a la landing sin borrar la sección anterior.

**Contexto para ejecución en frío:** los cinco motores no dentales conservan su UI y se montan
mediante wrappers de compatibilidad. `OptionWheel`, `MotorTransition` y el `MotorsSection` legado
deben permanecer disponibles para rollback.

### Archivos previstos

- Create: `components/landing/motors-section-legacy.tsx` a partir de la implementación actual
- Modify: `components/landing/motors-section.tsx` como frontera reversible
- Modify: componentes del teatro para modo producción
- Modify: `content/motor-theater.ts`
- Modify: `app/motores-preview/page.tsx` si debe apuntar al motor aprobado

### Integración

- Selección local/build-time explícita entre `legacy` y `theater`; sin servicio de flags nuevo.
- `SectionFrame` conserva `id={sectionIds.motores}` y `theme="dark"`.
- Hero sigue desplazando a `#motores`.
- CTA final desplaza a `#pricing`.
- Los otros cinco motores siguen accesibles desde la banda.
- El dental usa V2 y `demo-completada`.
- No se conecta `/api/lead`.
- Dental no emite requests. Analytics/Speed Insights globales siguen existiendo.
- Agenda es excepción: Cal.com solo carga al activar su motor. Reservar una cita es un efecto real
  y no forma parte de QA sin aprobación.
- Dental se precarga cerca del viewport; los demás motores y cualquier capa gráfica permanecen en
  chunks dinámicos.

### Validación y gate

- Comparar legacy/theater en los mismos breakpoints.
- Confirmar waterfall y presupuesto de 10 KB gzip inicial.
- Demostrar que cambiar a `legacy` restaura la sección sin revertir archivos.
- Aprobación antes de activar `theater` como valor público.

### Rollback

Cambiar la selección a `legacy`. No requiere restaurar archivos eliminados.

---

## Fase 6B — Activación pública controlada

**Tipo:** cambio público sin limpieza destructiva.

**Objetivo:** hacer `theater` la experiencia predeterminada y validar la landing completa.

### Validación completa

```bash
npm test
npx tsc --noEmit
npx eslint components/landing/motors-section.tsx components/landing/motors content lib/motors
npm run build
git diff --check
```

El lint global todavía puede reportar los tres errores heredados de `option-wheel.tsx` mientras el
legado permanezca para rollback. No añadir disables.

Browser:

- 320, 390, 768, 1024, 1440 y 2560 px;
- scroll, anclas, banda, seis motores, CTA y formularios;
- teclado y lector de pantalla;
- reduced motion;
- consola y Network;
- comparación visual de Hero, Problema, Prueba Social, Pricing y Relevo;
- medición contra baseline de Fase 0;
- ninguna reserva real de Cal.com durante QA.

### Criterios de aceptación

- No hay desincronización entre selector y motor.
- No hay captura de wheel ni bloqueo de página.
- LCP inicial cumple el presupuesto acordado.
- La escena libera recursos al salir del viewport.
- El motor dental no envía datos del demo.
- El mensaje de las dos caras se entiende sin completar todos los motores.

### Entregable y gate

- Landing integrada y validada localmente.
- Resumen no técnico con diferencias visuales, rendimiento y deuda restante.
- Aprobación para commit; después commit aislado.
- Aprobación separada antes de deploy.
- Validación posterior al deploy antes de Fase 6C.

### Rollback

Volver a `legacy` y desplegar. El teatro permanece en preview para corregirlo.

---

## Fase 6C — Limpieza heredada posterior a validación

**Tipo:** eliminación acotada después de validar producción.

**Objetivo:** retirar el selector y la transición anteriores cuando ya no sean necesarios para
rollback inmediato.

### Acciones

1. Repetir búsqueda de usos de `OptionWheel`, `MotorTransition` y `MotorsSectionLegacy`.
2. Confirmar que el teatro lleva el periodo de validación acordado sin rollback.
3. Eliminar solo consumidores y archivos sin uso.
4. Retirar la selección reversible si ya no aporta valor.
5. Ejecutar lint global; los tres errores heredados deben desaparecer por eliminación, no por
   supresión.

### Verificación

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
git diff --check
```

### Entregable y gate

- Diff de limpieza separado.
- Aprobación antes de commit.

### Rollback

Revertir solo el commit de limpieza restaura el legado y la selección reversible.

---

## Fase 7A.0 — Threat model y protocolo criptográfico

**Tipo:** diseño de seguridad, sin código de persistencia.

**Objetivo:** cerrar el protocolo antes de guardar cualquier dato sensible en el navegador.

### Amenazas y límites a documentar

- XSS mientras el formulario está abierto.
- Lectura de IndexedDB por scripts del mismo origin.
- Robo o rotación de claves.
- Replay y duplicación.
- Manipulación de tenant, motor, versión o consentimiento.
- Payload excesivo.
- Equipo compartido y navegador cerrado durante la expiración.

### Protocolo propuesto para revisión

- Payload máximo de referencia: 16 KB antes de cifrar.
- Clave de contenido aleatoria AES-256-GCM por envío.
- IV único y autenticado por envelope.
- Clave de contenido envuelta con RSA-OAEP SHA-256 o alternativa WebCrypto aprobada en el ADR.
- `keyId` y `envelopeVersion` obligatorios para rotación.
- AAD liga host/tenant resuelto, `motorId`, versión, consentimiento y `submissionId`.
- `submissionId` existe una sola vez y es la fuente idempotente.
- El cliente guarda y reenvía el envelope cifrado listo para servidor; no necesita descifrarlo tras
  una recarga.
- El servidor conserva la clave privada anterior al menos durante TTL + margen operativo.
- El servidor rechaza envelopes de más de una hora.

### Limitación del TTL

IndexedDB no puede garantizar borrado físico mientras el navegador permanece cerrado. `expiresAt`
limita aceptación del servidor y el cliente elimina al siguiente arranque, visita o tarea activa.
Esta limitación debe aparecer en el threat model; no describirla como borrado exacto al minuto 60.

### Entregable y gate

- ADR del envelope y threat model revisados por seguridad.
- Contrato de respuestas HTTP, rotación y errores.
- Aprobación antes de Fase 7A.1.

### Rollback

No aplica: documentación sin datos ni integración.

---

## Fase 7A.1 — Transporte portable y recuperación cifrada

**Tipo:** librería sin conexión a la landing demo.

**Objetivo:** implementar el contrato cliente para sitios reales y probar reintento, idempotencia y
TTL sin enviar datos externos.

**Contexto para ejecución en frío:** `MotorLeadTransport` existe desde Fase 1. Boreas debe continuar
con `DemoMotorLeadTransport`. Esta fase crea una implementación reutilizable, pero no la activa en
`#motores`.

### Archivos previstos

- Create: `lib/motors/transport/envelope-schema.ts`
- Create: `lib/motors/transport/crypto-envelope.ts`
- Create: `lib/motors/transport/pending-store.ts`
- Create: `lib/motors/transport/indexeddb-pending-store.ts`
- Create: `lib/motors/transport/http-motor-lead-transport.ts`
- Create: tests de schema, cifrado, TTL, reintento y `submissionId`

### Reglas

- Implementar exactamente el ADR aprobado en Fase 7A.0; no elegir algoritmos durante código.
- IndexedDB guarda ciphertext, metadata mínima, `submissionId`, `keyId`, versión y expiración.
- TTL máximo de una hora.
- Borrado en éxito, cancelación, siguiente arranque tras expiración o tarea activa de limpieza.
- El estado `recibido` requiere respuesta de persistencia, no entrega de email.
- No reintentar 4xx no recuperables.
- Respetar `Retry-After` y backoff acotado.
- No loggear payload ni ciphertext completo.
- La implementación permite inyectar reloj, store y fetch para tests.

### Tests

- Cifrado no conserva texto sensible.
- Descifrado solo con clave privada correspondiente en fixture de test.
- AAD alterado, IV incorrecto, versión desconocida o `keyId` inválido fallan cerrado.
- Recarga recupera pendiente.
- Expiración impide envío y elimina cuando el cliente vuelve a ejecutarse.
- Dos reintentos conservan `submissionId`.
- 409 idempotente se interpreta según contrato acordado.
- Offline no pierde resultado local.
- Boreas sigue sin invocar este transporte.

### Entregable y gate

- Librería portable y contrato documentado.
- Demo browser con backend falso local, sin efectos externos.
- Revisión de seguridad antes de decidir backend real.

### Rollback

Eliminar la implementación de transporte; runtime y landing conservan el adaptador demo.

---

## Fase 7B — Backend real de referencia

**Tipo:** backend, datos y notificaciones; requiere autorización nueva.

**Estado inicial:** bloqueada hasta elegir repositorio objetivo, modelo de tenant, base de datos,
retención y proveedor de notificación.

**Objetivo:** demostrar un vertical slice real desde un sitio de cliente hasta persistencia y
delivery asíncrono.

### Decisiones obligatorias antes de empezar

1. Repo objetivo: `boreas-template`, sitio piloto o módulo compartido.
2. Resolución de tenant desde host/ruta/configuración confiable.
3. Retención y proceso de borrado.
4. Cifrado en reposo y gestión de claves.
5. Canal: correo, CRM o WhatsApp.
6. Quién recibe alertas de delivery fallido.
7. Entorno de pruebas sin contactar personas reales.
8. Política CSP, inventario de scripts y exclusión de session replay en rutas con motores.
9. Custodia, rotación y retiro de claves del envelope.

### Contrato mínimo del backend

- Endpoint stateless.
- Validación Zod por `motorId` y `version`.
- Tenant resuelto del lado servidor.
- Persistencia del lead antes de responder.
- Restricción única por `(tenant, submissionId)`.
- Consentimiento versionado.
- Resumen derivado y contacto; respuestas completas solo por excepción aprobada.
- Outbox/delivery separado de la transacción de recepción.
- Rate limit que no mezcla tenants.
- Logs sin datos sensibles.
- Rechazo de envelopes vencidos, sobredimensionados o con clave retirada.
- CSP compatible con los proveedores aprobados; `frame-src` de Cal.com solo donde Agenda exista.

### Referencias internas permitidas

- Reusar ideas de `createOrGetCheckoutOrder` y `claimEmailDelivery`.
- No importar tablas, repositorio ni estados de checkout.
- No extender `/api/lead`; crear dominio separado.

### Validación

- Tests de esquema y repositorio.
- Concurrencia: mismo `submissionId` en paralelo produce un lead.
- Persistencia exitosa con delivery fallido responde recepción y encola reintento.
- Tenant A no puede leer/escribir como tenant B.
- Datos sintéticos únicamente.
- No-charge / no-contact test primero; cualquier email o mensaje real requiere aprobación.

### Rollback

- Desactivar adaptador por configuración.
- Revertir aplicación antes de migración destructiva.
- Las migraciones deben ser aditivas en esta fase; no borrar datos durante rollback.

---

## Fase 8 — Portar los otros cinco motores

**Tipo:** expansión posterior; no iniciar hasta validar comercialmente dental.

**Precondición:** especialistas pueden explicar qué recibe el paciente, qué recibe el profesional y
por qué convierte.

### Orden recomendado

1. Salud mental/GAD-7: prueba crisis, consentimiento y minimización.
2. Fisioterapia/dolor y medicina/pre-triage: comparten familia quiz y reglas urgentes.
3. Nutrición/metabólica: segundo patrón de cálculo.
4. Agenda: excepción de proveedor externo y reserva real.

Cada motor es una subfase con revisión propia. No portar por reemplazo masivo.

### Criterios comunes

- Menos de un minuto.
- Resultado antes de contacto.
- Resumen especialista minimizado.
- Crisis antes de venta.
- Adaptador demo en Boreas.
- Misma banda, runtime y estados.
- Tests de límites y contenido clínico.
- Verificación visual, teclado, móvil y reduced motion.

## 3. Política de validación por fase

Cada fase entrega cuatro evidencias separadas:

1. **Código:** tests, TypeScript, lint y build.
2. **Navegador:** comportamiento, consola, breakpoints y accesibilidad.
3. **Rendimiento:** comparación contra Fase 0.
4. **Alcance:** lista de archivos y confirmación de secciones no tocadas.

Una fase no se considera terminada solo porque compila.

La aprobación visual no autoriza commit, deploy ni comienzo de la siguiente fase. Cada acción
recibe su gate explícito conforme a las reglas globales.

## 4. Protocolo de cambios al plan

- Si una fase crece más de un commit revisable, dividirla antes de continuar.
- Una nueva dependencia, migración, proveedor o efecto externo requiere decisión registrada.
- Un bloqueo visual no autoriza avanzar al backend.
- Si el prototipo demuestra que una decisión de diseño falla, volver al spec y registrar la nueva
  decisión antes de editar código.
- Las fases opcionales pueden omitirse con motivo documentado.

## 5. Primer punto de inicio recomendado

Ejecutar solo **Fase 0**. Entregar baseline no técnico, pedir aprobación para su registro y después
pedir aprobación separada antes de Fase 0.5.
