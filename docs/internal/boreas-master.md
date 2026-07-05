# Boreas — Documento Maestro de Negocio

> **Confidencial — uso interno.** Contiene precios, márgenes, guiones de venta y estrategia
> comercial. Nunca exponer en el sitio público ni en commits fuera de este repo privado (regla
> heredada de [`GUIDELINES.md`](../../GUIDELINES.md) §1).
>
> **Este documento reemplaza** a los PDF/DOCX que vivían en `assets/` (movidos a
> `assets/deprecated/` el 2026-07-02) y consolida su contenido, corrigiendo discrepancias y
> retirando tácticas ya abandonadas. Es la única fuente de verdad para negocio/ventas/operación;
> `GUIDELINES.md` sigue siendo la fuente de verdad para producto/copy/diseño/código del sitio.
> Si hay conflicto entre ambos en temas de negocio, gana este archivo.

---

## 1. Resumen ejecutivo

Boreas es una agencia especializada en presencia digital para profesionales de la salud con
consultorio particular en México. No vende páginas web: vende **consultorios digitales abiertos
24/7** que filtran, convencen y agendan pacientes automáticamente, liberando al personal de
tareas repetitivas de comunicación.

- **Equipo:** 2 developers + 1 closer/SDR. Sin nadie dedicado a operaciones — ver §8.1.
- **Fase del negocio:** 0→1. Prioridad absoluta: el primer cierre, no la perfección del proceso.
- **Entrega:** 48–72 h. Esfuerzo del médico: un audio de WhatsApp de 1 minuto. Nada más.
- **Upsell secundario:** Relevo (relevo.chat, IA para WhatsApp + agenda). Se presenta al entregar
  el sitio, nunca antes de cerrar la venta principal.

## 2. Filosofía y posicionamiento

### 2.1 Ecuación de valor (Alex Hormozi)

```
Valor = (Resultado Soñado × Certeza de Lograrlo) / (Tiempo de Entrega × Esfuerzo y Sacrificio)
```

Aplicada al consultorio particular:

- **Resultado soñado:** el médico no quiere un archivo de código ni una plantilla; quiere un
  consultorio digital abierto 24/7 que refleje su esencia y le filtre pacientes decididos.
- **Certeza de lograrlo:** se maximiza apalancando la reputación que el médico ya tiene en Google
  Maps y asegurando redacción profesional especializada.
- **Tiempo de entrega:** 48–72 horas. La inmediatez destruye la duda de compra.
- **Esfuerzo y sacrificio:** reducido a cero. El médico no llena formularios ni redacta textos —
  su único esfuerzo es un audio de WhatsApp de 1 minuto.

> **Táctica retirada:** versiones anteriores de este documento mencionaban una "oferta flash de
> $5,000 MXN" con escasez semanal ("último cupo de la semana"). Esa táctica **queda prohibida** —
> contradice la regla vigente de `PRODUCT.md`/`GUIDELINES.md`: no precio público, no escasez
> semanal, no "último lugar". La urgencia se construye distinto — ver §2.4.

### 2.2 Reencuadres de producto

| ❌ No se vende | ✅ Sí se vende |
|---|---|
| "Una página web" | "Un consultorio digital abierto las 24 horas" |
| "Diseño y desarrollo web" | "Le quitamos el peso de encima a su asistente y le devolvemos su tiempo" |
| "Presencia en internet" | "Pacientes que llegan listos para agendar, porque la página ya hizo el filtro" |

### 2.3 Cambio de narrativa — beneficio sobre etiqueta

Principio Hormozi de "claridad antes que ingenio": eliminar nombres abstractos, inglés técnico y
metáforas corporativas.

