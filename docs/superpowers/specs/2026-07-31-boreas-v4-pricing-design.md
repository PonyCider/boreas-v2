# Boreas V4 — Pricing público (design)

Fecha: 2026-07-31

## Contexto

Hasta este documento, Boreas V4 heredaba de V3 la regla **"sin precio público"**. El Epic 5 estaba
definido únicamente como un formulario de contacto con validación y backend Resend.

Esa regla se deroga. V4 muestra precios públicos en la landing, en cuatro paquetes con precios
diferenciados, más dos toggles de configuración por card.

Razón del cambio: el pricing oculto obliga al visitante a una llamada antes de saber si el
servicio está en su rango. Para un ticket de $12,900–$32,900 MXN dirigido a un especialista
independiente, esa fricción filtra más leads calificados de los que protege.

## Alcance de este documento

Cubre: modelo de cobro, los cuatro paquetes y su contenido, la mecánica de los toggles, la
escalera de precios, el costeo real por cliente, la arquitectura y los límites del chatbot IA,
las reglas de anticipo y materiales, los tiempos de entrega, y los candados de alcance.

No cubre: el diseño visual pixel-perfect de las cards (se define al construir el Epic 5), el
copy final palabra por palabra, ni el contrato legal (este documento define las cláusulas que
el contrato debe contener, no su redacción jurídica).

## Decisiones

### 1. Modelo de cobro: setup único + mensualidad

Todo paquete se cobra en dos componentes independientes:

| Componente | Qué paga | Cuándo |
|---|---|---|
| **Setup** | Construcción del sitio | Pago único, 50% anticipo / 50% contra entrega |
| **Mensualidad** | Hosting, certificado SSL, respaldos, actualizaciones de seguridad, monitoreo, soporte, y administración de la renovación del dominio | Desde el mes siguiente a la publicación. Primer mes incluido en el setup |

Sobre el dominio: en Esencial y Profesional el dominio es del cliente y él cubre su costo anual;
Boreas administra la renovación como parte de la mensualidad. En Deluxe y Organizaciones el
**primer año de dominio va incluido** en el setup, y a partir del segundo año aplica la misma
regla.

**Regla única, sin excepciones por paquete: la mensualidad arranca el mes siguiente a que el
sitio sale en vivo.** No hay "a partir del mes 4" ni "a partir del mes 13".

La **garantía** es un reloj distinto y no gatea la mensualidad. Garantía significa: durante ese
periodo se corrigen sin costo errores, bugs o cosas que no funcionen como se acordó. No cubre
funciones nuevas ni rediseños.

Sin permanencia forzosa: el cliente puede cancelar con 30 días de aviso; se le entrega el código
y se le apoya en la migración. Esta cláusula es deliberadamente visible en la card — el miedo
principal del cliente de consultorio no es el precio, es quedar amarrado a un proveedor.

### 2. Los cuatro paquetes

Precios en MXN.

| | **Esencial** | **Profesional** ★ | **Deluxe** | **Organizaciones** |
|---|---|---|---|---|
| **Setup** | $12,900 | $19,900 | $32,900 | Cotización |
| **Mensualidad** | $590 | $890 | $1,490 | Desde $2,900 |
| Motores de conversión | 1 (a elección) | 2 | 3 | Todos |
| Páginas | Landing 1 pág | Landing + blog | Hasta 6 págs | A medida |
| SEO técnico + Google Business | ✓ | ✓ | ✓ | ✓ |
| WhatsApp, redes, Google Maps | ✓ | ✓ | ✓ | ✓ |
| Copy escrito por Boreas | — | ✓ | ✓ | ✓ |
| Logo vectorizado | — | ✓ | ✓ | ✓ |
| Agendamiento (Cal.com) | — | ✓ | ✓ | ✓ |
| Analítica + reporte mensual | — | ✓ | ✓ | ✓ |
| Dominio incluido (1 año) | — | — | ✓ | ✓ |
| Revisión de copy vs. COFEPRIS | ✓ | ✓ | ✓ | ✓ |
| Rondas de revisión | 2 | 3 | 4 | Ilimitadas |
| Garantía | 3 meses | 12 meses | 12 meses | SLA |

