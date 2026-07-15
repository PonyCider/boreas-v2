# Boreas V3

Landing page de Boreas: consultorios digitales para médicos privados en México.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · framer-motion · Supabase (leads). Fuentes: Newsreader + Figtree vía `next/font/google`.

## Desarrollo

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

Variables de entorno: copia `.env.local.example` a `.env.local` (Supabase + CallMeBot). El form de contacto persiste leads reales y notifica por WhatsApp — no es mock.

## Documentación

- [`GUIDELINES.md`](./GUIDELINES.md) — **fuente única de verdad**: negocio, voz, diseño, conversión, arquitectura, backlog.
- [`PRODUCT.md`](./PRODUCT.md) / [`DESIGN.md`](./DESIGN.md) — detalle de producto y sistema visual.
- [`AGENTS.md`](./AGENTS.md) / [`CLAUDE.md`](./CLAUDE.md) — reglas para agentes de IA.
- `docs/internal/` — confidencial, no citar en contenido público.
- `docs/superpowers/` — planes y specs históricos; el código es la verdad.
