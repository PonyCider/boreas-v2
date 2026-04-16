# Boreas v2.1 PRD

## Contexto

Este PRD redefine la version `2.1` de Boreas a partir de la estrategia consolidada de Boreas/Relevo.

- `Boreas` es la plataforma operativa de revenue.
- `Relevo` es el primer modulo activo dentro de Boreas y el motor de conversion.
- El objetivo inmediato no es construir un ecosistema completo visible en el sitio, sino comunicar con claridad la arquitectura del sistema y vender con precision el primer modulo que ya genera valor.

## Decision estrategica de version

La version `2.1` de Boreas se construira sobre estas decisiones:

- Boreas se posiciona como infraestructura de generacion de revenue, no como un hub de herramientas ni una automatizacion aislada.
- Relevo se posiciona como el modulo de conversion responsable de responder, calificar y llevar leads a acciones concretas, principalmente citas agendadas.
- El sitio no se enfocara en una sola vertical. La estrategia comercial de `v2.1` trabajara tres verticales principales en paralelo: `salud`, `belleza` e `inmobiliario`.
- Se acepta conscientemente que esta eleccion puede diluir parte del enfoque. La compensacion vendra por claridad narrativa, contenido mas fuerte y una explicacion mucho mas precisa de los playbooks y del onboarding.
- El reemplazo de `mailto:` es prioritario, pero la solucion final de CTA no queda cerrada en este PRD. Se evaluaran alternativas de alta conversion antes de elegir una implementacion final.
- Si se adopta un formulario, debera ser un formulario optimizado para conversion y ofrecer valor claro al usuario a cambio de completarlo.

## Problema actual

El sitio actual comunica Boreas como si fuera directamente el agente que conversa, califica y agenda. Eso mezcla plataforma y modulo en una sola capa mental. Tambien comunica amplitud funcional y promesas operativas por encima del grado de especializacion que hoy conviene vender.

Los principales problemas son:

- No existe una separacion clara entre Boreas y Relevo.
- La narrativa actual vende automatizacion conversacional, pero no explica la logica estructurada de playbooks por industria.
- El sitio comunica demasiada amplitud sin anclarla suficientemente en una tesis coherente.
- Los CTA actuales dependen de `mailto:` y no constituyen un embudo medible.
- El sitio no convierte su propia promesa en una experiencia de conversion medible dentro de la web.

## Objetivo del producto

Rediseñar el sitio de Boreas para que la version `2.1` logre tres cosas al mismo tiempo:

1. Explicar con claridad la arquitectura `Boreas -> Relevo`.
2. Vender Relevo como motor de conversion estructurado, medible y escalable.
3. Soportar tres verticales principales sin que el mensaje se vuelva generico.

## Objetivos de negocio

- Incrementar la claridad de posicionamiento de Boreas y Relevo.
- Mejorar la calidad de los leads entrantes.
- Aumentar la tasa de accion sobre el CTA principal.
- Preparar un sistema web medible para iterar con data real.

## Objetivos de UX y conversion

- Reducir confusion sobre que es Boreas y que es Relevo.
- Generar confianza en usuarios de salud, belleza e inmobiliario.
- Mostrar que el sistema no depende de prompts improvisados, sino de playbooks por industria.
- Reducir friccion en el primer contacto sin sacrificar calidad del lead.

## Audiencias prioritarias

### Primarias

- Negocios de salud que dependen de velocidad de respuesta y agenda.
- Negocios de belleza y bienestar que viven de reservas y seguimiento comercial.
- Negocios inmobiliarios donde la velocidad y la calificacion del lead impactan directamente el cierre.

### Secundarias

- Operadores o dueños que quieren resultados economicos, no experimentar con prompts.
- Equipos pequeños que ya sienten fuga de revenue por tiempos de respuesta lentos.

## Posicionamiento

### Boreas

`Boreas` es una plataforma operativa de revenue que automatiza adquisicion, conversion y retencion con inteligencia artificial.

### Relevo

`Relevo` es el primer modulo de Boreas. Es un motor de conversion que usa playbooks por industria para calificar leads y moverlos hacia acciones concretas como agendar una cita.

## Propuesta de valor

- No se vende "automatizacion de mensajes".
- No se vende "un bot".
- No se vende "un stack de IA".

Se vende:

- Menor tiempo de respuesta.
- Mejor avance conversacional.
- Mas citas agendadas.
- Mejor conversion de leads.

## Principios de producto