**Organizaciones** añade sobre Deluxe: portal de pacientes con autenticación, múltiples sedes o
múltiples especialistas, tracking de errores, mapas de calor, integraciones a medida (CRM,
expediente clínico), y SLA contractual.

`Profesional` es el paquete recomendado y se marca visualmente como tal.

### 3. Los dos toggles

Cada card lleva dos interruptores opcionales en lugar de multiplicar el número de cards.

**Toggle A — Entrega Express.** Reduce el tiempo de entrega. Precio igual al salto hacia el
siguiente paquete (ver §4).

**Toggle B — Chatbot IA.** +$6,000 setup, +$400/mes. Disponible **solo en Deluxe y
Organizaciones**. Esto produce la separación entre "Deluxe" y "Deluxe + IA" sin necesidad de una
quinta card.

### 4. La escalera de precios

Los saltos entre paquetes no son uniformes: Esencial→Profesional son $7,000, Profesional→Deluxe
son $13,000. El fee de Express se fija **exactamente igual al salto correspondiente**, de modo
que activar Express en un paquete cuesta lo mismo que subir al paquete completo de arriba.

| Configuración | Total setup | Alternativa al mismo precio |
|---|---|---|
| Esencial + Express (+$7,000) | $19,900 | **= Profesional** completo |
| Profesional + Express (+$13,000) | $32,900 | **= Deluxe** completo |
| Deluxe + Express (+$13,000) | $45,900 | Sin escalón superior |

El objetivo del toggle no es venderse por volumen: es hacer que el paquete superior se vea
obviamente mejor por el mismo dinero. Quien aun así compra Express es porque necesita velocidad
de verdad, y en ese caso el precio está justificado.

### 5. Costeo real por cliente

| Concepto | Costo mensual | Nota |
|---|---|---|
| Chatbot IA (DeepSeek V4 Flash, con cache) | $6–20 MXN | 300–1,000 conversaciones/mes |
| Hosting (Vercel Pro) | ≈$0 marginal | Una cuenta Pro cubre todos los clientes |
| Dominio | $25–60 MXN | $250–700 MXN/año amortizado |
| Base de datos (Supabase/Neon free tier) | $0 | Un consultorio no acerca el límite |
| Email transaccional (Resend free tier) | $0 | 3,000 correos/mes |

**Costo total por cliente: $30–100 MXN/mes.** Contra una mensualidad de $590–1,890, el margen es
de 6× a 20×.

Implicación de diseño: la mensualidad **no se justifica por costo, se justifica por valor**
(mantenimiento, actualizaciones, soporte, uptime). El precio lo fija el mercado, no la hoja de
costos. El costeo sirve para confirmar que no hay sangrado, no para derivar el precio.

### 6. Chatbot IA — arquitectura y límites

**Modelo:** DeepSeek V4 Flash. $0.14/1M input (cache miss), $0.28/1M output, $0.0028/1M cache
hit. El prompt de sistema y la base de conocimiento del consultorio son estables, por lo que la
mayor parte del input entra por cache hit.

**Control de gasto — obligatorio, no opcional:**

- Tope de mensajes por sesión y por IP.
- Presupuesto mensual de tokens con corte automático al alcanzarlo.

El costo base es despreciable; el riesgo real es el abuso de un endpoint público sin límite.
Sin corte automático el costo no es $20 MXN, es ilimitado.

**Alcance del bot — restringido a logística.** El bot responde sobre horarios, servicios,
precios, ubicación y agendamiento. Cualquier tema clínico se redirige a consulta
("eso lo revisa el especialista en consulta, ¿agendamos?").

Razón: un chatbot en la landing de un psicólogo recibiría **datos personales sensibles** (salud
mental). Bajo la LFPDPPP mexicana esos datos exigen consentimiento expreso, y si salen del país
la transferencia internacional debe declararse. DeepSeek opera desde China. Acotar el bot a
logística hace que el problema no llegue a existir, y además produce un mejor producto: el bot
convierte a cita en vez de intentar dar orientación clínica.

