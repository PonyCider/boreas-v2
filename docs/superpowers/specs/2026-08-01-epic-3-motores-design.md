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
| **Salud mental y terapia** | ⭐ Test de tamizaje | quiz-banda | 7 ítems tipo GAD-7 (0–3) → banda tranquilidad / atención / acompañamiento | Banda + motivo declarado |
| | Diario emocional | bitacora | emoción + intensidad + nota → diario descargable | Que completó el diario, sin contenido |
| | Termómetro de burnout | quiz-banda | 6 ítems → dimensión de agotamiento dominante | Dimensión dominante |
| | Test de estilo de apego | quiz-banda | 10 ítems → estilo (seguro / ansioso / evitativo) | Estilo resultante |
| **Nutrición** | ⭐ Calculadora metabólica | calculadora | sexo, edad, peso, estatura, actividad → kcal de mantenimiento (Mifflin-St Jeor) | Rango calórico y objetivo declarado |
| | IMC y rango | calculadora | peso + estatura → IMC y rango | IMC |
| | Evaluador de hábitos | quiz-banda | 5 preguntas → puntaje + hábito a corregir primero | Hábito prioritario |
| **Fisioterapia** | ⭐ Evaluador de dolor | quiz-banda | zona + intensidad EVA 0–10 + tipo + tiempo → prioridad | Zona, EVA y prioridad |
| | Auto-test de movilidad | quiz-banda | 5 movimientos autoevaluados → banderas rojas | Banderas rojas detectadas |
| | Estimador de sesiones | calculadora | tipo de lesión + semanas de evolución → rango de sesiones | Lesión y rango estimado |
| **Medicina general** | ⭐ Pre-triage | quiz-banda | 5 preguntas → prioridad baja / media / alta | Prioridad y síntoma principal |
| | Chequeos que te tocan | calculadora | edad + sexo → lista de estudios sugeridos | Estudios sugeridos |
| | Riesgo cardiometabólico | calculadora | IMC + presión + hábitos → nivel de riesgo | Nivel de riesgo |
| **Dental** | ⭐ Simulador de sonrisa | simulador | slider de alineación y tono → antes/después procedural | Interés declarado |
| | Cotizador de tratamiento | calculadora | tratamiento + número de piezas → rango estimado | Tratamiento consultado |
| | ¿Necesitas ortodoncia? | quiz-banda | 5 preguntas → recomendación de valoración | Recomendación resultante |
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

### 4. UX de la sección `#motores`

```
SectionFrame#motores (theme dark, border-t)
├── eyebrow + h2 (mismo tratamiento SplitText/reduced-motion que la sección Problema)
├── párrafo de encuadre
├── selector de categoría — 6 chips
├── MotorShell del motor activo
│   ├── izquierda: badge, título, descripción, 3 bullets, disclaimer
│   ├── derecha: la demo viva
│   └── abajo (banda propia): "Lo que te llega a ti" — la cara especialista
└── nota de privacidad global
```

Reglas:

- **Un motor montado a la vez.** Cambiar de chip desmonta el anterior: el reset es gratis y no se
  cargan seis demos que nadie pidió.
- **Los chips son tabs reales** (`role="tablist"`, `aria-selected`, navegación con flechas) desde
  que hay dos motores vivos. Mientras solo exista el agendamiento son etiquetas estáticas: fingir
  un tablist de un solo destino es deuda de accesibilidad sin beneficio.
- **Transición por CSS**, sin librería nueva y sin animación bajo `prefers-reduced-motion`.
- **Un CTA primario por viewport:** el CTA de esta sección es agendar. El motor activo no compite
  con el form de Epic 5; empuja al calendario.
- El resultado de cada motor se anuncia con `aria-live="polite"` y recibe el foco.

### 5. Agendamiento (Cal.com)

Embed por `<iframe loading="lazy">` a `https://cal.com/jafet-de-la-cruz-ponycider/demo`, sin
`@calcom/embed-react`: una etiqueta contra una dependencia. `theme` se pasa por query y lo fija
la sección — V4 no tiene toggle global de tema, cada `SectionFrame` declara el suyo. Debajo, un
enlace de escape a la misma URL por si el iframe no carga.

