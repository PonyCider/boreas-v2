# Flujo de entrega post-anticipo — diseño

> **Confidencial — uso interno.** Contiene esquemas de precio y márgenes. No exponer en el sitio público ni en commits fuera de este repo privado. Complementa `assets/Boreas_Documento_Maestro_Uso_Interno` (resuelve el hueco marcado en su §4.1 y §8.1: "el proceso de handoff closer → developer no está definido").

## 1. Objetivo

Definir qué pasa desde que el closer cobra el anticipo ($2,000 MXN mínimo) hasta que el sitio del cliente queda entregado, con foco en: qué stack usar, dónde desplegar, cómo se revisa con el cliente, y cómo se entrega.

Restricción de fondo: equipo de 2 developers + 1 closer, sin nadie de operaciones. Cualquier paso nuevo debe ser ligero — no agregar herramientas ni fricción que este equipo no pueda sostener.

## 2. Esquemas de pago (contexto para el resto del documento)

**Plan A — Pago único** ($10,000 o $15,000 MXN según complejidad)
- Anticipo mínimo: $2,000. Resto ($8,000 o $13,000) al entregar.
- Dominio: siempre lo compra y administra el cliente (Boreas solo ofrece opciones/precios).
- Se transfieren GitHub repo + proyecto Vercel a la cuenta del cliente. Boreas no conserva administración.
- Add-on opcional: garantía + mantenimiento 1 año, $1,000/mes × 12 vía suscripción recurrente de Mercado Pago (no MSI — ver §2.1).

**Plan B — Pago reducido + mensualidad forzosa** ($5,000 u $8,000 según complejidad)
- Anticipo mínimo: $2,000. Resto ($3,000 o $6,000) al entregar + suscripción de $1,000/mes × 12 (garantía + mantenimiento incluidos).
- Dominio: igual que Plan A, siempre del cliente.
- Boreas conserva GitHub + Vercel ("administración total"). Al cliente no se le entregan esas credenciales.
- Al año, renovación opcional: extensión de garantía/mantenimiento a $500/mes × 12.
- Ambas suscripciones se facturan el día en que el cliente se suscribe (no un día fijo de mes).

### 2.1 Cobro: suscripción recurrente, no MSI

Los pagos a plazo (mensualidad, garantía) se cobran como **suscripción recurrente de Mercado Pago**, no como link de "Meses Sin Intereses". MSI le cobra a Boreas una comisión adicional de ~12.89%+IVA sobre el total financiado, encima de la comisión base — reduce el margen de forma significativa y además exige que el cliente tenga línea de crédito disponible por el monto total. La suscripción recurrente solo cobra la comisión base por transacción (confirmada por el usuario: 2.44%+$4.00 con tarjeta; 2.65%+$4.00 en efectivo/OXXO/depósito) una vez por mes, sin el sobrecosto de financiamiento, y acepta más métodos de pago.

**Política de cobro fallido (definida por el usuario, ya operativa en MP):** 3 intentos de cobro a los 2, 5 y 7 días después de la fecha de facturación. Al día 10 sin cobro exitoso, la suscripción se pausa automáticamente. Boreas pausa en paralelo el proyecto en Vercel del cliente. Se le da a elegir: reactivar (se reanuda cobro y sitio), o recibir sus credenciales de una vez y cancelar garantía/mantenimiento a cambio del equivalente de lo que le restaba por pagar.

**Decisión abierta, no bloqueante:** quién absorbe el costo anual del dominio en Plan B (mensualidad) — revisar si ya está contemplado en el margen del plan mensual.

## 3. Onboarding (closer → developer)

El doctor **no** llena formularios ni entrega redes/fotos — coincide con la promesa de "esfuerzo cero" del negocio. Su único input es el audio de WhatsApp (mínimo 1 minuto, libre si quiere más), enfocado en 3 preguntas básicas para poder armar la página.

Flujo:
1. Closer cobra el anticipo.
2. Closer transcribe el audio (speech-to-text) e interpreta ambigüedades de dirección de diseño (ej. "estética amable pero clínica y profesional" → nota explícita de tono para el developer).
3. Assets (fotos, redes, horarios, reseñas de Google Maps) los recolecta Boreas de fuentes públicas/scraping — no se le piden al cliente.
4. Closer llena un **formulario interno** (transcripción + interpretación + especialidad + servicios + tono/dirección visual + link a carpeta de assets) en la misma herramienta donde ya vive el pipeline de leads.
5. El formulario cae directo al developer asignado como builder de ese cliente — listo para empezar sin volver a tocar al cliente hasta la primera preview.

