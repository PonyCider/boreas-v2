# Review — coreografía y copy del scroll cinemático del Hero

**Fecha:** 2026-07-14
**Autor:** Fable 5 (agente de análisis, solo investigación — sin código)
**Insumos leídos:** `docs/handoff/2026-07-13-checkpoint-and-cinematic-scroll-plan.md`, `GUIDELINES.md`, `DESIGN.md`, `content/boreas-home.ts`, `components/hero/boreas-hero.tsx`. Skills aplicadas: humanizer (detección de patrones de IA), marketing-psychology (sesgos y modelos de decisión).
**Qué revisa:** el esqueleto de 5 fases Problema→Solución propuesto para el pin del Hero. No cuestiono las decisiones marcadas como fijas (arco elegido por el dueño, reduced-motion colapsa a T4, mobile con pin adaptado).

---

## 0. Veredicto en tres líneas

El arco Problema→Solución es defendible, pero **tal como está esqueletizado viola dos reglas vigentes del propio proyecto** (contenido gateado por animación y el hero-metric template prohibido), **cuenta el journey del paciente en orden invertido** (respuesta antes que confianza), y **duplica casi literalmente el trabajo de las secciones Problema y Prueba social** que están dos scrolls más abajo. Todo tiene arreglo sin abandonar el arco: recortar a 3 fases, reordenar confianza antes que respuesta, y bajar la "voz de problema" del hero a un solo beat en vez de una fase entera de stats.

---

## 1. Narrativa: dónde se cae la lógica

### 1.1 Fase 1 rompe dos reglas escritas del proyecto

- **"Headline aún no visible o atenuado"** choca de frente con DESIGN.md → Motion Rules: *"Content is never gated behind animation — it must exist in the DOM and be visible by default"*, y con GUIDELINES §4 Layout: *"Primer viewport muestra la oferta"*. El detalle que lo hace grave: en un pin sticky, **el estado de fase 1 ES el estado de carga de la página** (scroll = 0). Un médico que abre la landing vería el 82% grande y ninguna oferta. Eso no es un efecto de scroll, es el primer viewport entero sin headline ni propuesta de valor. También afecta a crawlers y screenshots (regla explícita en GUIDELINES §4). El headline tiene que estar visible y legible desde scroll 0, sin excepción. La "aparición" de fase 2 puede ser un realce (peso, posición del cluster, foco), no un reveal.
- **"Search% chip aparece grande/centrado"** roza otra prohibición literal de GUIDELINES §4: el **hero-metric template** está en la lista de prohibiciones cross-register. Un stat gigante centrado como apertura del hero es exactamente ese patrón. El chip puede crecer y tomar protagonismo dentro del cluster derecho, pero no convertirse en la pieza central del viewport.

### 1.2 El orden de fases invierte el journey del paciente

La secuencia propuesta es: búsqueda (82%) → **respuesta 24h** → **confianza (rating/testimonial)** → agenda. Pero ningún paciente escribe antes de confiar. El journey real que Boreas vende es:

1. El paciente **busca** (82%, muchas veces de noche).
2. El paciente **encuentra** el consultorio digital: reseñas, rating, redacción profesional → confianza.
3. Recién entonces **escribe** por WhatsApp y recibe respuesta aunque sean las 11:47 PM.
4. Resultado: **agenda con citas**.

Poner "respuesta 24h" en fase 2 y "confianza" en fase 3 cuenta la historia al revés: el consultorio contesta a alguien que todavía no tenía motivos para escribir. Se siente sutil pero un médico evaluando el servicio va a leer la secuencia como su paciente la viviría, y el orden causal roto debilita la persuasión (el modelo mental correcto aquí es contraste antes/después + prueba social *antes* del pedido de acción, no después).

**Fix propuesto:** intercambiar fases 2 y 3 → búsqueda → encuentro/confianza → respuesta/contacto → agenda. La confianza (rating + testimonial) es *lo que el paciente encuentra*, no un adorno posterior.

### 1.3 La fase 5 no es una fase

