# Epic 3 — Teatro de conversión (diseño aprobado)

Fecha: 2026-08-20

Estado: aprobado para preparar implementación

## Autoridad y relación con specs previos

Este documento redefine la experiencia de la sección `#motores` y la preparación de sus motores
para reutilización en sitios de clientes.

- Reemplaza la UX del selector `OptionWheel`, la composición de `MotorShell` y la transición de
  motores descritas en `2026-08-01-epic-3-motores-design.md` §4.
- Conserva de ese documento el catálogo, las fichas clínicas, los disclaimers, la separación entre
  lógica y UI y la regla de un motor vivo por categoría.
- Amplía el alcance de portabilidad: el núcleo deberá admitir captura real mediante adaptadores,
  aunque la landing de Boreas use un adaptador demo sin persistencia.
- No cambia pricing. La sección solo conduce hacia planes o catálogo.

## 1. Entendimiento aprobado

- La promesa principal es: **Boreas convierte visitas en pacientes preparados**.
- La promesa de apoyo es: **una web puede trabajar, no solo informar**.
- La tecnología demuestra el resultado; no es el protagonista.
- La sección habla primero al especialista independiente y demuestra capacidad para clínicas
  pequeñas.
- Cada motor ofrece una experiencia funcional completa de menos de un minuto.
- La salida comercial principal conduce hacia planes; el catálogo y las demás especialidades
  sostienen la amplitud de la oferta.
- Escritorio puede usar una secuencia fijada durante el scroll. Móvil empieza en flujo normal.
- La primera implementación perfeccionará el escenario y el cotizador dental. El sistema se
  extenderá a los otros cinco motores después de validarlo.

## 2. Objetivos

1. Convertir `#motores` en uno de los momentos principales de la landing.
2. Explicar visualmente la transformación `visita → interacción → resultado → paciente preparado`.
3. Hacer visible la cara del especialista, porque ahí está el argumento comercial.
4. Reemplazar el `OptionWheel` por navegación clara, accesible y estable.
5. Elevar el cotizador dental a estándar visual, funcional y técnico para los demás motores.
6. Preparar un núcleo portable con presentación y transporte intercambiables.
7. Mantener rendimiento, accesibilidad, privacidad y confiabilidad como restricciones del diseño.

## 3. No objetivos iniciales

- Rediseñar los seis motores a la vez.
- Convertir la sección en espectáculo tecnológico.
- Guardar respuestas clínicas completas por defecto.
- Soportar trabajo offline prolongado.
- Rediseñar pricing.
- Hacer sticky la experiencia móvil en la primera versión.
- Volver esencial cualquier capa Canvas o WebGL.

## 4. Dirección elegida: Teatro de conversión

La sección tiene dos momentos: demostración narrativa y prueba real.

### Acto 1 — La visita

La sección entra en flujo normal. Una señal anónima representa a una persona que llega con una
duda. La escena no usa pacientes, fotografías clínicas ni resultados fabricados.

Mensaje: una visita todavía no es un paciente.

### Acto 2 — El motor trabaja

En escritorio comienza un tramo fijado. El cotizador dental aparece progresivamente y muestra
cómo tratamiento, rango, visitas e inclusiones se convierten en información útil.

La demostración usa la misma estructura visual que el motor real. No crea una interfaz paralela.

### Acto 3 — Las dos caras

La escena se divide:

- El paciente recibe claridad para avanzar.
- El especialista recibe intención, contexto y siguiente paso.

Este es el clímax. La cara especialista debe tener presencia equivalente o mayor que el resultado
del paciente.

### Acto 4 — Toma el control

El tramo fijado termina. La misma interfaz queda disponible para completar el cotizador. Después
se revelan la navegación por especialidades, el catálogo relacionado y el CTA hacia planes.

### Móvil y movimiento reducido

- Móvil presenta los actos como bloques consecutivos, sin fijar el scroll.
- `prefers-reduced-motion` presenta los mismos estados sin transformación continua.
- Si la primera versión demuestra que el sticky funciona, se podrá explorar su extensión a más
  tamaños en otra decisión.

## 5. Metáfora visual

La metáfora es **señal dispersa → contexto estructurado**.