**Decisión abierta, no bloqueante:** herramienta exacta para el formulario interno (Google Sheets vs Notion) — se define cuando el flujo esté en operación, no bloquea el diseño.

## 4. Stack y repo por cliente

- **Repo plantilla único** (`boreas-template`, privado): Next.js App Router + Tailwind + framer-motion, mismo patrón de este repo (todo el copy en un archivo de contenido único, componentes ya armados: hero, servicios, testimonios, FAQ, CTA de WhatsApp).
- Cliente nuevo = usar "Template repository" de GitHub → duplicar a `boreas-<slug-consultorio>`. El developer builder llena datos y ajusta, no arma UI desde cero.
- Sin CMS ni panel de administración para el doctor — el mantenimiento post-entrega lo hace Boreas vía código (coincide con "mantenimiento incluido" del modelo mensualidad).
- **CTA principal de cada sitio: link `wa.me/<número del doctor>`** con mensaje precargado — el paciente escribe directo al doctor, sin backend de por medio. Es el patrón más simple y confiable posible para la conversión núcleo del negocio.
- **Form de contacto secundario** (para leads que prefieren no abrir WhatsApp, o para descarga de e-book / lead magnet): persiste en **Supabase compartido** (un solo proyecto, tabla `leads` con columna `cliente_slug` para distinguir de qué sitio viene cada lead) y notifica **al doctor por email vía Resend** (no WhatsApp bot — ver §4.2).
- Ningún cliente recibe credenciales de Supabase, sin importar el plan — evita exponer leads de otros clientes en un proyecto compartido.

### 4.1 Hosting — Vercel Pro, no Hobby

El plan Hobby de Vercel prohíbe uso comercial en sus términos de servicio — desplegar sitios de clientes pagando ahí arriesga suspensión de cuenta. Vercel Pro ($20 USD/mes por asiento; 2 developers = $40 USD/mes) cubre **proyectos ilimitados** en la cuenta — el costo escala por asiento de equipo y uso compartido, no por número de sitios de cliente. Contra un proyecto de $5,000-15,000 MXN, es costo despreciable. Se paga desde el primer anticipo recibido.

Alternativa de respaldo si el margen aprieta: Cloudflare Pages (gratis, uso comercial permitido), requiere el adapter `@opennextjs/cloudflare` y trae algo más de fricción en ISR/optimización de imágenes. No es necesario hoy — queda como plan B documentado.

### 4.2 Notificaciones — por qué no CallMeBot para clientes

CallMeBot (usado hoy solo en Boreas.com para avisar al equipo interno de leads propios) es un bot no oficial: requiere que cada número receptor se "active" mandándole un mensaje primero, sin garantía de servicio, puede dejar de funcionar sin aviso. No es nivel profesional para algo de lo que un doctor va a depender. Por eso el diseño de este documento elimina la necesidad de cualquier bot de notificación en sitios de cliente: el WhatsApp deep-link no necesita notificación (llega directo al doctor), y el form secundario notifica por email vía Resend. CallMeBot puede seguir usándose para el sitio propio de Boreas si el equipo lo decide — no es parte del alcance de este documento.

**Escala de Resend:** free tier de 3,000 emails/mes aguanta ~100-300 clientes activos a un ritmo típico de 10-30 leads/mes por sitio — muy por encima de la meta de Fase 3 (10+ clientes) del documento maestro. Revisar consumo real cuando se acerquen a 8-10 clientes activos con formulario de e-book; plan pagado de Resend ($20 USD/mes por 50k emails) es trivial si hace falta.

## 5. Deploy y ambientes

