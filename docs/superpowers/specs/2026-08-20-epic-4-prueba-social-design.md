# Epic 4 — Prueba social (diseño)

Fecha: 2026-08-20
Estado: aprobado

## Contexto

La landing de Boreas ya demuestra capacidad técnica mediante el Hero, el problema, los motores y
Pricing. Epic 4 sigue siendo un stub. Su trabajo no será añadir otra demo ni repetir argumentos de
venta: será concentrar autoridad profesional antes del upsell de Relevo.

La sección se mueve después de Pricing. El visitante primero entiende el producto y el precio;
después encuentra evidencia editorial de que Boreas entiende distintas prácticas de salud.

## Entendimiento aprobado

- Objetivo emocional único: **autoridad**.
- Señal principal: voces de profesionales de distintas especialidades.
- Señal secundaria: calidad del trabajo entregado.
- Formato: casos profesionales anónimos, no reseñas con identidad falsa.
- Contenido inicial: ocho escenarios representativos, cuatro dentales y cuatro no dentales.
- Composición: dos carriles continuos en direcciones opuestas.
- Tema: fondo oscuro de Motores con tarjetas en carbón editorial.
- Posición: `Motores → Pricing → Epic 4 → Relevo`.
- El Hero queda completamente fuera del alcance.

## Objetivos

1. Comunicar en cinco segundos que Boreas entiende el trabajo de profesionales de la salud.
2. Permitir que una lectura completa revele qué se construyó y qué criterio de calidad se aplicó.
3. Crear un bloque visual autoritativo, sobrio y propio, sin competir con el producto ni Pricing.
4. Dejar una estructura fácil de sustituir por testimonios reales cuando existan y estén
   autorizados.

## No objetivos

- Modificar el Hero o su prueba social actual.
- Publicar nombres, rostros, ubicaciones o identidades inventadas.
- Fabricar métricas, porcentajes, estrellas, volúmenes de pacientes o resultados comerciales.
- Añadir CTA, formulario, modal, expansión de tarjetas o enlaces desde los casos.
- Construir un carrusel desde cero cuando una base de librería resuelve el loop.
- Añadir backend, CMS, analítica nueva o persistencia.

## Dirección visual

### Tema

La sección usa `theme="dark"` y `bg-background`, igual que Motores. El carbón editorial se aplica
solo como superficie de tarjeta, derivado de los tokens existentes; no crea un tercer tema ni un
modo global.

Reglas:

- Fondo oscuro base de Boreas.
- Tarjeta carbón derivada de `bg-elevated`/tokens del tema oscuro.
- El color por especialidad aparece solo en borde superior, índice e icono: arcilla dental,
  ciruela psicología, mostaza nutrición, salvia fisioterapia y azul petróleo medicina.
- Un borde estructural por tarjeta; sin divisores internos.
- Radio moderado, coherente con Pricing.
- Sin glow, glass, gradient text, side stripes ni sombras flotantes.
- Sin máscaras difuminadas en los extremos: las tarjetas entran y salen mediante recorte limpio.

### Composición

```text
SectionFrame#social-proof (theme dark)
├── container de cabecera
│   ├── eyebrow: VOCES PROFESIONALES
│   ├── h2: Así se ve una presencia construida con criterio.
│   ├── introducción
│   └── control pausa/reproducción
├── región de casos
│   ├── carril A: izquierda → derecha
│   └── carril B: derecha → izquierda
└── nota de escenarios representativos
```

Copy aprobado de cabecera:

- Eyebrow: **Voces profesionales**
- Heading: **Así se ve una presencia construida con criterio.**
- Introducción: **Distintas especialidades. El mismo estándar de claridad, rigor y cuidado en
  cada entrega.**

La cabecera alinea el control de pausa a la derecha en desktop. En móvil se apila; el control se
alinea con el eyebrow. No existe CTA dentro de la sección.

### Escala y responsive

