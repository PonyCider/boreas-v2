# Epic 3 — Motores de conversión (diseño)

Fecha: 2026-08-01

## Contexto

Los motores de conversión son el diferenciador central de Boreas: la pieza interactiva que
convierte a un visitante curioso en un paciente con cita. Un sitio genérico informa; un sitio con
motor agenda.

El spec de pricing (`2026-07-31-boreas-v4-pricing-design.md`) ya los vende por escalera —
1 motor en Esencial, 2 en Profesional, 3 en Deluxe, todos en Organizaciones — sin que exista aún
un catálogo que respalde esa promesa. Este documento lo define.

## Alcance

Cubre: definición de producto del motor, catálogo completo por categoría, qué se construye vivo
en la landing, UX y arquitectura de la sección `#motores`, reglas clínicas y legales, y el
contrato de captura de lead en los sitios de clientes.

No cubre: la implementación de los motores dentro de `boreas-template` (otro repo, otro ciclo),
el copy final palabra por palabra de cada motor, ni el detalle pixel-perfect de cada UI.

## Decisiones

### 1. Qué es un motor

Pieza interactiva, autocontenida y client-side que un paciente completa en menos de un minuto y
que termina en dos caras:

- **Cara paciente:** un resultado útil de verdad (una banda, un número, un entregable).
- **Cara especialista:** el contexto que le llega al profesional — resumen del resultado y datos
  de contacto — para que llegue preparado a la primera cita.

Esa segunda cara es la venta. Sin ella el motor es un juguete.

### 2. Catálogo — 5 categorías, 16 motores propios + agendamiento, 4 patrones

El costo de construir el motor número 15 es de horas, no de días, porque los 16 motores propios
caben en cuatro patrones técnicos (el agendamiento no: es un embed del proveedor):

| Patrón | Forma | Lógica |
|---|---|---|
| `quiz-banda` | N preguntas de opción única, auto-avance | suma de puntajes → banda por umbral |
| `calculadora` | M campos numéricos validados | fórmula → número + interpretación |
| `bitacora` | mini-form libre + selección | composición de un entregable |
| `simulador` | control visual (slider) | render procedural antes/después |

Catálogo (⭐ = se construye vivo en la landing de Boreas):

| Categoría | Motor | Patrón | Entrada → salida | Resumen al especialista |
|---|---|---|---|---|
| **Salud mental y terapia** | ⭐ Test de tamizaje | quiz-banda | GAD-7 completo, 7 ítems (0–3) → mínima / leve / moderada / severa | Banda y puntaje |
| | Diario emocional | bitacora | emoción + intensidad + nota → diario descargable | Que completó el diario, sin contenido |
| | Termómetro de burnout | quiz-banda | 6 ítems → dimensión de agotamiento dominante | Dimensión dominante |
| | Test de estilo de apego | quiz-banda | 10 ítems → estilo (seguro / ansioso / evitativo) | Estilo resultante |
| **Nutrición** | ⭐ Calculadora metabólica | calculadora | sexo, edad, peso, estatura, actividad → kcal de mantenimiento (Mifflin-St Jeor) | Rango calórico y objetivo declarado |
| | IMC y rango | calculadora | peso + estatura → IMC y rango | IMC |
| | Evaluador de hábitos | quiz-banda | 5 preguntas → puntaje + hábito a corregir primero | Hábito prioritario |
| **Fisioterapia** | ⭐ Evaluador de dolor | quiz-banda | intensidad EVA + tiempo + limitación + banderas rojas → prioridad | Prioridad y si hubo banderas rojas |
| | Auto-test de movilidad | quiz-banda | 5 movimientos autoevaluados → banderas rojas | Banderas rojas detectadas |
| | Estimador de sesiones | calculadora | tipo de lesión + semanas de evolución → rango de sesiones | Lesión y rango estimado |
| **Medicina general** | ⭐ Pre-triage | quiz-banda | 5 preguntas → prioridad baja / media / alta | Prioridad y síntoma principal |
| | Chequeos que te tocan | calculadora | edad + sexo → lista de estudios sugeridos | Estudios sugeridos |
| | Riesgo cardiometabólico | calculadora | IMC + presión + hábitos → nivel de riesgo | Nivel de riesgo |
| **Dental** | ⭐ Cotizador de tratamiento | calculadora | tratamiento elegido → rango, visitas y qué incluye | Tratamiento consultado y rango que vio |
| | Triage dental | quiz-banda | dolor, sangrado o pieza rota → hoy / esta semana / programada | Urgencia y síntoma principal |
| | Primera cita sin sorpresas | recorrido | motivo + nivel de miedo → paso a paso de la visita | Motivo y temor declarado |
| **Ortodoncia** | ⭐ Simulador de sonrisa | simulador | slider de alineación y tono → antes/después procedural | Interés declarado |
| **Todas** | ⭐ Agendamiento | embed | disponibilidad real → cita confirmada | Cita en el calendario |

