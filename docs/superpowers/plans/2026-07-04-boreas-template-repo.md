# Boreas Template Repo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up `boreas-template`, the reusable Next.js scaffold that gets duplicated (via GitHub "template repository") for every new client consultorio, with the core conversion pattern (WhatsApp deep-link CTA + secondary contact form → Supabase → Resend email) working end to end.

**Architecture:** Next.js App Router + TypeScript + Tailwind, single typed content file per client (`content/site.ts`), no CMS/database for content. One shared-pattern Supabase table for leads (tagged by `cliente_slug`) and Resend for lead-notification email — both wired through one Server Action.

**Tech Stack:** Next.js (latest via `create-next-app`), TypeScript, Tailwind CSS, `@supabase/supabase-js`, `resend`, Vitest (unit tests), zod (input validation).

## Global Constraints

- Content lives in one file, `content/site.ts` — never hardcode business copy in components (per `docs/internal/boreas-master.md` §9 and the design spec `docs/superpowers/specs/2026-07-02-post-anticipo-delivery-workflow-design.md` §4).
- No CMS, no admin panel — Boreas maintains client sites via code edits.
- Primary CTA is a `wa.me` deep link — zero backend dependency for the main conversion path.
- Secondary contact form persists to a **shared** Supabase project (not one per client) — every insert must carry a `cliente_slug` column value.
- Lead notification goes out by **email via Resend**, never a WhatsApp bot (CallMeBot is explicitly out of scope for client sites — see master doc §9).
- New repo lives at `/Users/ponycider/Documents/SaaS/boreas-template`, its own git history, independent from Boreas V3.

---

### Task 1: Scaffold the Next.js project

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/` (entire `create-next-app` output)
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/vitest.config.ts`
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/vitest.setup.ts`
- Modify: `/Users/ponycider/Documents/SaaS/boreas-template/package.json` (add `test` script + dev deps)

**Interfaces:**
- Produces: a runnable Next.js App Router project at that path, with `npm test` wired to Vitest.

- [ ] **Step 1: Run create-next-app**

```bash
cd /Users/ponycider/Documents/SaaS
npx create-next-app@latest boreas-template --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*" --use-npm
```

When prompted, accept defaults (App Router: yes, Turbopack: yes if offered).

- [ ] **Step 2: Verify it builds and runs**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm run build
```

Expected: build completes with no errors, prints a route summary (`/` as a static route).

- [ ] **Step 3: Install test + backend dependencies**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm install @supabase/supabase-js resend zod
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom
```

- [ ] **Step 4: Add Vitest config**

Create `/Users/ponycider/Documents/SaaS/boreas-template/vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

Create `/Users/ponycider/Documents/SaaS/boreas-template/vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 5: Add the test script**

Modify `package.json` — add to the `"scripts"` block:

```json
"test": "vitest run"
```

- [ ] **Step 6: Verify Vitest runs with zero tests**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test
```

Expected: `No test files found` (exit code may be non-zero — that's expected, there are no test files yet; this step just confirms the runner itself launches without config errors).

- [ ] **Step 7: Init git and commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git init
git add -A
git commit -m "chore: scaffold boreas-template Next.js project with Vitest"
```

---

### Task 2: Content model + WhatsApp CTA link builder

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/content/site.ts`
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/lib/whatsapp.ts`
- Test: `/Users/ponycider/Documents/SaaS/boreas-template/lib/whatsapp.test.ts`

**Interfaces:**
- Produces: `SiteContent` type and `siteContent` object (consumed by Task 3's hero component); `buildWhatsAppLink(phone: string, message: string): string` (consumed by Task 3).

- [ ] **Step 1: Write the failing test for the WhatsApp link builder**

Create `/Users/ponycider/Documents/SaaS/boreas-template/lib/whatsapp.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildWhatsAppLink } from "./whatsapp";