- Heading: `clamp(2.4rem, 5vw, 5rem)`.
- Introducción: ancho óptimo de 42–48 caracteres por línea.
- Tarjetas desktop: 560 px; tablet: 520 px.
- Tarjetas móvil: 88vw, con máximo de 400 px.
- Altura mínima de 300 px; contenido completo, sin truncamiento.
- Texto de cuerpo nunca menor de 16 px.
- Nota legal nunca menor de 12 px y con contraste legible.
- Desktop, tablet y móvil mantienen dos carriles.

## Anatomía de tarjeta

Cada tarjeta es un expediente editorial, no una reseña convencional.

1. Índice `01–08`, pequeño y monoespaciado.
2. Icono clínico lineal de la especialidad.
3. Cita profesional de 16–32 palabras como elemento principal.
4. Proyecto realizado en una línea concreta.
5. Dos o tres señales de calidad.
6. Rol + especialidad en el pie.

HTML semántico:

- `article` como contenedor.
- `blockquote` para la voz.
- `footer` para rol y especialidad.
- Los datos de proyecto se presentan como texto, no como controles.

Reglas:

- Sin nombres, retratos, ciudades, logos, estrellas o firmas falsas.
- Sin comillas gigantes decorativas.
- Sin color individual por tratamiento dental.
- Índice e icono forman un sistema híbrido de orientación.
- La cita domina; proyecto y señal de calidad respaldan.

## Contenido aprobado

### Carril superior

#### 01 — Clínica integral

> “La página ordena todo lo que hacemos sin convertir los tratamientos en un catálogo. Se siente
> clara, profesional y fácil de recorrer.”

- Proyecto: `Sitio para clínica dental integral`
- Calidad: `Arquitectura de tratamientos · agendamiento · navegación móvil`
- Voz: `Directora clínica · Odontología integral`

#### 02 — Psicología

> “El sitio explica mi enfoque sin simplificarlo ni sonar distante. Las personas pueden entender
> cómo trabajo antes de solicitar una sesión.”

- Proyecto: `Presencia digital para consulta psicológica`
- Calidad: `Copy profesional · servicios claros · agenda integrada`
- Voz: `Psicóloga clínica · Psicología`

#### 03 — Implantología

> “Necesitábamos explicar tratamientos complejos con precisión, sin promesas exageradas. El
> resultado transmite experiencia y criterio clínico.”

- Proyecto: `Sitio de implantología y rehabilitación oral`
- Calidad: `Copy clínico · jerarquía de tratamientos · revisión publicitaria`
- Voz: `Director clínico · Implantología`

#### 04 — Nutrición

> “La página dejó de girar alrededor de dietas y empezó a comunicar un proceso de acompañamiento
> serio, estructurado y personalizado.”

- Proyecto: `Sitio para consulta de nutrición`
- Calidad: `Metodología de atención · calculadora orientativa · experiencia móvil`
- Voz: `Nutrióloga clínica · Nutrición`

### Carril inferior

#### 05 — Ortodoncia

> “El proceso de ortodoncia ahora se explica por etapas y con expectativas claras. La página
> responde dudas antes del primer contacto.”

- Proyecto: `Landing especializada en ortodoncia`
- Calidad: `Proceso visual · preguntas frecuentes · llamada a valoración`
- Voz: `Ortodoncista · Ortodoncia`

#### 06 — Fisioterapia

> “Ahora podemos mostrar cómo evaluamos, tratamos y damos seguimiento sin reducir la práctica a
> una lista de lesiones.”

- Proyecto: `Sitio para centro de fisioterapia`
- Calidad: `Rutas de atención · evaluación inicial · agendamiento`
- Voz: `Director de práctica · Fisioterapia`

#### 07 — Odontopediatría

> “La nueva presencia habla con claridad a madres y padres sin perder el tono profesional. Cada
> decisión se siente pensada para la consulta infantil.”

- Proyecto: `Sitio para práctica de odontopediatría`
- Calidad: `Lenguaje accesible · experiencia móvil · agendamiento`
- Voz: `Odontopediatra · Odontología infantil`

#### 08 — Medicina general

> “La información importante quedó ordenada para que cada paciente sepa qué atendemos, cómo
> prepararse y cuál es el siguiente paso.”

- Proyecto: `Presencia digital para consulta médica`
- Calidad: `Servicios · indicaciones previas · contacto estructurado`
- Voz: `Médica responsable · Medicina general`