"Subcopy completo visible, CTA reforzado, pin se suelta" no revela nada nuevo: es el estado de liberación del pin. Presupuestarle 20% del scroll es pagar profundidad de scroll por cero información. El cierre debe ser el último 5-10% de la fase final, no un acto propio.

### 1.4 El CTA no puede esperar al 80%

Si el CTA "se refuerza" al final, la lectura implícita es que antes estaba débil o ausente. El checkpoint ya lo advierte: dentro del pin, el CTA no debe aparecer/desaparecer de forma que compita consigo mismo. Y hay un caso de usuario que el esqueleto ignora: el médico que ya vio la página antes (o llegó recomendado) y quiere ir directo al form. Si el pin le retiene el CTA cuatro fases, le agregaste fricción exactamente a tu lead más caliente. **El CTA primario del hero debe estar visible y clicable desde scroll 0 hasta la liberación del pin.** El "refuerzo" del cierre puede ser jerárquico (el resto del cluster se asienta y el ojo cae al CTA), nunca de aparición.

### 1.5 Elementos sin destino definido

El esqueleto no dice qué pasa con el **wordmark "Boreas"** (hoy ocupa ~40% de la columna izquierda a 10.5rem) ni con el goteo de **proof points 1-2 / 3-4** repartidos entre fases 3 y 4. Cuatro líneas de 13px repartidas en 40% del recorrido es muy poco payoff por centímetro de scroll: el usuario "gasta" media fase para ver aparecer "Sin trabajo técnico". Recomiendo que los proof points entren como un solo beat (o queden estáticos desde el inicio, que es lo que son: contexto, no revelación).

---

## 2. Copy específico

Disciplina T7-T8 vigente: ningún número nuevo sin fuente. Las dos stats citables disponibles son 82% (busca en línea antes de agendar) y 40% (fuera de horario), fuentes ya declaradas en `problemStatsSources`. El rating es **4.8** — `content/boreas-home.ts` tiene un comentario explícito sobre el drift 4.9 vs 4.8; el esqueleto dice "cuenta hasta 4.x", debe ser 4.8 exacto desde `socialProof.mockupDoctor`.

### 2.1 Eyebrow de fase 1 (framing de problema)

El propuesto ("82% de tus pacientes ya está buscando online") tiene tres problemas: usa "online" cuando todo el sitio dice "en línea"; repite el 82% que la sección Problema muestra en grande dos scrolls después (ver §4); y es la frase que cualquier landing de SaaS médico generada por IA pondría ahí (ver §5). Opciones concretas, en orden de preferencia:

- **Opción A (recomendada — hora, sin stat, cero duplicación):**
  `Son las 11:47 de la noche. Un paciente te está buscando.`
  Usa el timestamp que ya existe en `heroCardStats.lastReplyTime`, ancla la fase 1 al mismo objeto que paga en la fase de respuesta (ver 2.2), y no quema ninguna estadística que las secciones de abajo necesitan. Es específica, no genérica. Cae bajo el badge "Ejemplo ilustrativo" del cluster, no necesita fuente.
- **Opción B (stat, con fuente existente):**
  `El 82% de tus pacientes te busca en línea antes de agendar.`
  Correcta y citable (Accenture, ya en `problemStatsSources`), pero duplica el 82% de `problemStats[0]`. Solo usarla si se decide reescribir la sección Problema para que no repita el número (ver §4).
- **Opción C (consecuencia, sin número):**
  `Tus pacientes ya te buscan en línea. Lo que encuentran decide si te escriben.`
  Sin stat, plantea el stake real. Más larga; funciona mejor como microcopy de fase que como eyebrow.

Nota de diseño menor: el eyebrow actual está en `--c-mint` (color de estado positivo en el cluster). Un framing de problema en menta manda señal mixta; ámbar (`--c-amber`, ya usado para el stat 82%) es más coherente para el beat de tensión. Decisión de diseño, no de copy.

### 2.2 El microcopy con más palanca: el flip del chip 11:47 PM