| Término técnico (lo que NO se dice) | Descripción de beneficio vivo (lo que SÍ se dice) |
|---|---|
| "Diseño web responsivo / landing page" | "Tener tu consultorio, con tu tono y esencia, pero en línea. Abierto 24 horas, sin descanso, impecable en el celular de cualquier paciente." |
| "Filtro de confianza / autoridad de marca" | "Que el paciente que ya vio tus estrellas en Google Maps no se quede con la duda, sino que dé el paso firme, listo para pagar tu consulta." |
| "Calificación de leads / filtro de prospectos" | "Ahorrarle tiempo a tu asistente: en lugar de contestar 20 mensajes de curiosos, le heredas mensajes de pacientes que ya saben qué haces y van directo a agendar." |
| "Call to action optimizado" | "Un botón claro que conecta al paciente con tu WhatsApp en un solo toque." |

### 2.4 Urgencia — versión vigente

- ✅ Urgencia atada a comportamiento real del paciente: noches, madrugadas, fines de semana (ver
  dato de 40% en §3).
- ❌ No mostrar precio público. ❌ No escasez semanal. ❌ No "último lugar".

### 2.5 Propuesta de valor central

El profesional de la salud pierde pacientes y tiempo todos los días porque su asistente (o él
mismo) responde las mismas preguntas básicas: ¿cuánto cuesta?, ¿tienen disponibilidad?, ¿qué
especialidad manejan? La página de Boreas responde esas preguntas antes de que suene el
teléfono — y cuando suena, el paciente ya está listo para agendar.

### 2.6 Criterio de cliente ideal (ICP)

No se segmenta por especialidad médica, sino por señales de dolor y oportunidad:

- Consultorio particular (no hospitales ni IMSS/ISSSTE).
- Presencia en Google Maps con 4.3★ o más y actividad reciente.
- Sin página web, con web rota o web desactualizada (sin CTA para agendar).
- Área metropolitana o ciudad capital (mayor capacidad de pago).

Filtro adicional en el scraping: ¿la web actual tiene formulario o botón de agendar cita? No toda
web visible desde fuera es funcional para conversión.

## 3. Datos de mercado (fuente de las estadísticas citables del sitio)

> `GUIDELINES.md` exige que toda estadística mostrada en el sitio tenga fuente citable. Estas son
> las que respaldan las cifras usadas en `content/boreas-home.ts` (bloque `socialProof.stats`).

- **84%** de los pacientes busca y evalúa activamente la presencia en línea de un médico
  especialista antes de decidirse a agendar una primera cita.
- **3×** más conversión: los perfiles de Google Maps que enlazan a un espacio digital propio y
  optimizado registran hasta 3 veces más clics hacia llamadas/WhatsApp directos que los que
  redirigen a redes sociales genéricas.
- **40%+** de las citas y solicitudes de información médica digital ocurren fuera de horario de
  oficina tradicional (noches, madrugadas, fines de semana).

## 4. Modelo de negocio y precios

Dos esquemas, dos precios cada uno según complejidad del proyecto. **El dominio siempre lo compra
y administra el cliente por separado** (Boreas ofrece opciones y precios, en ambos planes).

### 4.1 Plan A — Pago único

| Concepto | Monto |
|---|---|
| Precio total | $10,000 o $15,000 MXN (según complejidad) |
| Anticipo mínimo | $2,000 MXN |
| Resto, al entregar | $8,000 o $13,000 MXN |
| Add-on opcional: garantía + mantenimiento 1 año | $500/mes × 12 (suscripción recurrente MP, no MSI) |
| Credenciales | Se transfieren GitHub repo + proyecto Vercel a la cuenta del cliente |
| Administración | Del cliente, total, desde la entrega |
| Ideal para | Clínicas establecidas, presupuesto claro |

### 4.2 Plan B — Pago reducido + mensualidad forzosa