**Aviso de privacidad obligatorio en todos los sitios**, no solo los que llevan chatbot: el
formulario de contacto ya recaba datos personales por sí solo. En los sitios con chatbot, el
aviso además declara el procesamiento por IA y la transferencia internacional de datos.

**Pendiente (no bloquea):** evaluar hospedar DeepSeek con un proveedor fuera de China (los pesos
son abiertos). Elimina el componente de transferencia internacional a costo similar.

### 7. COFEPRIS como diferenciador

Toda comunicación que ofrezca servicios de salud en México está regulada por COFEPRIS: hay
términos prohibidos y promesas de resultado que no se pueden hacer.

Boreas incluye **revisión del copy contra lineamientos COFEPRIS en todos los paquetes** y lo
presenta como diferenciador vendible en la card. Es un riesgo que la competencia genérica ignora
y que el especialista sí reconoce.

Consecuencia interna: el copy que Boreas escribe para clientes (Profesional en adelante) pasa por
esa revisión antes de publicarse. Es una checklist de producción, no solo una línea de marketing.

### 8. El Minuto Boreas

Mecanismo propietario de eliminación de fricción en el arranque. **La única obligación del
cliente para que el proyecto arranque es un audio de un minuto.**

El closer le hace tres preguntas que responde en un solo audio:

1. **¿A quién quieres atraer?** — "Descríbeme al paciente que te gustaría tener más seguido."
   Define el copy y **qué motor de conversión le corresponde**.
2. **¿Por qué te eligen a ti y no al de la otra cuadra?** Alimenta la sección de diferenciación,
   que es lo único que no se puede inventar ni copiar de la competencia.
3. **¿Qué quieres que haga quien entra a tu página?** Define el CTA primario y el flujo.

Son las tres cosas que no se pueden obtener de ninguna otra fuente. Todo lo demás lo recaba
Boreas.

Esto es argumento de venta de primera línea, no letra chica: *"Nos das un minuto de tu voz.
Nosotros hacemos el resto."* La razón principal por la que estos proyectos se atoran es que el
cliente tiene que hacer tarea. Boreas elimina la tarea.

### 9. Materiales y derechos de imagen

**Boreas recaba los materiales.** Fotos de redes sociales del cliente, logo, colores de marca,
lista de servicios, dirección, horarios, links de redes.

**Materiales opcionales del cliente.** Si el cliente quiere aportar sus propias fotos o textos,
el momento límite es la **primera revisión**. Lo que llegue después no mueve la fecha de entrega
y se integra **dentro del diseño ya aprobado**.

Esa última cláusula es el candado de alcance: sin ella, un cliente que entrega cuarenta fotos en
la tercera revisión espera un rediseño y lo cobra como revisión.

**Dos reglas obligatorias al recabar material de redes:**

1. **Ninguna foto con una persona identificable que no sea el especialista**, salvo autorización
   expresa por escrito. El Instagram de un consultorio puede contener fotos de talleres con
   asistentes visibles; publicarlas en el sitio los identifica como pacientes, lo que constituye
   dato personal sensible bajo LFPDPPP.
2. **Cláusula de derechos en el contrato:** *"El cliente declara tener los derechos de uso de
   todo el material publicado en sus perfiles públicos y autoriza a Boreas a utilizarlo en su
   sitio."* Una foto en redes puede ser de un fotógrafo que conserva el copyright o un stock
   licenciado solo para redes.

**Logo:** un logo descargado de redes es un JPG comprimido inservible para un header. Fallback:
se le pide al cliente el original, o se redibuja en vectorial. Vectorizarlo cuesta poco y se
percibe caro — por eso está incluido en Profesional y superiores.

### 10. Anticipo y reloj de entrega

**Anticipo: 50% para arrancar, 50% contra entrega.** Organizaciones se escalona 40/30/30 por el
tamaño del ticket.

El anticipo cumple dos funciones: reduce la tasa de abandono y cubre el tiempo invertido si el
cliente desaparece.

**Reloj de entrega:**

