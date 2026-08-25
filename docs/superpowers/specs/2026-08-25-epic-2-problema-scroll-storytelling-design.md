# EPIC 2 — “El problema”: scroll storytelling

**Estado:** Diseño aprobado  
**Fecha:** 2026-08-25  
**Alcance:** Rediseño completo de la sección `#problema` de la landing de Boreas V4  
**Sustituye:** `docs/superpowers/specs/2026-07-20-epic-2-problema-design.md`

## 1. Resultado buscado

La sección debe hacer visible una pérdida que hoy ocurre sin que el especialista la perciba:

> “Mi presencia digital me está costando pacientes sin que yo lo vea.”

La idea complementaria es:

> Una página que sólo informa ya no es suficiente para competir.

La sección no vende todavía la solución. Construye comprensión, tensión y continuidad hacia `#motores`.

## 2. Audiencia y tono

- Audiencia principal: especialistas de la salud en México.
- Tono: incómodo pero profesional.
- La narrativa muestra hechos reconocibles; no culpa al especialista.
- No se usan miedo artificial, urgencia inventada ni superioridad clínica.
- El paciente permanece anónimo.

## 3. Restricciones aprobadas

- Rediseño desde cero.
- No reutilizar `ProblemCompareSlider`.
- No usar nombres, rostros, ciudades, consultorios, competidores ni testimonios inventados.
- No inventar síntomas, diagnósticos o resultados clínicos.
- No usar video, Canvas, WebGL o 3D.
- No interceptar rueda, touch, teclado o barra de desplazamiento.
- No añadir un CTA propio.
- No alterar Hero, “La solución”, navegación o el orden de montaje.
- No añadir fuentes tipográficas, paletas o dependencias de animación.

## 4. Concepto aprobado

### “La cita que nunca viste”

La sección sigue una oportunidad que se pierde en minutos. Una persona anónima quiere conseguir una primera consulta esa misma semana. Encuentra la presencia digital del especialista, recibe información, pero no puede avanzar. El contacto depende de una respuesta humana. Otra opción le permite completar el siguiente paso y confirma la cita.

La experiencia dura cinco momentos. Desde que el título entra en su offset hasta que termina la tesis final, el recorrido completo no puede superar `400svh` en escritorio ni `320svh` en móvil.

La apertura identifica el relato como **“Ejemplo ilustrativo compuesto”**. Las horas ordenan la escena; no representan una duración típica, una conducta general ni una relación causal demostrada.

## 5. Copy aprobado como base

### Apertura

**Eyebrow**

> El problema

**Título**

> La cita que nunca viste.

**Introducción**

> Ejemplo ilustrativo compuesto. Son las 11:07 p. m. Alguien busca una primera consulta para esta semana. Te encuentra. Lo que suceda después puede influir en si esa búsqueda llega a tu agenda.

### Momento 1 — Necesidad

**Hora:** 11:07 p. m.  
**Frase:**

> Necesita una cita, no una lista de servicios.

**Pantalla:**

> Primera consulta disponible esta semana

El primer dato mexicano aparece como anotación editorial.

### Momento 2 — Encuentro

**Hora:** 11:09 p. m.  
**Frase:**

> Tu página responde qué haces. No responde cuándo puede empezar.

La pantalla muestra información correcta: servicios, ubicación, horarios y contacto. La presencia existente no se ridiculiza ni se construye como una parodia.

### Momento 3 — Callejón

**Hora:** 11:11 p. m.  
**Frase:**

> En este recorrido, la única opción visible es esperar a que alguien responda.

**Mensaje:**

> Hola. ¿Tiene disponibilidad esta semana?

**Estado:**

> Solicitud enviada · Te responderemos en horario de atención

No se simula un fallo ni una demora indebida. El consultorio establece una expectativa razonable. La fricción es que el recorrido no puede mostrar disponibilidad o reservar sin intervención humana.

### Momento 4 — Alternativa

**Hora:** 11:14 p. m.  
**Frase:**

> No espera una respuesta inmediata. Continúa buscando una opción que le permita conocer disponibilidad ahora.

Otra opción anónima muestra horarios disponibles y un siguiente paso inmediato. El segundo dato, internacional y etiquetado, aparece aquí.

### Momento 5 — Pérdida

**Hora:** 11:16 p. m.  
**Pantalla:**

> Cita confirmada  
> Esta semana

**Texto:**