Salud mental y terapia van fusionadas (una sola categoría con 4 motores): son el mismo comprador
y separarlas producía traslape en los motores, no en el mercado. El agendamiento es transversal:
no consume slot de la escalera de pricing — es la base de todos los paquetes de Profesional en
adelante.

Contenido reutilizable de `boreas-portfolio` (JS vanilla, copy en español ya revisado): las 6
preguntas y umbrales de Ancla (tamizaje), las 5 de Urgencia Directa (pre-triage), la fórmula
Mifflin-St Jeor de Punto de Equilibrio, y el encuadre del diario de Cartas al Silencio. Se porta
el contenido y los umbrales, no el código.

### 3. Qué se construye vivo en la landing

Seis motores funcionales: el agendamiento más el ⭐ de cada categoría. Los 11 restantes existen
como ficha de catálogo — nombre, entrada, salida, resumen y disclaimer — y se construyen a la
medida cuando un cliente los contrata.

Razón: 17 demos vivas serían 17 iteraciones visuales para sostener una promesa que la ficha ya
sostiene, y ningún visitante es psicólogo y dentista a la vez.

**Regla de un motor por categoría.** Cada categoría muestra su motor estelar funcionando y
**menciona** los otros dos por nombre y una línea de qué hacen, sin renderizarlos. Esa mención es
el gancho de upsell: el motor visible viene en cualquier paquete, los mencionados llegan con
Profesional o Deluxe. Mostrar los tres funcionando regalaría el argumento de venta y triplicaría
el peso de la sección.

### 4. UX de la sección `#motores`

```
SectionFrame#motores (theme dark, border-t)
├── eyebrow + h2 (mismo tratamiento SplitText/reduced-motion que la sección Problema)
├── párrafo de encuadre
├── selector de categoría — Option Wheel (React Bits), 6 opciones
├── MotorShell del motor activo
│   ├── izquierda: badge, título, descripción, 3 bullets, disclaimer
│   ├── derecha: la demo viva
│   ├── abajo (banda propia): "Lo que te llega a ti" — la cara especialista
│   └── al pie: los otros 2 motores de la categoría, mencionados como upsell
└── nota de privacidad global
```

Reglas:

- **Un motor montado a la vez.** Cambiar de categoría desmonta el anterior: el reset es gratis y
  no se cargan seis demos que nadie pidió.
- **El selector es el Option Wheel de React Bits** (registry `@react-bits`, ya declarado en
  `components.json`), no los chips provisionales de 3.1. Debe quedar operable con teclado y
  anunciar la opción activa; si el componente no lo trae, se le agrega antes de mergear.
- **Transición por CSS**, sin librería nueva y sin animación bajo `prefers-reduced-motion`.
- **Un CTA primario por viewport:** el CTA de esta sección es agendar. El motor activo no compite
  con el form de Epic 5; empuja al calendario.
- El resultado de cada motor se anuncia con `aria-live="polite"` y recibe el foco.

### 5. Agendamiento (Cal.com)

Embed por `<iframe loading="lazy">` a `https://cal.com/jafet-de-la-cruz-ponycider/demo`, sin
`@calcom/embed-react`: una etiqueta contra una dependencia. El tema va fijo a `dark` por query
porque la sección lo está — V4 no tiene toggle global, cada `SectionFrame` declara el suyo.

Estados obligatorios: skeleton mientras carga, y a los 8 segundos sin `onLoad` se reemplaza por
una tarjeta con enlace para abrir el calendario en otra pestaña. Un ad-blocker o un 403 no puede
dejar 700 px en blanco. `referrerPolicy="strict-origin-when-cross-origin"`.

Este calendario es el real de Boreas: agendar en la landing aparta una llamada de verdad, y los
datos de la reserva los procesa Cal.com. Las dos cosas se dicen en texto visible junto al embed,
con enlace al aviso de privacidad de Cal.com. El visitante no debe descubrir que "la demo" era
real después de reservar.

### 6. Reglas clínicas y legales

Innegociables en los 17 motores:

