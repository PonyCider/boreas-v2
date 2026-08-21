# Epic 4 — Prueba social: Implementation Plan

> Diseño aprobado: `docs/superpowers/specs/2026-08-20-epic-4-prueba-social-design.md`

**Goal:** Reemplazar el stub de Prueba Social por una sección oscura de autoridad con ocho casos
profesionales anónimos en dos carriles infinitos, accesibles y responsive.

**Architecture:** El contenido vive en `content/social-proof.ts`. `SocialProofSection` permanece
server component y entrega la región animada a `SocialProofMarquee`, el único componente cliente.
El loop usa el componente oficial Magic UI Marquee, adaptado mínimamente para pausa compartida,
copias inaccesibles y movimiento reducido. La entrada editorial usa `motion/react` y pausa el loop
hasta terminar. Las tarjetas son semánticas y sin interacción.

**Tech Stack:** Next.js 16.2.12, React 19.2.4, TypeScript, Tailwind v4, Magic UI Marquee,
Motion, Tabler/Lucide ya instalados, Vitest.

## Global Constraints

- Trabajar solo en la rama `jafet`.
- No modificar Hero ni `components/ui/avatar-circles.tsx`.
- No cambiar Pricing o Relevo salvo el orden de montaje en `LandingSections`.
- Mantener `sectionIds.socialProof === "social-proof"` y el enlace “Resultados”.
- Usar `theme="dark"` y los tokens oscuros existentes de Motores.
- No crear tema global o toggle. La paleta acotada por especialidad vive solo en las cards.
- No métricas, estrellas, nombres, rostros, ubicaciones o testimonios atribuibles.
- No CTA, modal, links o expansión dentro de las tarjetas.
- No GSAP, WebGL, timers o `requestAnimationFrame` para el carrusel.
- No nueva dependencia de npm salvo que el registry oficial demuestre una dependencia transitiva
  imprescindible; detenerse y pedir aprobación antes de añadirla.
- `prefers-reduced-motion` debe tener equivalente estático y manualmente desplazable.
- Contraste ≥4.5:1 cuerpo y ≥3:1 texto grande.
- Hairlines solo como límites estructurales.
- Implementar por fases y pedir revisión visual antes de pulido final o commit.

## Preflight

- [ ] Confirmar rama y árbol limpio:

```bash
git status --short --branch
git rev-parse --abbrev-ref HEAD
```

Esperado: `jafet`, sin cambios fuera de los dos documentos de diseño/plan.

- [ ] Guardar lista de archivos del Hero para comprobar no-alcance al final:

```bash
git diff --name-only main...HEAD -- components/landing/hero-section.tsx components/landing/hero-visual.tsx components/ui/avatar-circles.tsx
```

- [ ] Leer el spec aprobado completo antes de implementar.

---

### Task 1: Integrar Magic UI Marquee desde la librería oficial

**Files:**

- Create: `components/ui/marquee.tsx`
- Modify: `app/globals.css` solo si el registry lo requiere

**Objetivo:** Obtener el motor de loop desde Magic UI. No escribir una implementación alternativa.

- [ ] **Step 1: Añadir el componente con el registry oficial**

Comando de referencia oficial:

```bash
npx shadcn@latest add @magicui/marquee
```

Antes de aceptar sobreescrituras, comprobar que el destino sea
`components/ui/marquee.tsx`. Si el CLI propone modificar archivos ajenos o instalar paquetes,
detenerse y revisar el diff.

- [ ] **Step 2: Auditar el componente generado**

Confirmar:

- usa transform/CSS, no timers;
- expone `reverse`, `pauseOnHover`, `repeat` y `className`;
- funciona con Tailwind v4;
- no introduce colores, fondos o radios propios;
- el loop depende de keyframes presentes en `globals.css` o en clases válidas.

- [ ] **Step 3: Adaptación mínima aprobada**

Añadir solo las capacidades que el wrapper necesita:

```ts
type MarqueeProps = {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  paused?: boolean;
  repeat?: number;
  children: React.ReactNode;
};
```

Requisitos:

- `paused` aplica `animation-play-state: paused` a todos los grupos.
- El primer grupo es accesible.
- Grupos con índice `> 0` usan `aria-hidden="true"`.
- Las copias usan `motion-reduce:hidden`.
- `repeat={4}` mantiene un grupo original y tres copias para cubrir también viewports ultra-wide
  sin exponer duplicados al árbol accesible.

