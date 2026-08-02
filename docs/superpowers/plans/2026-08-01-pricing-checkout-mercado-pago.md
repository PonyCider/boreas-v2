# Pricing → Checkout Pro: Implementation Plan

**Goal:** Reemplazar el formulario aislado de “Empecemos” por un checkout iniciado desde cada card de pricing. El usuario confirma sus datos en un modal, paga en Mercado Pago el 50% de la inversión inicial y Boreas recibe avisos separados para checkout iniciado y anticipo aprobado.

**Architecture:** Las cards conservan su configuración local de Express e IA. Al pulsar el CTA, `PricingSection` guarda una `Selection` y abre un modal controlado. El navegador envía solamente los datos del contacto y los identificadores de la selección; el servidor vuelve a obtener el plan, recalcula la inversión inicial y deriva `deposit = setup / 2`. El backend crea una preferencia de Mercado Pago y devuelve únicamente su `init_point`. Los retornos presentan estado al comprador; el webhook firmado es la fuente de verdad del pago.

**UI sources:** shadcn `Dialog` para portal, bloqueo de foco, Escape y semántica; React Bits `TiltedCard` ya presente para parallax contenido en el resumen; Unlumen `FloatingTooltip` ya presente para explicar anticipo y mensualidad; Motion/Framer Motion ya instalados para entrada, salida y estados. No se construirá un modal, focus trap o sistema de overlays desde cero.

**Payment rule:** El anticipo es exactamente 50% de la inversión inicial: `plan + Express + instalación de IA`. La mensualidad queda fuera del cobro. Organizaciones sigue bajo cotización y no crea un checkout.

**Implementation status (2026-08-01):** Tasks 1–9 implementadas. Tests, TypeScript, build, lint focalizado y validación visual desktop/mobile completados. La compra sandbox, simulación real de webhook y salida a producción quedan pendientes de credenciales de Mercado Pago. El lint global conserva errores preexistentes en `components/ui/option-wheel.tsx`, fuera de este alcance.

## Constraints

- El precio mostrado en el navegador nunca es autoridad.
- No enviar `MERCADOPAGO_ACCESS_TOKEN` ni el secreto del webhook al cliente.
- Moneda: MXN.
- Setup y mensualidad deben seguir mostrándose por separado.
- Solo `Esencial`, `Profesional` y `Deluxe` pueden crear una preferencia de pago.
- `Organizaciones` usa el mismo modal visual, pero termina en una solicitud de contacto.
- La redirección de Mercado Pago no confirma el pago. Solo el webhook validado puede marcarlo como aprobado.
- Mantener `prefers-reduced-motion`, navegación por teclado, focus visible y contraste.
- El parallax no se aplica al formulario, inputs, CTA ni contenedor completo.
- No agregar campos innecesarios ni un flujo de varios pasos.

## Experience specification

### Modal de checkout

Desktop: panel de hasta 980 px, dividido aproximadamente 40/60.

- **Panel de resumen:** plan, complementos, inversión inicial, anticipo de hoy, mensualidad posterior y entrega estimada.
- **Panel de formulario:** nombre, WhatsApp, correo y especialidad; aviso de privacidad; CTA con el importe exacto.
- CTA: `Pagar anticipo de $X`.
- Microcopy: `Serás llevado al sitio seguro de Mercado Pago.`
- Acción secundaria discreta: cerrar y seguir comparando.

Mobile: una sola columna. El resumen se comprime en un bloque superior; el CTA queda visible sin tapar campos ni teclado.

### Motion

- Overlay: fade y blur corto.
- Shell: entrada con `opacity`, `y` y `scale` mediante spring controlado.
- Resumen y campos: stagger breve, no más de 35–45 ms entre elementos.
- Salida: más rápida que la entrada.
- Parallax: solo panel de resumen, amplitud máxima 1.5–2°, sin escala agresiva.
- Hover CTA: elevación de 1 px, refuerzo de sombra y desplazamiento de flecha.
- Cambio de precio o addons: transición numérica existente con `AnimatedPrice`.
- Reduced motion: fade simple; sin parallax, stagger ni desplazamientos.

### Estados

1. Formulario listo.
2. Validación con errores inline.
3. Creando checkout: inputs bloqueados y CTA con progreso.
4. Error recuperable: conserva todos los datos y permite reintentar.
5. Redirección a Mercado Pago.
6. Retorno aprobado, pendiente o rechazado.
7. Organizaciones: confirmación de solicitud enviada, sin redirección.