- **Ningún motor diagnostica.** Todos cierran invitando a valoración profesional. El disclaimer
  vive junto al resultado, no en un pie de página.
- **Ficha clínica obligatoria por motor.** Antes de construir uno se declara en `content/motors.ts`:
  instrumento y fuente citable, versión, población excluida (edad mínima, embarazo, comorbilidad
  según aplique), y qué hace el motor en la banda más grave. Un motor sin ficha no se construye.
- **Instrumentos reales, sin versiones caseras.** El tamizaje de salud mental usa el **GAD-7
  completo (7 ítems, escala 0–3, cortes 5 / 10 / 15)** con fuente citada — Spitzer RL, Kroenke K,
  Williams JBW, Löwe B (2006), *Arch Intern Med* 166(10):1092-7 — no la variante de 6 ítems del
  portafolio, que no es un instrumento validado. Si un motor no puede usar un instrumento
  validado, se rotula explícitamente como orientación y no reporta bandas clínicas.
- **Salud mental, banda alta:** bloque de alto contraste con Línea de la Vida (800 911 2000,
  24/7, gratuita y confidencial) por encima del CTA. No es una nota al pie.
- **Pre-triage, prioridad alta:** la acción primaria es **llamar al 911 o acudir a urgencias**, con
  el número marcable en móvil y la lista de síntomas de alarma visible (dolor en el pecho,
  dificultad para respirar en reposo, sangrado que no cede, confusión o desmayo, debilidad súbita
  de un lado del cuerpo). "Acude a urgencias" a secas deja la decisión clínica en el UI.