- Control sobre flexibilidad.
- Resultados medibles por encima de novedad.
- Iteracion con clientes reales.
- No construir features sin data.
- Comunicar sistema y logica, no solo interfaz.

## Requisitos del contenido

### P0

- Reescribir la narrativa central para diferenciar Boreas de Relevo.
- Reestructurar el homepage para que Relevo aparezca como el modulo actual dentro del sistema Boreas.
- Reemplazar `mailto:` por un CTA transaccional real.
- Mantener las tres verticales principales visibles: salud, belleza e inmobiliario.
- Evitar promesas ambiguas que desborden el foco actual de conversion.

### P1

- Crear una seccion fuerte sobre playbooks por industria.
- Usar esa seccion para compensar la dilution natural de trabajar tres verticales.
- Hacer visible que la especializacion no vive en prompts sueltos sino en logica operacional.
- Explicar el onboarding como una experiencia simple y confiable: el usuario aporta datos del negocio; Boreas/Relevo activan la estructura correcta.
- Reforzar la confianza del usuario mostrando que no necesita diseñar la logica del sistema.

### P2

- Consolidar el contenido estrategico en una capa facil de iterar.
- Mejorar SEO y metadata segun la nueva arquitectura de marca.
- Preparar medicion y eventos para experimentar sobre CTA y captura.

## Requisitos funcionales

### CTA principal

- El CTA debe dejar de depender de `mailto:`.
- La solucion final queda abierta entre varias alternativas de alta conversion.
- La seleccion de alternativa se hara en una exploracion posterior, no en este documento.
- Si se usa formulario, debe:
  - minimizar friccion,
  - pedir solo lo necesario,
  - aumentar la percepcion de valor,
  - devolver algo util al usuario por completarlo.

### Multi-vertical

- La web debe sostener tres verticales sin parecer una solucion generica.
- Cada vertical debe verse reflejada de forma creible.
- El contenido debe demostrar adaptacion por playbook, no por cosmetica superficial.

### Demo de producto

- La demo debe representar a `Relevo`, no a Boreas como marca paraguas.
- Debe mostrar calificacion, manejo de avance conversacional y empuje a accion.
- Debe alinearse con la tesis de conversion y no solo con "responder mensajes".

### Onboarding

- Debe comunicar que el usuario no diseña la logica.
- Debe mostrar que el sistema se configura a partir de:
  - industria,
  - informacion del negocio,
  - precios,
  - horarios,
  - ubicacion,
  - contexto operativo.
- Debe aumentar confianza y reducir ansiedad de implementacion.

## Requisitos de medicion

Se debe preparar la base para medir:

- click en CTA principal,
- inicio de flujo de contacto,
- finalizacion del flujo,
- seleccion de vertical,
- interacciones con demo,
- scroll depth por seccion,
- conversion a llamada o contacto efectivo.

## No objetivos de v2.1

- No lanzar aun modulos completos de adquisicion o retencion como propuesta principal del sitio.
- No convertir la web en una app completa.
- No sobrecargar el homepage con demasiados caminos secundarios.
- No comprometer el mensaje principal por perseguir amplitud de features.

## Riesgos

- Trabajar tres verticales puede reducir claridad si la narrativa no es excepcionalmente precisa.
- Elegir un CTA incorrecto puede aumentar friccion o bajar calidad del lead.
- Si la seccion de playbooks no se explica bien, el mensaje puede seguir percibiendose como "otro chatbot".
- Si onboarding no transmite control y simplicidad, la confianza puede caer.

## Mitigaciones

- Usar contenido explicativo fuerte para sostener las tres verticales.
- Diseñar el CTA como experimento medible, no como decision cerrada por intuicion.
- Tratar playbooks y onboarding como piezas de conversion, no como notas tecnicas.
- Priorizar claridad semantica de marca por encima de copy creativo ambiguo.

## Entregables esperados

- Homepage v2.1 con nueva arquitectura narrativa.
- PRD versionado dentro del repo.
- Backlog en EPICs y subtasks `v2.1`.
- Base de medicion para iteracion posterior.

## Criterios de exito

- Un usuario nuevo entiende en menos de un minuto que Boreas es la plataforma y Relevo el modulo actual.
- Las tres verticales se sienten parte de una misma tesis operativa, no una lista dispersa.
- El CTA principal deja de ser `mailto:` y pasa a un flujo medible.
- El sitio comunica playbooks y onboarding como ventajas de conversion y confianza.
- La version `2.1` queda documentada y ejecutable como roadmap real.