- [ ] **Step 4: Verificación focalizada**

```bash
npx eslint components/ui/marquee.tsx
npx tsc --noEmit
```

**Stop condition:** si Magic UI no funciona con Tailwind v4 sin una reescritura extensa, no crear
un carrusel propio. Documentar el bloqueo y volver a evaluar el componente oficial actual.

---

### Task 2: Crear la fuente de verdad del contenido y sus invariantes

**Files:**

- Create: `content/social-proof.ts`
- Create: `content/social-proof.test.ts`

**Produces:**

```ts
export type SocialProofSpecialty =
  | "odontologia-integral"
  | "psicologia"
  | "implantologia"
  | "nutricion"
  | "ortodoncia"
  | "fisioterapia"
  | "odontopediatria"
  | "medicina-general";

export type SocialProofCase = {
  id: `case-${string}`;
  index: string;
  lane: "primary" | "secondary";
  specialty: SocialProofSpecialty;
  quote: string;
  project: string;
  qualitySignals: readonly [string, string, ...string[]];
  role: string;
};
```

- [ ] **Step 1: Escribir primero los tests de invariantes**

Casos:

1. existen exactamente ocho casos;
2. IDs e índices no se repiten;
3. cada carril contiene cuatro casos;
4. existen cuatro especialidades dentales y cuatro no dentales;
5. todas las citas, proyectos, roles y señales tienen contenido;
6. cada cita contiene 16–32 palabras;
7. no aparecen patrones promocionales como porcentajes, `+N`, `N×`, estrellas o conteos de
   pacientes/citas;
8. la nota contiene “Escenarios representativos” y “No corresponden a testimonios”.

- [ ] **Step 2: Crear heading, introducción y nota**

Copy exacto:

```ts
export const socialProofHeading = {
  eyebrow: "Voces profesionales",
  heading: "Así se ve una presencia construida con criterio.",
  body: "Distintas especialidades. El mismo estándar de claridad, rigor y cuidado en cada entrega.",
  disclosure:
    "Escenarios representativos basados en necesidades comunes de profesionales de la salud. No corresponden a testimonios de clientes identificables.",
} as const;
```

- [ ] **Step 3: Añadir los ocho casos aprobados**

Copiar el contenido literal del spec. No reescribir copy durante implementación sin aprobación.
Usar `satisfies readonly SocialProofCase[]` para conservar tipos literales.

- [ ] **Step 4: Ejecutar tests focalizados**

```bash
npm test -- content/social-proof.test.ts
```

Si la configuración de Vitest solo incluye `lib/**/*.test.ts`, ampliar `include` de forma mínima a
`content/**/*.test.ts` y conservar los patrones existentes.

---

### Task 3: Construir la tarjeta semántica

**Files:**

- Create: `components/landing/social-proof-card.tsx`

**Consumes:** `SocialProofCase`

- [ ] **Step 1: Crear mapa exhaustivo de iconos**

Resolver iconos desde la librería ya instalada. No guardar componentes en el archivo de contenido.
El mapa debe estar tipado como:

```ts
const specialtyIcons: Record<SocialProofSpecialty, IconComponent> = { /* ... */ };
```

Usar iconos lineales sobrios. Las cuatro variantes dentales pueden compartir familia visual, pero
deben distinguirse mediante texto e índice; no mediante colores diferentes.

- [ ] **Step 2: Implementar `SocialProofCard`**

Estructura:

```tsx
<article>
  <header>{/* index + icon */}</header>
  <blockquote>{quote}</blockquote>
  <div>{/* project + quality signals */}</div>
  <footer>{role}</footer>
</article>
```

Reglas:

- no `tabIndex`;
- no click handlers;
- sin botones o enlaces;
- sin divisores internos;
- `aria-hidden` en iconos decorativos;
- texto completo y envoltura estable;
- `min-height` común, no altura rígida que corte contenido;
- carbón editorial derivado de tokens oscuros;
- borde estructural y radio del sistema.

- [ ] **Step 3: Lint y tipos**

```bash
npx eslint components/landing/social-proof-card.tsx
npx tsc --noEmit
```

---

### Task 4: Orquestar los dos carriles y el control de pausa

**Files:**

- Create: `components/landing/social-proof-marquee.tsx`

**State:**

