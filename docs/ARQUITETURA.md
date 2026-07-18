# Arquitetura

Site Next.js (App Router) de página única. Não há roteamento além da rota raiz — todo o
conteúdo (hero, galeria, modal) é montado dentro de `src/app/page.tsx`.

## Fluxo de dados: como o site busca os agentes

Este é o ponto mais importante da arquitetura: **o conteúdo dos 10 agentes não é
mantido neste repositório**. Ele vive em `agents/*.md` no repositório público
[`CafeLabsDev/forge`](https://github.com/CafeLabsDev/forge) (onde os agentes de verdade
são definidos e mantidos) e é buscado em build time por `src/lib/agents.ts`.

Mecânica (`getAgents()` em `src/lib/agents.ts`):

1. Uma lista fixa `AGENT_CONFIGS` (hardcoded neste repo) define os 10 agentes — id,
   número de exibição, subtítulo ("role") e a variável CSS de cor de destaque. Essa
   lista é só apresentação/ordem; não é o conteúdo do agente.
2. Para cada agente, `fetchAgent()` faz `fetch()` direto em
   `https://raw.githubusercontent.com/CafeLabsDev/forge/main/agents/<id>.md` — sem
   clone do repo, sem token (o repo é público). Isso roda dentro de um Server Component
   (`page.tsx` é `async` e chama `getAgents()`), então o Next.js renderiza estaticamente
   a página contra o estado do repo `forge` no momento do build/deploy.
3. O Markdown recebido é interpretado só pelo frontmatter (`name:` e `description:`,
   via regex simples em `parseFrontmatter`) — o corpo completo do arquivo (frontmatter +
   prompt) é guardado como `content` bruto, que é exatamente o que aparece copiável no
   modal.
4. Cada busca é isolada (`Promise.all` sobre `fetchAgent` por agente, cada um com seu
   próprio try/catch): se a busca de um agente falhar (rede, 404, frontmatter ausente ou
   mal formado), só aquele card vira "Unavailable" — não derruba o build nem a página
   inteira.
5. Independente da busca, cada agente tem uma flag `ready` decidida aqui neste repo
   (atualmente hardcoded para `orchestrator`, `product` e `design` em
   `AGENT_CONFIGS`/`fetchAgent`) — controla se o card mostra a tag "Soon" e se o modal
   mostra o prompt completo ou uma mensagem de "ainda não desenhado". Um agente pode ter
   `ready: true` e ainda assim aparecer como indisponível se a busca falhar no momento do
   build (`unavailable` é independente de `ready`).

**Implicação prática**: renomear um agente, mudar seu path em `agents/` ou mudar o
formato do frontmatter no repo `forge` pode quebrar o fetch ou derrubar o card para
"Unavailable" neste site, sem que nada tenha mudado aqui. Como o fetch acontece em
build time (não em runtime do navegador), atualizar o conteúdo de um agente no repo
`forge` só aparece aqui depois de um novo build/deploy deste site — não há
revalidação incremental configurada (`next.config.ts` não define `revalidate`/ISR;
TODO: confirmar se isso é intencional ou uma lacuna a fechar quando o Forge atualizar
prompts com mais frequência).

## Rotas e composição de página

Rota única (`/`, `src/app/page.tsx`), Server Component `async`:

1. Skip-link de acessibilidade (`#gallery`).
2. `<header className="hero stars">` — wordmark "FORGE", subtítulo, CTA "Ver no
   GitHub" (link externo pro repo `forge`) e o indicador de scroll (`.scroll-cue`,
   link âncora pra `#gallery`).
3. `<AgentGallery agents={agents} />` — grid de cards + modal (ver abaixo).
4. `<footer className="site-footer">`.

`src/app/layout.tsx` define só metadata (`title`/`description`) e carrega a fonte de
exibição `Bebas_Neue` (`next/font/google`), aplicada exclusivamente ao wordmark "FORGE"
via a CSS var `--font-display` — nunca ao corpo do texto ou ao prompt.

## Componentes

- **`AgentGallery`** (`components/AgentGallery.tsx`, client component) — dono do estado
  `openAgent`; renderiza a lista de `AgentCard` e o único `AgentModal` compartilhado.
- **`AgentCard`** (`components/AgentCard.tsx`) — um card por agente: foto (SVG "Face" se
  `ready`, ou `SeedGraph` genérico caso contrário), id, nome, tag ("Soon"/"Unavailable"
  quando aplicável), role e descrição truncada em 2 linhas. É um `<button>` que abre o
  modal ao clicar.
- **`AgentModal`** (`components/AgentModal.tsx`, client component) — dialog de detalhe.
  Fica sempre montado no DOM (visibilidade controlada por estado `hidden`/`isOpen`, não
  por montagem condicional) para permitir cross-fade de abertura/fechamento; implementa
  foco inicial no botão fechar, focus trap por Tab/Shift+Tab e fechamento por Esc ou
  clique no backdrop. Mostra o prompt completo + `CopyButton` quando `ready && content`
  existem; caso contrário mostra uma mensagem explicando por que não ("ainda não
  desenhado" vs. "não foi possível buscar do GitHub", com link direto pro arquivo no
  GitHub como fallback).
- **`CopyButton`** (`components/CopyButton.tsx`) — copia o prompt via
  `navigator.clipboard`, com fallback em cascata: `document.execCommand("copy")` numa
  textarea oculta e, se isso também falhar, seleciona o texto visível pra Ctrl+C manual.
- **`figures.tsx`** — sistema compartilhado de "figuras" SVG (grafos de nós/arestas) que
  dá a cada agente pronto (`orchestrator`, `product`, `design`) um retrato desenhado à
  mão (versão pequena "Face" pro card, versão de corpo inteiro "Body" pro modal), mais um
  `SeedGraph` genérico determinístico (por índice, não aleatório — evita divergência
  entre render de servidor e cliente) usado para os agentes ainda não prontos. As
  coordenadas dos grafos foram portadas 1:1 de mockups validados fora do repo (comentado
  no topo do arquivo); ver `docs/DESIGN.md` para a lógica visual por trás.

## Decisões técnicas não óbvias

- **Conteúdo vem de fora do repo, de propósito.** Em vez de duplicar os prompts dos
  agentes neste site (o que exigiria manter dois lugares em sincronia manualmente), o
  site sempre reflete o `agents/*.md` do repo `forge` no momento do build — trade-off
  deliberado: menos duplicação, mas atualização de conteúdo aqui depende de um novo
  deploy deste site (ver acima).
- **Falha parcial, não falha total.** O isolamento por agente (`Promise.all` com
  try/catch individual) é uma escolha explícita para que uma instabilidade pontual do
  GitHub raw content não derrube a página toda — só degrada o(s) card(s) afetado(s).
- **`ready` é um interruptor manual neste repo, não uma propriedade do agente no repo
  `forge`.** Hoje só 3 dos 10 agentes estão marcados como prontos; os outros existem no
  Forge mas ainda não têm o tratamento visual (figura própria) nem foram "aprovados" para
  mostrar o prompt completo aqui.
