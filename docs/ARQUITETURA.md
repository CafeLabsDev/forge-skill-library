**[Leia em Português](ARQUITETURA.pt-br.md)**

# Architecture

Single-page Next.js (App Router) site, with locale routing via `next-intl`
(`/en`, `/pt`, English as the default locale — see "Internationalization" below). Outside
the locale prefix, there are no other routes — all content (hero, gallery, modal) is
assembled inside `src/app/[locale]/page.tsx`.

## Data flow: how the site fetches the agents

This is the most important part of the architecture: **agent content is not
maintained in this repository**. It lives in `agents/*.md` in the public
[`CafeLabsCorp/forge`](https://github.com/CafeLabsCorp/forge) repository (where the
actual agents are defined and maintained) and is fetched at build time by `src/lib/agents.ts`.

Mechanics (`getAgents()` in `src/lib/agents.ts`):

1. A fixed list, `AGENT_CONFIGS` (hardcoded in this repo), defines the agents — id,
   display number, subtitle ("role"), and the accent-color CSS variable. This
   list is presentation/ordering only; it isn't the agent's content, but it needs to be
   updated manually whenever an agent is added/removed in `forge`
   (this has happened once already: the `docs` agent was added to the `forge` roster without
   updating this list, leaving the "10 agents" count in the gallery header and
   hero copy stale — fixed on 2026-07-19 alongside replacing that hardcoded
   text with a dynamic count via `agents.length`, so it can't happen again).
2. For each agent, `fetchAgent()` does a direct `fetch()` against
   `https://raw.githubusercontent.com/CafeLabsCorp/forge/main/agents/<id>.md` — no
   repo clone, no token (the repo is public). This runs inside a Server Component
   (`page.tsx` is `async` and calls `getAgents()`), so Next.js statically renders
   the page against the state of the `forge` repo at the moment of the build/deploy.
3. The Markdown received is only parsed for its frontmatter (`name:` and `description:`,
   via a simple regex in `parseFrontmatter`) — the file's full body (frontmatter +
   prompt) is kept as raw `content`, which is exactly what shows up copyable in the
   modal.
4. Each fetch is isolated (`Promise.all` over `fetchAgent` per agent, each with its
   own try/catch): if one agent's fetch fails (network, 404, missing or malformed
   frontmatter), only that card becomes "Unavailable" — it doesn't take down the build
   or the whole page.
5. Regardless of the fetch outcome, each agent has a `ready` flag decided here in this repo
   (currently hardcoded for `orchestrator`, `product`, and `design` in
   `AGENT_CONFIGS`/`fetchAgent`) — it controls whether the card shows the "Soon" tag and
   whether the modal shows the full prompt or a "not yet designed" message. An agent can have
   `ready: true` and still show up as unavailable if the fetch fails at
   build time (`unavailable` is independent from `ready`).

**Practical implication**: renaming an agent, changing its path under `agents/`, or changing the
frontmatter format in the `forge` repo can break the fetch or drop the card to
"Unavailable" on this site, with nothing changing here. Since the fetch happens at
build time (not in the browser at runtime), updating an agent's content in the
`forge` repo only shows up here after a new build/deploy of this site — there is no
incremental revalidation configured (`next.config.ts` doesn't define `revalidate`/ISR;
TODO: confirm whether this is intentional or a gap to close once Forge updates
prompts more frequently).

## Routes and page composition

A single route per locale (`/[locale]`, `src/app/[locale]/page.tsx`), an `async`
Server Component:

1. Accessibility skip-link (`#gallery`).
2. `<MiniNav />` — fixed at the top, hidden until scroll passes the hero; includes the
   `LanguageSwitcher`.
3. `<header className="hero stars">` — `LanguageSwitcher` (top-right corner),
   animated `ForgeIcon` icon + "FORGE" wordmark (`.hero-mark`), subtitle, "View on
   GitHub" CTA (external link to the `forge` repo), and the scroll indicator (`.scroll-cue`,
   an anchor link to `#gallery`).
4. `<AgentGallery agents={agents} />` — card grid + modal (see below).
5. `<InstallSection />` — step-by-step instructions for installing the full Forge.
6. `<footer className="site-footer">`.

