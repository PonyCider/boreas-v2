# Boreas Template Context Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give any AI agent that opens `boreas-template` (or a `boreas-<cliente>` repo cloned from it) enough context to understand the business and the product without needing the separate Boreas V3 repo — split into a public-safe `PRODUCT.md` and a gitignored confidential file, so nothing sensitive can leak through GitHub's template-duplication or a Plan A repo transfer to a client.

**Architecture:** Two new files in `boreas-template`: `PRODUCT.md` (tracked, product/voice/audience context) and `docs/internal/boreas-internal-context.md` (gitignored, condensed pricing/delivery-process context). The `.gitignore` entry for `docs/internal/` is added *before* the confidential file is created, so it never enters git history. `README.md` gets one added note about manually copying the gitignored file into new client clones. `docs/internal/boreas-master.md` in Boreas V3 gets a one-paragraph cross-reference note.

**Tech Stack:** Plain Markdown and `.gitignore` — no code, no tests to run beyond `git status`/`git check-ignore` verification.

## Global Constraints

- The `docs/internal/` gitignore entry MUST be added and committed before `boreas-internal-context.md` is created — order matters, a later `.gitignore` does not retroactively remove an already-committed file from history.
- `PRODUCT.md` must contain zero pricing, payment-plan amounts, sales scripts, or pipeline KPIs — those live only in the gitignored file and in Boreas V3's `docs/internal/boreas-master.md`.
- `boreas-internal-context.md` must contain zero cold-call scripts, objection handling, or sales-pipeline KPIs — only the payment-plan structure, the domain-payment rule, and the delivery-flow summary a coding agent might need.
- All new/edited files live in `/Users/ponycider/Documents/SaaS/boreas-template` except the last task, which edits `/Users/ponycider/Documents/SaaS/Boreas V3/docs/internal/boreas-master.md`.

---

### Task 1: Gitignore the confidential-context folder before it exists

**Files:**
- Modify: `/Users/ponycider/Documents/SaaS/boreas-template/.gitignore`

**Interfaces:**
- Produces: a gitignore rule that Task 3 depends on being in place *before* it creates the confidential file.

- [ ] **Step 1: Add the ignore rule**

Modify `/Users/ponycider/Documents/SaaS/boreas-template/.gitignore` — append this block at the end of the file:

```
# confidential business context — never track, never push, never travels with a client transfer
docs/internal/
```

