**[Leia em Português](DESIGN.pt-br.md)**

# Design

There is no visual identity name coined separately from the "FORGE" brand itself
(unlike, for example, Domo's "Armário Aberto") — the "FORGE" wordmark and the
"constellation"/dark graph aesthetic described below are the identity.
`TODO: confirm` if a dedicated name is ever adopted for this visual.

## Palette

Single, dark theme (`color-scheme: dark` on `:root`, `src/app/globals.css`) — there is no
light variant.

### Surfaces and text

| Token           | Value                   | Use                                   |
| --------------- | ------------------------ | -------------------------------------- |
| `--bg`          | `#0a0b0d`                 | page background                        |
| `--bg-raised`   | `#121418`                 | elevated element background (card photo, close button) |
| `--bg-panel`    | `#16191e`                 | panels (card, modal, toolbar)         |
| `--border`      | `rgba(255,255,255,0.09)`  | default borders                          |
| `--border-strong` | `rgba(255,255,255,0.18)` | higher-contrast borders             |
| `--text`        | `#f3f1ea`                 | primary text                        |
| `--text-dim`    | `#a2a8b3`                 | secondary text                       |
| `--text-faint`  | `#6b7280`                 | tertiary text (ids, uppercase labels) |

### Per-agent accent color

Each agent has its own accent color, stored as an HSL triplet (without the
`hsl()` function) so it can be composed with opacity via `hsl(var(--x) / <alpha>)`:

| Agent          | CSS var             | HSL              |
| -------------- | -------------------- | ----------------- |
| Orchestrator   | `--orchestrator`      | `38 85% 58%` (amber) |
| Product        | `--product`           | `165 60% 48%` (teal) |
| Design         | `--design`             | `320 68% 62%` (magenta) |
| Mobile         | `--mobile`             | `145 52% 48%` (green) |
| Backend        | `--backend`            | `250 58% 66%` (blue-violet) |
| Frontend Web   | `--frontend-web`       | `200 75% 58%` (cyan-blue) |
| DevOps         | `--devops`             | `220 14% 62%` (blue-gray) |
| QA             | `--qa`                 | `15 78% 56%` (red-orange) |
| Security       | `--security`           | `355 62% 50%` (red) |
| Analytics      | `--analytics`          | `275 58% 66%` (purple) |
| Docs           | `--docs`               | `100 38% 52%` (sage green) |

These colors become `--card-accent` (defined inline per component, never hardcoded in
CSS) and drive: the card's border/glow on hover/focus, the "role" color on the card and modal,
the copy button's background, the SVG figures' color (via `color: var(--card-accent)` +
`currentColor`, see below), and the glow behind the "FORGE" wordmark (fixed to
`--orchestrator`, since it's agent 01/the tech lead).

## Typography

- **Body**: a system font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif`) — no webfont is loaded for running text,
  a deliberate decision (see the comment in `globals.css`).
- **"FORGE" wordmark**: the only exception — `Bebas_Neue` (weight 400, self-hosted via
  `next/font/google`, `latin` subset), applied only to the hero's `<h1>` via the
  `--font-display` CSS var. Fluid size `clamp(4rem, 16vw, 11rem)`.
- **Modal prompt** (`.prompt-body`): a monospace font
  (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`), 12.5px, to clearly
  differentiate the copyable content from the rest of the UI.
- Labels/ids (`.card-id`, `.gallery h2`, `.modal-id`) use uppercase + wide letter-spacing
  (0.1–0.14em) in `--text-faint`, a pattern repeated across the UI for "metadata".

## Layout and spacing

- Hero: `min-height: 100dvh` (the "hero always covers the full screen" rule from Café
  Labs' landing page standard — see `mind/cafelabs/padroes-landing.md`), centered content.
- Gallery: a responsive grid, `repeat(auto-fill, minmax(300px, 1fr))`, max-width 1180px.
- Cards: `border-radius: 18px` (`--radius-card`), with a decorative "tab"
  (`.card::before`) simulating a hanging tag at the top of the card.
- Modal: `width: min(980px, 100%)`, a two-column layout (figure on the left, content on the
  right) that collapses to a single column below 720px.

## "Constellation" background

`.stars` (applied to the hero) is a background generated entirely in CSS — two `radial-gradient`s of
white dots with different opacity and size, no image at all — creating a
starry-sky effect behind the wordmark.

## SVG figure system (per-agent portraits)

The most distinctive element of the identity: each ready agent (`orchestrator`, `product`,
`design`) has a portrait drawn as an SVG graph — nodes (`.fig-node`, circles) linked
by edges (`.fig-edge`, lines), with all color inherited from `currentColor`/`--card-accent`.
Implemented in `src/components/figures.tsx`:

- **Face** (small, 10–12 nodes) — used on the gallery card.
- **Body** (full body, 28–32 nodes) — used in the modal, with 2 or 4 animated "arms"
  (each its own `<g>`, pivoting via `transform-box: view-box` at its own
  shoulder coordinate) that give each agent its own, non-interchangeable pose:
  - **Orchestrator**: 4 symmetric arms "conducting" (a coordinating posture).
  - **Product**: 2 asymmetric arms — one raised, pointing at an isolated node
    (the riskiest hypothesis), the other lowered, branching into 4 ghost nodes
    (discarded hypotheses).
  - **Design**: 2 asymmetric arms — one becomes a "brush" with a flowing ink
    spiral (`stroke-dashoffset` animated, 17 segments with staggered delay to look
    like one continuous stroke), the other forms an "L" framing/viewfinder shape with dashed
    ghost edges.
- **`SeedGraph`** — a deterministic generic graph (keyed by index `seed`, not random —
  avoiding a mismatch between server/client rendering) used for agents that don't have their own
  figure yet and for the "unavailable" state.

Each figure's coordinates were ported 1:1 from HTML mockups validated outside this
repo (noted in a comment at the top of `figures.tsx`) — they aren't "re-art directed" in the
conversion to JSX, just re-expressed.

## Motion

- `.scroll-cue` (the hero's scroll indicator): a subtle `bob` animation (translateY 6px,
  2.4s, infinite).
- Design's arm coil: continuous flow via `stroke-dashoffset`.
- Modal: opacity cross-fade + a slight scale/translate on open/close.
- All motion respects `prefers-reduced-motion: reduce` (checked explicitly in
  `AgentModal.tsx` via `prefersReducedMotion()`, and via `@media` in the relevant
  keyframes/transitions in CSS) — consistent with rule 2 of the Café Labs landing page standard.