`src/app/[locale]/layout.tsx` sets the metadata (`title`/`description`, translated and with the
agent count via `getAgents()`), validates the URL's `locale` (`hasLocale` +
`notFound()`), wraps the tree in `NextIntlClientProvider`, and loads the display
font `Bebas_Neue` (`next/font/google`), applied exclusively to the "FORGE" wordmark
via the `--font-display` CSS var — never to body text or the prompt.

## Internationalization

`next-intl` with locale routing (`src/i18n/routing.ts`: locales `en`/`pt`, `en`
as default — English because of this site's international/technical audience,
unlike the sibling products, which prioritize Portuguese). `LanguageSwitcher`
(`components/LanguageSwitcher.tsx`) switches the locale while preserving the current route,
rendered both in the hero and in the `MiniNav`.

Only the page's "chrome" is translated (`messages/en.json`, `messages/pt.json`): hero, nav,
install steps, footer, card/modal microcopy (tags, aria-labels, state
messages). **Each agent's name, role, and description always stay in English**,
regardless of the active locale — they are technical content fetched by `src/lib/agents.ts` from the
public `forge` repo (see "Data flow" above), not page copy that this
site owns or should translate. The list of "ready" agent names shown in the modal
(`AgentModal.tsx`) uses `Intl.ListFormat` to produce the conjunction ("A, B and C" / "A, B e
C") correctly localized without hardcoding the connective.

## Components

- **`AgentGallery`** (`components/AgentGallery.tsx`, client component) — owns the
  `openAgent` state; renders the list of `AgentCard`s and the single shared `AgentModal`.
- **`AgentCard`** (`components/AgentCard.tsx`) — one card per agent: portrait (SVG "Face" if
  `ready`, or a generic `SeedGraph` otherwise), id, name, tag ("Soon"/"Unavailable"
  when applicable), role, and a description truncated to 2 lines. It's a `<button>` that opens the
  modal on click.
- **`AgentModal`** (`components/AgentModal.tsx`, client component) — the detail dialog.
  It stays mounted in the DOM at all times (visibility controlled by a `hidden`/`isOpen` state, not
  conditional mounting) to allow an open/close cross-fade; it implements
  initial focus on the close button, a Tab/Shift+Tab focus trap, and closing via Esc or
  a backdrop click. It shows the full prompt + `CopyButton` when `ready && content`
  exist; otherwise it shows a message explaining why not ("not yet
  designed" vs. "could not fetch from GitHub", with a direct link to the file on
  GitHub as a fallback).
- **`LanguageSwitcher`** (`components/LanguageSwitcher.tsx`, client component) — a button
  that switches to the other locale (`en`↔`pt`) while preserving the current route (`useRouter`/
  `usePathname` from `src/i18n/navigation.ts`).
- **`CopyButton`** (`components/CopyButton.tsx`) — copies the prompt via
  `navigator.clipboard`, with a cascading fallback: `document.execCommand("copy")` on a
  hidden textarea and, if that also fails, selecting the visible text for a manual Ctrl+C.
- **`figures.tsx`** — a shared system of SVG "figures" (node/edge graphs) that
  gives each ready agent (`orchestrator`, `product`, `design`) a hand-drawn
  portrait (a small "Face" version for the card, a full-body "Body" version for the modal), plus a
  deterministic generic `SeedGraph` (keyed by index, not random — avoiding a mismatch
  between server and client rendering) used for the agents that aren't ready yet. The
  graph coordinates were ported 1:1 from mockups validated outside the repo (noted in a comment
  at the top of the file); see `docs/DESIGN.md` for the visual logic behind them.

## Non-obvious technical decisions

- **Content lives outside the repo, on purpose.** Instead of duplicating the agent
  prompts on this site (which would require manually keeping two places in sync), the
  site always reflects the `forge` repo's `agents/*.md` as of build time — a deliberate
  trade-off: less duplication, but updating content here depends on a new
  deploy of this site (see above).
- **Partial failure, not total failure.** Per-agent isolation (`Promise.all` with
  individual try/catch) is an explicit choice so that a temporary GitHub raw content
  instability doesn't take down the whole page — it only degrades the affected card(s).
- **`ready` is a manual switch in this repo, not a property of the agent in the
  `forge` repo.** Today only 3 of the 11 agents are marked as ready; the others exist in
  Forge but don't yet have the visual treatment (a dedicated figure) nor have been "approved" to
  show the full prompt here.