- [ ] **Step 2: Verify the rule is recognized (even though the folder doesn't exist yet)**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
mkdir -p docs/internal
touch docs/internal/.gitkeep-test
git status --short docs/internal/
```

Expected: no output (empty) — confirms `docs/internal/` is ignored, since a tracked-but-ignored directory would otherwise show as untracked.

- [ ] **Step 3: Remove the throwaway test file**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
rm docs/internal/.gitkeep-test
```

(Leave the empty `docs/internal/` directory — Task 3 will populate it. Empty directories aren't tracked by git regardless, so nothing to commit yet.)

- [ ] **Step 4: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add .gitignore
git commit -m "chore: gitignore docs/internal/ before any confidential file exists there"
```

---

### Task 2: Create PRODUCT.md

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/PRODUCT.md`

**Interfaces:**
- Produces: a tracked file any future agent reads first for business/product context. No code interfaces — pure documentation.

- [ ] **Step 1: Write the file**

Create `/Users/ponycider/Documents/SaaS/boreas-template/PRODUCT.md`:

```markdown
# Boreas Template — Product Context

> Read this before writing any code in this repo (or in any `boreas-<cliente>` repo cloned from
> it). This file is safe to travel with the repo — including if it's ever transferred to a client
> — because it contains no pricing, sales process, or internal business metrics. That confidential
> context lives separately in `docs/internal/boreas-internal-context.md`, which is gitignored and
> only exists on Boreas's local machines (see that file's own header for why).

## What Boreas is

Boreas is a digital-presence agency for health professionals in Mexico. It doesn't sell "a
website" — it sells a **digital consultorio open 24/7** that filters, convinces, and books
patients automatically, so the professional (or their assistant) stops answering the same basic
questions over and over.

The audience is **health professionals broadly**, not only medical doctors: general and
specialist medicine, mental health/psychology, dentistry, and wellness/aesthetics.

## What this repo is

`boreas-template` is the base scaffold duplicated once per client, via GitHub's "Template
repository" feature — never a fork. Each duplicate (`boreas-<slug-consultorio>`) becomes one
specific professional's site.

## The 4 business categories (market reference, not yet an architecture)

These come from Boreas's own lead-scraping data and describe the market, not a code structure —
see the next section for why:

- **Medicina general y especialidades médicas** (~486 reference leads) — doctor, dermatólogo,
  cirujano plástico, cardiólogo, urólogo among the most frequent.
- **Salud mental y psicología** (~203) — psicólogo, psicoterapeuta, psiquiatra.
- **Odontología y cuidado dental** (~111) — dentista, clínica dental.
- **Bienestar, estética y cuidado personal** (~97) — nutriólogo, salón de belleza, spa médico.

## Category system — planned, not implemented

Each category is meant to eventually get its own "core idea": a distinct conversion mechanism
(a pre-triage quiz, a validated mental-health test like GAD-7/PHQ-9, a before/after simulator, a
metabolism calculator) and its own visual identity. **That system does not exist yet** — it's a
separate, larger project with its own design spec still to come.

**Until that spec exists, build every client site with the generic pattern already in this repo:**
hero section + WhatsApp CTA + secondary contact form (see `README.md` for the onboarding steps and
`components/` for the existing pattern). Do not invent category-specific structure on your own —
if a task asks for category/core-idea work before that spec exists, say so instead of guessing.

## Voice and copy rules

Carried over from Boreas's main business docs, unchanged:

- Spanish first. Clear before clever.
- Use words the professional and their patients actually recognize — no technical jargon as a
  hook.
- Never show public pricing. Never show weekly scarcity or "last slot" messaging — on Boreas's own
  marketing site or on any client site built from this template.
- Translate every technical term into the business outcome it produces, never sell the feature
  itself.

## Visual design — deferred

There are no brand color/typography tokens defined in this repo yet. Visual identity is decided
together with the category system above — possibly one identity per category rather than one
universal system. Today this repo uses plain Tailwind defaults with no branding applied.
```

- [ ] **Step 2: Verify it's tracked correctly**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git status --short PRODUCT.md
```

Expected: `?? PRODUCT.md` (untracked, ready to be added — NOT ignored, unlike `docs/internal/`).

- [ ] **Step 3: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add PRODUCT.md
git commit -m "docs: add PRODUCT.md with business/product context for AI agents"
```

---

### Task 3: Create the gitignored confidential context file

**Files:**
- Create: `/Users/ponycider/Documents/SaaS/boreas-template/docs/internal/boreas-internal-context.md`

**Interfaces:**
- Consumes: the `.gitignore` rule from Task 1 (must already be in place).
- Produces: a local-only file for any future Boreas agent working inside a client repo — never appears in git history or on GitHub.

- [ ] **Step 1: Write the file**

Create `/Users/ponycider/Documents/SaaS/boreas-template/docs/internal/boreas-internal-context.md`:

```markdown
# Boreas Internal Context (confidential — never commit)

> This file lives in `docs/internal/`, which is gitignored in this repo (see `.gitignore`). It
> exists so a Boreas-side agent working inside a client's repo has payment/delivery context
> without needing the separate Boreas V3 repo open. It is a **condensed, derived copy** of
> `docs/internal/boreas-master.md` in the Boreas V3 repo — if anything here conflicts with that
> file, `boreas-master.md` wins. This file does NOT contain cold-call scripts, objection handling,
> or sales-pipeline KPIs — that's sales-process information, not something a coding agent needs.

## Payment plans

**Plan A — pago único** ($10,000 or $15,000 MXN depending on complexity)
- Deposit minimum $2,000 MXN, remainder ($8,000 or $13,000) due at delivery.
- Optional add-on: 1 year warranty + maintenance, $500/month × 12, charged as a recurring Mercado
  Pago subscription (never MSI installments — MSI's extra ~12.89%+IVA fee eats margin and requires
  the client to have a full credit line available).
- GitHub repo + Vercel project are **transferred to the client** at delivery. Client administers
  everything from that point on.

**Plan B — pago reducido + mensualidad forzosa** ($5,000 or $8,000 MXN depending on complexity)
- Deposit minimum $2,000 MXN, remainder ($3,000 or $6,000) due at delivery, plus a forced 12-month
  subscription of $1,000/month (includes warranty + maintenance), same recurring-MP-subscription
  mechanism as Plan A's add-on.
- After year 1, optional renewal: $500/month × 12.
- Boreas **keeps** the GitHub repo and Vercel project — "administración total." The client is
  never given those credentials.
- Failed-payment policy (already live in Mercado Pago): 3 retry attempts at 2/5/7 days after the
  billing date; on day 10 with no successful charge, the subscription auto-pauses and Boreas pauses
  the client's Vercel project in parallel, offering reactivation or a prorated credential handoff.

**Domain — always the client's, no exception.** In both plans, the client purchases and owns their
own domain (Boreas only offers options/pricing for it). This never changes based on plan.

## Delivery flow summary

- 2 review rounds included in the price, regardless of plan.
- If WhatsApp text feedback isn't enough, escalate to a screen-share video call (Zoom, using its
  native screen-annotation feature) with a developer — this replaces the need for a 3rd round, it
  doesn't add one.
- Explicit client approval is required before merging to production and connecting the final
  domain — never assume approval from silence.
- Full delivery-workflow detail (stack, deploy environments, exact commit flow) lives in Boreas
  V3's `docs/superpowers/specs/2026-07-02-post-anticipo-delivery-workflow-design.md` — not
  duplicated here since it's implementation detail this file doesn't need to carry.

## Where the full picture lives

The complete business doc — sales scripts, objection handling, pipeline KPIs, full pricing
rationale — lives in `docs/internal/boreas-master.md` in the separate Boreas V3 repo. This file is
intentionally a subset: only what a coding agent inside a client repo needs, never the sales
process.
```

- [ ] **Step 2: Verify it is NOT tracked by git**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git status --short docs/internal/
git check-ignore -v docs/internal/boreas-internal-context.md
```

Expected: first command prints nothing (file is ignored, doesn't show as untracked). Second
command prints the `.gitignore` line and file path that causes it to be ignored (confirms the
rule from Task 1 is what's catching it).

- [ ] **Step 3: No commit for this step**

This file must never be committed — that's the entire point. Do not run `git add` on it. There is
nothing to commit for this task; Task 1's commit already covered the `.gitignore` rule that makes
this safe.

---

### Task 4: Note the manual-copy step in README.md

**Files:**
- Modify: `/Users/ponycider/Documents/SaaS/boreas-template/README.md`

**Interfaces:**
- Consumes: the existence of `docs/internal/boreas-internal-context.md` from Task 3.

- [ ] **Step 1: Add a note explaining the gitignored file doesn't travel automatically**

Modify `/Users/ponycider/Documents/SaaS/boreas-template/README.md` — add this section right after
the existing "## Onboarding de un cliente nuevo" numbered list (after step 5, before "## Stack"):

```markdown

**Nota sobre contexto confidencial:** este repo tiene un archivo gitignoreado en
`docs/internal/boreas-internal-context.md` (precios, esquemas de pago, resumen de entrega) que
**no se propaga automáticamente** al clonar vía "Template repository" de GitHub — esa función solo
copia contenido trackeado por git. Si quieres tenerlo disponible en el repo de un cliente nuevo,
cópialo manualmente después de duplicar el repo.
```

- [ ] **Step 2: Verify the file renders as valid markdown**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
cat README.md
```

Expected: the new note appears between the onboarding list and the "## Stack" heading, no broken
formatting.

- [ ] **Step 3: Commit**

```bash
cd /Users/ponycider/Documents/SaaS/boreas-template
git add README.md
git commit -m "docs: note that the gitignored confidential context file must be copied manually per client clone"
```

---

### Task 5: Cross-reference note in Boreas V3's master doc

**Files:**
- Modify: `/Users/ponycider/Documents/SaaS/Boreas V3/docs/internal/boreas-master.md:307-322` (the
  "## 9. Operaciones y tecnología" section)

**Interfaces:**
- None — documentation only, no code interfaces.

- [ ] **Step 1: Add the cross-reference note**

Modify `/Users/ponycider/Documents/SaaS/Boreas V3/docs/internal/boreas-master.md` — find this
existing line near the end of the "## 9. Operaciones y tecnología" section:

```markdown
- **Leads propios de Boreas** (Boreas.com): ya persisten en Supabase + notifican por WhatsApp vía
  CallMeBot (`app/actions/submit-contact.ts`) — implementado, no es mock.
```

Add this new bullet immediately after it:

```markdown
- **Contexto operativo en cada repo de cliente:** una versión condensada de este documento
  (esquemas de pago, regla de dominio, resumen del flujo de entrega — sin scripts de venta ni
  KPIs de pipeline) vive gitignoreada en `docs/internal/boreas-internal-context.md` dentro de
  `boreas-template` y de cada `boreas-<cliente>` clonado de él. Es una copia derivada, no una
  segunda fuente de verdad — si hay discrepancia, gana este documento.
```

- [ ] **Step 2: Verify the edit landed correctly**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3"
grep -n "Contexto operativo en cada repo de cliente" docs/internal/boreas-master.md
```

Expected: one match, inside the "## 9. Operaciones y tecnología" section.

- [ ] **Step 3: Commit**

```bash
cd "/Users/ponycider/Documents/SaaS/Boreas V3"
git add docs/internal/boreas-master.md
git commit -m "docs: cross-reference the gitignored per-client context file from the master doc"
```

---

## Self-Review Notes

- **Spec coverage:** §3 (PRODUCT.md content) → Task 2. §4 (confidential file content) → Task 3.
  §5 (gitignore-first ordering, no auto-propagation) → Task 1 (ordering) + Task 4 (README note).
  §6 (Boreas V3 cross-reference) → Task 5. §2 (why two documents) is the rationale behind Tasks
  1-3's structure, not a separate deliverable. §7 (out of scope) has no task — correctly excluded.
- **Placeholder scan:** no TBD/TODO; every step has exact file content or exact commands.
- **Type consistency:** N/A — no code, no function signatures across tasks.
- **Ordering dependency:** Task 1 must run before Task 3 (gitignore before the file exists) —
  encoded as an explicit constraint and as the task order itself.
