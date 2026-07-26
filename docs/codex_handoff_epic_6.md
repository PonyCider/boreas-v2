# Plan de Handoff para Codex — EPIC 6: Relevo (Upsell Section)

## 📌 Contexto General

Antigravity ha completado la **Fase 1 (Infraestructura y Librerías de UI)**. El entorno de Boreas V4 está 100% preparado, compilando limpiamente con Next.js 16 (App Router), React 19, Tailwind v4 y las 8 librerías de UI requeridas.

Este documento contiene las instrucciones precisas y el paso a paso para que **Codex** ejecute la **Fase 2: Implementación de los Componentes del EPIC 6 (Sección Relevo)**.

---

## 🛠️ Estado Actual del Repositorio (Fase 1 Completada)

1. **`package.json`**:
   - `animejs`, `@tabler/icons-react`, `framer-motion`, `gsap`, `ogl` instalados.
   - `daisyui@latest` (v5) instalado en devDependencies.
2. **`components.json`**:
   - Registros `@react-bits`, `@smoothui` y `@unlumen-ui` preconfigurados.
3. **`app/globals.css`**:
   - Directiva `@plugin "daisyui";` integrada bajo `@import "tailwindcss";`.
4. **Guía Global de UI**:
   - Consulta [`docs/external_ui_components_handoff.md`](file:///Users/ponycider/Documents/SaaS/Boreas%20V4/docs/external_ui_components_handoff.md) para reglas de estilo y fallbacks.

---

## 🎯 Objetivo de Codex en esta Sesión

Construir y pulir la sección de **Relevo (upsell/curiosidad)** en la landing page, migrando y adaptando los componentes probados en Boreas V3 (`relevo-curiosity-section.tsx` y `relevo-example-carousel.tsx`) para la audiencia de salud de V4 (psicólogos, terapeutas, nutriólogos, fisioterapeutas y médicos).

---

## 📋 Tareas Específicas a Ejecutar por Codex

### Paso 1: Actualizar el Copy en [`content/site.ts`](file:///Users/ponycider/Documents/SaaS/Boreas%20V4/content/site.ts)
Modificar el objeto `sectionStubs[sectionIds.relevo]` e incluir la estructura de datos completa para Relevo:
* `eyebrow`: "Relevo — Consultorio digital extendido" (o similar).
* `heading`: Encabezado principal impactante sobre cómo Relevo complementa la atención entre sesiones.
* `description`: Texto explicativo del servicio.
* `carouselItems`: Arreglo de ejemplos ilustrativos de funcionalidades de Relevo (seguimiento, cuestionarios, recordatorios automatizados, etc.).

### Paso 2: Crear [`components/landing/relevo-example-carousel.tsx`](file:///Users/ponycider/Documents/SaaS/Boreas%20V4/components/landing/relevo-example-carousel.tsx)
* Implementar el carrusel de ejemplos interactivo portado de V3.
* Usar **`framer-motion`** para las transiciones y deslizamiento entre tarjetas.
* Asegurar compatibilidad con gestos táctiles (drag / swipe) en dispositivos móviles.
* Cumplir con accesibilidad: botones prev/next con `aria-label` e indicadores de diapositiva activa.

### Paso 3: Crear [`components/landing/relevo-curiosity-section.tsx`](file:///Users/ponycider/Documents/SaaS/Boreas%20V4/components/landing/relevo-curiosity-section.tsx)
* Reconstruir la sección principal de curiosidad de V3.
* Integrar el encabezado, párrafos explicativos, tarjetas de características y el carrusel de ejemplos (`RelevoExampleCarousel`).
* Aplicar animaciones de entrada suaves con `framer-motion` (`fade-in`, `slide-up`).

### Paso 4: Reemplazar el Stub en [`components/landing/relevo-section.tsx`](file:///Users/ponycider/Documents/SaaS/Boreas%20V4/components/landing/relevo-section.tsx)
* Sustituir el stub temporal actual por el renderizado de `RelevoCuriositySection`.
* Mantener la estructura del `SectionFrame` con `id={sectionIds.relevo}` y el separador `border-t border-line`.

---

## 🚨 Reglas de Código y Estilo que Codex Debe Respetar

1. **Librería de Animación**: Usar **`framer-motion`** exclusivamente para esta sección (ya que es un port de V3). NUNCA mezclar GSAP o anime.js dentro del mismo componente cliente.
2. **"use client"**: Asegurarse de incluir la directiva `'use client';` en la parte superior de los archivos `.tsx` interactivos.
3. **Contraste y Colores**: Usar las variables de color del tema de Boreas V4 (`var(--ink)`, `var(--bg-deep)`, `var(--accent)`, `var(--bg-surface)`). El contraste de texto debe ser ≥ 4.5:1 para cuerpo.
4. **Accesibilidad y Reduced Motion**: Toda animación de `framer-motion` debe considerar `prefers-reduced-motion` mediante variante estática sin movimiento brusco.
5. **DOM Visible por Defecto**: Las animaciones deben realzar la vista, no gatear u ocultar información esencial del DOM.

---

## ✅ Criterios de Aceptación y Verificación

Al terminar la implementación, Codex debe ejecutar:

```bash
# 1. Verificación de compilación limpia
npm run build

# 2. Verificación de linter de TypeScript y React
npx eslint
```

Ambos comandos deben pasar sin errores ni advertencias de compilación.
