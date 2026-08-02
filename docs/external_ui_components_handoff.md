# Documento Handoff: Integración de Componentes Externos y Ecosistema UI en Boreas V4

Este documento sirve como guía de contexto para **Antigravity / Gemini**, **Claude Code** y **Codex** al integrar y utilizar los 8 catálogos y librerías de UI instaladas en Boreas V4.

---

## 1. Stack del Proyecto & Reglas de Estilo

* **Framework:** Next.js 16 (App Router) + React 19 + TypeScript.
* **Estilos:** **Tailwind CSS v4** (Configuración *CSS-first* centrada en `app/globals.css`).
* **Design Tokens:** Variables CSS locales (`var(--ink)`, `var(--bg-deep)`, `var(--accent)`, `border-line`).
* **Librerías de Animación Disponibles:**
  * `framer-motion`: Piezas portadas de V3 (Header, Footer, Relevo).
  * `gsap` + `@gsap/react`: Motores interactivos y componentes bespokes de alto impacto visual.
  * `animejs`: Micro-interacciones, contadores numéricos y morphing SVG.
  * `ogl`: WebGL background FX.
* **Regla de Coexistencia de Animación:** NUNCA combinar dos librerías de animación dentro del mismo componente.

---

## 2. Catálogo de Repositorios y Librerías de UI Instaladas

| Librería / Repositorio | Método de Uso & Comando | Ubicación / Configuración |
|---|---|---|
| **1. anime.js** | `npm install animejs @types/animejs` (Ya instalado) | `import anime from "animejs"` en componentes interactivos o de contador. |
| **2. Aceternity UI** | Copiar código desde [ui.aceternity.com](https://ui.aceternity.com/docs) | Guardar en `@/components/ui/aceternity/`. Usa `framer-motion`, `@tabler/icons-react`, `clsx`. |
| **3. Motion Primitives** | `npx motion-primitives add <component>` o copia desde [motion-primitives.com](https://motion-primitives.com/docs/installation) | Guardar en `@/components/ui/motion-primitives/`. |
| **4. uiverse.io** | Copiar snippets HTML/CSS/Tailwind desde [uiverse.io](https://uiverse.io/elements) | Encapsular en componentes React cliente en `@/components/ui/uiverse/`. |
| **5. Smooth UI** | `npx shadcn@latest add @smoothui/<component>` | Configurado mediante registro `@smoothui` en `components.json`. |
| **6. Unlumen UI** | `npx shadcn@latest add @unlumen-ui/<component>` | Configurado mediante registro `@unlumen-ui` en `components.json`. |
| **7. daisyUI** | Paquete `daisyui@latest` instalado + `@plugin "daisyui";` en `app/globals.css` | Clases utilitarias (`badge`, `toggle`, `loading`, `modal`) disponibles globalmente. |
| **8. OriginKit** | Copia desde [originkit.dev](https://www.originkit.dev) / MCP Server | Guardar en `@/components/ui/originkit/`. Servidor MCP en `.claude/mcp.json`. |

---

## 3. Instrucciones Específicas por Plataforma de IA

### 🤖 Antigravity / Gemini
1. Activa la skill **`modern-web-guidance`** para verificar patrones modernos de Tailwind v4 y React 19.
2. Consulta `components.json` donde los registros `@react-bits`, `@smoothui` y `@unlumen-ui` están preconfigurados.
3. Adapta cualquier regla de `tailwind.config.js` heredada de componentes externos a directivas `@theme` o `@keyframes` en `app/globals.css`.

### 💻 Claude Code
1. Servidores MCP preconfigurados en `.claude/mcp.json` (OriginKit MCP: `https://mcp.originkit.dev/mcp`).
2. Usa `npx shadcn@latest add @smoothui/<name>` o `@unlumen-ui/<name>` para añadir componentes con la CLI.
3. Asegura siempre `"use client";` en componentes interactivos con hooks o animaciones.

### 🧠 Codex
1. Consulta la tabla de librerías arriba para identificar si el componente requiere CLI o copia de código local.
2. Utiliza `@tabler/icons-react` o SVGs vectoriales inline (evitando marcas comerciales eliminadas de `lucide-react`).
3. Aplica fallbacks estáticos para dispositivos móviles (`hidden sm:block` / `block sm:hidden`).

---

## 4. Reglas Anti-Errores para Componentes Externos

1. **Tailwind v4 CSS-First:** Si un catálogo pide añadir propiedades en `tailwind.config.js`, no crees ese archivo; agrégalas en `app/globals.css` con `@theme inline` o `@keyframes`.
2. **Icons Handoff:** Usa `lucide-react` para iconos generales o `@tabler/icons-react` para marcas/iconos extendidos. No importes marcas eliminadas de Lucide.
3. **Responsividad Móvil:** Las animaciones basadas en cursor (`mousemove`, `hover`) deben contar con versión móvil estática o táctil mediante clases de visibilidad.
4. **Accesibilidad (a11y):** Aplica `prefers-reduced-motion` a toda animación interactiva.