describe("buildWhatsAppLink", () => {
  it("builds a wa.me link with URL-encoded message", () => {
    const link = buildWhatsAppLink("+525512345678", "Hola, quiero agendar una cita");
    expect(link).toBe(
      "https://wa.me/525512345678?text=Hola%2C%20quiero%20agendar%20una%20cita",
    );
  });

  it("strips non-digit characters from the phone number except the leading +", () => {
    const link = buildWhatsAppLink("+52 (55) 1234-5678", "Hola");
    expect(link).toBe("https://wa.me/525512345678?text=Hola");
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- lib/whatsapp.test.ts
```

Expected: FAIL — `Cannot find module './whatsapp'`.

- [ ] **Step 3: Implement the link builder**

Create `/Users/ponycider/Documents/SaaS/boreas-template/lib/whatsapp.ts`:

```ts
export function buildWhatsAppLink(phone: string, message: string): string {
  const digitsOnly = phone.replace(/[^\d]/g, "");
  const encodedMessage = encodeURIComponent(message).replace(/%20/g, "%20");
  return `https://wa.me/${digitsOnly}?text=${encodedMessage}`;
}
```

- [ ] **Step 4: Run the test and verify it passes**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- lib/whatsapp.test.ts
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Create the content model**

Create `/Users/ponycider/Documents/SaaS/boreas-template/content/site.ts`:

```ts
export type SiteContent = {
  clienteSlug: string;
  consultorio: {
    nombre: string;
    especialidad: string;
    whatsapp: string;
    ciudad: string;
  };
  hero: {
    heading: string;
    subheading: string;
    ctaMessage: string;
  };
  servicios: Array<{
    nombre: string;
    descripcion: string;
  }>;
  faq: Array<{
    pregunta: string;
    respuesta: string;
  }>;
};

export const siteContent: SiteContent = {
  clienteSlug: "demo-consultorio",
  consultorio: {
    nombre: "Consultorio Demo",
    especialidad: "Medicina General",
    whatsapp: "+525512345678",
    ciudad: "Ciudad de México",
  },
  hero: {
    heading: "Su consultorio digital, abierto las 24 horas.",
    subheading: "Agende con confianza — respondemos por WhatsApp.",
    ctaMessage: "Hola, quiero agendar una cita",
  },
  servicios: [
    { nombre: "Consulta general", descripcion: "Valoración y seguimiento." },
  ],
  faq: [
    {
      pregunta: "¿Cómo agendo una cita?",
      respuesta: "Escríbanos por WhatsApp con el botón de arriba.",
    },
  ],
};
```

- [ ] **Step 6: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add lib/whatsapp.ts lib/whatsapp.test.ts content/site.ts
git commit -m "feat: add content model and WhatsApp CTA link builder"
```

---

### Task 3: Hero section wired to the content model and WhatsApp CTA

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/components/hero-section.tsx`
- Test: `/Users/ponycider/Documents/SaaS/boreas-template/components/hero-section.test.tsx`
- Modify: `/Users/ponycider/Documents/SaaS/boreas-template/app/page.tsx`

**Interfaces:**
- Consumes: `siteContent` from `content/site.ts` (Task 2), `buildWhatsAppLink` from `lib/whatsapp.ts` (Task 2).
- Produces: `HeroSection` component (default export), rendered in `app/page.tsx`.

- [ ] **Step 1: Write the failing test**

Create `/Users/ponycider/Documents/SaaS/boreas-template/components/hero-section.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { HeroSection } from "./hero-section";

describe("HeroSection", () => {
  it("renders the heading from content and a WhatsApp CTA link", () => {
    render(<HeroSection />);
    expect(
      screen.getByText("Su consultorio digital, abierto las 24 horas."),
    ).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /agendar por whatsapp/i });
    expect(cta).toHaveAttribute(
      "href",
      "https://wa.me/525512345678?text=Hola%2C%20quiero%20agendar%20una%20cita",
    );
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- components/hero-section.test.tsx
```

Expected: FAIL — `Cannot find module './hero-section'`.

- [ ] **Step 3: Implement the component**

Create `/Users/ponycider/Documents/SaaS/boreas-template/components/hero-section.tsx`:

```tsx
import { siteContent } from "@/content/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function HeroSection() {
  const ctaLink = buildWhatsAppLink(
    siteContent.consultorio.whatsapp,
    siteContent.hero.ctaMessage,
  );

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 text-center">
      <h1 className="text-4xl font-semibold tracking-tight">
        {siteContent.hero.heading}
      </h1>
      <p className="mt-4 text-lg text-neutral-600">
        {siteContent.hero.subheading}
      </p>
      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-block rounded-md bg-green-600 px-6 py-3 font-medium text-white"
      >
        Agendar por WhatsApp
      </a>
    </section>
  );
}
```

- [ ] **Step 4: Run the test and verify it passes**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- components/hero-section.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Wire it into the page**

Modify `/Users/ponycider/Documents/SaaS/boreas-template/app/page.tsx` — replace the entire file contents with:

```tsx
import { HeroSection } from "@/components/hero-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
}
```

- [ ] **Step 6: Verify the build still passes**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add components/hero-section.tsx components/hero-section.test.tsx app/page.tsx
git commit -m "feat: add hero section with WhatsApp CTA"
```

---

### Task 4: Supabase leads table + client setup

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/supabase/migrations/0001_create_leads.sql`
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/lib/supabase.ts`
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/.env.local.example`

**Interfaces:**
- Produces: `supabase` client instance (exported from `lib/supabase.ts`), a `leads` table with columns `id, cliente_slug, nombre, whatsapp, mensaje, created_at`. Consumed by Task 5's Server Action.

- [ ] **Step 1: Write the migration SQL**

Create `/Users/ponycider/Documents/SaaS/boreas-template/supabase/migrations/0001_create_leads.sql`:

```sql
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  cliente_slug text not null,
  nombre text not null,
  whatsapp text not null,
  mensaje text,
  created_at timestamptz not null default now()
);

create index if not exists leads_cliente_slug_idx on public.leads (cliente_slug);
```

*This is one shared table across every client site — `cliente_slug` is what distinguishes leads per consultorio. Run this once against the shared Supabase project (not once per client).*

- [ ] **Step 2: Create the Supabase client wrapper**

Create `/Users/ponycider/Documents/SaaS/boreas-template/lib/supabase.ts`:

```ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

- [ ] **Step 3: Document the required env vars**

Create `/Users/ponycider/Documents/SaaS/boreas-template/.env.local.example`:

```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
NOTIFY_EMAIL_TO=
```

- [ ] **Step 4: Verify the project still builds**

`lib/supabase.ts` throws at import time if env vars are missing, which would break the build if imported eagerly anywhere. Confirm it is not yet imported by any page/component:

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
grep -r "from \"@/lib/supabase\"" app components || echo "not yet imported — safe"
```

Expected: `not yet imported — safe` (Task 5 will import it inside a Server Action, which only runs at request time, not build time).

- [ ] **Step 5: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add supabase/migrations/0001_create_leads.sql lib/supabase.ts .env.local.example
git commit -m "feat: add shared leads table migration and Supabase client"
```

---

### Task 5: Contact form Server Action — persist lead + notify by email

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/lib/resend.ts`
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/app/actions/submit-lead.ts`
- Test: `/Users/ponycider/Documents/SaaS/boreas-template/app/actions/submit-lead.test.ts`

**Interfaces:**
- Consumes: `supabase` from `lib/supabase.ts` (Task 4), `siteContent` from `content/site.ts` (Task 2).
- Produces: `submitLead(_prevState: LeadFormState, formData: FormData): Promise<LeadFormState>`, `LeadFormState = { success?: boolean; error?: string }` — consumed by Task 6's contact form component.

- [ ] **Step 1: Create the Resend client wrapper**

Create `/Users/ponycider/Documents/SaaS/boreas-template/lib/resend.ts`:

```ts
import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;

export const resend = apiKey ? new Resend(apiKey) : null;
```

*Returns `null` when the key is unset (e.g. in preview environments) instead of throwing — matches the pattern already used for CallMeBot in Boreas V3's own `submit-contact.ts`, where a missing credential means "skip notification silently," not "crash."*

- [ ] **Step 2: Write the failing test for the Server Action**

Create `/Users/ponycider/Documents/SaaS/boreas-template/app/actions/submit-lead.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";

const insertMock = vi.fn().mockResolvedValue({ error: null });
const sendMock = vi.fn().mockResolvedValue({ data: {}, error: null });

vi.mock("@/lib/supabase", () => ({
  supabase: { from: () => ({ insert: insertMock }) },
}));

vi.mock("@/lib/resend", () => ({
  resend: { emails: { send: sendMock } },
}));

import { submitLead } from "./submit-lead";

describe("submitLead", () => {
  beforeEach(() => {
    insertMock.mockClear();
    sendMock.mockClear();
  });

  it("returns an error when required fields are missing", async () => {
    const formData = new FormData();
    formData.set("nombre", "");
    formData.set("whatsapp", "");

    const result = await submitLead({}, formData);

    expect(result).toEqual({
      success: false,
      error: "Por favor, completa los campos requeridos.",
    });
    expect(insertMock).not.toHaveBeenCalled();
  });

  it("persists the lead with cliente_slug and sends a notification email", async () => {
    const formData = new FormData();
    formData.set("nombre", "Juan Pérez");
    formData.set("whatsapp", "5512345678");
    formData.set("mensaje", "Quisiera información");

    const result = await submitLead({}, formData);

    expect(result).toEqual({ success: true });
    expect(insertMock).toHaveBeenCalledWith({
      cliente_slug: "demo-consultorio",
      nombre: "Juan Pérez",
      whatsapp: "5512345678",
      mensaje: "Quisiera información",
    });
    expect(sendMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 3: Run the test and verify it fails**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- app/actions/submit-lead.test.ts
```

Expected: FAIL — `Cannot find module './submit-lead'`.

- [ ] **Step 4: Implement the Server Action**

Create `/Users/ponycider/Documents/SaaS/boreas-template/app/actions/submit-lead.ts`:

```ts
"use server";

import { supabase } from "@/lib/supabase";
import { resend } from "@/lib/resend";
import { siteContent } from "@/content/site";

export type LeadFormState = {
  success?: boolean;
  error?: string;
};

export async function submitLead(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const whatsapp = String(formData.get("whatsapp") ?? "").trim();
  const mensaje = String(formData.get("mensaje") ?? "").trim() || undefined;

  if (!nombre || !whatsapp) {
    return { success: false, error: "Por favor, completa los campos requeridos." };
  }

  const { error } = await supabase.from("leads").insert({
    cliente_slug: siteContent.clienteSlug,
    nombre,
    whatsapp,
    mensaje,
  });

  if (error) {
    return { success: false, error: "Ocurrió un error al guardar tus datos. Intenta de nuevo." };
  }

  if (resend) {
    const notifyTo = process.env.NOTIFY_EMAIL_TO;
    if (notifyTo) {
      resend.emails
        .send({
          from: "Boreas <leads@boreas.mx>",
          to: notifyTo,
          subject: `Nuevo paciente interesado — ${siteContent.consultorio.nombre}`,
          text: `Nombre: ${nombre}\nWhatsApp: ${whatsapp}\nMensaje: ${mensaje ?? "(sin mensaje)"}`,
        })
        .catch(() => {
          // Fire-and-forget — the lead is already saved even if the email fails.
        });
    }
  }

  return { success: true };
}
```

- [ ] **Step 5: Run the test and verify it passes**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- app/actions/submit-lead.test.ts
```

Expected: PASS, 2 tests.

- [ ] **Step 6: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add lib/resend.ts app/actions/submit-lead.ts app/actions/submit-lead.test.ts
git commit -m "feat: add lead Server Action persisting to Supabase and notifying via Resend"
```

---

### Task 6: Contact form section wired to the Server Action

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/components/contact-form-section.tsx`
- Test: `/Users/ponycider/Documents/SaaS/boreas-template/components/contact-form-section.test.tsx`
- Modify: `/Users/ponycider/Documents/SaaS/boreas-template/app/page.tsx`

**Interfaces:**
- Consumes: `submitLead` and `LeadFormState` from `app/actions/submit-lead.ts` (Task 5).
- Produces: `ContactFormSection` component (default export), rendered in `app/page.tsx` below `HeroSection`.

- [ ] **Step 1: Write the failing test**

Create `/Users/ponycider/Documents/SaaS/boreas-template/components/contact-form-section.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ContactFormSection } from "./contact-form-section";

describe("ContactFormSection", () => {
  it("renders required name and WhatsApp fields and a submit button", () => {
    render(<ContactFormSection />);
    expect(screen.getByLabelText(/nombre/i)).toBeRequired();
    expect(screen.getByLabelText(/whatsapp/i)).toBeRequired();
    expect(
      screen.getByRole("button", { name: /enviar/i }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify it fails**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- components/contact-form-section.test.tsx
```

Expected: FAIL — `Cannot find module './contact-form-section'`.

- [ ] **Step 3: Implement the component**

Create `/Users/ponycider/Documents/SaaS/boreas-template/components/contact-form-section.tsx`:

```tsx
"use client";

import { useActionState } from "react";
import { submitLead, type LeadFormState } from "@/app/actions/submit-lead";

const initialState: LeadFormState = {};

export function ContactFormSection() {
  const [state, formAction] = useActionState(submitLead, initialState);

  if (state.success) {
    return (
      <section className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-lg font-medium">
          Gracias — le escribiremos pronto.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-md px-6 py-16">
      <form action={formAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1">
          Nombre
          <input name="nombre" required className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1">
          WhatsApp
          <input name="whatsapp" required className="rounded border px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1">
          Mensaje (opcional)
          <textarea name="mensaje" className="rounded border px-3 py-2" />
        </label>
        {state.error && <p className="text-red-600">{state.error}</p>}
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-6 py-3 font-medium text-white"
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
```

- [ ] **Step 4: Run the test and verify it passes**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test -- components/contact-form-section.test.tsx
```

Expected: PASS, 1 test.

- [ ] **Step 5: Wire it into the page**

Modify `/Users/ponycider/Documents/SaaS/boreas-template/app/page.tsx` — replace the entire file contents with:

```tsx
import { HeroSection } from "@/components/hero-section";
import { ContactFormSection } from "@/components/contact-form-section";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ContactFormSection />
    </main>
  );
}
```

- [ ] **Step 6: Run the full test suite**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm test
```

Expected: PASS, all 6 tests across the 4 test files.

- [ ] **Step 7: Verify the production build**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
npm run build
```

Expected: build completes with no errors.

- [ ] **Step 8: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add components/contact-form-section.tsx components/contact-form-section.test.tsx app/page.tsx
git commit -m "feat: add contact form section wired to the lead Server Action"
```

---

### Task 7: README for future clone-and-customize workflow

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/README.md`

**Interfaces:**
- None — documentation only.

- [ ] **Step 1: Write the README**

Create `/Users/ponycider/Documents/SaaS/boreas-template/README.md`:

```markdown
# boreas-template

Plantilla base para sitios de cliente de Boreas. Cada consultorio nuevo se crea
duplicando este repo vía la función "Template repository" de GitHub, nunca
haciendo fork.

## Onboarding de un cliente nuevo

1. Duplicar este repo como `boreas-<slug-consultorio>`.
2. Editar `content/site.ts` con los datos reales del cliente (viene del
   formulario interno que llena el closer tras transcribir el audio de
   WhatsApp — ver `docs/internal/boreas-master.md` §6.4 en el repo Boreas V3).
3. Copiar `.env.local.example` a `.env.local` y llenar `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `NOTIFY_EMAIL_TO` (con el
   correo del doctor, para las notificaciones de lead).
4. Conectar el repo a un nuevo proyecto de Vercel (Pro, no Hobby).
5. Desarrollar en una rama `preview` — nunca en `main` directo — hasta tener
   aprobación explícita del cliente.

## Stack

Next.js (App Router) + TypeScript + Tailwind + Supabase (leads compartidos,
tabla `leads` con columna `cliente_slug`) + Resend (notificación por email).

## Tests

```bash
npm test
```
```

- [ ] **Step 2: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add README.md
git commit -m "docs: add onboarding README for cloning this template per client"
```

---

## Self-Review Notes

- **Spec coverage:** repo plantilla (§4 del design spec) → Tasks 1-3, 7. CTA `wa.me` sin backend (§4) → Task 3. Form secundario a Supabase compartido con `cliente_slug` (§4) → Task 4-6. Notificación por email vía Resend, no bot (§4.2) → Task 5. Todo lo demás del spec (Vercel Pro, dominio, revisión Zoom, entrega, pricing) es manual/proceso, no código — documentado en `docs/internal/boreas-master.md`, fuera del alcance de este plan.
- **Placeholder scan:** ningún TODO/TBD — cada paso trae código completo y comandos exactos.
- **Type consistency:** `LeadFormState` definido en Task 5, reusado sin cambios en Task 6. `SiteContent`/`siteContent` definidos en Task 2, consumidos sin cambios en Tasks 3 y 5.