> No sabemos todo lo que influyó en su elección. En este ejemplo, sí sabemos que pudo completar el siguiente paso por sí misma.

### Cierre

> ¿Cuántas oportunidades como ésta pasan sin que las veas?

> Una página que sólo informa no puede ayudar al paciente a dar el siguiente paso.

> El problema no es que no respondas a las 11 p. m. Es que tu presencia no pueda avanzar sin ti.

> Tu presencia digital debería seguir facilitando el acceso cuando tú no puedes responder.

La siguiente sección responde cómo Boreas transforma esa búsqueda en una cita.

## 6. Evidencia aprobada

### Dato mexicano

**Copy de pantalla:**

> En 2025, Doctoralia México registró alrededor de 160 millones de visitas y facilitó 18 millones de consultas médicas.

**Fuente:** Doctoralia México, datos propios de plataforma para 2025.

- Publicación: https://press.doctoralia.com.mx/460243-alopecia-vph-y-salud-mental-los-temas-de-salud-mas-buscados-eninternet-durante-2025-en-mexico
- Contexto: actividad registrada dentro de Doctoralia México; no es una encuesta poblacional.
- Límite: demuestra escala de búsqueda y acceso dentro de esa plataforma. No mide el comportamiento de todos los pacientes mexicanos ni prueba que una web propia cause o evite una pérdida.

### Dato internacional

**Copy de pantalla:**

> 43% de las citas registradas por Zocdoc en 2025 se agendó fuera del horario tradicional.

**Fuente:** Zocdoc, *What Patients Want 2025*.

- Reporte: https://www.zocdoc.com/resources/white-papers/what-patients-want-2025/
- PDF del reporte: https://zocdocpractice.zocdoc.com/wp-content/uploads/2025/12/WhatPatientsWant_ZocdocAnnualReport_2025_Final2.pdf
- Contexto: millones de citas registradas dentro de una plataforma estadounidense.
- Límite: describe comportamiento dentro de Zocdoc; no representa a la población mexicana.

### Reglas de evidencia

- Presentar ambos datos como contexto, no como prueba de causalidad.
- No extrapolar la actividad de Doctoralia a todos los pacientes mexicanos.
- No extrapolar el 43% a pacientes mexicanos.
- No afirmar causalidad entre una web informativa y la pérdida automática de una cita.
- Mostrar enlaces accesibles, no sólo nombres de fuente.
- Eliminar las cifras actuales `82%` y `40%`.

### Inferencia permitida

- **Doctoralia México:** una cantidad relevante de recorridos de búsqueda y acceso a atención sucede dentro de canales digitales en México.
- **Zocdoc:** dentro de esa plataforma estadounidense, una parte relevante de las reservas ocurre fuera del horario tradicional.
- **No permitido:** concluir que la ausencia de agenda causa por sí sola que un paciente elija a otro especialista.
- Los datos se separan visualmente del cambio de decisión mediante la etiqueta **“Contexto”** y una nota de alcance visible.

## 7. Composición visual

### Dirección

Editorial clínica con una interrupción nocturna.

### Entrada

El fondo cambia del Hero oscuro al tema claro actual. La apertura contiene eyebrow, título, introducción y una indicación discreta para continuar la búsqueda.

### Escenario principal

En escritorio, una única composición permanece sticky debajo de la navegación.

**Columna editorial**

- Momento `01 / 05`.
- Hora.
- Frase de decisión.
- Dato, contexto geográfico y enlace sólo en momentos 1 y 4.
- Progreso vertical.

**Pantalla del paciente**

- Ocupa el centro y lado derecho.
- No usa marco de teléfono, notch o navegador falso.
- La misma superficie evoluciona entre búsqueda, página, mensaje, alternativa y confirmación.
- El contenido anterior permanece perceptible cuando ayuda a explicar la consecuencia.
- Muestra permanentemente la etiqueta **“Representación narrativa · No interactiva”**.
- Sus acciones se renderizan como texto y contenedores estáticos, nunca como `button`, `a`, `input` o elementos con rol interactivo.
- Usa `pointer-events: none`, cursor por defecto y ningún estado hover, pressed o focus.

### Ancla memorable

Una línea terracota conecta cada hora con la acción correspondiente dentro de la pantalla. Es el rastro de una oportunidad invisible.

- Avanza durante los primeros cuatro momentos.
- Se acerca al especialista.
- Se corta al aparecer “Cita confirmada”.
- Permanece incompleta durante el cierre.