El chip existente dice `11:47 PM · tu consultorio respondió` — eso es el estado *solución*. La secuencia gana una mecánica de payoff barata y específica si el mismo chip arranca en estado *problema* y flipea:

- **Estado problema (fase 1):** `11:47 PM · tu paciente sigue esperando` (alternativa: `11:47 PM · nadie contesta a esta hora`, que hace eco de la fricción #1 de `socialProof.frictions` sin copiarla).
- **Estado solución (fase de respuesta):** `11:47 PM · tu consultorio respondió` (existente, no tocar).

Mismo objeto, mismo timestamp, significado invertido por el scroll del lector. Es la clase de motion "específico al contenido" que exige la directiva del dueño, y es loss aversion bien aplicada: primero el costo de no tener consultorio digital, después el alivio. Requiere una key nueva en `content/boreas-home.ts` (p. ej. `lastReplyProblemLabel`) — el copy vive en content, no en JSX.

### 2.3 Otros microcopy que la secuencia necesita (o debe evitar)

- **Labels de fase tipo "Confianza" / "Agenda llena" como eyebrows por fase:** no. GUIDELINES prohíbe el eyebrow tracked uppercase por sección, y nombrar las fases en pantalla es narración de tutorial, no demo. Las fases se entienden por lo que hacen los objetos.
- **Appointments chip:** `3 citas hoy` (existente) alcanza. Si se quiere un remate tipo "agendadas mientras dormías", es ilustrativo (cubierto por el badge) pero opcional; no agregarlo si alarga la fase.
- **Cualquier número nuevo** ("N pacientes perdidos por semana", "X búsquedas sin respuesta en tu zona", "cada noche se pierden Y citas") — **necesita fuente**. No existe hoy. Si el dueño quiere uno, se consigue la fuente primero o no entra.
- **Subcopy del cierre:** el `heroSubcopy` actual ya cierra bien la secuencia ("convierte esa primera búsqueda en confianza y contacto directo") — de hecho describe literalmente el arco. No hace falta escribir un cierre nuevo; hace falta que el subcopy esté visible al final. Si estuvo visible todo el tiempo (recomendado, ver §1.1), el cierre es solo el asentamiento visual del cluster.

---

## 3. Pacing y fatiga de scroll

GUIDELINES §1: fase 0→1, la prioridad absoluta es el primer cierre. El hero no es el producto: es el pasillo hacia el form. Cada viewport-height de pin es scroll que el médico paga antes de llegar a prueba social, proceso, garantía y form.

- 5 fases legibles necesitan ~80-100vh cada una → un pin de 400-500vh. En un tráfico 82%/71% móvil, eso es 4-6 pulgares de scroll dentro de una sola "pantalla" que no avanza visualmente. El riesgo no es solo aburrimiento: en móvil el usuario interpreta "scrolleo y la página no se mueve" como bug, no como cine.
- **Recomendación dura: 3 fases, pin total ≤ 250-300vh en desktop.** Fusión concreta:
  1. **Fase 1 — Te busca (0→30%):** eyebrow en framing de problema + chip 11:47 en estado problema + search chip toma protagonismo dentro del cluster. Headline, subcopy y CTA visibles desde el inicio.
  2. **Fase 2 — Te encuentra (30→65%):** doctor card entra con rating 4.8 (count-up una sola vez) + testimonial. Proof points entran como un beat único.
  3. **Fase 3 — Te responde y agenda (65→100%):** flip del chip 11:47 a "tu consultorio respondió", botón WhatsApp destaca, appointments chip cuenta a 3. Últimos ~10%: el cluster se asienta, pin se suelta.
- Si el dueño insiste en 4: separar "responde" (65→85%) de "agenda" (85→100%), nunca resucitar la fase 5 de cierre ni la fase de headline oculto.
- **Móvil:** 2 beats máximo (busca+encuentra / responde+agenda), pin ≤ 150vh, sobre la card in-flow existente. Si en pruebas reales el sticky jankea con la barra de direcciones, degradar a la coreografía T4 actual sin pin es mejor que un pin roto — el checkpoint ya exige diseñar móvil explícitamente, no heredar el desktop reducido.

---

## 4. Consistencia con el resto de la landing

Aquí está el problema estructural más serio del esqueleto: **pisa dos secciones enteras.**

- **Sección Problema:** muestra el 82% y el 40% en grande (`problemStats`) más tres pain points. La fase 1 propuesta abre con el mismo 82% grande y centrado. El médico vería el mismo número protagonista dos veces en tres scrolls. Segunda aparición = déjà vu, y la sección Problema (que existe para profundizar) pierde su golpe.
- **Prueba social:** su heading es `"Tu paciente buscó anoche. No te encontró."` — literalmente la escena que la fase 1 del hero dramatiza. Si el hero ya contó "paciente busca de noche → consultorio responde", la sección de abajo relata la misma noche por segunda vez.

**Cómo evitarlo sin tocar el arco elegido:**

1. **Repartir los papeles por altitud narrativa.** Hero = *una* anécdota (un paciente, una noche, un consultorio — micro-historia con objetos). Problema = *la evidencia general* (stats con fuente, pain points, "esto no es un caso, es el patrón"). Prueba social = *lo que el paciente ve* (mockup + fricciones). Con ese reparto, el hero no necesita mostrar el 82% en grande: le basta la hora (11:47 PM) como gancho, y deja los números para Problema. Por eso la opción A del eyebrow (§2.1) es la recomendada: reserva el 82% para la sección que lo necesita.
2. Si igualmente se quiere el 82% en el hero, dejarlo en el tamaño actual del chip (contexto de fondo), nunca como protagonista de fase, y considerar reencuadrar `problemStats[0]` hacia la consecuencia (qué pasa cuando buscan y no hay nada) para que no sea repetición literal. Eso es una edición aparte con su propio riesgo; la ruta 1 es más barata.
3. El final "agenda llena" bordea el territorio de Transformación ("Te entregamos pacientes decididos"). Con 3 citas y un chip es un destello aceptable; no expandirlo a más objetos de resultado (nada de gráficas de crecimiento, más testimoniales, etc.) o Transformación llega masticada.

---

## 5. Riesgos de "AI slop" (precisos, no vibes)

Coreografía:

- **Stat gigante centrado como apertura** — es el hero-metric template (prohibido en GUIDELINES) y además el patrón #1 de scrollytelling generado por IA. Señalado en §1.1.
- **Count-up de rating desde 0** — un rating no "sube" hasta 4.8; semánticamente es raro (las reseñas ya existen) y el count-up en cada número de la página es un tell de landing generada. Ya existe en el hero actual, pero la secuencia lo re-dispararía en fase de confianza: que cuente **una sola vez** y rápido (≤0.9s como hoy), o que entre ya resuelto y solo el testimonial haga fade.
- **Goteo uniforme de items** (proof points 1-2, luego 3-4) — el reparto simétrico de listas entre fases es relleno mecánico, no narrativa. Un beat único.
- **"CTA reforzado" al cierre** — si "reforzado" termina siendo pulso, glow o scale-loop del botón, es slop y además viola anti-bans (sin glow, sin elástico). El refuerzo legítimo es que todo lo demás se asiente.
- **Labels de fase en pantalla** ("Problema", "Confianza") — narración de tutorial. Los objetos cuentan la fase.

Copy:

- `"82% de tus pacientes ya está buscando online"` — frase plantilla de SaaS + anglicismo fuera de la voz del sitio ("en línea" en todo el copy actual). Reemplazos en §2.1.
- Vigilar en cualquier copy nuevo: construcciones "No es X, es Y" adicionales (el sitio ya tiene una en `transformationHeading`, que funciona; dos son patrón), tríadas por reflejo, y remates aforísticos ("La confianza es la nueva sala de espera" y familia). El copy existente del sitio es concreto y con vocabulario del médico — el estándar para lo nuevo es ese.
- Lo que el copy actual hace bien y hay que conservar: detalles duros (11:47 PM, 4.8, 127 reseñas, 48-72 h). La especificidad es el antídoto del slop; la secuencia debe apoyarse en esos objetos, no en frases nuevas.

---

## 6. Alternativa concreta: "Una noche, un paciente" (mismo stack, mismas restricciones)

No es un arco distinto — es el mismo Problema→Solución del dueño, comprimido a 3 fases y contado como una sola escena continua en vez de cinco diapositivas. Diferencias operativas contra el esqueleto:

- **Columna izquierda estática todo el pin.** Wordmark, headline, subcopy, CTA y proof points visibles desde scroll 0 y sin reorganización (cumple primer-viewport, contenido no gateado, CTA persistente). Solo el eyebrow crossfadea una vez: de framing de problema (opción A) al `heroCredibility` actual, alrededor del 60%.
- **Toda la coreografía vive en el cluster derecho**, que ya es el "escenario" natural (y en móvil, en la card in-flow). Esto simplifica reduced-motion (el colapso a T4 ya decidido es trivial: el cluster final ES el estado T4) y reduce el costo móvil.
- **Timeline por fase (desktop, contenedor ~280vh, viewport sticky):**
  - **0→30% — Te busca.** Cluster casi vacío: chip 11:47 PM en estado problema (§2.2) + search chip visible en tamaño normal. Tensión por ausencia: el "espacio donde debería estar tu consultorio" está vacío.
  - **30→65% — Te encuentra.** La doctor card entra al centro del cluster (una traslación con ease-out exponencial, sin bounce): rating 4.8, 127 reseñas, testimonial. Es la respuesta visual a "¿qué encuentra el paciente?".
  - **65→100% — Te escribe y agenda.** Flip del chip a "tu consultorio respondió", el botón de WhatsApp toma foco, appointments chip cuenta a 3 citas. Último 10%: nada nuevo, el cluster se asienta y el pin suelta.
- **Móvil:** mismas 3 escenas comprimidas a 2 (busca+encuentra / responde+agenda), pin ~150vh sobre la card in-flow. Si jankea: sin pin, escenas como secuencia `whileInView` — decisión a validar en dispositivo real, no en devtools.
- **Por qué es mejor que el esqueleto:** cero violaciones de guidelines, orden causal correcto, la mitad de profundidad de scroll, un solo mecanismo de payoff memorable (el flip del chip) en vez de cinco apariciones, y no le roba material a Problema ni a Prueba social.

---

## 7. Header CTA dinámico — de acuerdo, con dos precisiones

Pasar el threshold de 600px a la altura real del hero pineado es correcto. Dos cosas que el plan debe fijar:

1. La medición debe ser reactiva (la altura del pin cambia con viewport/breakpoint), no un número calculado una vez al montar.
2. La regla operativa es más simple que "altura del hero": **mientras el CTA del hero esté en viewport (pineado o no), el CTA del header no aparece; cuando el pin suelta y el hero sale, aparece.** Eso satisface "un CTA primario por viewport" sin coordinar números mágicos.

---

## 8. Checklist de decisiones para el dueño

| # | Decisión | Recomendación |
|---|----------|---------------|
| 1 | ¿Headline visible desde scroll 0? | Sí, obligatorio (regla vigente, no negociable) |
| 2 | ¿5 fases o 3? | 3 (fusionar confianza+respuesta con agenda como remate; cierre no es fase) |
| 3 | ¿Orden respuesta↔confianza? | Confianza antes que respuesta (journey del paciente) |
| 4 | ¿Eyebrow fase 1? | Opción A: "Son las 11:47 de la noche. Un paciente te está buscando." |
| 5 | ¿82% grande en el hero? | No — reservarlo para la sección Problema; en el hero queda como chip |
| 6 | ¿Flip del chip 11:47 (problema→solución)? | Sí — es el payoff central; nueva key en content |
| 7 | ¿CTA visible durante todo el pin? | Sí, sin aparición/refuerzo animado |
| 8 | ¿Pin móvil? | 2 beats, ≤150vh, validar en dispositivo real con plan B sin pin |
| 9 | ¿Números nuevos en microcopy? | Solo con fuente citable; hoy no hay ninguno aprobado |