| Concepto | Monto |
|---|---|
| Precio base | $5,000 u $8,000 MXN (según complejidad) |
| Anticipo mínimo | $2,000 MXN |
| Resto, al entregar | $3,000 o $6,000 MXN |
| Mensualidad forzosa, 12 meses | $1,000/mes (suscripción recurrente MP, incluye garantía + mantenimiento) |
| Renovación año 2 (opcional) | $500/mes × 12 |
| Credenciales | Boreas conserva GitHub + Vercel — "administración total" |
| Administración | De Boreas mientras la suscripción esté activa |
| Ideal para | Consultorios nuevos o con flujo de caja ajustado |

**Nota de consistencia:** el total del Plan B a lo largo de 12 meses ($5-6k + $12k = ~$17-20k)
puede terminar siendo mayor al Plan A con garantía ($10-16k). Es intencional — menor fricción de
entrada a cambio de mayor costo total financiado. El guion de venta debe enmarcarlo así, no como
sorpresa al mes 6.

### 4.3 Cobro — suscripción recurrente, no MSI

Los pagos a plazo se cobran como **suscripción/preapproval recurrente de Mercado Pago**, nunca
como link de Meses Sin Intereses. MSI cobra a Boreas una comisión adicional de ~12.89%+IVA sobre
el total financiado (confirmado en cuenta real de MP), encima de la comisión base — reduce el
margen de forma significativa y exige que el cliente tenga línea de crédito por el monto total.
La suscripción recurrente solo cobra la comisión base por transacción una vez al mes:

- Cualquier método (tarjeta): 2.44% + $4.00 MXN por cobro.
- Efectivo / OXXO / depósito: 2.65% + $4.00 MXN por cobro.

Ventaja adicional: no requiere que el cliente tenga crédito disponible por el monto total,
amplía el universo de clientes elegibles (débito, OXXO).

**Política de cobro fallido (operativa en MP):** 3 intentos a los 2, 5 y 7 días después de la
fecha de facturación. Al día 10 sin éxito, la suscripción se pausa automáticamente — y Boreas
pausa en paralelo el proyecto en Vercel del cliente. Se le da a elegir: reactivar (se reanuda
cobro y sitio), o recibir sus credenciales de una vez y cancelar garantía/mantenimiento a cambio
del equivalente de lo que le restaba por pagar.

### 4.4 Estrategia de precio en fase de validación

En los primeros clientes, el objetivo no es maximizar el precio: es validar el umbral de
resistencia del mercado y obtener casos de éxito del sector salud. Ofrecer Plan B como entrada de
menor fricción para los primeros cierres; escalar agresividad de precio una vez con 2-3 casos de
éxito documentados del sector.

### 4.5 Upsell: Relevo

Relevo (relevo.chat) es una plataforma IA que responde mensajes y administra agendas vía
suscripción mensual — complemento natural: la página atrae al paciente, Relevo lo convierte y
agenda automáticamente.

- **Momento ideal:** al entregar la página terminada (cliente en modo de entusiasmo) — ver §7.
- ⚠ No presentar Relevo antes de cerrar la venta principal — aumenta la complejidad del pitch y
  puede frenar el cierre.

## 5. Equipo

| Rol | Responsabilidades | Métricas clave |
|---|---|---|
| Developer 1 (builder) | Arma el sitio a partir del onboarding | Páginas armadas / tiempo |
| Developer 2 (polisher) | Pule calidad y maneja ajustes de revisión con el cliente (vía closer) | Rondas resueltas / tiempo |
| Closer / SDR | Cold calls, calificación de leads, cierre, cobro de anticipos, único punto de contacto del cliente | Llamadas/día, tasa de conexión, cierres, anticipos cobrados |

### 5.1 Puntos ciegos del equipo actual

- Sin nadie dedicado a operaciones/onboarding — en cuanto haya 3+ clientes simultáneos, la
  coordinación closer↔developers es el cuello de botella más probable.
- Depender de una sola persona (el closer) para todos los ingresos es el riesgo más crítico del
  negocio en esta etapa.

## 6. Proceso comercial

### 6.1 Pipeline de ventas