### Sistema visual

- `Newsreader`: título, frases decisivas y cierre.
- `Figtree`: horas, cifras, UI simulada y fuentes.
- Números tabulares para horas y datos.
- Tema claro actual para el fondo editorial.
- Tema oscuro actual, anidado localmente, para la pantalla nocturna.
- `--accent` para el rastro, horas y progreso.
- Bordes y radios existentes.
- Sombras suaves sólo para separar la pantalla.
- Sin gradientes decorativos, partículas, brillos o tarjetas flotantes.

**DFII:** 15. La dirección combina impacto, ajuste al contexto sanitario, viabilidad y consistencia con el sistema existente.

## 8. Scroll y motion

- `position: sticky` nativo fija la escena.
- La lista ordenada de momentos es el elemento observado. `useScroll` usa `offset: ["start 112px", "end 112px"]`.
- Cinco intervalos iguales del progreso observado determinan el momento activo: `[0, .2)`, `[.2, .4)`, `[.4, .6)`, `[.6, .8)` y `[.8, 1]`.
- El usuario conserva scroll, velocidad y dirección nativos.
- Subir revierte la historia.
- No hay animaciones largas intentando alcanzar el scroll.
- El rango activo de escritorio mide `240svh`; cada `li` recibe `48svh`.
- El momento activo es discreto. Las capas visuales aplican una transición CSS corta después del cambio; no existen dos momentos semánticos activos a la vez.

### Geometría del track

- `stageHeight` es la altura del elemento sticky.
- `activeRange` es la altura total de la lista de cinco momentos.
- `trackHeight = stageHeight + activeRange`.
- El stage participa en el flujo; la lista usa margen negativo igual a `stageHeight` para comenzar en el mismo eje visual.
- Un espaciador final de `stageHeight` completa la altura del track.
- El recorrido sticky útil es `trackHeight - stageHeight = activeRange`.
- La lista comienza y termina en el mismo offset superior de `112px`; por tanto, el progreso `0–1` cubre exactamente `activeRange` en avance y reversa.

### Acción dominante por momento

1. La búsqueda aparece y muestra resultados.
2. Un resultado entra al foco y se abre.
3. La disponibilidad no aparece; el mensaje queda enviado.
4. La presencia inicial pierde foco y aparece una ruta accionable.
5. La confirmación reemplaza el foco y corta el rastro.

### Propiedades permitidas

- `transform`.
- `opacity`.
- Cambios discretos de contraste sin filtros animados costosos.

No animar dimensiones, márgenes, padding, `top`, `left` o propiedades que provoquen layout durante el scroll.

## 9. Responsive y movimiento reducido

### Móvil

- Mantiene los cinco momentos.
- Entre `360px` y `1023px` de ancho, con altura mínima de `760px`, la pantalla ocupa `42svh` y permanece sticky a `top: 7rem`.
- El momento activo aparece debajo con hora, frase y progreso.
- Progreso horizontal `01 — 05`.
- Menos capas, desplazamientos más cortos y datos resumidos.
- El rango activo móvil mide `200svh`; cada `li` recibe `40svh`.
- La altura total del track móvil es `42svh + 200svh`.
- Por debajo de `360px` de ancho o `760px` de alto, la experiencia pasa a flujo lineal.

### Escritorio

- Desde `1024px` de ancho y `720px` de alto, `stageHeight` es `calc(100svh - 8.5rem)` y `activeRange` es `240svh`.
- La altura total del track es `calc(100svh - 8.5rem + 240svh)`.
- La escena usa `position: sticky`, `top: 7rem` y `height: calc(100svh - 8.5rem)`.
- La escena se libera al terminar el track. El cierre vive fuera del sticky.
- `7rem` coincide con el offset de navegación y `scroll-mt-28` ya usado por la landing.

### `prefers-reduced-motion`

- Elimina sticky prolongado, scrub, escritura simulada, parallax y escala.
- Muestra los cinco momentos como lista editorial.
- Cada momento tiene un estado visual estático.
- Conserva copy, datos, fuentes y cierre completos.

## 10. Accesibilidad

