# Contexto para agentes de IA en boreas-template — diseño

> **Alcance:** este spec cubre solo la transferencia de contexto de negocio/producto al repo
> `boreas-template` (para que un agente de IA sin memoria de esta conversación entienda el
> proyecto al entrar). **No cubre** el sistema de categorías + "core idea" por especialidad
> (quiz de pre-triage, test GAD-7/PHQ-9, simulador antes/después, calculadora de metabolismo,
> etc.) — eso es un proyecto separado y más grande, con su propio brainstorm futuro.

## 1. Objetivo

Que un agente de IA nuevo, sin contexto de esta conversación, que entre a la carpeta raíz de
`boreas-template` (o de cualquier `boreas-<cliente>` clonado de él) entienda: qué es Boreas, a
quién le vende, qué es este repo, y que el sistema de categorías/core-idea está planeado pero
no construido — sin tener que buscar información en el repo separado de Boreas V3.

## 2. Por qué dos documentos, no uno

El repo de GitHub de cada sitio de cliente se **transfiere al cliente** en el Plan A de pago
único (ver `docs/internal/boreas-master.md` §4.1 en este repo). Cualquier contenido confidencial
(precios, esquemas de pago, política de cobro) que viva en un archivo trackeado por git viajaría
con esa transferencia — el cliente terminaría con acceso a información de negocio interna de
Boreas. Por eso el contexto se separa en dos documentos con reglas de git distintas:

- **`PRODUCT.md`** — trackeado normalmente, viaja con el repo sin problema (no es confidencial).
- **`docs/internal/boreas-internal-context.md`** — vive en el working directory pero **nunca se
  trackea** (ver §5). Existe para que un agente de Boreas trabajando dentro de un repo de cliente
  tenga el contexto operativo a la mano, sin depender de tener el repo Boreas V3 abierto en
  paralelo, y sin riesgo de que se filtre.

## 3. `PRODUCT.md` — contenido

Vive en la raíz de `boreas-template`, se trackea en git normalmente. Contenido:

- **Qué es Boreas:** agencia de presencia digital para profesionales de la salud en México —
  consultorio digital abierto 24/7 que filtra, convence y agenda pacientes. Audiencia ampliada
  a "profesionales de la salud" en general (no solo médicos con cédula): medicina general y
  especialidades, salud mental/psicología, odontología, bienestar/estética.
- **Qué es este repo:** plantilla base que se clona (vía "Template repository" de GitHub, nunca
  fork) una vez por cliente. Cada clon se convierte en el sitio de un consultorio/profesional
  específico.
- **Las 4 categorías de negocio (referencia de mercado, no arquitectura aún):** listadas con su
  volumen de leads de referencia (dato interno de scraping, no confidencial per se al nivel de
  categoría-y-conteo, pero sin cifras de precio):
  - Medicina general y especialidades médicas (~486 leads de referencia — doctor, dermatólogo,
    cirujano plástico, cardiólogo, urólogo entre los más frecuentes).
  - Salud mental y psicología (~203 — psicólogo, psicoterapeuta, psiquiatra).
  - Odontología y cuidado dental (~111 — dentista, clínica dental).
  - Bienestar, estética y cuidado personal (~97 — nutriólogo, salón de belleza, spa médico).
- **Sistema de categorías — planeado, no implementado:** nota explícita: cada categoría tendrá su
  propio "core idea" (mecanismo de conversión: quiz, test validado, simulador, calculadora) y su
  propia identidad visual, diseñados en un proyecto separado. **Hasta que ese sistema exista, este
  repo solo trae el patrón genérico ya construido** (hero + CTA de WhatsApp + form de contacto).
  Un agente que entre a construir un sitio hoy no debe inventar estructura de categorías — debe
  usar el patrón genérico y esperar el spec correspondiente si se le pide algo de categorías.
- **Reglas de voz y copy** (portadas de `PRODUCT.md`/`GUIDELINES.md` de Boreas V3, sin cambios de
  fondo): español primero, claro antes que ingenioso, vocabulario que el profesional reconoce, sin
  jerga técnica como gancho, sin precio público, sin escasez semanal ni "último lugar". Aplican a
  cualquier copy que se escriba en `content/site.ts` de cualquier sitio de cliente.
- **Diseño visual: diferido.** No hay tokens de color/tipografía definidos todavía — eso se decide
  junto con el sistema de categorías (cada categoría podría tener su propia identidad visual). El
  repo hoy usa Tailwind default sin marca aplicada.

## 4. `docs/internal/boreas-internal-context.md` — contenido

Condensado operativo, no el documento maestro completo — solo lo que un agente trabajando dentro
de un repo de cliente necesitaría sin acceso al repo Boreas V3:

- Los 2 esquemas de pago (Plan A pago único, Plan B reducido + mensualidad) con montos y qué se
  transfiere/retiene en cada uno (repo + Vercel al cliente en A; Boreas conserva todo en B).
- Regla fija: el dominio siempre lo paga y elige el cliente, en ambos planes, sin excepción.
- Resumen del flujo de revisión/entrega: 2 rondas incluidas, escalación a videollamada Zoom con
  anotación en vez de una 3ra ronda, aprobación explícita del cliente obligatoria antes de mergear
  a producción y conectar dominio.
- Referencia a que el documento completo (con guiones de venta, KPIs de pipeline, proceso
  comercial) vive en `docs/internal/boreas-master.md` del repo Boreas V3 — no se duplica aquí
  porque no aporta a un agente construyendo código de un sitio de cliente.

**Explícitamente fuera de este archivo:** scripts de cold call, manejo de objeciones, KPIs de
pipeline de ventas, filosofía Hormozi — información de proceso comercial, no de este proyecto de
código. Vive solo en Boreas V3.

## 5. Mecanismo de no-filtración

En `boreas-template/.gitignore`, agregar:

```
docs/internal/
```

Esto se hace **antes** de crear el archivo `boreas-internal-context.md`, para que nunca exista un
commit en el historial que lo haya incluido (un `.gitignore` posterior no borra del historial ya
existente — el orden importa). El archivo vive en el working directory de cada clon del template,
legible por cualquier agente que opere ahí, pero:

- Nunca aparece en `git log`/`git show`/GitHub.
- La función "Template repository" de GitHub solo duplica contenido trackeado — el archivo
  gitignoreado no se propaga a los repos `boreas-<cliente>` generados a partir de este template
  automáticamente vía GitHub; **cada developer que clone un cliente nuevo debe copiar este
  archivo manualmente al nuevo repo** si quiere tenerlo ahí (ver nota en README).
- En transferencia de Plan A (repo completo al cliente), el archivo nunca viajó a GitHub en primer
  lugar, así que no hay nada que filtrar.

## 6. Actualización en Boreas V3

En `docs/internal/boreas-master.md`, agregar una nota en la sección de operaciones/tecnología: el
contexto operativo condensado también vive (gitignoreado) en cada repo de cliente derivado de
`boreas-template`, como copia derivada de este documento — no una segunda fuente de verdad. Si hay
discrepancia entre ambos, gana `boreas-master.md`.

## 7. Fuera de alcance (próximo brainstorm)

- Sistema de categorías: cómo se asigna una categoría a un cliente nuevo, cómo se estructura el
  "core idea" de cada una (componentes de quiz/test/simulador/calculadora), cómo elige el
  developer builder cuál usar al clonar el template, identidad visual por categoría.
