# Epic 5 — Pricing público y CTA final: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el stub de `PricingSection` por una sección de pricing público con 4 paquetes, 2 toggles que recalculan precio en vivo, y un formulario de lead que envía por Resend con el paquete elegido como contexto.

**Architecture:** Los datos de paquetes viven en `content/pricing.ts` (patrón del repo: copy y datos en `content/`). El cálculo de precio es una función pura en `lib/pricing.ts` con tests — es la única lógica de dinero del proyecto y la que codifica la escalera de precios del spec. La sección es un client component con estado local (`useState`) por card; no hay estado global. El único punto de persistencia es el POST a `/api/lead`, que valida con zod y envía por Resend.

**Tech Stack:** Next.js 16.2.2 (App Router), React 19.2.4, TypeScript, Tailwind v4 (`@theme inline`), vitest (nuevo), zod (nuevo), resend (nuevo).

## Global Constraints

Copiadas literales del spec `docs/superpowers/specs/2026-07-31-boreas-v4-pricing-design.md` y de las reglas heredadas en `2026-07-19-boreas-v4-landing-design.md` §6.

- **Precios exactos (MXN):** Esencial setup `12900` / mensualidad `590` / Express `+7000`. Profesional setup `19900` / `890` / Express `+13000`. Deluxe setup `32900` / `1490` / Express `+13000`. Organizaciones: setup bajo cotización, mensualidad desde `2900`.
- **Toggle IA:** `+6000` setup, `+400` mensualidad. **Solo disponible en Deluxe y Organizaciones.**
- **Invariante de la escalera:** `Esencial + Express === Profesional` y `Profesional + Express === Deluxe`, en setup. Es requisito del spec §4, no coincidencia.
- **Setup y mensualidad se muestran como dos cifras separadas, nunca sumadas.**
- **Tiempos publicados = los actuales, no los objetivo** (spec §11): Esencial y Profesional 14–21 días (Express 7–10), Deluxe 21–30 días (Express 14–18).
- **Revisiones:** Esencial 2, Profesional 3, Deluxe 4, Organizaciones ilimitadas.
- **Garantía:** Esencial 3 meses, Profesional 12, Deluxe 12, Organizaciones SLA.
- **Sin escasez artificial:** prohibido countdown, "quedan N lugares", o presión de tiempo. El toggle Express es producto real, no urgencia falsa.
- **Un CTA primario por viewport** (regla V3).
- **`prefers-reduced-motion` obligatorio** con equivalente estático. Ya existe una regla global en `app/globals.css:216`; toda animación nueva debe quedar cubierta por ella o traer su propia media query.
- **Contraste** ≥4.5:1 en cuerpo, ≥3:1 en texto grande.
- **Sin glass/glow decorativo, sin gradient text, sin side-stripe borders, sin cards anidadas.**
- **Copy en español**, tono claro, audiencia: especialistas de la salud independientes.
- **Tokens de color existentes** (usar estos, no inventar): `foreground`, `muted`, `clinical`, `accent`, `accent-soft`, `surface`, `elevated`, `line`, `border`, `danger`. Radios: `--radius-sm`, `--radius-md`, `--radius-xl`, `--radius-pill`.

**Milestones de revisión:** Tareas 1–5 dejan la sección de pricing completa y navegable. Tareas 6–8 añaden el formulario y el backend. Conviene revisar al terminar la 5.

---

### Task 1: Datos de pricing y cálculo de precio

Esta tarea establece la fuente de verdad de todos los números y la única lógica de dinero del proyecto. Incluye montar vitest porque el repo aún no tiene runner de tests.

**Files:**
- Create: `content/pricing.ts`
- Create: `lib/pricing.ts`
- Create: `lib/pricing.test.ts`
- Create: `vitest.config.ts`
- Modify: `package.json` (devDependency `vitest`, script `test`)

**Interfaces:**
- Consumes: nada.
- Produces:
  - `type TierId = "esencial" | "profesional" | "deluxe" | "organizaciones"`
  - `type Tier` (ver código del Step 3)
  - `type PlanConfig = { express: boolean; ia: boolean }`
  - `type Selection = { tier: Tier; config: PlanConfig }`
  - `type ComputedPrice = { setup: number | null; monthly: number }`
  - `tiers: Tier[]`, `getTier(id: TierId): Tier`
  - `computePrice(tier: Tier, config: PlanConfig): ComputedPrice`
  - `formatMxn(amount: number): string`
  - `IA_SETUP = 6000`, `IA_MONTHLY = 400`
  - `pricingHeading`, `mensualidadTooltip`, `garantiaTooltip` (copy)

- [ ] **Step 1: Instalar vitest y añadir el script**

```bash
npm install -D vitest
npm pkg set scripts.test="vitest run"
```

- [ ] **Step 2: Crear `vitest.config.ts`**