- Un `h2` introduce la sección.
- Los momentos forman una lista ordenada.
- Horas y estados tienen texto explícito.
- La pantalla simulada es decorativa para tecnologías asistivas.
- Ningún control falso recibe foco o anuncia interactividad.
- La pantalla narrativa no responde al puntero y mantiene cursor por defecto en toda su superficie.
- Cada dato, contexto y enlace existe una sola vez en la narrativa semántica, fuera de la pantalla `aria-hidden`.
- La pantalla puede repetir cifras como decoración, pero nunca contiene el enlace ni la única instancia de la explicación.
- El contenido está disponible en el HTML inicial.
- Los enlaces de fuentes son accesibles por teclado.
- El contraste cumple WCAG 2.2 AA: `4.5:1` para texto normal; `3:1` para texto grande, bordes de foco e indicadores significativos.
- Los enlaces de fuente muestran foco visible con contraste mínimo `3:1` contra estados adyacentes en el tema claro. Ningún enlace vive dentro de la pantalla nocturna decorativa.
- La sección funciona sin JavaScript como relato lineal.

### Estado inicial y mejora progresiva

- El HTML inicial contiene la apertura, los cinco `li`, ambos datos con fuentes y el cierre.
- La lista semántica nunca se oculta para habilitar la experiencia.
- CSS define el layout sticky cuando el viewport cumple las reglas anteriores; JavaScript sólo cambia el estado decorativo de la pantalla.
- Sin JavaScript, la pantalla permanece en su primer estado y el relato completo sigue avanzando linealmente en la columna editorial.
- `prefers-reduced-motion` desactiva sticky mediante CSS antes de la hidratación; no depende de un efecto de React.
- No se cambia entre dos árboles de layout después de hidratar, evitando un salto en navegación directa a `#problema`.

## 11. Arquitectura técnica

### `components/landing/problem-section.tsx`

- Wrapper semántico.
- Apertura, historia y cierre.
- Conserva `sectionIds.problema` y tema claro.
- No administra scroll.

### `components/landing/problem-story.tsx`

- Único componente cliente de la experiencia.
- Observa el progreso de la sección con `motion/react`.
- El target observado es la lista ordenada de momentos, no la sección completa ni el wrapper del track.
- Actualiza React sólo cuando cambia el momento activo.
- Respeta movimiento reducido y fallback lineal.
- No agrega listeners manuales de scroll.

### `components/landing/problem-story-screen.tsx`

- Renderiza los cinco estados visuales.
- Conserva capas montadas para mantener continuidad.
- Cambia sólo `opacity` y `transform`.
- Se marca como presentación visual, no como interfaz interactiva.

### `content/problem.ts`

- Define apertura, momentos, cierre, evidencia y fuentes.
- No deja copy narrativo incrustado en componentes.
- El esquema debe ser tipado y validable.

### Lógica pura

Una función pura limita progreso a `0–1` y lo convierte en momento `0–4` mediante los cinco intervalos definidos. No aplica histéresis ni depende de dirección o estado anterior.

### Dependencias

- Reutilizar `motion/react`.
- No usar GSAP o ScrollTrigger para esta sección.
- No añadir dependencias.

## 12. Limpieza aprobada

Eliminar:

- `components/landing/problem-compare-slider.tsx`.
- `CompareMock`.
- `compareSlider`.
- `@img-comparison-slider/react`.
- Dependencias transitivas exclusivas del comparador en `package-lock.json`.

El comparador y su paquete no tienen otros consumidores actuales. Los documentos anteriores permanecen como historial; esta especificación los sustituye.

## 13. Validación

### Automatizada

`content/problem.test.ts`

- Exactamente cinco momentos.
- IDs, horas y orden únicos.
- Evidencia sólo en momentos 1 y 4.
- Fuente, contexto geográfico y URL HTTPS obligatorios.

`lib/problem-story.test.ts`

- Conversión correcta de progreso a momento.
- Clamping menor que `0` y mayor que `1`.
- Fronteras exactas `.2`, `.4`, `.6` y `.8`.
- Reversibilidad.

### Navegador

- `1440×900`.
- `1280×720`.
- `768×1024`.
- `390×844`.
- `360×760`, viewport móvil mínimo que activa sticky.
- `375×667`.
- Movimiento reducido en escritorio y móvil.
- Entrada desde Hero.
- Navegación directa a `#problema`.
- Scroll lento, rápido y reverso.
- Redimensionamiento dentro de la historia.
- Zoom al 200%.
- Transición a `#motores`.
- Navegación por teclado de fuentes.
- Clic exploratorio sobre búsqueda, mensaje, horarios y confirmación: ningún elemento aparenta o ejecuta interacción.
- Inspección antes de hidratar.