1. **Scraping (Apify)** → leads exportados a Google Sheets con filtros de calidad.
2. **Calificación previa** → priorizar leads sin web, 4.3★+, actividad reciente.
3. **Cold call** → pitch de 60-90 segundos, objetivo: generar interés o agendar demo.
4. **Seguimiento** → WhatsApp o segunda llamada si no se cerró en el primer contacto.
5. **Cierre** → acuerdo de plan de pago + cobro de anticipo ($2,000 mín.).
6. **Onboarding** → ver §6.4.
7. **Entrega** → flujo completo documentado en
   [`docs/superpowers/specs/2026-07-02-post-anticipo-delivery-workflow-design.md`](../superpowers/specs/2026-07-02-post-anticipo-delivery-workflow-design.md).
8. **Upsell + reseña + referidos** → mismo momento de entrega, ver §7.

### 6.2 Criterios de calificación de lead (30 segundos, antes de llamar)

- ¿Tiene página web? → si no tiene, prioridad máxima.
- ¿Cuántas estrellas en Google Maps? → mínimo 4.3.
- ¿Muestra actividad reciente? → respuestas a reseñas, fotos actualizadas.
- ¿Es consultorio particular? → descartar hospitales y servicios públicos.
- ¿Tiene teléfono visible? → necesario para cold call.

### 6.3 Script de cold call — estructura

| Fase | Objetivo | Ejemplo |
|---|---|---|
| Apertura (0-15s) | No colgar | "¿Hablo con [consultorio]? Soy [nombre] de Boreas — le llamo porque encontré su consultorio en Google Maps y quería hacerle una pregunta rápida de 30 segundos sobre cómo están llegando sus pacientes nuevos." |
| Diagnóstico (15-45s) | Que el prospecto hable del dolor | "¿Actualmente cómo lo contactan los pacientes nuevos? ¿Llaman directo o cómo se enteran de usted?" |
| Gancho (45-75s) | Conectar dolor con solución, sin tecnicismos | "Lo que hacemos en Boreas es ponerle un asistente digital a su consultorio que responde esas preguntas a cualquier hora. ¿Tiene 10 minutos esta semana para mostrarle cómo funciona para su consultorio?" |
| Cierre de siguiente paso | Conseguir la reunión/demo — **la llamada NO busca vender** | Ver objeciones abajo |

### 6.3.1 Manejo de objeciones

| Objeción | Respuesta sugerida |
|---|---|
| "Ya tengo Facebook/Instagram" | Las redes consiguen visitas; la página es donde esas visitas se convierten en citas. Sin página, su asistente hace el trabajo que la web podría hacer sola, 24 horas. |
| "Es muy caro" | ¿Cuánto le cuesta perder un paciente que no pudo agendar porque nadie contestó un domingo? La página se paga con 1-2 citas nuevas al mes. |
| "Ya lo hizo alguien y no funcionó" | Una página que no convierte es un flyer digital. Lo que construimos es un proceso de captación: filtra, convence y agenda. Le muestro ejemplos. |
| "No tengo tiempo" | Por eso existe el modelo mensual: usted nos da la información una vez, nosotros mantenemos todo actualizado. |
| "Déjame pensarlo" | Entendido. ¿Le parece si le preparo una muestra de cómo luciría su consultorio digital? Sin costo, sin compromiso. |

### 6.4 Onboarding (closer → developer)

El doctor **no** llena formularios ni entrega redes/fotos — coincide con "esfuerzo cero". Su
único input: **un audio de WhatsApp de mínimo 1 minuto**, cubriendo 3 ejes:

1. **Foco comercial:** los 2-3 tratamientos más rentables que quiere llenar en su agenda.
2. **Identidad visual básica:** elección de atmósfera (limpia/tecnológica en azules, o
   relajante/estética en tonos orgánicos) — dirección de diseño, no especificación técnica.