- `manuallyPaused`: pausa persistente mediante botón, foco o toque.
- `hoverPaused`: pausa transitoria mientras el puntero está dentro.
- `entranceComplete`: habilita el Marquee cuando termina la entrada editorial.
- `paused = manuallyPaused || hoverPaused || !entranceComplete`.

- [ ] **Step 1: Renderizar carriles desde contenido**

- Filtrar por `lane`.
- Carril primary: dirección normal, duración aproximada 60 s.
- Carril secondary: `reverse`, duración aproximada 70 s.
- Móvil: aumentar duración 20–25% mediante custom properties responsive.
- `repeat={4}`.

- [ ] **Step 2: Entrada editorial aprobada**

- Activar una sola vez mediante `useInView`.
- Revelar eyebrow, dos líneas del heading, body y control en secuencia.
- Carril primary entra 56 px desde la derecha; secondary, desde la izquierda.
- Mantener ambos Marquees pausados hasta que termina secondary.
- Con movimiento reducido, aplicar el estado final sin transición.

- [ ] **Step 3: Implementar el botón**

Requisitos:

- botón nativo;
- 44 × 44 px de hit target;
- icono pausa de dos líneas cuando corre;
- icono play cuando está detenido;
- `aria-label` exacto “Pausar casos” / “Reanudar casos”;
- focus ring visible;
- `motion-reduce:hidden`;
- no tooltip obligatorio.

- [ ] **Step 4: Interacciones de pausa**

- `pointerenter`: `hoverPaused = true` solo para puntero fino.
- `pointerleave`: `hoverPaused = false`; no anular una pausa persistente.
- `focuscapture`: pausa persistente.
- primer `pointerdown` con puntero coarse: pausa persistente.
- botón: alterna pausa persistente y limpia la pausa transitoria al reanudar.
- ambos carriles reciben siempre el mismo `paused`.

Evitar listeners globales y consultas repetidas a `matchMedia`.

- [ ] **Step 5: Movimiento reducido**

Resolver mediante CSS:

- `animation: none`;
- ocultar copias;
- `overflow-x: auto`;
- conservar scroll táctil;
- ocultar botón;
- no cambiar markup después de hidratar.

- [ ] **Step 6: Semántica**

- región con `aria-labelledby` al heading de sección;
- sin `aria-live`;
- copias fuera del árbol accesible;
- los carriles pueden usar listas semánticas si no rompen el componente base.

- [ ] **Step 7: Lint y tipos**

```bash
npx eslint components/landing/social-proof-marquee.tsx
npx tsc --noEmit
```

---

### Task 5: Reemplazar el stub y mover la sección

**Files:**

- Modify: `components/landing/social-proof-section.tsx`
- Modify: `components/landing/landing-sections.tsx`
- Modify: `content/site.ts`

- [ ] **Step 1: Reescribir `SocialProofSection` como shell server**

Debe:

- importar `socialProofHeading` y `SocialProofMarquee`;
- usar `SectionFrame id={sectionIds.socialProof} theme="dark"`;
- aplicar `bg-background` y un solo `border-t border-line`;
- asignar ID estable al heading para `aria-labelledby`;
- renderizar eyebrow, heading, body, carriles y nota;
- no añadir `"use client"`.

- [ ] **Step 2: Reordenar `LandingSections`**

Orden exacto:

```tsx
<HeroSection />
<ProblemSection />
<MotorsSection />
<PricingSection />
<SocialProofSection />
<RelevoSection />
```

- [ ] **Step 3: Retirar el stub de `content/site.ts`**

Conservar:

- `sectionIds.socialProof`;
- nav card “Resultados” y su href;
- `primaryCta`.

Eliminar `sectionStubs` si ya no tiene consumidores. Confirmar con el grafo o búsqueda textual
antes de borrarlo.

- [ ] **Step 4: Verificación estructural**

```bash
rg -n "sectionStubs|Prueba social — pendiente" app components content
npx eslint components/landing/social-proof-section.tsx components/landing/landing-sections.tsx content/site.ts
npx tsc --noEmit
```

Esperado: cero stubs y anchor conservado.

---

### Task 6: Pulido visual aprobado

**Files:**

- Modify: archivos de Epic 4 únicamente
- Modify: `app/globals.css` si faltan variables/keyframes del registry

- [ ] **Step 1: Aplicar escala aprobada**