Nota aprobada al pie:

> Escenarios representativos basados en necesidades comunes de profesionales de la salud. No
> corresponden a testimonios de clientes identificables.

## Movimiento

La base será el componente oficial **Magic UI Marquee**, copiado mediante su registry. Boreas
construye la capa editorial y las adaptaciones de accesibilidad; no reimplementa el loop desde
cero.

- Carril superior: aproximadamente 60 s por ciclo.
- Carril inferior: aproximadamente 70 s por ciclo.
- En móvil, 20–25% más lento.
- Direcciones opuestas.
- Sin aceleración, rebote, parallax o respuesta al scroll.
- Animación por transform/CSS; sin GSAP, `requestAnimationFrame` propio o timers de movimiento.

La entrada aprobada es editorial progresiva y ocurre una sola vez cuando la sección entra al
viewport:

- eyebrow: fade y subida de 10 px;
- título: dos líneas reveladas desde una máscara vertical;
- descripción y control: fade con desplazamiento corto;
- carril superior: fade y entrada de 56 px desde la derecha;
- carril inferior: fade y entrada de 56 px desde la izquierda;
- el Marquee permanece pausado hasta que termina el segundo carril.

La entrada usa `motion/react`, ya instalado en el proyecto. Magic UI conserva el loop continuo;
no se añaden GSAP, `requestAnimationFrame` propio ni timers de movimiento.

## Pausa y accesibilidad

El control es un botón pequeño sin texto visible:

- Reproduciendo: dos líneas verticales paralelas.
- Pausado: triángulo de reproducción.
- `aria-label`: “Pausar casos” / “Reanudar casos”.
- Focus ring visible en arcilla.
- Icono visual de 12–14 px.
- Área táctil real mínima de 44 × 44 px.

Comportamiento:

- Hover pausa ambos carriles de forma temporal.
- Foco dentro de la región pausa ambos carriles.
- Toque en la región pausa y requiere el botón para reanudar.
- La pausa conserva la posición actual.
- El control gobierna ambos carriles, nunca uno por separado.

Lectores de pantalla:

- La región obtiene nombre desde el heading.
- Solo los ocho casos originales entran al árbol accesible.
- Las copias del loop usan `aria-hidden="true"`.
- No se usa `aria-live`.
- Las tarjetas no son focos ni controles.

Con `prefers-reduced-motion`:

- No hay autoplay ni entrada animada.
- Los dos carriles permanecen visibles.
- Se permite desplazamiento horizontal manual.
- Las copias del loop se ocultan visualmente.
- El botón de pausa se oculta.
- No hay salto posterior a hidratación.

## Arquitectura

```text
content/social-proof.ts
        ↓
SocialProofSection (server)
        ↓
SocialProofMarquee (client: entrada + pausa)
        ↓
Magic UI Marquee + SocialProofCard
```

Archivos nuevos:

- `content/social-proof.ts`
- `components/ui/marquee.tsx`
- `components/landing/social-proof-card.tsx`
- `components/landing/social-proof-marquee.tsx`
- `content/social-proof.test.ts`

Archivos modificados:

- `components/landing/social-proof-section.tsx`
- `components/landing/landing-sections.tsx`
- `content/site.ts`
- `app/globals.css`

El contenido declara ID, carril, especialidad, rol, cita, proyecto y señales de calidad. Los
iconos se resuelven en el componente; el archivo de contenido no almacena JSX.

## Requisitos no funcionales

### Rendimiento

- Sin imágenes ni solicitudes de red.
- Sin nueva dependencia de npm: Magic UI se integra como código del registry.
- Sin WebGL, GSAP o bucle JavaScript.
- El estado cliente se limita a pausa/reproducción y finalización de la entrada.
- Las copias se limitan a las necesarias para cerrar el loop.

### Escala y mantenimiento

- Fuente de verdad única en `content/social-proof.ts`.
- Ocho casos iniciales; la estructura acepta sustituir contenido sin rediseñar.
- No se introduce CMS hasta que exista una necesidad real de edición externa.
- Tipos e invariantes impiden carriles desequilibrados o IDs duplicados.