Fragmentos demostrativos como `precio`, `dolor`, `primera cita` o `disponibilidad` aparecen como
señales abstractas. Conforme avanza el motor, convergen en un resultado para el paciente y un
resumen operativo para el especialista.

El drama se construye con composición, luz, escala tipográfica, profundidad y transformación de
información. No cambia el tema oscuro de la sección.

### Capa Canvas o WebGL

Se permite una capa ambiental puntual si supera claramente una versión DOM.

- Es decorativa y prescindible.
- No contiene texto ni información esencial.
- Se pausa fuera del viewport y con la pestaña oculta.
- Reduce resolución en dispositivos limitados.
- Se elimina bajo movimiento reducido.
- La interacción principal funciona si esa capa falla o no carga.

## 6. Navegación: banda de motores expandible

El `OptionWheel` se elimina de esta sección.

Cada especialidad ocupa un segmento con:

- Número `01–06`.
- Especialidad.
- Motor destacado.
- Resultado que produce.

Ejemplo: `DENTAL · Cotizador · Rango + visitas`.

### Comportamiento

- El segmento activo se expande.
- Los demás permanecen visibles como destinos.
- Hover o foco puede revelar una vista previa breve.
- Clic o `Enter` activa el motor.
- Flechas izquierda y derecha recorren opciones.
- El cambio actualiza el escenario sin esperar una salida encolada.
- La banda no intercepta la rueda del mouse.
- Móvil usa navegación horizontal con `scroll-snap` y un selector compacto mientras se usa el
  motor.

### Semántica

- Patrón `tablist` / `tab` / `tabpanel`.
- Nombre completo anunciado.
- Foco visible.
- Relación explícita mediante `aria-controls`.
- Estado comprensible sin depender de color o movimiento.

## 7. Motor de referencia: cotizador dental

### Paso 1 — Promesa

Explica que el paciente conocerá rango, visitas y qué incluye antes de pedir una cita. Tiempo
estimado y privacidad aparecen desde el inicio.

### Paso 2 — Tratamiento

El paciente elige entre tratamientos configurados por el consultorio. Cada opción explica el
problema que resuelve. No se usan imágenes clínicas falsas.

### Paso 3 — Contexto breve

Dos preguntas opcionales mejoran el lead sin alterar artificialmente el precio:

- Qué le preocupa más: precio, dolor, tiempo o incertidumbre.
- Cuándo desea comenzar: pronto, este trimestre o solo está explorando.

### Paso 4 — Resultado inmediato

El resultado no se bloquea detrás de un formulario. Incluye:

- Rango de referencia.
- Número estimado de visitas.
- Qué incluye.
- Qué puede modificar el precio.
- Fecha de actualización del rango.

### Paso 5 — Conversión

Después de entregar valor, ofrece `Quiero una valoración` con:

- Contacto mínimo.
- Canal preferido.
- Consentimiento claro.
- Estados de envío, reintento y confirmación.

### Paso 6 — Las dos caras

En Boreas se muestra cómo queda estructurado el lead. En un sitio de cliente, el paciente ve una
versión transparente: `Esto recibirá el consultorio`.

Estados comunes:

`inicio → captura → resultado → contacto → enviando → confirmado`

Estados adicionales:

`pendiente`, `reintentando`, `error recuperable` y `configuración inválida`.

## 8. Arquitectura portable

### Núcleo compartido

Cada motor define:

- Identidad y versión.
- Campos y reglas.
- Cálculo de resultado.
- Resumen para especialista.
- Consentimiento requerido.
- Configuración editable por cliente.

La lógica permanece en TypeScript puro. La presentación puede cambiar sin duplicar fórmulas ni
validaciones.

### Presentación adaptable

El sistema comparte estados, validación y contratos. Cada sitio controla:

- Marca y tokens.
- Copy.
- Composición visual.
- Campos habilitados.
- Moneda, idioma y localidad.
- CTA y canal de contacto.

### Transporte intercambiable

La UI conoce un contrato equivalente a:

```ts
submitLead(payload, idempotencyKey)
```

