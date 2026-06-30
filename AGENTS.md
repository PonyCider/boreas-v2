<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Active Add-ons

Use these project-local instructions when they fit the task:

- `caveman` in [`skills/caveman/SKILL.md`](./skills/caveman/SKILL.md) for terse, high-signal replies. Keep `caveman lite` as the default communication style in this repo.
- `design-taste-frontend` in [`skills/design-taste-frontend/SKILL.md`](./skills/design-taste-frontend/SKILL.md) for landing pages, redesigns, and any work that needs a stronger visual point of view.
- `frontend-design` in [`skills/frontend-design/SKILL.md`](./skills/frontend-design/SKILL.md) for distinctive UI direction, typography, motion, and layout choices.
- `impeccable` via [`PRODUCT.md`](./PRODUCT.md) and [`DESIGN.md`](./DESIGN.md) for product context and design-system rules.

**Start with [`GUIDELINES.md`](./GUIDELINES.md) — it is the single source of truth** (business, voice, design system, conversion rules, tech architecture, do/don'ts, known backlog). It points to [`PRODUCT.md`](./PRODUCT.md) and [`DESIGN.md`](./DESIGN.md) for detail. If docs conflict, `GUIDELINES.md` wins. For any UI or landing-page work, read all three before editing code.

## gstack

Global installation via `~/.claude/skills/gstack`. Use `/browse` skill for all web browsing — never use `mcp__claude-in-chrome__*` tools.

Available skills:
- `/office-hours`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/browse`, `/connect-chrome`, `/qa`, `/qa-only`, `/design-review`, `/setup-browser-cookies`, `/setup-deploy`, `/setup-gbrain`, `/retro`, `/investigate`, `/document-release`, `/document-generate`, `/codex`, `/cso`, `/autoplan`, `/plan-devex-review`, `/devex-review`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/gstack-upgrade`, `/learn`
