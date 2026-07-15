<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Active Add-ons

Use these project-local instructions when they fit the task:

- `caveman` in [`skills/caveman/SKILL.md`](./skills/caveman/SKILL.md) for terse, high-signal replies. Default communication style in this repo is `caveman full` (enforced by a global hook in Claude Code; this repo copy exists for other agent CLIs like Gemini — in Claude Code the caveman plugin/hook wins over the repo copy).
- `design-taste-frontend` in [`skills/design-taste-frontend/SKILL.md`](./skills/design-taste-frontend/SKILL.md) for landing pages, redesigns, and any work that needs a stronger visual point of view.
- `frontend-design` in [`skills/frontend-design/SKILL.md`](./skills/frontend-design/SKILL.md) for distinctive UI direction, typography, motion, and layout choices.
- `framer-motion` in [`skills/framer-motion/SKILL.md`](./skills/framer-motion/SKILL.md) for scroll-linked/pinned motion and general framer-motion implementation patterns — read the "Boreas project overrides" section at the bottom first (project's `framer-motion` package name and no-spring/ease-out-exponential rules win over the imported upstream content).
- `impeccable` via [`PRODUCT.md`](./PRODUCT.md) and [`DESIGN.md`](./DESIGN.md) for product context and design-system rules.

**Start with [`GUIDELINES.md`](./GUIDELINES.md) — it is the single source of truth** (business, voice, design system, conversion rules, tech architecture, do/don'ts, known backlog). It points to [`PRODUCT.md`](./PRODUCT.md) and [`DESIGN.md`](./DESIGN.md) for detail. If docs conflict, `GUIDELINES.md` wins. For any UI or landing-page work, read all three before editing code.

## Project facts (verified against the repo — keep in sync)

- **Stack:** Next.js 16 App Router · React 19 · Tailwind v4 · framer-motion · Supabase. Fonts: Newsreader + Figtree via `next/font/google` (Satoshi retired — do not reintroduce).
- **Commands:** `npm run dev` (port 3000), `npm run build`, `npm run lint`. There is no test suite.
- **Do NOT touch:** `.next/`, `node_modules/`, `tsconfig.tsbuildinfo` (build outputs); `docs/internal/` (confidential — pricing, scripts, KPIs; never quote it in public-facing copy or commits).
- **Real side effects:** `app/actions/submit-contact.ts` persists leads to Supabase and sends a WhatsApp notification via CallMeBot — it is NOT a mock. Don't submit the form casually while testing.
- **Historical docs:** everything under `docs/superpowers/` and `docs/product/deprecated/` is a point-in-time record. Status fields there may be stale — the code is the truth. Never re-implement something from an old plan/spec without checking the current code and `GUIDELINES.md` §7 backlog first.

## gstack

Global installation via `~/.claude/skills/gstack`. Use `/browse` skill for all web browsing — never use `mcp__claude-in-chrome__*` tools. Routing rules live in `CLAUDE.md`.
