# EPIC 3 — Fase 0.5: compatibilidad V4 ↔ `boreas-template`

**Fecha:** 2026-08-24  
**Template auditado:** `/Users/ponycider/Documents/SaaS/boreas-template`  
**Rama auditada:** `worktree-category-mechanism-engines`  
**Commit:** `6bc2ba719b608eb0cc73816553d6adb4d95810b7`  
**Modo:** lectura de blobs comprometidos mediante `git show`; sin checkout ni cambios externos.

## Decisión

**Migrar conceptos, no portar la implementación.**

La rama del template aporta un buen vocabulario inicial — cuatro familias de engine, catálogo por
categoría, activación ordenada y resolución fail-fast—, pero su runtime, UI y persistencia no son
compatibles con los contratos aprobados para el Teatro de conversión.

V4 construirá el runtime nuevo. Después, `boreas-template` podrá consumir ese contrato mediante un
adaptador. No se copiarán directamente `MechanismSection`, `ContactGate`, los cuatro renderers ni
`submitMechanismLead`.

## Estado real del template

- La rama está publicada y su worktree asociado está limpio.
- El worktree `main` está sucio y adelantado seis commits respecto de `origin/main`; no se tocó.
- La rama añade 25 archivos y 1293 líneas.
- Existen cuatro renderers genéricos: quiz, calculator, simulator y lead-magnet.
- El catálogo de mecanismos reales está completamente vacío en las cuatro categorías.
- No existen preguntas clínicas aprobadas, fórmulas reales, rangos comerciales ni contenido por
  especialidad que debamos preservar.
- `git diff --check main...worktree-category-mechanism-engines` no detectó errores de whitespace.
- Se inventariaron los tests comprometidos, pero no se ejecutaron tests ni build para mantener el
  worktree externo estrictamente sin escrituras.

## Inventario

### Contratos

`lib/mechanisms/types.ts` define:

- cuatro categorías fijas;
- un `MechanismResult` común;
- contacto con nombre y WhatsApp;
- configs discriminadas para quiz, calculator, simulator y lead-magnet;
- callbacks `scoreToResult` y `compute` embebidos en la configuración.

El resultado mezcla dominio y presentación: resumen, copy de CTA, mensaje de WhatsApp, URL de
descarga y un `raw` arbitrario viven en el mismo objeto.

### Estado y renderers

- Quiz mantiene índice, puntaje y gate dentro de React.
- Calculator mantiene valores y gate dentro de React.
- Simulator alterna entre dos URLs de imagen; no calcula ni transforma nada.
- Lead magnet muestra contacto antes de desbloquear una URL pública.
- No existe reducer, máquina de estados, runtime puro ni recuperación de una sesión.
- No existe separación entre definición, lógica, renderer y transporte.

### Catálogo y resolución

- `catalog` agrupa configs por categoría.
- `resolveActiveMechanisms` mantiene el orden definido por el cliente.
- Un ID desconocido lanza un error descriptivo.
- Un test importa el `siteContent` real para detectar IDs inválidos en CI.
- Los cuatro catálogos están vacíos.

### Orquestación y transporte

- `MechanismSection` importa estáticamente los cuatro engines.
- El componente llama directamente a una server action de Supabase.
- `SalesHook` depende directamente de `siteContent` y WhatsApp.
- No existe interfaz de transporte, adaptador demo ni carga dinámica por engine.

### Persistencia

- La server action acepta del navegador `mechanismId`, contacto y el resultado completo.
- Solo recorta y comprueba que nombre y WhatsApp no estén vacíos.
- Persiste `MechanismResult` completo en una columna `jsonb`.
- La prueba exige explícitamente persistir `raw: { score: 2 }`.
- No existen consentimiento, versión de consentimiento, `submissionId`, restricción única,
  idempotencia, TTL ni minimización.
- El servidor no recalcula ni valida que el resultado corresponda al motor y su versión.
- La migración no activa RLS ni define políticas.
- El transporte está acoplado a Supabase y a `siteContent.clienteSlug`.

## Compatibilidad con los contratos aprobados

| Contrato V4 | Template | Resultado |
|---|---|---|
| Resultado antes de contacto | Quiz, calculator y lead-magnet ocultan valor detrás del gate | Incompatible |
| Dos caras | Solo hay resultado paciente y CTA; no existe resumen profesional explícito | Incompatible |
| Minimización | `raw` arbitrario y resultado completo se guardan en `jsonb` | Incompatible |
| Consentimiento versionado | No existe | Incompatible |
| Idempotencia con `submissionId` | No existe | Incompatible |
| Transporte intercambiable | UI llama directamente a Supabase | Incompatible |
| Runtime puro | Estado y cálculo se disparan dentro de React | Incompatible |
| Definición separada del renderer | Config y funciones llegan al renderer; imports estáticos | Parcial |
| Catálogo versionado | IDs sin versión; catálogo vacío | Parcial |
| Demo sin efectos externos | No existe adaptador demo | Incompatible |
| Resultado visible aunque falle red | El resultado aparece antes de terminar la promesa | Compatible |
| Resolución fail-fast | Error descriptivo y test sobre config real | Compatible |
| Orden configurable por cliente | `activeMechanisms` conserva orden | Compatible |

## Riesgos concretos

### Privacidad

- `MechanismResult.raw` permite respuestas, puntajes o datos clínicos sin esquema.
- `mechanism_result` guarda también copy comercial, mensaje de WhatsApp y posible URL de descarga.
- El contrato no distingue datos necesarios para el especialista de datos usados solo para
  calcular el resultado.
- No existe consentimiento para guardar respuestas completas.
- No existe política de retención ni borrado.