- **Disclaimer durante la interacción, no solo al final.** En el simulador de sonrisa y en el
  cotizador el texto obligatorio ("proyección, no resultado garantizado" / "estimado, la
  cotización sale de la valoración") está visible mientras el paciente mueve el control, no
  después.
- **Riesgo cardiometabólico** lleva disclaimer reforzado: estimación poblacional a partir de
  datos autorreportados, no sustituye medición clínica ni estudios de laboratorio.
- **IMC** se presenta como indicador poblacional, nunca como veredicto de salud.
- **Cotizador dental:** los rangos son estimados y así se rotulan; la cotización real sale de la
  valoración presencial. Aplica la misma regla en los sitios de clientes. Los rangos de la landing
  son **de referencia nacional para consultorio privado en México (agosto 2026)**, no los de un
  consultorio en particular, y el motor lo dice en pantalla — publicar un rango sin esa aclaración
  lo convierte en oferta a ojos del paciente, que es justo lo que castiga el art. 32 de la LFPC.
  Las fuentes de cada rango están citadas en la cabecera de `lib/motors/cotizador-dental.ts`.
  Mérida corre por debajo de la capital (las fuentes ubican ciudades medias en torno al 60-70% del
  precio de CDMX), así que los rangos abren bajo a propósito.
- Los motores de especialidad de la landing no envían ni guardan nada, y la sección lo declara.
  El agendamiento es la excepción declarada (§5).

### 7. Captura de lead en los sitios de clientes

- **El resultado es gratis.** El paciente ve su resultado completo y después decide contactar.
  Nada de gate previo: pedir datos antes de un resultado de ansiedad o de dolor tumba la
  conversión justo en el momento de mayor vulnerabilidad, y llena el CRM de contactos falsos.
- **Viaja el resumen, no el detalle.** Al especialista le llega la banda o el número y el
  contacto — nunca las respuestas ítem por ítem. Bajo LFPDPPP las respuestas clínicas son datos
  personales sensibles: no recolectarlas es más barato y más limpio que custodiarlas.
- **Consentimiento expreso antes de enviar.** El resumen viaja solo tras un checkbox marcado por
  el paciente, sin premarcar, con el texto de a quién llega y para qué. Sin checkbox no hay envío:
  bajo LFPDPPP art. 9 los datos sensibles exigen consentimiento expreso, y un disclaimer no lo es.
- **Retención declarada.** El aviso de privacidad del sitio dice cuánto conserva el consultorio
  ese resumen y cómo se ejercen los derechos ARCO. Boreas actúa como encargado, el consultorio es
  el responsable: eso se escribe en el contrato de servicio, no se asume.
- **Minimización.** Si un motor puede cumplir su función sin recolectar un campo, no lo recolecta.

Este contrato es el que implementará `boreas-template`. Aquí solo se define.

### 8. Arquitectura de código (landing)

```
content/motors.ts                       copy, catálogo, fichas
lib/motors/*.ts                         lógica pura: preguntas, umbrales, fórmulas
components/landing/motors-section.tsx   sección: heading, chips, motor activo
components/landing/motors/motor-shell.tsx    marco + cara especialista
components/landing/motors/<motor>.tsx        un archivo por motor vivo
```

- **Sin capa de engine genérica.** El `boreas-template` tiene una (`lib/mechanisms/*`, config-
  driven) con el catálogo vacío: es infraestructura para clonar-por-cliente y no le sirve a seis
  motores de formas distintas. Lo único compartido es `MotorShell` y el tipo `SpecialistLead`.
- **La lógica vive separada de la UI** en `lib/motors/`: funciones puras sin React, para poder
  probarlas sin montar nada.
- **Tests con vitest** (una devDependency nueva; Node 20 no ejecuta TypeScript nativo) para lo
  que sí puede estar mal en silencio: umbrales de banda en `t` y `t-1`, la fórmula de
  Mifflin-St Jeor y la validación de rangos. Sin tests de render — ese trabajo lo hace la
  iteración visual.

### 9. Líneas divisorias

Una hairline marca el borde de la sección o de la card del motor. Nada más. Los bullets, las
señales del lead y los párrafos se separan con espacio y jerarquía tipográfica. La banda "Lo que
te llega a ti" se distingue por fondo (`bg-elevated`), no por línea. Regla añadida al spec padre
el 2026-08-01 y vigente en toda la landing, no solo en esta sección.

### 10. Motion y accesibilidad

Heredado de la disciplina de V4, sin excepciones nuevas: `prefers-reduced-motion` con
equivalente estático en toda animación, contenido presente en el DOM sin depender de animación,
contraste ≥4.5:1 en cuerpo, foco visible, todo operable con teclado, y ninguna animación de
bounce o elastic.

### 11. Subtareas

| # | Subtarea | Estado |
|---|---|---|
| 3.1 | Sección + `MotorShell` + agendamiento Cal.com | Construido 2026-08-01, pendiente de pulir |
| 3.2 | Selector Option Wheel (React Bits) en vez de los chips provisionales | Construido 2026-08-01, pendiente de pulir |
| 3.3 | Test de tamizaje GAD-7 (salud mental) | Construido 2026-08-01, pendiente de pulir |
| 3.4 | Calculadora metabólica (nutrición) | Construido 2026-08-01, pendiente de pulir |
| 3.5 | Evaluador de dolor (fisioterapia) | Construido 2026-08-01, pendiente de pulir |
| 3.6 | Pre-triage (medicina general) | Construido 2026-08-01, pendiente de pulir |
| 3.7 | Simulador de sonrisa procedural | Construido 2026-08-01. Reclasificado a ortodoncia el 2026-08-03 |
| 3.10 | Cotizador dental (nuevo estelar de dental) | Construido 2026-08-03 |
| 3.11 | Controles con shadcn tematizados y materialidad con acento | Construido 2026-08-03 |
| 3.8 | Fichas de los 11 motores de catálogo + menciones de upsell por categoría | Pendiente |
| 3.9 | Página `/privacidad` y su enlace en el footer | Construido 2026-08-01, falta domicilio |

Cada subtarea se pule visualmente con el usuario antes de pasar a la siguiente.

## Fuera de alcance

- Implementación de los motores en `boreas-template`.
- Backend o persistencia en la landing: los motores no envían nada (Epic 5 es el único punto de
  captura real).
- Fotos de pacientes reales en el simulador dental — es procedural por decisión, no por falta de
  material: evita derechos de imagen, datos sensibles de terceros y promesas clínicas falsas.
- **Imágenes de personas como antes/después (decidido el 2026-08-03).** Se evaluó generar caras
  con IA para darle aire premium al motor dental y se descartó. Como *ambiente* una imagen
  generada no tiene problema: no hay persona real, no hace falta model release. Como *resultado*
  sí lo tiene, y no es formalismo: un "después" generado es un resultado fabricado, presentarlo
  como lo que el tratamiento logra es información engañosa bajo el art. 32 de la LFPC, y la
  publicidad de servicios de salud cae bajo COFEPRIS, que es donde el antes/después está
  vigilado. Un disclaimer no arregla que la pieza central sea falsa. Encima, esto se replica en
  el sitio de cada cliente: o cada dentista pone fotos propias con consentimiento de sus
  pacientes, o todos comparten la misma cara de IA.
- **Subir la foto del paciente al simulador.** Procesar una cara es dato personal sensible bajo
  la LFPDPPP (art. 3 fr. V) y exige consentimiento expreso por escrito, aunque el procesamiento
  ocurra solo en el navegador. Fuera de alcance.

### 12. Cambio de motor estelar en dental (2026-08-03)

El simulador de sonrisa dejó de ser el motor estelar de dental y pasó al catálogo como motor de
**ortodoncia**. Su lugar lo toma el **cotizador de tratamiento**.

Por qué: el simulador solo sirve al segmento estético, que es una fracción del consultorio dental,
y ataca el cuarto motivo por el que un paciente no agenda. Los tres de arriba —no saber cuánto va a
costar, miedo, y no saber si lo suyo es urgente— quedaban sin cubrir. El precio es el único que es
universal a todo consultorio dental sin importar el tratamiento, y es literalmente la pregunta que
detiene la llamada. El cotizador además produce el mejor lead de los cuatro: llega alguien que ya
sabe el rango, las visitas y qué incluye, así que la llamada es para agendar y no para negociar.

Efecto colateral aceptado: la sección se queda **sin ningún motor gráfico**. Un render de dientes
falso es un "wow" que se paga con credibilidad, y la credibilidad es todo el posicionamiento de
Boreas. Triage dental y "primera cita sin sorpresas" quedan como los otros dos motores de la
categoría, mencionados como upsell de Profesional y Deluxe.

Decisión de patrón: el cotizador es el **segundo** motor tipo calculadora. Un cuarto quiz-banda
(que es lo que habría sido el triage dental) dejaba la sección con cuatro quizzes de seis motores
y se leía repetitiva.

Se cotiza **un tratamiento a la vez**, no varios sumables: un total grande espanta al paciente
antes de que hable con nadie, que es lo contrario de lo que hace el motor.

## Pendientes conocidos

- El evento de Cal.com embebido es `/demo`. Si más adelante conviene un evento dedicado para
  tráfico de landing (distinta duración o distintas preguntas de reserva), es un cambio de una
  línea en `content/motors.ts`.
- Los motores de ficha no tienen copy final; se escribe cuando el primer cliente contrate uno.
- **Rangos del cotizador con fecha de caducidad.** Son precios de mercado consultados el
  2026-08-03. Envejecen. Conviene revisarlos una vez al año o cuando un dentista comente que están
  fuera de lugar.
- **Simulador de sonrisa sin categoría propia en la rueda.** Ortodoncia no es una de las cinco
  especialidades del selector, así que el simulador queda construido pero sin lugar en la landing;
  vive en `/motores-preview` y en el catálogo. Decidir si ortodoncia merece su propia entrada o si
  se queda como sub-especialidad de dental.
- **Supersesión del spec padre:** la tabla de motores de
  `2026-07-19-boreas-v4-landing-design.md` §3 quedó obsoleta (listaba 5 motores y otra mezcla de
  categorías). Este documento es la autoridad, pero el spec padre todavía no lo dice. Pendiente de
  resolver con el usuario.
- **CSP con `frame-src`:** el proyecto no declara headers de seguridad en `next.config.ts`. No es
  regresión del iframe — no hay CSP en ninguna parte — pero conviene añadirla antes del deploy.
- **Proceso COFEPRIS:** el spec de pricing dice "revisión de copy vs. COFEPRIS" sin definir quién
  clasifica, quién tramita ni qué pasa si el cliente no tiene autorización. Se resuelve en el Epic
  de pricing, no aquí.
- **Desincronización del selector (2026-08-01):** girar la rueda rápido hacia abajo y de vuelta
  arriba rompe la transición — `AnimatePresence mode="wait"` encola salidas y el panel se queda en
  el motor anterior mientras la rueda ya marca otro. Deuda aceptada. Arreglo probable: animación
  solo de entrada, sin esperar a que termine la salida.
- **Domicilio en el aviso de privacidad:** la LFPDPPP art. 16 fr. I exige domicilio del
  responsable. Por decisión del titular (2026-08-01) se publica solo ciudad y estado, más el
  correo como canal de contacto, para no exponer un domicilio particular. El aviso queda
  incompleto a propósito; se cierra cuando exista buzón u oficina virtual.
- **Escasez real, no inventada:** el footer anuncia disponibilidad limitada. Debe reflejar la
  capacidad real de entrega (3 consultorios al mes al 2026-08-01). Si el número deja de ser real,
  se actualiza o se quita: información falsa sobre disponibilidad es materia de la LFPC art. 32.