- Cada repo-cliente conectado a su propio proyecto Vercel Pro. Push a `main` = producción; el developer builder trabaja en una rama `preview` (no en `main` directo).
- Vercel genera un dominio estable para esa rama (ej. `preview-boreas-dr-juan-perez.vercel.app`) que no cambia entre commits — se manda **un solo link** por WhatsApp al inicio de la revisión, y se actualiza solo con cada push. No se reenvían links nuevos en cada ronda.
- Producción y dominio final solo se activan tras aprobación explícita del cliente (§6).
- Variables `CALLMEBOT_PHONE`/`CALLMEBOT_APIKEY` (si se usan en el sitio propio de Boreas) se configuran únicamente en el ambiente Production de Vercel, nunca en Preview, para que pruebas del cliente en el link de revisión no disparen notificaciones falsas.
- Supabase no distingue preview/producción — es el mismo proyecto compartido en ambos casos.

## 6. Revisión y feedback con el cliente

- **El closer es el único punto de contacto del cliente** de principio a fin — los developers nunca hablan directo con el doctor.
- **2 rondas de revisión incluidas** en el precio, sin importar el plan.
  - Ronda 1: closer manda el link de preview + pide feedback por WhatsApp + llena un formulario interno de revisión → se lo pasa al developer de turno.
  - Si el feedback por texto no alcanza, o el cliente lo pide: se escala a una **videollamada por Zoom** con un developer, compartiendo el preview en vivo y anotando directo sobre la pantalla compartida (función nativa de Zoom, gratis, sin límite de tiempo en llamadas 1:1). Esto sustituye la necesidad de una tercera ronda — es una forma más profunda de resolver la ronda 2, no una ronda adicional.
- **Aprobación explícita obligatoria** antes de hacer merge a producción — se le pregunta directo ("¿le parece bien así para publicarlo?") y se espera un sí claro. No se asume aprobación por silencio. Si no responde en ~3-5 días hábiles, el closer da seguimiento.

**Decisión abierta, no bloqueante:** qué pasa si un cliente insiste en una tercera ronda más allá de la escalación a Zoom (cobrar extra vs. cortar alcance) — se decide caso por caso por el closer mientras el volumen sea bajo; formalizar como política cuando haya más datos reales.

## 7. Entrega final

1. Aprobación explícita recibida → merge a `main` → deploy de producción.
2. Conectar el dominio del cliente (ya en su poder desde el inicio) — el developer agrega los registros DNS que pide Vercel. Si el cliente no puede hacerlo solo, se resuelve por la misma videollamada de Zoom.
3. QA final corto (no exhaustivo): mobile responsive, el CTA de WhatsApp abre correctamente, el form de contacto llega a Supabase y notifica por email, SSL activo, sin errores de consola.
4. Cobro del restante vía Mercado Pago en este momento — antes o junto con la entrega de credenciales, no después. Si es Plan B, aquí se activa la suscripción mensual (primer cobro el día de entrega).
5. Credenciales según plan:
   - Plan A: se transfiere el repo de GitHub + el proyecto de Vercel a la cuenta del cliente (necesita tener o crear una).
   - Plan B: Boreas conserva GitHub y Vercel; el cliente solo recibe confirmación de que su sitio está en línea.
6. Mensaje de confirmación por WhatsApp del closer: sitio en vivo + qué sigue según su plan + agradecimiento.
7. Mismo momento, en un solo mensaje de entusiasmo del cliente, se combinan tres asks que el documento maestro marcaba por separado:
   - Pitch de Relevo (upsell).
   - Si el cliente eligió Plan A sin garantía: ofrecer el add-on de mantenimiento.
   - Pedir reseña/testimonio — resuelve el hueco de falta de prueba social del sector salud, y siembra el programa de referidos entre colegas médicos.
8. Registro interno: marcar el proyecto como entregado en el tracker con fecha, para alimentar el KPI de "tiempo de entrega" (meta 7-14 días hábiles).

## 8. Resumen del flujo completo

```
Anticipo cobrado
  → Onboarding (audio 1 min → closer transcribe/interpreta → form interno → dev builder)
  → Build en repo-cliente (rama preview, Vercel Pro)
  → Revisión (WhatsApp / escalación a Zoom con anotación) — 2 rondas
  → Aprobación explícita
  → Producción + dominio + cobro del restante + credenciales según plan
  → Upsell Relevo + reseña + referidos
```

## 9. Decisiones abiertas (no bloquean implementación)

- Herramienta exacta para el formulario interno de onboarding y de revisión (Sheets vs Notion).
- Quién absorbe el costo anual del dominio en Plan B.
- Política formal para una tercera ronda de revisión si el cliente insiste más allá de la escalación a Zoom.
