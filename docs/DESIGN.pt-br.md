**[Read in English](DESIGN.md)**

# Design

Não há um nome de identidade visual cunhado separadamente da própria marca "FORGE"
(diferente de, por exemplo, o "Armário Aberto" do Domo) — o wordmark "FORGE" e a estética
"constelação"/grafo escuro descrita abaixo são a identidade.
`TODO: confirmar` se em algum momento um nome próprio for adotado para este visual.

## Paleta

Tema único, escuro (`color-scheme: dark` em `:root`, `src/app/globals.css`) — não há
variante clara/light.

### Superfícies e texto

| Token           | Valor                   | Uso                                   |
| --------------- | ------------------------ | -------------------------------------- |
| `--bg`          | `#0a0b0d`                 | fundo da página                        |
| `--bg-raised`   | `#121418`                 | fundo de elementos elevados (foto do card, botão fechar) |
| `--bg-panel`    | `#16191e`                 | painéis (card, modal, toolbar)         |
| `--border`      | `rgba(255,255,255,0.09)`  | bordas padrão                          |
| `--border-strong` | `rgba(255,255,255,0.18)` | bordas de maior contraste             |
| `--text`        | `#f3f1ea`                 | texto principal                        |
| `--text-dim`    | `#a2a8b3`                 | texto secundário                       |
| `--text-faint`  | `#6b7280`                 | texto terciário (ids, labels uppercase) |

### Cor de destaque por agente

Cada um dos agentes tem sua própria cor de destaque, guardada como tripla HSL (sem a
função `hsl()`) para poder compor com opacidade via `hsl(var(--x) / <alpha>)`:

| Agente         | CSS var             | HSL              |
| -------------- | -------------------- | ----------------- |
| Orchestrator   | `--orchestrator`      | `38 85% 58%` (âmbar) |
| Product        | `--product`           | `165 60% 48%` (verde-água) |
| Design         | `--design`             | `320 68% 62%` (magenta) |
| Mobile         | `--mobile`             | `145 52% 48%` (verde) |
| Backend        | `--backend`            | `250 58% 66%` (roxo-azulado) |
| Frontend Web   | `--frontend-web`       | `200 75% 58%` (azul-ciano) |
| DevOps         | `--devops`             | `220 14% 62%` (cinza-azulado) |
| QA             | `--qa`                 | `15 78% 56%` (laranja-avermelhado) |
| Security       | `--security`           | `355 62% 50%` (vermelho) |
| Analytics      | `--analytics`          | `275 58% 66%` (roxo) |
| Docs           | `--docs`               | `100 38% 52%` (verde-sálvia) |

Essas cores viram `--card-accent` (definida inline por componente, nunca hardcoded no
CSS) e dirigem: borda/glow do card no hover/focus, cor do "role" no card e no modal,
fundo do botão de copiar, cor das figuras SVG (via `color: var(--card-accent)` +
`currentColor`, ver abaixo) e o glow atrás do wordmark "FORGE" (fixo em
`--orchestrator`, já que é o agente 01/tech lead).

## Tipografia

- **Corpo**: pilha de fontes de sistema (`-apple-system, BlinkMacSystemFont, "Segoe UI",
  Roboto, Helvetica, Arial, sans-serif`) — nenhuma webfont carregada para texto corrido,
  decisão deliberada (ver comentário em `globals.css`).
- **Wordmark "FORGE"**: única exceção — `Bebas_Neue` (peso 400, self-hosted via
  `next/font/google`, subset `latin`), aplicada só ao `<h1>` da hero via a CSS var
  `--font-display`. Tamanho fluido `clamp(4rem, 16vw, 11rem)`.
- **Prompt no modal** (`.prompt-body`): fonte monoespaçada
  (`ui-monospace, SFMono-Regular, Menlo, Consolas, monospace`), 12.5px, para diferenciar
  claramente o conteúdo copiável do resto da UI.
- Labels/ids (`.card-id`, `.gallery h2`, `.modal-id`) usam uppercase + letter-spacing
  largo (0.1–0.14em) em `--text-faint`, um padrão repetido em toda a UI para "metadados".

## Layout e espaçamento