- Boreas usa un adaptador demo sin persistencia.
- Los sitios reales usan un endpoint de producción.
- El motor no depende directamente de correo, CRM, WhatsApp o proveedor de base de datos.

### Backend

- Valida esquema, motor, versión y cliente.
- Registra la versión del consentimiento.
- Aplica una restricción única a la clave idempotente.
- Persiste el lead antes de responder `recibido`.
- Envía notificaciones mediante cola u outbox.
- Mantiene transacciones cortas.
- Nunca envía respuestas clínicas crudas a analítica.

## 9. Privacidad y seguridad

- Por defecto se envían resumen derivado, señales relevantes y contacto.
- Las respuestas completas requieren necesidad explícita y consentimiento específico.
- Datos clínicos no aparecen en URLs, logs, eventos de analítica ni herramientas de replay.
- Cliente y servidor validan el mismo contrato.
- Cada payload queda ligado al cliente correcto; no se confía en un `tenantId` libre enviado por
  el navegador.
- CSP y proveedores externos forman parte de la preparación de producción.
- Los motores no diagnostican ni sustituyen valoración profesional.
- Los flujos urgentes interrumpen el flujo comercial y muestran primero el recurso de atención.

### Recuperación temporal

Si falla la red:

1. El navegador cifra el payload con una clave pública del backend.
2. Guarda ciphertext, clave idempotente y vencimiento en IndexedDB.
3. Reintenta durante máximo una hora.
4. Borra al confirmar, cancelar o vencer.

El cifrado protege el dato almacenado. No protege el formulario abierto contra XSS; por eso la
CSP y el control de scripts son obligatorios.

## 10. Confiabilidad y errores

- `Recibido` solo se muestra después de persistencia confirmada.
- Un reintento usa la misma clave y no crea otro lead.
- El resultado para el paciente permanece visible aunque falle el envío.
- Al vencer el pendiente, se elimina y se pide confirmar nuevamente el contacto.
- Una configuración incompleta, vencida o inconsistente no inventa un resultado.
- Si un rango no es válido, el motor ofrece valoración sin mostrar precio.
- Los errores técnicos se registran sin payload sensible.

## 11. Rendimiento y escala

- Objetivo de escala inicial: campañas con miles de usos diarios y ráfagas concentradas.
- Endpoints sin estado y notificaciones asíncronas absorben picos sin mantener transacciones largas.
- La sección y su capa ambiental cargan cerca del viewport.
- La primera carga de la landing no incluye recursos pesados exclusivos del teatro.
- Canvas/WebGL libera o pausa trabajo fuera de escena.
- No debe haber tareas largas durante formularios.
- La experiencia debe ser fluida en un móvil medio real.
- No se acepta regresión medible del LCP inicial de la landing.

## 12. Accesibilidad

- Todo el recorrido funciona con teclado.
- El foco avanza solo después de una acción explícita.
- Resultados, errores y pendientes tienen anuncios diferenciados.
- Ningún estado depende solo de color.
- Zoom y texto grande no rompen el motor.
- Móvil funciona sin hover.
- El contenido existe aunque la animación no se ejecute.
- Contraste de texto de cuerpo mínimo 4.5:1.
- Ningún control cambia de posición mientras tiene foco.

## 13. Validación

### Lógica

- Rangos, límites, formatos y resúmenes.
- Umbrales y casos justo antes y después de cada límite.
- Configuraciones inválidas fallan antes del despliegue.
- El mismo input produce el mismo resultado en landing y sitio de cliente.

### Contrato y privacidad

- Adaptador demo y adaptador real cumplen la misma interfaz.
- Reintentos no crean duplicados.
- Una recarga recupera el pendiente cifrado.
- El vencimiento elimina el payload.
- No queda información sensible sin cifrar en almacenamiento, logs o analítica.

### Experiencia end-to-end

- Recorrido completo del cotizador.
- Cambio entre especialidades.
- Resultado paciente y resumen especialista.
- CTA hacia planes.
- Teclado completo.
- Movimiento reducido.
- Móvil sin sticky.
- Red lenta, desconexión y recuperación.
- Configuración vencida o incompleta.

### Visual y rendimiento

