# Forge Skill Library

Public gallery site for the [Forge](https://github.com/CafeLabsDev/forge) multi-agent
system: a full-viewport hero followed by a grid of agent cards, each opening a modal
with the agent's description and a one-click "copy prompt" button. The agent content
itself is not authored here — at build time the site fetches each agent's Markdown
definition straight from the public `CafeLabsDev/forge` repo, so this site is a
presentation layer, not the source of truth for the agents.

Built by [Café Labs](https://cafelabs.net); deployed at
[forge.cafelabs.net](https://forge.cafelabs.net).

## Tech stack

| Layer      | Choice                                          |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 16 (App Router), React 19, TypeScript     |
| Styling    | Plain CSS (`src/app/globals.css`) + Tailwind CSS v4 import (utility classes not currently used in markup — see `docs/ARQUITETURA.md`) |
| Content    | Fetched at build time from `raw.githubusercontent.com/CafeLabsDev/forge` (no clone, no auth token — the source repo is public) |
| Font       | `Bebas_Neue` via `next/font/google`, scoped to the "FORGE" wordmark only |
| Hosting    | Vercel, custom domain `forge.cafelabs.net`        |
| Lint       | ESLint (`eslint-config-next`)                     |

## Prerequisites

- Node.js 20+ (developed against v20.20.1 — no `engines` field pins this yet, see
  `docs/DEPLOY.md`).
- No environment variables and no secrets: the GitHub fetch at build time hits public,
  unauthenticated raw-content URLs.

## Running locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:3000`. Because content is fetched at build/request time from
the public Forge repo, you need network access to `raw.githubusercontent.com` for the
gallery to populate; if a fetch fails, that one agent's card degrades to an
"Unavailable" state instead of breaking the page (see `docs/ARQUITETURA.md`).

Other scripts:

```bash
npm run build   # production build (also fetches agent content fresh)
npm run start   # serve the production build
npm run lint    # eslint
```

## Folder structure

```
src/
  app/
    layout.tsx      # root layout, metadata, display font
    page.tsx         # hero + gallery + footer composition
    globals.css      # design tokens, hero/gallery/card/modal/figure styles
  components/
    AgentGallery.tsx  # client component: grid + modal open/close state
    AgentCard.tsx     # one badge card (photo, name, role, description)
    AgentModal.tsx     # detail dialog: full description + prompt + copy
    CopyButton.tsx      # clipboard copy with execCommand/manual-select fallback
    figures.tsx          # shared SVG "figure grammar" (per-agent portraits)
  lib/
    agents.ts        # build-time fetch of agents/*.md from CafeLabsDev/forge
```

## Docs

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — how the site is put together: routes,
  components, and exactly how/when it talks to the public Forge repo.
- [`docs/DESIGN.md`](docs/DESIGN.md) — visual identity: palette, typography, the
  per-agent SVG figure system.
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — how it ships to `forge.cafelabs.net`.