- heading `clamp(2.4rem, 5vw, 5rem)`;
- intro 42–48 caracteres por línea;
- cards 420–460 px desktop;
- cards 82–88vw, max 380 px mobile;
- body ≥16 px;
- disclosure ≥12 px;
- gap amplio y consistente entre cards/carriles.

- [ ] **Step 2: Validar tema**

Comparar tokens contra `MotorsSection`:

- mismo `theme="dark"`;
- mismo `bg-background`;
- tarjetas carbón desde tokens existentes;
- arcilla solo en microdetalles;
- contraste medido, no inferido por apariencia.

- [ ] **Step 3: Probar overflow y ritmo**

Comprobar que:

- no aparece scrollbar horizontal de página;
- el scroll manual reducido vive dentro de cada carril;
- ambas filas quedan visualmente separadas;
- no hay corte vertical de citas;
- Pricing termina limpio antes del bloque oscuro;
- Relevo inicia con suficiente respiración.

**Milestone:** detenerse aquí, presentar capturas desktop/móvil y resumen no técnico. Pedir aprobación
antes de cambios visuales adicionales.

---

### Task 7: Validación accesible y responsive en navegador

**Files:** no cambios previstos; corregir solo Epic 4 si una prueba falla.

- [ ] **Step 1: Desktop normal (1440 px)**

Validar:

- dos carriles y direcciones opuestas;
- velocidades legibles;
- pausa/reanudar mantiene posición;
- hover pausa ambos;
- heading y nota visibles;
- orden Pricing → Epic 4 → Relevo.

- [ ] **Step 2: Breakpoints**

Repetir en 1024, 768, 390 y 320 px:

- sin overflow de página;
- tarjetas completas;
- botón discreto con hit target de 44 px;
- dos carriles presentes;
- toque pausa y botón reanuda.

- [ ] **Step 3: Movimiento reducido**

Emular `prefers-reduced-motion: reduce` y comprobar:

- autoplay detenido desde primera pintura;
- botón oculto;
- copias ocultas;
- scroll manual disponible;
- ocho casos originales alcanzables;
- sin salto de hidratación.

- [ ] **Step 4: Teclado y árbol accesible**

- `Tab` llega al control de pausa.
- Focus ring visible.
- El nombre cambia correctamente.
- El árbol accesible contiene ocho casos, no los treinta y dos nodos usados para sostener el loop.
- No existe `aria-live` en los carriles.

- [ ] **Step 5: Consola**

Separar warnings externos de Cal.com de errores propios. Epic 4 debe quedar sin errores o warnings de
hidratación, keys, accesibilidad o recursos.

---

### Task 8: Validación técnica final y control de alcance

- [ ] **Step 1: Tests**

```bash
npm test
```

- [ ] **Step 2: Lint**

```bash
npx eslint content/social-proof.ts content/social-proof.test.ts components/ui/marquee.tsx components/landing/social-proof-card.tsx components/landing/social-proof-marquee.tsx components/landing/social-proof-section.tsx components/landing/landing-sections.tsx content/site.ts
npm run lint
```

- [ ] **Step 3: TypeScript y build**

```bash
npx tsc --noEmit
npm run build
```

- [ ] **Step 4: Diff hygiene**

```bash
git diff --check
git status --short
git diff --name-only
```

El diff permitido se limita a:

- docs del Epic 4;
- contenido/test de social proof;
- `vitest.config.mts` para incluir tests de contenido;
- Magic UI Marquee;
- componentes de social proof;
- `landing-sections.tsx`;
- `content/site.ts`;
- `app/globals.css` si el registry lo requiere.

Debe devolver vacío:

```bash
git diff --name-only -- components/landing/hero-section.tsx components/landing/hero-visual.tsx components/ui/avatar-circles.tsx
```

- [ ] **Step 5: Reporte de entrega**

Separar resultados de:

1. tests;
2. TypeScript;
3. ESLint;
4. build;
5. navegador normal;
6. navegador con movimiento reducido;
7. consola;
8. archivos modificados.

No marcar el Epic completo hasta recibir aprobación visual del usuario.

## Rollback

Todo el Epic es local y estático. Para revertir durante implementación:

1. restaurar el orden anterior en `LandingSections`;
2. restaurar el stub de `SocialProofSection` y `content/site.ts`;
3. retirar los archivos nuevos de Epic 4;
4. retirar únicamente los keyframes/variables añadidos para Marquee.

No hay migraciones, datos persistidos, servicios externos o side effects de producción.