- Capturas comparables en escritorio, tableta y móvil.
- Revisión de jerarquía, legibilidad, continuidad, foco, error, pendiente y éxito.
- Medición de LCP inicial, tareas largas, estabilidad de animación y liberación de recursos.
- Validación en móvil medio real.

### Validación comercial

Antes de portar el sistema a los otros cinco motores, especialistas deben poder explicar:

1. Qué hace un motor.
2. Qué recibe el paciente.
3. Qué recibe el profesional.
4. Por qué eso ayuda a convertir.

Si el mensaje no se entiende, la sección no está terminada aunque la implementación sea correcta.

## 14. Riesgos reconocidos

- El sticky puede sentirse lento o invasivo si dura demasiado.
- La capa ambiental puede dañar rendimiento sin aportar claridad.
- El cifrado y reintento local elevan la complejidad y no sustituyen protección contra XSS.
- El motor dental puede hacer que la oferta parezca limitada a esa especialidad.
- Una transición demasiado teatral puede competir con el motor real.
- Configuración de precios sin proceso de vigencia puede publicar rangos obsoletos.

Estos riesgos se validan primero con el cotizador dental y una versión móvil sin sticky.

## 15. Registro de decisiones

| ID | Decisión | Alternativas | Motivo |
|---|---|---|---|
| D01 | Mensaje principal: convertir visitas en pacientes preparados | Tecnología o catálogo como mensaje principal | Expresa el resultado comercial |
| D02 | Tecnología como apoyo | Espectáculo tecnológico dominante | La interacción debe probar la promesa |
| D03 | Hablar primero al especialista y escalar a clínica pequeña | Elegir solo uno | Cubre comprador inicial y crecimiento |
| D04 | Salida hacia planes o catálogo | Agendar llamada o retener exploración | La sección demuestra; pricing convierte |
| D05 | Experiencias completas de menos de un minuto | Demos cortas o doble nivel | Aumenta credibilidad |
| D06 | Sticky primero en escritorio | Sticky en todos los tamaños o ninguno | Impacto con menor riesgo móvil |
| D07 | Estética de precisión y control | Transformación emocional o futurismo | Alinea forma con promesa |
| D08 | Canvas/WebGL puntual y degradable | Solo DOM o impacto sin límite | Permite una escena central sin dependencia |
| D09 | Preparar integración real | Solo demo o formularios simulados | Los motores deben portarse a clientes |
| D10 | Núcleo compartido y presentación adaptable | Copia total o paquete visual rígido | Equilibra consistencia y personalización |
| D11 | Diseñar para picos de campañas | Consultorio normal o escala masiva | Cubre uso esperado sin sobrediseño |
| D12 | Reintento cifrado por una hora | Solo pestaña o 24 horas | Equilibrio entre recuperación y exposición |
| D13 | Enviar resumen y contacto por defecto | Todas las respuestas o solo resultado | Minimización con contexto útil |
| D14 | Sección + un motor de referencia | Seis motores juntos o solo escenario | Reduce retrabajo y permite validar |
| D15 | Cotizador dental como referencia | Tamizaje o agenda | Problema comercial claro y resultado tangible |
| D16 | Teatro de conversión | Laboratorio o recorrido guiado | Une narrativa, demostración y exploración |
| D17 | Banda expandible | OptionWheel | Mejora claridad, acceso y estabilidad |
| D18 | Resultado antes del contacto | Resultado bloqueado | Entrega valor antes de pedir datos |
| D19 | Cara especialista visible | Mantenerla al pie | Es el argumento central de venta |
| D20 | Reglas de fallo, seguridad y accesibilidad obligatorias | Resolverlas por motor | Evita implementaciones inconsistentes |
| D21 | Validar lógica, contrato, UX, visual, rendimiento y comprensión comercial | Validación solo técnica | El éxito incluye que la promesa se entienda |

## 16. Preguntas diferidas, no bloqueantes

- Si el sticky debe extenderse a todos los tamaños después de validar escritorio.
- Si Canvas, WebGL o DOM produce la mejor capa ambiental con el presupuesto real.
- Qué forma visual exacta tendrá la banda expandida después del primer prototipo.
- Qué proveedor y backend usará cada sitio de cliente; el contrato debe permanecer independiente.