> El reloj arranca cuando se cumplen dos cosas: **anticipo pagado y audio recibido**. Nada más
> depende del cliente.
>
> A los 30 días sin audio, el proyecto se pausa y el anticipo no es reembolsable.

### 11. Tiempos de entrega

Referencia de mercado mexicano 2026: landing page 7–14 días; sitio corporativo de 5–10 páginas
3–6 semanas.

| Paquete | Base actual | Express actual | Base objetivo | Express objetivo |
|---|---|---|---|---|
| Esencial | 14–21 días | 7–10 días | 10–14 días | 5–7 días |
| Profesional | 14–21 días | 7–10 días | 10–14 días | 5–7 días |
| Deluxe | 21–30 días | 14–18 días | 18–25 días | 10–14 días |

**La card publica los tiempos actuales, no los objetivo.** Una fecha publicada es una promesa
comercial; incumplirla cuesta más que no haberla prometido.

Los tiempos objetivo se alcanzan cuando las **plantillas base** estén mejoradas lo suficiente
para sostenerlos. La transición se valida contra ~3 proyectos reales y luego se cambia el número
en `content/` — es una edición de una línea, no rebloquea nada.

Nota de posicionamiento: los "7 días" del mercado son plantillas genéricas sin motor de
conversión ni copy a medida, y **exigen que el cliente entregue fotos, textos, logo y reuniones**.
La ventaja competitiva de Boreas en la card no es la fecha: es el Minuto Boreas.

### 12. Reglas heredadas que cambian

- **Se deroga "sin precio público".** V4 muestra precios en la landing.
- **Se mantiene "sin escasez semanal"**: nada de countdowns, "quedan 2 lugares", ni presión
  artificial de tiempo. El toggle de Express es una opción real de producto, no un mecanismo de
  urgencia falsa.
- Se mantiene el resto de las reglas de V3 (un CTA primario por viewport, estadísticas con
  fuente citable, `prefers-reduced-motion`, contraste mínimo).

## Sección de pricing (Epic 5) — requisitos de UX

- Cuatro cards en grid. `Profesional` destacado como recomendado.
- Cada card muestra **setup y mensualidad como dos cifras separadas**, nunca sumadas.
- Un `(?)` junto a "Mensualidad" abre:

  > **¿Qué es la mensualidad?**
  >
  > El pago único construye tu sitio. La mensualidad lo mantiene vivo.
  >
  > **Incluye:** hosting, certificado de seguridad, respaldos automáticos, actualizaciones de
  > seguridad, monitoreo de caídas y soporte por WhatsApp.
  >
  > **Arranca** el mes siguiente a que tu sitio salga en vivo. El primer mes va incluido en el
  > pago inicial.
  >
  > **Sin permanencia forzosa.** Puedes cancelar cuando quieras con 30 días de aviso; te
  > entregamos el código y te ayudamos a migrar.

- Un `(?)` junto a "Garantía" abre:

  > Durante este periodo arreglamos sin costo cualquier error, bug o cosa que no funcione como se
  > acordó. No cubre funciones nuevas ni rediseños.

- Los dos toggles actualizan el precio mostrado en vivo, sin recargar. El toggle de IA está
  deshabilitado (visible pero inactivo, con explicación) en Esencial y Profesional.
- El formulario de contacto del Epic 5 recibe el paquete y los toggles seleccionados como
  contexto, para que el lead llegue precalificado.
- Todo el estado es cliente; el único punto de persistencia sigue siendo el envío del formulario
  vía Resend.

## Pendientes y dependencias

| Pendiente | Bloquea | Notas |
|---|---|---|
| Mejorar plantillas base | Tiempos objetivo (§11) | No bloquea el lanzamiento del pricing |
| Evaluar hosting de DeepSeek fuera de China | Nada | Mejora de cumplimiento, §6 |
| Redacción jurídica del contrato | Primera venta | Este documento define las cláusulas; falta redactarlas |
| Aviso de privacidad plantilla | Primer sitio con chatbot | §6 |
| Cuenta y link público de Cal.com | Epic 3.5 y Profesional+ | Heredado del spec de landing |