## Task 1 — Incorporar la base UI del modal

**Files:**
- Create from registry: `components/ui/dialog.tsx`
- Create: `components/landing/pricing/checkout-modal.tsx`
- Reuse: `components/ui/tilted-card.tsx`
- Reuse: `components/unlumen-ui/floating-tooltip.tsx`

- [ ] Ejecutar primero `shadcn view dialog` o `add --dry-run` para revisar el recurso.
- [ ] Instalar `Dialog` desde el registro shadcn configurado.
- [ ] Conservar portal, overlay, focus trap, Escape, retorno de foco y atributos ARIA.
- [ ] Construir la composición Boreas encima del primitive, sin reimplementar esas funciones.
- [ ] Adaptar `TiltedCard` al panel de resumen con amplitud restringida y desactivación móvil/reduced-motion.
- [ ] Añadir tooltip de Unlumen a “Anticipo de hoy” y “Mensualidad posterior”.

## Task 2 — Formalizar el cálculo del anticipo

**Files:**
- Modify: `lib/pricing.ts`
- Modify: `lib/pricing.test.ts`

- [ ] Añadir `computeDeposit(tier, config)` como función pura.
- [ ] Reutilizar `computePrice`; no duplicar sumas.
- [ ] Devolver `{ setup, deposit, monthly }` o un contrato equivalente.
- [ ] Rechazar planes con `setup === null`.
- [ ] Probar las combinaciones base, Express, IA y Express+IA.
- [ ] Probar que mensualidad e `IA_MONTHLY` nunca entren al anticipo.
- [ ] Probar cantidades exactas y enteras en MXN.

## Task 3 — Contrato y validación del checkout

**Files:**
- Create: `lib/checkout-schema.ts`
- Create: `lib/checkout-schema.test.ts`
- Refactor/reuse: `lib/lead-schema.ts`

- [ ] Definir input público: `tierId`, `express`, `ia`, nombre, email, teléfono, especialidad y honeypot.
- [ ] No aceptar setup, depósito ni mensualidad desde el cliente.
- [ ] Normalizar teléfono y correo.
- [ ] Rechazar IA en planes no compatibles y Express donde no aplique.
- [ ] Mantener mensajes de validación en español.
- [ ] Generar una referencia `BOR-<uuid>` del lado servidor.

## Task 4 — Abrir el modal desde las cards

**Files:**
- Modify: `components/landing/pricing-section.tsx`
- Modify: `components/landing/pricing/plan-card.tsx`
- Modify: `components/landing/pricing/organization-plan-card.tsx`
- Create: `components/landing/pricing/checkout-form.tsx`

- [ ] Reemplazar el scroll a `#contacto` por apertura controlada del modal.
- [ ] Pasar una copia estable de la configuración activa al modal.
- [ ] Mantener el estado de cada toggle al cerrar y reabrir.
- [ ] Evitar dobles aperturas y dobles submits.
- [ ] Hacer que el CTA del modal muestre el anticipo calculado.
- [ ] Mantener Organizaciones como variante `lead-only`.

## Task 5 — Crear la preferencia de Mercado Pago

**Files:**
- Create: `lib/mercado-pago.ts`
- Create: `app/api/checkout/route.ts`
- Modify: `.env.example`
- Modify: `package.json`

- [ ] Instalar el SDK oficial `mercadopago`.
- [ ] Validar el request con Zod y aplicar rate limit/honeypot.
- [ ] Recalcular plan, upsells, inversión inicial y anticipo en servidor.
- [ ] Crear una preferencia nueva por intento.
- [ ] Configurar `currency_id: MXN`, payer, descripción y `external_reference`.
- [ ] Configurar `back_urls` de éxito, pendiente y fallo sobre `https://boreas.one`.
- [ ] Configurar `notification_url` HTTPS.
- [ ] Usar `auto_return: approved`.
- [ ] Devolver al cliente únicamente `{ checkoutUrl }`.
- [ ] Añadir `MERCADOPAGO_ACCESS_TOKEN`, `MERCADOPAGO_WEBHOOK_SECRET` y `NEXT_PUBLIC_SITE_URL` al ejemplo de entorno.

## Task 6 — Notificar checkout iniciado

**Files:**
- Create: `lib/checkout-email.ts`
- Modify: `app/api/checkout/route.ts`