### Integridad

- El navegador puede enviar cualquier `mechanismId` y cualquier resultado.
- El servidor no valida motor, versión, tenant resuelto ni correspondencia entre entradas y
  resultado.
- Reintentos o doble clic pueden crear leads duplicados.
- Una respuesta exitosa significa que Supabase no devolvió error, pero no existe identificador de
  envío estable ni reconciliación.

### Experiencia y accesibilidad

- El gate rompe el principio de entregar valor primero.
- No hay progreso, navegación atrás ni recuperación en quiz.
- No hay `fieldset`/`legend`, anuncio de cambio, manejo de foco ni región viva para resultados.
- Calculator depende de restricciones HTML básicas; no tiene esquema de validación compartido,
  unidades estructuradas ni errores accesibles.
- ContactGate no incluye `type="tel"`, `inputMode`, `autocomplete` ni consentimiento.
- Simulator es un reveal de dos imágenes con textos alternativos genéricos, no un simulador.
- Los engines no prueban teclado, foco, lector, zoom ni movimiento reducido.

### Rendimiento y portabilidad

- Los cuatro engines entran por imports estáticos aunque el sitio active uno o ninguno.
- Las funciones dentro de config impiden tratar la definición como metadata serializable.
- `SalesHook` ata el resultado a WhatsApp y a la estructura específica de `siteContent`.
- `MechanismSection` ata la presentación al backend del template.

## Matriz de decisión

| Pieza | Decisión | Qué se conserva | Qué cambia |
|---|---|---|---|
| Quiz | Migrar | Preguntas, opciones y evaluador de puntaje como conceptos | Dominio puro, estado común, resultado antes de contacto y renderer nuevo |
| Calculator | Migrar | Campos declarativos y función de cálculo | Validación compartida, unidades, precisión, resultado primero y renderer nuevo |
| Simulator | Reemplazar | Solo la familia `simulator` como posible categoría | El reveal de imágenes no sirve como base de un motor real ni portable |
| Lead magnet | Adaptar como módulo secundario | Descripción, asset y estado de disponibilidad | Sale del runtime principal; captura opcional posterior al valor y renderer nuevo |
| Catálogo | Adaptar | Activación ordenada y fallo por ID inválido | IDs versionados, metadata pura y selección independiente del renderer |
| Resolver | Adaptar | Resolución determinista y error descriptivo | Resuelve definición, dominio y vista desde registros separados |
| Tests de comportamiento | Migrar | Caminos felices, error de persistencia y orden | Añadir contratos puros, accesibilidad, privacidad, idempotencia y carga dinámica |
| `MechanismSection` | Reemplazar | Ningún código directo | Máquina común + vista dinámica + transporte inyectado |
| `ContactGate` | Reemplazar | Solo el concepto de contacto mínimo | Consentimiento, semántica, validación, estados y contacto después del resultado |
| `SalesHook` | Adaptar | Acción posterior al resultado | Acciones configurables, sin dependencia directa de WhatsApp o `siteContent` |
| Server action y schema | Reemplazar | Ningún contrato de persistencia | Transporte versionado, validación servidor, minimización e idempotencia |

## Frontera compartida aprobable para Fase 1

### 1. Definición portable

`MotorDefinition` contiene solo metadata serializable:

- `motorId` y `version`;
- familia de engine;
- especialidades compatibles;
- etiqueta, promesa y capacidades;
- requisitos de consentimiento;
- sin React, proveedor, CTA, WhatsApp ni funciones de cálculo.

### 2. Dominio puro por motor

Cada motor exporta funciones TypeScript puras:

- validación de entradas;
- transición o reducción de estado;
- cálculo de `PatientResult`;
- derivación separada de `SpecialistSummary`;
- reglas de urgencia y configuración inválida.

La lógica puede registrarse por `motorId@version`, pero no vive dentro de la metadata ni dentro de
React.

### 3. Runtime común

El runtime conoce fases, no layouts:

`inicio → captura → resultado → contacto → enviando → demo-completada|confirmado`

También conoce `pendiente`, `reintentando`, `error recuperable` y `configuración inválida`.

### 4. Registro de vistas

`MotorViewRegistry` vive fuera del runtime y usa imports dinámicos por motor. Boreas puede usar el
Teatro; un sitio cliente puede usar una composición distinta sin duplicar dominio.

### 5. Transporte

`MotorLeadTransport.submitLead(submission)` recibe:

- un único `submissionId`;
- motor y versión;
- contacto mínimo;
- `SpecialistSummary` minimizado;
- versión y evidencia de consentimiento.

El runtime no conoce Supabase, correo, CRM ni WhatsApp. Fase 1 implementa solo
`DemoMotorLeadTransport`, sin red ni almacenamiento.

### 6. Adaptador para el template

Más adelante, `boreas-template` deberá:

- convertir `category` y `activeMechanisms` a IDs versionados;
- aportar branding, copy y canales como configuración de presentación;
- elegir el transporte real del cliente;
- cargar solo los renderers activos;
- no importar UI de Boreas ni acoplar el runtime a `siteContent`.

## Consecuencia para el plan

La Fase 1 puede continuar como está prevista, con una precisión: además de `MotorDefinition` y
`MotorViewRegistry`, debe existir un **registro de dominio puro por `motorId@version`**. Esto evita
repetir el error del template de colocar `compute` y `scoreToResult` dentro de la config que consume
React.

No se necesita portar archivos del template antes de Fase 1.

## Gate

Fase 0.5 completa. La siguiente fase autorizable es **Fase 1: contratos, runtime mínimo y harness
aislado**. No se inicia sin aprobación explícita.