### Checks separados

- Vitest.
- TypeScript.
- ESLint.
- Build.
- Consola del navegador.
- Inspección visual y de rendimiento.

### Umbrales de rendimiento

- En Fase 0 se registra como baseline el commit limpio anterior a la implementación mediante `git rev-parse HEAD`.
- Baseline y feature se miden sobre builds de producción, en la misma máquina y versión estable de Chrome, registrando ambas versiones en el informe.
- Perfil fijo: `1280×720`, CPU `4×`, red sin throttling, una recarga de calentamiento y caché habilitada para las corridas medidas.
- Recorrido fijo: desde el borde superior de `#problema` hasta el borde superior de `#motores` en 10 segundos, sin interacción adicional.
- Se realizan tres corridas por build y se compara la mediana.
- CLS total `≤ 0.1`; ningún layout shift nuevo puede tener un `source` dentro de `#problema` después de cargar fuentes.
- El número mediano de long tasks `> 50ms` durante el recorrido no puede superar el baseline. Si aparece uno nuevo, su stack no puede incluir los nuevos archivos de `problem-story`.
- La duración máxima mediana de long tasks no puede empeorar más de `10ms` frente al baseline.
- Verificación estática: las propiedades ligadas al progreso se limitan a `transform` y `opacity`.

## 14. Criterios de aceptación

- Los cinco momentos se entienden sin observar la pantalla simulada.
- La pantalla nocturna permanece como ancla visual reconocible.
- La pérdida se explica sin inventar causalidad o denigrar otra presencia.
- Ningún elemento falso recibe foco.
- Ningún elemento visual falso muestra cursor, hover o apariencia de control disponible.
- La navegación no tapa contenido esencial.
- No hay salto al activar o liberar sticky.
- La versión reducida contiene la misma información.
- No queda código o dependencia del comparador descartado.
- Hero, `#motores`, navegación y demás secciones conservan su comportamiento.
- La distancia de scroll desde el título hasta el final de la tesis es `≤ 400svh` en escritorio y `≤ 320svh` en móvil.
- En `360×760`, los momentos 1 y 4 muestran frase, dato, alcance y fuente completos, sin truncamiento, superposición o scroll interno.

## 15. Riesgos y mitigaciones

### Sticky inestable en viewports bajos

Mitigación: fallback lineal por altura y movimiento reducido; no forzar paridad.

### Narrativa demasiado larga

Mitigación: cinco momentos, media pantalla aproximada por momento y móvil más corto.

### Estadísticas sobreinterpretadas

Mitigación: contexto visible, fuentes enlazadas y lenguaje restringido.

### UI falsa confundida con controles

Mitigación: pantalla no interactiva, `aria-hidden` y cero elementos enfocables.

### Re-render durante scroll

Mitigación: MotionValue para progreso y estado React sólo al cambiar de momento.

### Regresión de identidad

Mitigación: reutilizar Newsreader, Figtree y tokens actuales; tema oscuro sólo anidado.

## 16. Decision Log

1. **Foco principal:** pérdida invisible de pacientes.  
   **Complemento:** una página informativa ya no basta.

2. **Tono:** incómodo pero profesional.  
   Se descartaron tono puramente clínico y provocación agresiva.

3. **Hilo:** recorrido de un paciente perdido.  
   Se descartaron auditoría de web y jornada del especialista.

4. **Punto de vista:** pantalla del paciente.  
   Se descartaron pantalla dividida y abstracción analítica.

5. **Clímax:** cita confirmada con otro especialista anónimo.  
   No se muestra competidor, marca o identidad.

6. **Duración:** cinco momentos en tres o cuatro pantallas.  
   Se descartaron una versión cinematográfica larga y una versión excesivamente compacta.

7. **Datos:** exactamente dos y sólo como contexto.  
   México primero; evidencia internacional sólo cuando se etiqueta. Ninguno prueba causalidad.

8. **Móvil:** misma historia, ejecución simplificada.  
   Sticky sólo cuando es estable; nunca scroll hijacking.

9. **Cierre:** pregunta, tesis principal y puente.  
   No hay CTA dentro de la sección.

10. **Atmósfera:** editorial clara con una pantalla nocturna central.  
    Se descartaron inmersión oscura completa y transición cromática progresiva.

11. **Necesidad:** primera consulta esa semana.  
    Se descartaron síntomas, diagnósticos y especialidad inventada.