3. **Diferenciador real:** por qué lo eligen sus pacientes actuales (instalaciones, puntualidad,
   tecnología sin dolor, etc.).

Flujo:

1. Closer cobra el anticipo.
2. Closer transcribe el audio (speech-to-text) e interpreta ambigüedades de dirección de diseño
   (ej. "estética amable pero clínica y profesional" → nota explícita para el developer).
3. Assets (fotos, redes, horarios, reseñas de Google Maps) los recolecta Boreas de fuentes
   públicas/scraping — no se le piden al cliente.
4. Closer llena un **formulario interno** (transcripción + interpretación + los 3 ejes + link a
   carpeta de assets) en la misma herramienta donde vive el pipeline de leads.
5. Cae directo al developer builder asignado — listo para empezar sin volver a tocar al cliente
   hasta la primera preview.

**Herramienta:** Google Forms (closer llena datos con campos guiados) → Google Sheets (tabla viva,
misma hoja donde ya vive el pipeline de leads). Costo cero, sin herramienta nueva que adoptar.
Notion se descarta por ahora — se revisita en la migración a CRM de Fase 3 (10+ clientes, ver §10.1).

### 6.5 Refuerzo psicológico post-depósito

Para que el cliente se mantenga en modo de entusiasmo mientras se desarrolla el proyecto:

- **Documento de respaldo:** enviar de inmediato un resumen ejecutivo corto (puede ser un mensaje
  de WhatsApp bien estructurado, no necesita ser PDF formal) que valide en términos de negocio
  (dinero/tiempo ganado) que tomó una buena decisión.
- **Prueba social real:** extraer las mejores reseñas reales del cliente en Google Maps e
  integrarlas en el diseño de su propio sitio. Ver sus propias palabras plasmadas en su página
  genera pertenencia instantánea y resuelve, a nivel de cada sitio de cliente, el hueco de "prueba
  social" que hoy sigue abierto a nivel de Boreas.com (`GUIDELINES.md` backlog P1).

## 7. Entrega final y upsell

Flujo operativo completo (stack, deploy, revisión, entrega) documentado en
[`docs/superpowers/specs/2026-07-02-post-anticipo-delivery-workflow-design.md`](../superpowers/specs/2026-07-02-post-anticipo-delivery-workflow-design.md).
Resumen del momento de entrega: al confirmar que el sitio está en vivo, en el mismo mensaje de
entusiasmo del cliente se combinan tres asks:

1. Pitch de Relevo (upsell).
2. Si eligió Plan A sin garantía: ofrecer el add-on de mantenimiento ($500/mes × 12).
3. Pedir reseña/testimonio — alimenta el portafolio del sector salud y siembra el programa de
   referidos entre colegas médicos (ver §8.2).

## 8. Riesgos y oportunidades

### 8.1 Riesgos

- Sin casos de éxito propios del sector salud, el pitch depende del carisma del closer y de la
  calidad de Boreas.com — mitigar con demo ficticia de consultorio médico/dental en el portafolio.
- Depender de una sola persona (closer) para todos los ingresos sigue siendo el cuello de botella
  más crítico.
- **Resuelto en esta iteración:** política de cobro fallido en mensualidad (§4.3) y quién
  administra qué según plan (§4.1/§4.2) — ya no son huecos abiertos.

### 8.2 Oportunidades no explotadas

- Los clientes del sector salud son muy referentes entre sí — un doctor satisfecho puede
  recomendar a 3 colegas del mismo edificio. Diseñar programa de referidos desde el inicio
  (pedirlo justo al momento de entrega, §7).
- El modelo mensual genera MRR predecible que financia la operación sin depender de nuevas
  ventas — priorizar cerrar clientes en Plan B mientras se valida precio.

## 9. Operaciones y tecnología

Stack, hosting, notificaciones y escalado de infraestructura por cliente están definidos en
detalle en el spec de flujo de entrega (§6.1 punto 7 arriba). Resumen:

