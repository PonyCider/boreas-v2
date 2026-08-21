# Epic 4 — Prueba social: Progress

Fecha: 2026-08-20

## Estado

**Fase 3 — Completada**

## Referencias

- Diseño: `docs/superpowers/specs/2026-08-20-epic-4-prueba-social-design.md`
- Implementación: `docs/superpowers/plans/2026-08-20-epic-4-prueba-social.md`

## Fases

### Fase 1 — Fundación

**Estado:** Completada

- [x] Integrar Magic UI Marquee desde el registry oficial.
- [x] Auditar y adaptar el primitive sin reescribir el loop.
- [x] Crear contenido tipado de ocho casos.
- [x] Añadir y pasar pruebas de invariantes.

### Fase 2 — Sección visual

**Estado:** Completada

- [x] Construir tarjeta semántica.
- [x] Orquestar carriles y pausa.
- [x] Reemplazar stub y reordenar secciones.
- [x] Aplicar diseño responsive aprobado.

### Fase 3 — Validación

**Estado:** Completada

- [x] Validar navegador, breakpoints y movimiento reducido.
- [x] Ejecutar tests, lint, TypeScript y build.
- [x] Confirmar control de alcance y Hero intacto.

## Decisiones de implementación

- El registry oficial instala Marquee en `components/ui/marquee.tsx`; specs y plan se alinearon a
  esa ruta.
- Se conservó el copy aprobado de Implantología y se corrigió la invariante documental de 18–32
  a 16–32 palabras.
- La adaptación del primitive se limita a pausa compartida, copias `aria-hidden` y fallback de
  movimiento reducido.
- La sección conserva arquitectura server-first; solo la orquestación de pausa y puntero vive en
  un componente cliente.
- El control usa un área accesible de 44 px y un icono visual discreto de 16 px.

## Bloqueos

- Ninguno.

## Archivos modificados

- `app/globals.css`
- `components.json`
- `components/ui/marquee.tsx`
- `components/landing/landing-sections.tsx`
- `components/landing/social-proof-card.tsx`
- `components/landing/social-proof-marquee.tsx`
- `components/landing/social-proof-section.tsx`
- `content/site.ts`
- `content/social-proof.ts`
- `content/social-proof.test.ts`
- `vitest.config.mts`
- Documentación de diseño, plan y progreso.

## Session Log

### 2026-08-20

- Diseño y plan aprobados.
- Fase 1 iniciada en la rama `jafet`.
- Magic UI Marquee integrado desde el registry oficial.
- Contenido y seis pruebas de invariantes añadidos.
- Tests focalizados, ESLint y TypeScript pasaron.
- Fase 2 implementada después de Pricing y antes de Relevo.
- Escritorio y móvil revisados en navegador; dos carriles, pausa y reanudación funcionan.
- Consola del navegador sin errores ni advertencias.
- Ocho tarjetas quedan en el árbol accesible; las ocho copias del loop están ocultas con
  `aria-hidden`.
- Breakpoints 320, 390, 768, 1024, 1440 y 2560 px pasaron sin desbordamiento horizontal; tarjetas
  de 282, 343, 520, 560, 560 y 560 px respectivamente. El control conserva un área de 44 × 44 px.
- El CSS compilado incluye fallback de movimiento reducido: animación desactivada, copias ocultas
  y desplazamiento horizontal manual.
- Suite completa: 89/89 pruebas. TypeScript, lint focalizado y build de producción pasaron.
- El lint global conserva tres errores heredados en `components/ui/option-wheel.tsx`; el archivo no
  difiere de `origin/main` y quedó fuera de alcance.
- Hero no presenta cambios contra `origin/main`.
- Ajuste ultra-wide: cards de escritorio reducidas de 483 a 334 px de alto y ampliadas de 450 a
  560 px. La sección bajó de 1608 a 1321 px en 2560 × 1440.
- Marquee restaurado a cuatro repeticiones. La cobertura posterior al reinicio subió de 1872 a
  6936 px; el mayor espacio visible queda en 24 px, igual al gap normal entre cards.
- Se exploraron dos entradas con selector temporal. El usuario eligió la variante A editorial;
  se retiraron la variante B, el parámetro de URL y el control de replay.
- La entrada final revela eyebrow, heading, body y carriles en secuencia. El Marquee permanece
  pausado hasta que termina el segundo carril.