### Privacidad y seguridad

- No hay formularios, datos personales, identidad real, almacenamiento o transmisión.
- No hay HTML proporcionado por usuarios ni render de contenido no confiable.
- No se añaden eventos de analítica específicos de los casos.

### Fiabilidad

- La composición y el texto permanecen en el HTML; la mejora de entrada requiere hidratación.
- Tras hidratar, la entrada ocurre una sola vez y deja el contenido en su estado final.
- El modo reducido no depende de una lectura tardía de `matchMedia`.

## Criterios de aceptación

1. La sección aparece después de Pricing y antes de Relevo.
2. El anchor `#social-proof` y el enlace “Resultados” continúan funcionando.
3. Se renderizan ocho casos: cuatro dentales y cuatro no dentales.
4. Cada carril contiene cuatro casos originales y tres copias inaccesibles para sostener el loop
   también en pantallas ultra-wide.
5. Pausa, hover, foco y toque controlan ambos carriles según este spec.
6. El modo reducido elimina autoplay y deja scroll manual.
7. Contraste AA; texto completo; área táctil mínima de 44 px.
8. Sin errores propios de consola, hidratación o overflow.
9. Sin cambios al Hero.
10. Tests, TypeScript, ESLint y build pasan.
11. Browser validado en 320, 390, 768, 1024, 1440 y 2560 px.
12. La entrada editorial ocurre una vez; ambos carriles permanecen pausados hasta que termina.

## Decision Log

| Decisión | Alternativas | Razón |
|---|---|---|
| Autoridad como único objetivo | Transformación, aspiración | La sección debe generar confianza profesional, no emoción de campaña. |
| Voces profesionales como señal principal | Resultados operativos, calidad sola | Refuerza el vertical salud y la autoridad por pares. |
| Calidad como señal secundaria | Métricas ilustrativas | Muestra criterio sin fabricar resultados. |
| Casos profesionales | Citas editoriales, credenciales compactas | Permite entender qué trabajo se realizó. |
| Perfiles anónimos | Nombres ficticios, contenido temporal | Evita falsa atribución. |
| Sin rostros | Consultorios, retratos genéricos | Evita representar identidades que no corresponden. |
| Ocho casos, 4+4 | Cinco, seis, mayoría dental | Da peso a dental sin borrar otras especialidades. |
| Evidencia cualitativa + alcance | Métricas ilustrativas | Mantiene honestidad y autoridad. |
| Dos carriles opuestos | Un carril, caso destacado | Crea presencia sin interacción compleja. |
| Solo lectura | Expandibles, modal | Reduce fricción y superficie accesible. |
| Rol + especialidad | Ciudad, región | Informa sin inventar ubicación. |
| Aclaración solo al pie | Por tarjeta, cabecera | Transparencia con menor ruido visual. |
| Dos carriles también en móvil | Uno, lista estática | Conserva identidad; movimiento se desacelera. |
| Magic UI Marquee | React Bits, implementación propia | Mejor encaje editorial y menor código propio. |
| Botón de pausa solo con icono | Texto visible | Control discreto con nombre accesible. |
| Entrada editorial progresiva | Apertura cinematográfica | Mantiene consistencia con el resto de la landing y deja el Marquee como movimiento principal. |
| Después de Pricing | Antes de Pricing | Preserva continuidad Motores–Pricing y responde objeción posterior al precio. |
| Tema Motores + tarjetas carbón | Motores exacto, carbón completo | Coherencia de marca con separación suficiente. |
| Índice + icono | Solo icono, solo índice | Combina orden editorial y reconocimiento de especialidad. |
| Contenido local tipado | Componente, CMS | Ocho casos no justifican infraestructura externa. |

## Referencias

- Diseño general: `docs/superpowers/specs/2026-07-19-boreas-v4-landing-design.md`
- Magic UI Marquee: <https://magicui.design/docs/components/marquee>
- WAI-ARIA Carousel Pattern: <https://www.w3.org/WAI/ARIA/apg/patterns/carousel/>
- WAI Carousels Tutorial: <https://www.w3.org/WAI/tutorials/carousels/>