- **Repo plantilla único** (Next.js + Tailwind + framer-motion) clonado por cliente vía "template
  repository" de GitHub — sin CMS, mantenimiento vía código.
- **Hosting:** Vercel Pro (no Hobby — uso comercial de clientes viola los términos de Hobby).
  Costo por asiento de equipo, no por sitio de cliente — no escala exponencialmente.
- **CTA principal de cada sitio:** link `wa.me/<doctor>` directo, sin backend.
- **Form secundario:** Supabase compartido (un proyecto, columna `cliente_slug`) + notificación
  por email vía Resend. Nunca WhatsApp bot para clientes (CallMeBot solo para el pipeline propio
  de Boreas, no para sitios de cliente — no es nivel profesional para algo de lo que un doctor
  dependa).
- **Leads propios de Boreas** (Boreas.com): ya persisten en Supabase + notifican por WhatsApp vía
  CallMeBot (`app/actions/submit-contact.ts`) — implementado, no es mock.
- **Contexto operativo en cada repo de cliente:** una versión condensada de este documento
  (esquemas de pago, regla de dominio, resumen del flujo de entrega — sin scripts de venta ni
  KPIs de pipeline) vive gitignoreada en `docs/internal/boreas-internal-context.md` dentro de
  `boreas-template` y de cada `boreas-<cliente>` clonado de él. Es una copia derivada, no una
  segunda fuente de verdad — si hay discrepancia, gana este documento.

## 10. KPIs y métricas

| Métrica | Definición | Meta inicial | Frecuencia |
|---|---|---|---|
| Llamadas realizadas/día | Llamadas efectivas del closer | 20-30/día | Diaria |
| Tasa de conexión | % de llamadas que contestan | ~20-30% | Semanal |
| Tasa de interés | % de contactos que quieren saber más | 10-15% | Semanal |
| Cierre/anticipo cobrado | Ventas cerradas con pago inicial | 1-2/semana (meta) | Semanal |
| Tiempo de entrega | Desde anticipo hasta entrega | 7-14 días hábiles | Por proyecto |
| MRR | Total de mensualidades activas | $5,000 a los 3 meses | Mensual |
| Upsell Relevo | Clientes activos usando relevo.chat | 1 upsell / 3 ventas | Mensual |

### 10.1 Metas por fase

- **Fase 1 — Validación (semanas 1-4):** primer anticipo cobrado; validar precio con mínimo 3
  respuestas de mercado; script de cold call probado con datos reales.
- **Fase 2 — Primeros clientes (mes 2-3):** 3-5 clientes entregados y satisfechos; al menos 1 caso
  de éxito documentado del sector salud; MRR $1,500-2,500; 1 upsell de Relevo activo.
- **Fase 3 — Escala (mes 4-6):** 10+ clientes entregados; onboarding estandarizado (checklist);
  MRR $5,000+; evaluar contratar closer adicional o tercer developer. **Este es también el punto
  para revisitar Google Sheets → CRM básico y revisar consumo real de Resend/Supabase.**

## 11. Notas y actualizaciones

| Fecha | Cambios |
|---|---|
| Junio 2025 | Documento inicial (versión "Uso Interno") — contexto completo del negocio. |
| Junio 2025 (variante) | Documento "Estrategias de Infraestructura Digital Médica" — psicología de venta, data de mercado, protocolo de onboarding y blindaje post-depósito. |
| 2026-07-02 | Unificación de ambos documentos en este archivo. Corregido: táctica de escasez/precio flash retirada (contradice reglas vigentes); pricing de add-ons corregido (Plan A $500/mes, Plan B $1,000/mes — estaban invertidos en un borrador de sesión); cobro por suscripción recurrente MP en vez de MSI; stack de notificaciones actualizado (sin CallMeBot para clientes); flujo de entrega completo documentado por separado y referenciado aquí. Los PDF/DOCX originales se movieron a `assets/deprecated/`. |