- [ ] Después de crear la preferencia, enviar a Boreas un correo “Checkout iniciado”.
- [ ] Incluir referencia, contacto, especialidad, plan, addons, inversión, anticipo y mensualidad.
- [ ] Marcar claramente `PAGO AÚN NO CONFIRMADO`.
- [ ] Usar la referencia como idempotency key de Resend.
- [ ] Si el correo falla, registrar el error sin inventar un pago aprobado; definir si se permite o se bloquea la redirección durante implementación.

## Task 7 — Webhook como fuente de verdad

**Files:**
- Create: `app/api/mercado-pago/webhook/route.ts`
- Create: `lib/mercado-pago-webhook.ts`
- Create: tests for signature/event handling

- [ ] Validar `x-signature`, `x-request-id` y `data.id` con el secreto configurado.
- [ ] Responder 401 a firmas inválidas.
- [ ] Recuperar el pago desde Mercado Pago; no confiar en el body del webhook.
- [ ] Verificar referencia Boreas, moneda, importe y estado.
- [ ] Enviar “Anticipo aprobado” solo para `approved`.
- [ ] Enviar estados `pending`, `rejected`, `cancelled` o `refunded` con asunto distinto cuando aporten valor operativo.
- [ ] Usar `payment/<paymentId>/<status>` como idempotency key de Resend.
- [ ] Responder 200 rápidamente para evitar reintentos innecesarios.

## Task 8 — Páginas de retorno

**Files:**
- Create: `app/checkout/exito/page.tsx`
- Create: `app/checkout/pendiente/page.tsx`
- Create: `app/checkout/error/page.tsx`

- [ ] Éxito: agradecer, indicar que se verificará el pago y explicar que Boreas pedirá el audio.
- [ ] Pendiente: explicar que el proyecto comienza cuando el pago sea aprobado.
- [ ] Error: ofrecer reintento y regreso a pricing sin perder claridad.
- [ ] No mostrar “pagado” basándose únicamente en parámetros GET.
- [ ] Mantener identidad Boreas, navegación mínima y soporte por WhatsApp/correo.

## Task 9 — Retirar el formulario aislado

**Files:**
- Remove/refactor: `components/landing/pricing/lead-form.tsx`
- Modify: `components/landing/pricing-section.tsx`
- Preserve/refactor: `app/api/lead/route.ts`

- [ ] Eliminar el bloque visual `#contacto` bajo Pricing.
- [ ] Reutilizar la ruta de lead para Organizaciones o mover esa lógica a un endpoint explícito.
- [ ] Verificar que ningún CTA o navbar dependa del id eliminado.
- [ ] Mantener `/privacidad` enlazado desde el modal.

## Task 10 — Validación integral

- [ ] Unit tests: precios, anticipo, schemas y parsing de webhook.
- [ ] TypeScript, lint, test y build.
- [ ] Navegación completa por teclado y focus restoration.
- [ ] Escape, clic exterior, scroll lock y teclado móvil.
- [ ] Desktop, tablet y móvil; Safari y Chrome.
- [ ] Reduced motion.
- [ ] Pruebas de Mercado Pago con credenciales de test: aprobado, pendiente y rechazado.
- [ ] Simulador oficial de webhooks y firma inválida.
- [ ] Doble clic, reintento de red y webhook duplicado.
- [ ] Confirmar que el monto cobrado coincide con 50% del setup calculado.
- [ ] Validación visual final antes de producción.

## Persistence decision

Esta primera iteración puede operar sin una base de datos nueva:

- Mercado Pago conserva preferencia, pago y `external_reference`.
- El correo “Checkout iniciado” conserva datos y configuración del lead.
- El correo “Anticipo aprobado” usa la misma referencia para correlación.

Esto mantiene el alcance pequeño, pero no crea un dashboard interno ni historial propio. Si se requiere automatización posterior, recuperación avanzada o conciliación interna, el siguiente paso será una tabla `checkout_intents`. No se introducirá una base de datos sin una decisión explícita de proveedor.

## External setup required before production

- Aplicación de Checkout Pro en la cuenta vendedora de Mercado Pago.
- Access Token de pruebas y producción.
- Public Key si el flujo elegido por el SDK frontend la requiere; con redirect directo por `init_point` no debe ser necesaria.
- Webhook URL y secreto configurados en Mercado Pago.
- URLs de producción en `boreas.one`.
- Compra de prueba completa antes de habilitar credenciales reales.

## Explicitly out of scope

- Cobro automático de mensualidades.
- Segundo pago del 50% contra entrega.
- Suscripciones, facturación o generación de CFDI.
- Dashboard administrativo.
- Checkout directo para Organizaciones.
- Subir el audio dentro del formulario.