12. **Falla principal:** la web informa, pero no permite avanzar.  
    La dependencia de respuesta humana es secundaria.

13. **Presupuesto técnico:** ligero.  
    Sin video, Canvas, WebGL o 3D.

14. **Éxito:** comprensión y continuidad hacia “La solución”.  
    No se optimiza esta sección para CTA directo.

15. **Concepto:** “La cita que nunca viste”.  
    Se descartaron “Pestañas que se cierran” y “Minutos de decisión”.

16. **Tecnología:** sticky nativo y `motion/react`.  
    Se descartó GSAP/ScrollTrigger para esta sección.

17. **Componente huérfano:** eliminación completa.  
    No se reutiliza código, copy o dependencia del comparador.

18. **Relato compuesto:** las horas son estructura narrativa, no comportamiento típico.  
    El copy y la presentación deben declarar explícitamente su carácter ilustrativo.

19. **Mejora progresiva:** un solo árbol semántico; CSS decide sticky o lineal antes de hidratar.  
    JavaScript sólo actualiza la pantalla decorativa.

20. **Activación responsive:** reglas deterministas por ancho, altura y movimiento reducido.  
    No se detectan “navegadores inestables” mediante heurísticas.

21. **Geometría:** el rango observado es la lista de momentos y la altura del track incluye stage más rango activo.  
    Esto alinea activación, intervalos y liberación sticky.

22. **Conformidad visual:** WCAG 2.2 AA con umbrales explícitos.  
    El foco de fuentes se valida en el único árbol accesible.

23. **Responsabilidad del especialista:** la historia no exige respuesta humana inmediata.  
    La falla es la ausencia de un siguiente paso autónomo, no una demora de tres minutos.

24. **Pantalla simulada:** representación explícitamente no interactiva.  
    No usa semántica, cursor o estados que prometan controles disponibles.

25. **Presupuesto de recorrido:** se mide desde título hasta tesis, no sólo dentro del track.  
    Máximo `400svh` en escritorio y `320svh` en móvil.

## 17. Revisión adversarial

### Skeptic / Challenger — REVISE

Objeciones aceptadas y resueltas:

1. Se declaró el caso como ilustrativo compuesto y se redujo el lenguaje causal.
2. Se retiró el `39%` sin artefacto primario accesible; se sustituyó por datos propios y trazables de Doctoralia México.
3. Se definió la inferencia permitida de cada dato y su separación visual como contexto.
4. Se especificó un único árbol semántico y mejora progresiva sin cambio de layout tras hidratación.
5. Se eliminaron histéresis y solapamiento contradictorios; los intervalos son puros y exactos.
6. Se fijaron breakpoints, alturas, offset, track y liberación.
7. Datos y enlaces viven fuera de la pantalla `aria-hidden`.
8. Se añadieron entorno y umbrales de rendimiento verificables.
9. Se retiró la prueba de ausencia de copy viejo por ser un contrato editorial YAGNI.

### Constraint Guardian — REVISE

Objeciones aceptadas y resueltas:

1. Se definieron elemento observado, offsets, fórmula del track, recorrido útil y geometría móvil.
2. Se fijó un protocolo de baseline, entorno, caché, recorrido y mediana de tres corridas para rendimiento.
3. Se añadieron umbrales WCAG 2.2 AA y foco visible verificable.

### User Advocate — REVISE

Objeciones aceptadas y resueltas:

1. Se eliminó la lectura de que el especialista debía responder en tres minutos; la causa narrativa es la falta de autonomía del recorrido.
2. La pantalla se etiqueta como representación, no contiene controles reales y no responde al puntero.
3. Se definió y redujo el presupuesto total desde título hasta tesis.
4. Sticky móvil comienza a `760px` de alto y se valida el contenido completo en `360×760`.
5. “Intervenir en esta decisión” se sustituyó por ayudar al paciente a dar el siguiente paso.

### Integrator / Arbiter — APPROVED

- Las objeciones de los tres revisores fueron aceptadas y resueltas.
- No quedan objeciones abiertas o rechazadas sin racional.
- El diseño y el Decision Log son aceptables para pasar al plan de implementación.
- Esta disposición no autoriza implementación directa.

## 18. Próximo gate

Antes de implementar:

1. Revisión adversarial de esta especificación.
2. Corrección y aprobación de hallazgos materiales.
3. Plan de implementación por fases.
4. Aprobación explícita para iniciar la primera fase.