Este calendario es el real de Boreas: agendar en la landing aparta una llamada de verdad. La
sección lo dice en texto — el visitante no debe descubrir que "la demo" era real después de
reservar.

### 6. Reglas clínicas y legales

Innegociables en los 17 motores:

- **Ningún motor diagnostica.** Todos cierran invitando a valoración profesional. El disclaimer
  vive junto al resultado, no en un pie de página.
- **Salud mental, banda alta:** bloque de alto contraste con Línea de la Vida (800 911 2000,
  24/7, gratuita y confidencial) por encima del CTA. No es una nota al pie.
- **Pre-triage, prioridad alta:** la acción primaria es "acude a urgencias"; el contacto con el
  consultorio queda como secundario.
- **Riesgo cardiometabólico** lleva disclaimer reforzado: estimación poblacional a partir de
  datos autorreportados, no sustituye medición clínica ni estudios de laboratorio.
- **IMC** se presenta como indicador poblacional, nunca como veredicto de salud.
- **Cotizador dental:** los rangos son estimados y así se rotulan; la cotización real sale de la
  valoración presencial. Aplica la misma regla en los sitios de clientes.
- **Tamizaje:** se cita la fuente del instrumento junto al resultado.
- Los motores de la landing no envían ni guardan nada. La sección lo declara.

### 7. Captura de lead en los sitios de clientes

- **El resultado es gratis.** El paciente ve su resultado completo y después decide contactar.
  Nada de gate previo: pedir datos antes de un resultado de ansiedad o de dolor tumba la
  conversión justo en el momento de mayor vulnerabilidad, y llena el CRM de contactos falsos.
- **Viaja el resumen, no el detalle.** Al especialista le llega la banda o el número y el
  contacto — nunca las respuestas ítem por ítem. Bajo LFPDPPP las respuestas clínicas son datos
  personales sensibles: no recolectarlas es más barato y más limpio que custodiarlas.
- El aviso de privacidad del sitio del cliente declara qué se procesa y qué no, como ya exige el
  spec de pricing para todos los sitios.

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

### 9. Motion y accesibilidad

Heredado de la disciplina de V4, sin excepciones nuevas: `prefers-reduced-motion` con
equivalente estático en toda animación, contenido presente en el DOM sin depender de animación,
contraste ≥4.5:1 en cuerpo, foco visible, todo operable con teclado, y ninguna animación de
bounce o elastic.

### 10. Subtareas

| # | Subtarea | Estado |
|---|---|---|
| 3.1 | Sección + `MotorShell` + agendamiento Cal.com | Construido 2026-08-01, pendiente de pulir |
| 3.2 | Chips como tablist real (al llegar el segundo motor) | Pendiente |
| 3.3 | Test de tamizaje (salud mental) | Pendiente |
| 3.4 | Calculadora metabólica (nutrición) | Pendiente |
| 3.5 | Evaluador de dolor (fisioterapia) | Pendiente |
| 3.6 | Pre-triage (medicina general) | Pendiente |
| 3.7 | Simulador de sonrisa procedural (dental) | Pendiente |
| 3.8 | Fichas de los 11 motores de catálogo en `content/motors.ts` | Pendiente |

Cada subtarea se pule visualmente con el usuario antes de pasar a la siguiente.

## Fuera de alcance

- Implementación de los motores en `boreas-template`.
- Backend o persistencia en la landing: los motores no envían nada (Epic 5 es el único punto de
  captura real).
- Fotos de pacientes reales en el simulador dental — es procedural por decisión, no por falta de
  material: evita derechos de imagen, datos sensibles de terceros y promesas clínicas falsas.

## Pendientes conocidos

- El evento de Cal.com embebido es `/demo`. Si más adelante conviene un evento dedicado para
  tráfico de landing (distinta duración o distintas preguntas de reserva), es un cambio de una
  línea en `content/motors.ts`.
- Los 11 motores de ficha no tienen copy final; se escribe cuando el primer cliente contrate uno.