- Hero: `min-height: 100dvh` (regra "hero sempre cobrindo a tela inteira" do padrão de
  landing da Café Labs — ver `mind/cafelabs/padroes-landing.md`), conteúdo centralizado.
- Galeria: grid responsivo `repeat(auto-fill, minmax(300px, 1fr))`, max-width 1180px.
- Cards: `border-radius: 18px` (`--radius-card`), com uma "aba" decorativa
  (`.card::before`) simulando uma etiqueta pendurada no topo do card.
- Modal: `width: min(980px, 100%)`, layout de duas colunas (figura à esquerda, conteúdo à
  direita) que colapsa para coluna única abaixo de 720px.

## Fundo "constelação"

`.stars` (aplicado à hero) é um fundo gerado só em CSS — dois `radial-gradient` de
pontos brancos com opacidade e tamanho diferentes, sem nenhuma imagem — criando um efeito
de céu estrelado atrás do wordmark.

## Sistema de figuras SVG (retratos por agente)

O elemento mais distinto da identidade: cada agente pronto (`orchestrator`, `product`,
`design`) tem um retrato desenhado como grafo SVG — nós (`.fig-node`, círculos) ligados
por arestas (`.fig-edge`, linhas), toda a cor herdada de `currentColor`/`--card-accent`.
Implementado em `src/components/figures.tsx`:

- **Face** (pequena, 10–12 nós) — usada no card da galeria.
- **Body** (corpo inteiro, 28–32 nós) — usada no modal, com 2 ou 4 "braços" animados
  (cada um seu próprio `<g>`, pivotando em `transform-box: view-box` na própria
  coordenada do ombro) que dão a cada agente uma pose própria e não intercambiável:
  - **Orchestrator**: 4 braços simétricos "conduzindo" (postura de coordenação).
  - **Product**: 2 braços assimétricos — um levantado apontando pra um nó isolado
    (a hipótese mais arriscada), outro baixo se ramificando em 4 nós fantasmas
    (hipóteses descartadas).
  - **Design**: 2 braços assimétricos — um vira um "pincel" com uma espiral de tinta
    fluindo (`stroke-dashoffset` animado, 17 segmentos com delay escalonado pra parecer
    um traço contínuo), o outro forma um "L" de enquadramento/viewfinder com arestas
    tracejadas fantasmas.
- **`SeedGraph`** — grafo genérico determinístico (por índice `seed`, não aleatório —
  evita divergência entre render de servidor/cliente) usado para os agentes ainda sem
  figura própria e para o estado "unavailable".

As coordenadas de cada figura foram portadas 1:1 de mockups HTML validados fora deste
repo (comentado no topo de `figures.tsx`) — não são "re-art directed" na conversão para
JSX, só reexpressas.

## Marca e favicon

O hexágono âmbar + 6 pétalas existe em duas implementações separadas, de propósito:

- **`ForgeIcon`** (`src/components/ForgeIcon.tsx`) — o componente React usado dentro da
  página, na hero (animado) e no `MiniNav` (estático). As pétalas usam `currentColor`
  pra herdar `--text` em vez de um fill estático.
- **`src/app/icon.svg`** (favicon/ícone da aba do navegador, resolvido pela convenção de
  metadata baseada em arquivo do Next.js) — um SVG separado e estático com a mesma forma,
  usando `prefers-color-scheme` diretamente (`.petal { fill: #f3f1ea }`, trocado pra
  `#16191e` no modo claro) já que renderiza num contexto sem acesso às CSS custom
  properties nem ao tema dark-only deste site. Vive fora do segmento `[locale]`
  especificamente pra não ficar prefixado por locale (corrigido em 2026-07-22, ver
  histórico do git).

## Movimento

- `.scroll-cue` (indicador de scroll da hero): animação `bob` sutil (translateY 6px,
  2.4s, infinita).
- Coil do braço de Design: flow contínuo via `stroke-dashoffset`.
- Modal: cross-fade de opacidade + leve scale/translate ao abrir/fechar.
- Todo movimento respeita `prefers-reduced-motion: reduce` (checado explicitamente em
  `AgentModal.tsx` via `prefersReducedMotion()`, e via `@media` nos keyframes/transições
  CSS relevantes) — consistente com a regra 2 do padrão de landing da Café Labs.