El alias `@/` debe resolverse igual que en `tsconfig.json` (`"paths": { "@/*": ["./*"] }`), o los tests no encontrarán `@/content/pricing`.

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Espeja tsconfig.json: "@/*" -> "./*"
    alias: { "@": import.meta.dirname },
  },
  test: {
    include: ["lib/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Escribir `content/pricing.ts`**

Todos los números salen del spec §2, §3 y §11. No inventar ni redondear.

```ts
export type TierId = "esencial" | "profesional" | "deluxe" | "organizaciones";

export type Tier = {
  id: TierId;
  name: string;
  /** Una línea: para quién es este paquete. */
  tagline: string;
  /** null = precio bajo cotización (Organizaciones). */
  setup: number | null;
  monthly: number;
  /** true → la mensualidad se muestra como "desde $X". */
  monthlyIsFrom: boolean;
  /** Costo de activar Entrega Express. null = el toggle no aplica. */
  expressFee: number | null;
  /** Tiempos publicados hoy (spec §11: se publica el actual, no el objetivo). */
  delivery: { base: string; express: string | null };
  /** Lo que incluye, en orden de importancia percibida. Máx 8 por card. */
  features: string[];
  revisions: string;
  warranty: string;
  /** El toggle de Chatbot IA solo existe en Deluxe y Organizaciones (spec §3). */
  allowsIa: boolean;
  recommended: boolean;
  ctaLabel: string;
};

export const IA_SETUP = 6000;
export const IA_MONTHLY = 400;

export const tiers: Tier[] = [
  {
    id: "esencial",
    name: "Esencial",
    tagline: "Para empezar a existir en internet con algo que sí convierte.",
    setup: 12900,
    monthly: 590,
    monthlyIsFrom: false,
    expressFee: 7000,
    delivery: { base: "14 a 21 días", express: "7 a 10 días" },
    features: [
      "1 motor de conversión, el de tu especialidad",
      "Landing de una página",
      "SEO técnico y Google Business",
      "WhatsApp, redes y Google Maps",
      "Revisión de copy contra lineamientos COFEPRIS",
    ],
    revisions: "2 rondas de revisión",
    warranty: "3 meses de garantía",
    allowsIa: false,
    recommended: false,
    ctaLabel: "Quiero el Esencial",
  },
  {
    id: "profesional",
    name: "Profesional",
    tagline: "El que recomendamos: escribimos tu copy y agendas sin intermediarios.",
    setup: 19900,
    monthly: 890,
    monthlyIsFrom: false,
    expressFee: 13000,
    delivery: { base: "14 a 21 días", express: "7 a 10 días" },
    features: [
      "2 motores de conversión",
      "Landing con blog",
      "Copy escrito por nosotros",
      "Agendamiento en línea",
      "Logo vectorizado",
      "Analítica y reporte mensual",
      "Todo lo del Esencial",
    ],
    revisions: "3 rondas de revisión",
    warranty: "12 meses de garantía",
    allowsIa: false,
    recommended: true,
    ctaLabel: "Quiero el Profesional",
  },
  {
    id: "deluxe",
    name: "Deluxe",
    tagline: "Presencia completa, con dominio propio y chatbot opcional.",
    setup: 32900,
    monthly: 1490,
    monthlyIsFrom: false,
    expressFee: 13000,
    delivery: { base: "21 a 30 días", express: "14 a 18 días" },
    features: [
      "3 motores de conversión",
      "Hasta 6 páginas",
      "Dominio incluido el primer año",
      "Todo lo del Profesional",
    ],
    revisions: "4 rondas de revisión",
    warranty: "12 meses de garantía",
    allowsIa: true,
    recommended: false,
    ctaLabel: "Quiero el Deluxe",
  },
  {
    id: "organizaciones",
    name: "Organizaciones",
    tagline: "Clínicas con varias sedes o varios especialistas.",
    setup: null,
    monthly: 2900,
    monthlyIsFrom: true,
    expressFee: null,
    delivery: { base: "A definir contigo", express: null },
    features: [
      "Todos los motores de conversión",
      "Portal de pacientes con acceso",
      "Múltiples sedes y especialistas",
      "Tracking de errores y mapas de calor",
      "Integraciones a medida (CRM, expediente)",
      "SLA contractual",
      "Todo lo del Deluxe",
    ],
    revisions: "Revisiones ilimitadas",
    warranty: "SLA",
    allowsIa: true,
    recommended: false,
    ctaLabel: "Hablemos",
  },
];

export function getTier(id: TierId): Tier {
  const tier = tiers.find((t) => t.id === id);
  if (!tier) throw new Error(`Paquete desconocido: ${id}`);
  return tier;
}

export const pricingHeading = {
  eyebrow: "Precios",
  heading: "Cuánto cuesta y qué incluye.",
  body: "Sin cotizaciones sorpresa. El pago único construye tu sitio; la mensualidad lo mantiene vivo.",
};

export const mensualidadTooltip = {
  summary: "¿Qué es la mensualidad?",
  paragraphs: [
    "El pago único construye tu sitio. La mensualidad lo mantiene vivo.",
    "Incluye: hosting, certificado de seguridad, respaldos automáticos, actualizaciones de seguridad, monitoreo de caídas y soporte por WhatsApp.",
    "Arranca el mes siguiente a que tu sitio salga en vivo. El primer mes va incluido en el pago inicial.",
    "Sin permanencia forzosa. Puedes cancelar cuando quieras con 30 días de aviso; te entregamos el código y te ayudamos a migrar.",
  ],
};

export const garantiaTooltip = {
  summary: "¿Qué cubre la garantía?",
  paragraphs: [
    "Durante este periodo arreglamos sin costo cualquier error, bug o cosa que no funcione como se acordó.",
    "No cubre funciones nuevas ni rediseños.",
  ],
};

export const expressToggle = {
  label: "Entrega Express",
  help: "Reduce el tiempo de entrega.",
};

export const iaToggle = {
  label: "Chatbot IA",
  help: "Responde horarios, servicios y ubicación, y agenda citas.",
  unavailable: "Disponible desde Deluxe.",
};

/** Nota bajo las cards. El reloj de entrega es del spec §10. */
export const pricingFootnote =
  "El anticipo es 50% para arrancar y 50% contra entrega. El tiempo de entrega empieza a correr cuando recibimos tu anticipo y tu audio de un minuto: nada más depende de ti.";
```

- [ ] **Step 4: Escribir los tests que fallan**

El test de la escalera es el importante: convierte la regla de negocio del spec §4 en algo que se rompe solo si alguien mueve un precio.

```ts
// lib/pricing.test.ts
import { describe, it, expect } from "vitest";
import { getTier, IA_MONTHLY, IA_SETUP } from "@/content/pricing";
import { computePrice, formatMxn } from "@/lib/pricing";

const plain = { express: false, ia: false };

describe("computePrice", () => {
  it("devuelve el precio base sin toggles", () => {
    expect(computePrice(getTier("esencial"), plain)).toEqual({ setup: 12900, monthly: 590 });
    expect(computePrice(getTier("profesional"), plain)).toEqual({ setup: 19900, monthly: 890 });
    expect(computePrice(getTier("deluxe"), plain)).toEqual({ setup: 32900, monthly: 1490 });
  });

  it("Express suma el fee del paquete al setup y no toca la mensualidad", () => {
    expect(computePrice(getTier("esencial"), { express: true, ia: false })).toEqual({
      setup: 19900,
      monthly: 590,
    });
  });

  it("IA suma setup y mensualidad en Deluxe", () => {
    expect(computePrice(getTier("deluxe"), { express: false, ia: true })).toEqual({
      setup: 32900 + IA_SETUP,
      monthly: 1490 + IA_MONTHLY,
    });
  });

  it("IA se ignora en los paquetes que no la permiten", () => {
    expect(computePrice(getTier("esencial"), { express: false, ia: true })).toEqual({
      setup: 12900,
      monthly: 590,
    });
    expect(computePrice(getTier("profesional"), { express: false, ia: true })).toEqual({
      setup: 19900,
      monthly: 890,
    });
  });

  it("Organizaciones no tiene setup calculable", () => {
    const price = computePrice(getTier("organizaciones"), { express: true, ia: true });
    expect(price.setup).toBeNull();
    expect(price.monthly).toBe(2900 + IA_MONTHLY);
  });

  // Requisito del spec §4: el fee de Express es exactamente el salto al
  // siguiente paquete, para que subir de escalón sea la opción obvia.
  it("mantiene la escalera: paquete + Express cuesta lo mismo que el paquete de arriba", () => {
    const esencialExpress = computePrice(getTier("esencial"), { express: true, ia: false });
    const profesionalBase = computePrice(getTier("profesional"), plain);
    expect(esencialExpress.setup).toBe(profesionalBase.setup);

    const profesionalExpress = computePrice(getTier("profesional"), { express: true, ia: false });
    const deluxeBase = computePrice(getTier("deluxe"), plain);
    expect(profesionalExpress.setup).toBe(deluxeBase.setup);
  });
});

describe("formatMxn", () => {
  it("formatea con separador de miles y sin decimales", () => {
    expect(formatMxn(12900)).toBe("$12,900");
    expect(formatMxn(590)).toBe("$590");
  });
});
```

- [ ] **Step 5: Correr los tests y verificar que fallan**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/pricing"`.

- [ ] **Step 6: Escribir `lib/pricing.ts`**

```ts
import type { Tier } from "@/content/pricing";
import { IA_MONTHLY, IA_SETUP } from "@/content/pricing";

export type PlanConfig = { express: boolean; ia: boolean };

/**
 * Lo que el visitante eligió en una card. Vive aquí y no en el componente de
 * sección para que el formulario pueda importarlo sin ciclo de dependencias.
 */
export type Selection = { tier: Tier; config: PlanConfig };

/** setup null = bajo cotización (Organizaciones). */
export type ComputedPrice = { setup: number | null; monthly: number };

export function computePrice(tier: Tier, config: PlanConfig): ComputedPrice {
  // Los toggles se ignoran silenciosamente donde el paquete no los permite:
  // la UI no los ofrece ahí, y así un estado viejo nunca produce un precio falso.
  const iaOn = config.ia && tier.allowsIa;
  const expressFee = config.express && tier.expressFee !== null ? tier.expressFee : 0;

  const setup =
    tier.setup === null ? null : tier.setup + expressFee + (iaOn ? IA_SETUP : 0);

  return { setup, monthly: tier.monthly + (iaOn ? IA_MONTHLY : 0) };
}

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

/** "$12,900" — sin decimales, sin sufijo de moneda. */
export function formatMxn(amount: number): string {
  return mxn.format(amount).replace(/\s*MXN\s*/, "").trim();
}
```

- [ ] **Step 7: Correr los tests y verificar que pasan**

Run: `npm test`
Expected: PASS, 7 tests.

Si `formatMxn` falla, imprime el valor real (`Intl` puede emitir `$12,900.00` o un espacio duro según la versión de ICU) y ajusta el `replace`/opciones hasta que devuelva exactamente `$12,900`.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json vitest.config.ts content/pricing.ts lib/pricing.ts lib/pricing.test.ts
git commit -m "feat(pricing): add tier data and price computation with ladder invariant test"
```

---

### Task 2: Componente InfoTooltip

El `(?)` de "Mensualidad" y "Garantía". Se implementa con `<details>`/`<summary>` nativo: es accesible por teclado y por lector de pantalla sin JavaScript, y funciona antes de la hidratación.

**Files:**
- Create: `components/landing/pricing/info-tooltip.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: `<InfoTooltip summary={string} paragraphs={string[]} />`

- [ ] **Step 1: Escribir el componente**

```tsx
// components/landing/pricing/info-tooltip.tsx

/**
 * Divulgación con <details> nativo en vez de un popover con JS: accesible por
 * teclado y por lector de pantalla sin trabajo extra, y funciona sin hidratar.
 */
export function InfoTooltip({
  summary,
  paragraphs,
}: {
  summary: string;
  paragraphs: string[];
}) {
  return (
    <details className="group inline-block align-middle">
      <summary
        aria-label={summary}
        className="inline-flex h-5 w-5 cursor-pointer list-none items-center justify-center rounded-[999px] border border-line text-xs text-clinical transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent [&::-webkit-details-marker]:hidden"
      >
        ?
      </summary>
      <div className="mt-3 rounded-[var(--radius-md)] border border-line bg-elevated p-4 text-sm leading-relaxed text-muted">
        <p className="mb-2 font-medium text-foreground">{summary}</p>
        {paragraphs.map((text) => (
          <p key={text} className="mt-2 first:mt-0">
            {text}
          </p>
        ))}
      </div>
    </details>
  );
}
```

- [ ] **Step 2: Verificar que compila y que el tipo es correcto**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/landing/pricing/info-tooltip.tsx
git commit -m "feat(pricing): add native details-based info tooltip"
```

---

### Task 3: Componente PlanToggle

El interruptor de Express y el de IA. Es un `<input type="checkbox">` real con label visible — no un div con `onClick` — para que llegue gratis el soporte de teclado y de lector de pantalla.

**Files:**
- Create: `components/landing/pricing/plan-toggle.tsx`

**Interfaces:**
- Consumes: nada.
- Produces: `<PlanToggle id={string} label={string} help={string} delta={string} checked={boolean} onChange={(v: boolean) => void} />`

- [ ] **Step 1: Escribir el componente**

`delta` es el texto del sobreprecio ya formateado (ej. `"+$7,000"`); lo calcula la card, no el toggle.

```tsx
// components/landing/pricing/plan-toggle.tsx

export function PlanToggle({
  id,
  label,
  help,
  delta,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  delta: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  const helpId = `${id}-help`;

  return (
    <div className="flex items-start gap-3 border-t border-line pt-4">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-describedby={helpId}
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      />
      <label htmlFor={id} className="cursor-pointer text-sm">
        <span className="font-medium text-foreground">{label}</span>
        <span className="ml-2 text-clinical">{delta}</span>
        <span id={helpId} className="mt-1 block text-clinical">
          {help}
        </span>
      </label>
    </div>
  );
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add components/landing/pricing/plan-toggle.tsx
git commit -m "feat(pricing): add accessible plan toggle control"
```

---

### Task 4: Componente PlanCard

Una card por paquete, con estado local de toggles y precio recalculado en vivo.

**Files:**
- Create: `components/landing/pricing/plan-card.tsx`

**Interfaces:**
- Consumes: `Tier`, `getTier`, `expressToggle`, `iaToggle`, `IA_SETUP`, `mensualidadTooltip`, `garantiaTooltip` de `@/content/pricing`; `computePrice`, `formatMxn`, `PlanConfig` de `@/lib/pricing`; `InfoTooltip`; `PlanToggle`.
- Produces: `<PlanCard tier={Tier} onSelect={(tier: Tier, config: PlanConfig) => void} />`

**Nota de accesibilidad — desviación deliberada del spec.** El spec §"Sección de pricing" pide que el toggle de IA se vea "deshabilitado pero visible" en Esencial y Profesional. Un `<input disabled>` no recibe foco, así que quien navega con lector de pantalla nunca escucharía la explicación. En su lugar se renderiza una fila estática de texto: cumple la intención (visible y explicado) sin dejar un control muerto.

- [ ] **Step 1: Escribir el componente**

```tsx
// components/landing/pricing/plan-card.tsx
"use client";

import { useState } from "react";
import type { Tier } from "@/content/pricing";
import {
  expressToggle,
  garantiaTooltip,
  iaToggle,
  IA_SETUP,
  mensualidadTooltip,
} from "@/content/pricing";
import { computePrice, formatMxn, type PlanConfig } from "@/lib/pricing";
import { InfoTooltip } from "./info-tooltip";
import { PlanToggle } from "./plan-toggle";

export function PlanCard({
  tier,
  onSelect,
}: {
  tier: Tier;
  onSelect: (tier: Tier, config: PlanConfig) => void;
}) {
  const [config, setConfig] = useState<PlanConfig>({ express: false, ia: false });
  const price = computePrice(tier, config);

  const delivery =
    config.express && tier.delivery.express ? tier.delivery.express : tier.delivery.base;

  return (
    <article
      className={`flex flex-col rounded-[var(--radius-xl)] border bg-surface p-6 ${
        tier.recommended ? "border-accent" : "border-line"
      }`}
    >
      {tier.recommended && (
        <p className="mb-4 inline-flex self-start rounded-[999px] bg-accent-soft px-3 py-1 text-xs font-medium text-foreground">
          El que recomendamos
        </p>
      )}

      <h3 className="font-display text-2xl font-normal text-foreground">{tier.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{tier.tagline}</p>

      {/* aria-live: al mover un toggle, el lector anuncia el precio nuevo. */}
      <div className="mt-6 border-t border-line pt-6" aria-live="polite">
        <p className="text-3xl font-display text-foreground">
          {price.setup === null ? "Cotización" : formatMxn(price.setup)}
        </p>
        <p className="text-xs text-clinical">Pago único</p>

        <p className="mt-3 flex items-center gap-2 text-lg text-foreground">
          {tier.monthlyIsFrom ? `desde ${formatMxn(price.monthly)}` : formatMxn(price.monthly)}
          <span className="text-sm text-clinical">al mes</span>
          <InfoTooltip
            summary={mensualidadTooltip.summary}
            paragraphs={mensualidadTooltip.paragraphs}
          />
        </p>
      </div>

      <ul className="mt-6 space-y-2 text-sm text-muted">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-2">
            <span aria-hidden="true" className="text-accent">
              ·
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <dl className="mt-6 space-y-1 border-t border-line pt-4 text-sm text-clinical">
        <div className="flex justify-between gap-4">
          <dt>Entrega</dt>
          <dd className="text-foreground">{delivery}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt>Revisiones</dt>
          <dd className="text-foreground">{tier.revisions}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="flex items-center gap-2">
            Garantía
            <InfoTooltip
              summary={garantiaTooltip.summary}
              paragraphs={garantiaTooltip.paragraphs}
            />
          </dt>
          <dd className="text-foreground">{tier.warranty}</dd>
        </div>
      </dl>

      <div className="mt-6 space-y-4">
        {tier.expressFee !== null && (
          <PlanToggle
            id={`${tier.id}-express`}
            label={expressToggle.label}
            help={`${expressToggle.help} ${tier.delivery.express ?? ""}`.trim()}
            delta={`+${formatMxn(tier.expressFee)}`}
            checked={config.express}
            onChange={(express) => setConfig((prev) => ({ ...prev, express }))}
          />
        )}

        {tier.allowsIa ? (
          <PlanToggle
            id={`${tier.id}-ia`}
            label={iaToggle.label}
            help={iaToggle.help}
            delta={`+${formatMxn(IA_SETUP)}`}
            checked={config.ia}
            onChange={(ia) => setConfig((prev) => ({ ...prev, ia }))}
          />
        ) : (
          // Fila estática en vez de un input deshabilitado: un control sin foco
          // deja fuera a los lectores de pantalla. Ver nota de la Task 4.
          <div className="border-t border-line pt-4 text-sm text-clinical">
            <span className="font-medium">{iaToggle.label}</span>
            <span className="mt-1 block">{iaToggle.unavailable}</span>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onSelect(tier, config)}
        className={`mt-8 w-full rounded-[var(--radius-pill)] px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          tier.recommended
            ? "bg-accent text-[var(--bg-void)] hover:opacity-90"
            : "border border-line text-foreground hover:border-accent"
        }`}
      >
        {tier.ctaLabel}
      </button>
    </article>
  );
}
```

- [ ] **Step 2: Verificar que compila**

Run: `npx tsc --noEmit`
Expected: sin errores.

Si el token `bg-accent text-[var(--bg-void)]` da contraste insuficiente contra el acento, cambia a `text-[var(--bg-surface)]` y verifica en Step 3 de la Task 5.

- [ ] **Step 3: Commit**

```bash
git add components/landing/pricing/plan-card.tsx
git commit -m "feat(pricing): add plan card with live price recalculation"
```

---

### Task 5: Ensamblar PricingSection

Reemplaza el stub. Al terminar esta tarea la sección de pricing está completa y navegable; el formulario llega en la Task 6.

**Files:**
- Modify: `components/landing/pricing-section.tsx` (reemplazo completo)
- Modify: `content/site.ts:43-55` (sacar `pricing` de `sectionStubs`)

**Interfaces:**
- Consumes: `tiers`, `pricingHeading`, `pricingFootnote` de `@/content/pricing`; `PlanCard`; `PlanConfig` de `@/lib/pricing`; `SectionFrame` de `./landing-sections`.
- Produces: `PricingSection`, y el ancla DOM `id="contacto"` que la Task 6 rellena con el formulario.

- [ ] **Step 1: Sacar `pricing` de los stubs en `content/site.ts`**

Reemplaza el bloque de `sectionStubs` (líneas 43–55) por:

```ts
export const sectionStubs: Record<
  Exclude<SectionId, "hero" | "problema" | "motores" | "pricing" | "relevo">,
  { eyebrow: string; heading: string }
> = {
  [sectionIds.socialProof]: {
    eyebrow: "Epic 4",
    heading: "Prueba social — pendiente de pulir",
  },
};
```

- [ ] **Step 2: Reescribir `components/landing/pricing-section.tsx`**

```tsx
"use client";

import { useState } from "react";
import { SectionFrame } from "./landing-sections";
import { PlanCard } from "./pricing/plan-card";
import { sectionIds } from "@/content/site";
import { pricingFootnote, pricingHeading, tiers, type Tier } from "@/content/pricing";
import type { PlanConfig, Selection } from "@/lib/pricing";

export function PricingSection() {
  const [selection, setSelection] = useState<Selection | null>(null);

  function handleSelect(tier: Tier, config: PlanConfig) {
    setSelection({ tier, config });
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SectionFrame id={sectionIds.pricing} className="border-t border-line">
      <div className="mx-auto max-w-[1460px] px-4 sm:px-6 lg:px-10">
        <p className="text-sm font-medium text-accent">{pricingHeading.eyebrow}</p>
        <h2 className="mt-4 max-w-3xl text-[clamp(1.8rem,3.5vw,3.2rem)] font-display font-normal leading-[1.12] tracking-[-0.010em] text-foreground">
          {pricingHeading.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {pricingHeading.body}
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {tiers.map((tier) => (
            <PlanCard key={tier.id} tier={tier} onSelect={handleSelect} />
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-sm leading-relaxed text-clinical">{pricingFootnote}</p>

        <div id="contacto" className="mt-20 scroll-mt-28">
          {/* Task 6 monta aquí <LeadForm selection={selection} />. */}
          {selection && (
            <p className="text-sm text-muted">
              Elegiste {selection.tier.name}
              {selection.config.express ? " con Entrega Express" : ""}
              {selection.config.ia && selection.tier.allowsIa ? " y Chatbot IA" : ""}.
            </p>
          )}
        </div>
      </div>
    </SectionFrame>
  );
}
```

`scrollIntoView` con `behavior: "smooth"` respeta `prefers-reduced-motion` en los navegadores actuales de forma nativa, así que no hace falta rama extra.

- [ ] **Step 3: Verificar tipos, lint y build**

```bash
npx tsc --noEmit && npm run lint && npm run build
```

Expected: los tres pasan. `tsc` confirma que ningún otro archivo seguía leyendo `sectionStubs[sectionIds.pricing]`.

- [ ] **Step 4: Verificar en el navegador**

Levanta el preview con la herramienta de preview del harness (no `npm run dev` en Bash) y comprueba, en `#pricing`:

1. Se renderizan 4 cards y "Profesional" trae el badge de recomendado.
2. Activar **Entrega Express** en Esencial cambia el setup a `$19,900` y la entrega a "7 a 10 días".
3. Activar **Chatbot IA** en Deluxe cambia el setup a `$38,900` y la mensualidad a `$1,890`.
4. Esencial y Profesional muestran "Chatbot IA — Disponible desde Deluxe" como texto, sin checkbox.
5. Organizaciones muestra "Cotización" y "desde $2,900 al mes".
6. Los `(?)` abren y cierran con Enter y con Espacio, no solo con clic.
7. Recorrer con Tab llega a cada checkbox y a cada botón, con anillo de foco visible.
8. `resize_window` a mobile: las cards se apilan a una columna y nada desborda horizontalmente.

Revisa `read_console_messages` — no debe haber errores ni warnings de hidratación.

- [ ] **Step 5: Commit**

```bash
git add components/landing/pricing-section.tsx content/site.ts
git commit -m "feat(pricing): replace stub with four-tier pricing section"
```

---

### Task 6: Formulario de lead con validación zod

**Files:**
- Create: `lib/lead-schema.ts`
- Create: `lib/lead-schema.test.ts`
- Create: `components/landing/pricing/lead-form.tsx`
- Modify: `components/landing/pricing-section.tsx` (montar el formulario en `#contacto`)
- Modify: `package.json` (dependency `zod`)

**Interfaces:**
- Consumes: `Selection` de `@/lib/pricing` (definido en la Task 1).
- Produces:
  - `leadSchema` (zod), `type LeadInput = z.infer<typeof leadSchema>`
  - `<LeadForm selection={Selection | null} />`

- [ ] **Step 1: Instalar zod**

```bash
npm install zod
```

- [ ] **Step 2: Escribir el test que falla**

```ts
// lib/lead-schema.test.ts
import { describe, it, expect } from "vitest";
import { leadSchema } from "@/lib/lead-schema";

const valid = {
  nombre: "Ana Ruiz",
  email: "ana@consultorio.mx",
  telefono: "5512345678",
  especialidad: "Psicología",
  mensaje: "",
  paquete: "profesional",
  express: false,
  ia: false,
  website: "",
};

describe("leadSchema", () => {
  it("acepta un lead válido", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("rechaza email inválido", () => {
    expect(leadSchema.safeParse({ ...valid, email: "ana@" }).success).toBe(false);
  });

  it("rechaza teléfono que no tenga 10 dígitos", () => {
    expect(leadSchema.safeParse({ ...valid, telefono: "551234" }).success).toBe(false);
  });

  it("acepta teléfono con espacios y guiones", () => {
    const parsed = leadSchema.safeParse({ ...valid, telefono: "55 1234-5678" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.telefono).toBe("5512345678");
  });

  it("rechaza un paquete que no existe", () => {
    expect(leadSchema.safeParse({ ...valid, paquete: "premium" }).success).toBe(false);
  });

  // Honeypot: los bots llenan todos los campos, incluido el oculto.
  it("rechaza cuando el honeypot viene lleno", () => {
    expect(leadSchema.safeParse({ ...valid, website: "http://spam.example" }).success).toBe(false);
  });
});
```

- [ ] **Step 3: Correr el test y verificar que falla**

Run: `npm test`
Expected: FAIL — `Failed to resolve import "@/lib/lead-schema"`.

- [ ] **Step 4: Escribir `lib/lead-schema.ts`**

```ts
import { z } from "zod";

export const leadSchema = z.object({
  nombre: z.string().trim().min(2, "Escribe tu nombre").max(80),
  email: z.email("Revisa tu correo").max(120),
  telefono: z
    .string()
    // Se acepta como lo escribe la gente y se normaliza a 10 dígitos.
    .transform((value) => value.replace(/\D/g, ""))
    .refine((digits) => digits.length === 10, "El teléfono debe tener 10 dígitos"),
  especialidad: z.string().trim().min(2, "Dinos tu especialidad").max(80),
  mensaje: z.string().trim().max(1000).default(""),
  paquete: z.enum(["esencial", "profesional", "deluxe", "organizaciones"]),
  express: z.boolean(),
  ia: z.boolean(),
  // Campo trampa: invisible para personas, irresistible para bots.
  website: z.string().max(0, "Envío rechazado"),
});

export type LeadInput = z.infer<typeof leadSchema>;
```

- [ ] **Step 5: Correr el test y verificar que pasa**

Run: `npm test`
Expected: PASS, 13 tests en total (7 de pricing + 6 de lead-schema).

Si `z.email` no existe, el proyecto instaló zod v3: cambia a `z.string().email(...)`. Confirma la versión con `npm ls zod`.

- [ ] **Step 6: Escribir `components/landing/pricing/lead-form.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Selection } from "@/lib/pricing";
import { leadSchema } from "@/lib/lead-schema";

type Status = "idle" | "sending" | "sent" | "error";

const field =
  "mt-1 w-full rounded-[var(--radius-sm)] border border-line bg-surface px-3 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

export function LeadForm({ selection }: { selection: Selection | null }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));

    const parsed = leadSchema.safeParse({
      ...data,
      paquete: selection?.tier.id ?? "profesional",
      express: selection?.config.express ?? false,
      ia: (selection?.config.ia && selection.tier.allowsIa) ?? false,
    });

    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0]);
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }

    setErrors({});
    setStatus("sending");

    const response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    setStatus(response.ok ? "sent" : "error");
  }

  if (status === "sent") {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-xl)] border border-accent bg-accent-soft p-8"
      >
        <p className="font-display text-2xl text-foreground">Listo, ya nos llegó.</p>
        <p className="mt-2 text-sm text-muted">
          Te escribimos hoy mismo para pedirte tu audio de un minuto. Es lo único que
          necesitamos de ti para arrancar.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <h3 className="font-display text-2xl font-normal text-foreground">Empecemos</h3>
      <p className="mt-2 text-sm text-muted">
        {selection
          ? `Elegiste ${selection.tier.name}${selection.config.express ? " con Entrega Express" : ""}${
              selection.config.ia && selection.tier.allowsIa ? " y Chatbot IA" : ""
            }.`
          : "Déjanos tus datos y te contactamos hoy mismo."}
      </p>

      <div className="mt-6 space-y-4">
        {(
          [
            { name: "nombre", label: "Nombre", type: "text", autoComplete: "name" },
            { name: "email", label: "Correo", type: "email", autoComplete: "email" },
            { name: "telefono", label: "Teléfono", type: "tel", autoComplete: "tel" },
            { name: "especialidad", label: "Tu especialidad", type: "text", autoComplete: "off" },
          ] as const
        ).map((input) => (
          <div key={input.name}>
            <label htmlFor={input.name} className="text-sm font-medium text-foreground">
              {input.label}
            </label>
            <input
              id={input.name}
              name={input.name}
              type={input.type}
              autoComplete={input.autoComplete}
              aria-invalid={errors[input.name] ? true : undefined}
              aria-describedby={errors[input.name] ? `${input.name}-error` : undefined}
              className={field}
            />
            {errors[input.name] && (
              <p id={`${input.name}-error`} className="mt-1 text-sm text-danger">
                {errors[input.name]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label htmlFor="mensaje" className="text-sm font-medium text-foreground">
            ¿Algo que debamos saber? (opcional)
          </label>
          <textarea id="mensaje" name="mensaje" rows={3} className={field} />
        </div>

        {/* Honeypot: fuera de pantalla, sin tab-stop, oculto al lector de pantalla. */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-px w-px opacity-0"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-[var(--radius-pill)] bg-accent px-5 py-3 text-sm font-medium text-[var(--bg-void)] transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Enviando…" : "Enviar"}
      </button>

      {status === "error" && (
        <p role="alert" className="mt-4 text-sm text-danger">
          No se pudo enviar. Inténtalo otra vez en un momento.
        </p>
      )}
    </form>
  );
}
```

- [ ] **Step 7: Montar el formulario en la sección**

En `components/landing/pricing-section.tsx`, añade el import y reemplaza el contenido del `<div id="contacto">`:

```tsx
import { LeadForm } from "./pricing/lead-form";
```

```tsx
<div id="contacto" className="mt-20 scroll-mt-28">
  <LeadForm selection={selection} />
</div>
```

- [ ] **Step 8: Verificar tipos y build**

```bash
npx tsc --noEmit && npm run build
```

Expected: ambos pasan. El POST a `/api/lead` todavía devuelve 404 — la ruta llega en la Task 7.

- [ ] **Step 9: Commit**

```bash
git add package.json package-lock.json lib/lead-schema.ts lib/lead-schema.test.ts components/landing/pricing/lead-form.tsx components/landing/pricing-section.tsx
git commit -m "feat(pricing): add lead form with zod validation and honeypot"
```

---

### Task 7: API route con Resend

**Files:**
- Create: `app/api/lead/route.ts`
- Create: `.env.example`
- Modify: `package.json` (dependency `resend`)

**Interfaces:**
- Consumes: `leadSchema`, `LeadInput` de `@/lib/lead-schema`; `getTier` de `@/content/pricing`; `computePrice`, `formatMxn` de `@/lib/pricing`.
- Produces: `POST /api/lead` → `200 { ok: true }` | `400 { ok: false }` | `429` | `500 { ok: false }`.

- [ ] **Step 1: Instalar resend y documentar las variables de entorno**

```bash
npm install resend
```

Crea `.env.example`:

```
# Resend — https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxx
# Remitente verificado en Resend
LEAD_FROM_EMAIL=leads@boreas.mx
# Destinatario de las notificaciones de lead
LEAD_TO_EMAIL=hola@boreas.mx
```

Verifica que `.env*` esté ignorado: `grep -n "env" .gitignore`. Si no aparece, añade `.env*.local` y `.env` antes de continuar. **Nunca commitees la API key real.**

- [ ] **Step 2: Escribir `app/api/lead/route.ts`**

Se queda en el runtime Node.js por defecto — no declarar `runtime = "edge"`.

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { leadSchema } from "@/lib/lead-schema";
import { getTier } from "@/content/pricing";
import { computePrice, formatMxn } from "@/lib/pricing";

// ponytail: rate limit en memoria, por instancia. Suficiente contra el
// email-bombing casual; si hace falta algo real, mover a Vercel KV o Upstash.
const RATE_LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "desconocido";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  const parsed = leadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const lead = parsed.data;
  const tier = getTier(lead.paquete);
  const price = computePrice(tier, { express: lead.express, ia: lead.ia });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  const to = process.env.LEAD_TO_EMAIL;

  if (!apiKey || !from || !to) {
    console.error("Faltan variables de entorno de Resend");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const detalle = [
    `Paquete: ${tier.name}`,
    `Entrega Express: ${lead.express ? "sí" : "no"}`,
    `Chatbot IA: ${lead.ia ? "sí" : "no"}`,
    `Setup: ${price.setup === null ? "cotización" : formatMxn(price.setup)}`,
    `Mensualidad: ${formatMxn(price.monthly)}`,
    "",
    `Nombre: ${lead.nombre}`,
    `Correo: ${lead.email}`,
    `Teléfono: ${lead.telefono}`,
    `Especialidad: ${lead.especialidad}`,
    `Mensaje: ${lead.mensaje || "(sin mensaje)"}`,
  ].join("\n");

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: lead.email,
      subject: `Lead ${tier.name} — ${lead.nombre}`,
      text: detalle,
    });
    if (error) throw error;
  } catch (error) {
    console.error("Resend falló", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 3: Verificar tipos y build**

```bash
npx tsc --noEmit && npm run build
```

Expected: ambos pasan.

- [ ] **Step 4: Probar la ruta contra validación y rate limit**

Con el preview levantado:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/lead -H 'Content-Type: application/json' -d '{"nombre":"x"}'
```

Expected: `400`.

```bash
for i in $(seq 1 7); do curl -s -o /dev/null -w "%{http_code} " -X POST http://localhost:3000/api/lead -H 'Content-Type: application/json' -d '{}'; done; echo
```

Expected: los primeros responden `400` y a partir del sexto aparece `429`.

Para probar el envío real hace falta una `RESEND_API_KEY` en `.env.local`. Sin ella la ruta devuelve `500` con "Faltan variables de entorno de Resend" en la consola del servidor, que es el comportamiento correcto.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/api/lead/route.ts .env.example
git commit -m "feat(pricing): add lead API route with Resend, rate limit and validation"
```

---

### Task 8: Verificación de accesibilidad y cierre

**Files:**
- Modify: los que hagan falta según lo que encuentres.

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: nada nuevo.

- [ ] **Step 1: Correr la suite completa**

```bash
npm test && npx tsc --noEmit && npm run lint && npm run build
```

Expected: los cuatro pasan.

- [ ] **Step 2: Auditar la sección en el navegador**

Con el preview abierto en `#pricing`:

1. **Teclado solo, sin ratón:** Tab llega a cada `(?)`, cada checkbox, cada botón de card y cada campo del formulario. El anillo de foco es visible en todos.
2. **Contraste:** con `javascript_tool`, lee el `color` y `background-color` computados del texto `.text-clinical` sobre `bg-surface` y confirma ≥4.5:1. Si no llega, súbelo a `text-muted`.
3. **Reduced motion:** `resize_window` con `colorScheme` y prueba el scroll al enviar; con `prefers-reduced-motion: reduce` no debe haber desplazamiento animado.
4. **Dark mode:** cambia el tema y revisa que las cards, el badge de recomendado y el estado de éxito sigan legibles.
5. **Mobile (375px):** una columna, sin scroll horizontal, los `(?)` abren sin desbordar la card.
6. **Consola:** `read_console_messages` sin errores ni warnings de hidratación.

- [ ] **Step 3: Verificar que el copy no rompe reglas del spec**

```bash
grep -rniE "quedan [0-9]|últimos? lugares|oferta termina|solo hoy|cupo limitado" content/pricing.ts components/landing/pricing/
```

Expected: sin resultados. La regla "sin escasez semanal" sigue vigente (spec §12).

- [ ] **Step 4: Commit final**

El working tree trae trabajo en curso de Epic 3 sin commitear. **Nunca uses `git add -A` ni
`git add .` en este repo** — nombra los archivos. Si esta tarea no tocó nada, no hay commit.

```bash
git add content/pricing.ts lib/pricing.ts components/landing/pricing/ components/landing/pricing-section.tsx
git commit -m "fix(pricing): accessibility and contrast pass on pricing section"
```

---

## Fuera de alcance de este plan

- **Mejorar las plantillas base** para bajar la entrega a 10–14 días (spec §11). Cuando pase, es cambiar `delivery` en `content/pricing.ts`.
- **Hospedar DeepSeek fuera de China** (spec §6, pendiente).
- **El chatbot IA en sí.** Este plan sólo vende el toggle; construir el bot es trabajo aparte, con su propio tope de tokens y corte automático.
- **Aviso de privacidad y contrato.** El spec define las cláusulas; redactarlas es tarea legal, no de este plan.
- **Cal.com para Profesional+.** Bloqueado por la cuenta del usuario, heredado del Epic 3.5.
