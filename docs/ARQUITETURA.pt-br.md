**[Read in English](ARQUITETURA.md)**

# Arquitetura

Site Next.js (App Router) de página única, com roteamento por locale via `next-intl`
(`/en`, `/pt`, inglês como locale padrão — ver seção "Internacionalização" abaixo). Fora
do prefixo de locale, não há outras rotas — todo o conteúdo (hero, galeria, modal) é
montado dentro de `src/app/[locale]/page.tsx`.

## Fluxo de dados: como o site busca os agentes

Este é o ponto mais importante da arquitetura: **o conteúdo dos agentes não é
mantido neste repositório**. Ele vive em `agents/*.md` no repositório público
[`CafeLabsCorp/forge`](https://github.com/CafeLabsCorp/forge) (onde os agentes de verdade
são definidos e mantidos) e é buscado em build time por `src/lib/agents.ts`.

Mecânica (`getAgents()` em `src/lib/agents.ts`):

1. Uma lista fixa `AGENT_CONFIGS` (hardcoded neste repo) define os agentes — id,
   número de exibição, subtítulo ("role") e a variável CSS de cor de destaque. Essa
   lista é só apresentação/ordem; não é o conteúdo do agente, mas precisa ser
   atualizada manualmente sempre que um agente for adicionado/removido no `forge`
   (já aconteceu uma vez: o agente `docs` foi adicionado ao roster do `forge` sem
   atualizar esta lista, deixando a contagem "10 agents" no header da galeria e no
   texto da hero desatualizada — corrigido em 2026-07-19 junto com a troca desses
   textos por contagem dinâmica via `agents.length`, pra não se repetir).
2. Para cada agente, `fetchAgent()` faz `fetch()` direto em
   `https://raw.githubusercontent.com/CafeLabsCorp/forge/main/agents/<id>.md` — sem
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

Rota única por locale (`/[locale]`, `src/app/[locale]/page.tsx`), Server Component
`async`:

1. Skip-link de acessibilidade (`#gallery`).
2. `<MiniNav />` — fixo no topo, some até o scroll passar da hero; inclui o
   `LanguageSwitcher`.
3. `<header className="hero stars">` — `LanguageSwitcher` (canto superior direito),
   ícone `ForgeIcon` + wordmark "FORGE" animados (`.hero-mark`), subtítulo, CTA "Ver no
   GitHub" (link externo pro repo `forge`) e duas chamadas âncora lado a lado
   (`.hero-cues`): "Agents ↓" pra `#gallery` e "Install ↓" pra `#install`.
4. `<AgentGallery agents={agents} />` — grid de cards + modal (ver abaixo).
5. `<InstallSection />` — passo a passo de instalação do Forge completo, ancorado em
   `#install`.
6. `<footer className="site-footer">`.

`src/proxy.ts` é o middleware do `next-intl` (`createMiddleware(routing)`) que resolve o
prefixo de locale em toda requisição, exceto `api`/`_next`/`_vercel`/arquivos estáticos —
é o que faz `/` redirecionar pra `/en` (locale padrão) e mantém `/en`/`/pt` em sincronia
com o plugin `withNextIntl` do `next.config.ts`. `src/lib/site.ts` guarda as duas
constantes de URL externa usadas nos componentes (`FORGE_REPO_URL`,
`FORGE_QUICK_START_URL`) em vez de deixá-las hardcoded inline.

`src/app/[locale]/layout.tsx` define metadata (`title`/`description`, traduzido e com a
contagem de agentes via `getAgents()`), valida o `locale` da URL (`hasLocale` +
`notFound()`), envolve a árvore em `NextIntlClientProvider` e carrega a fonte de
exibição `Bebas_Neue` (`next/font/google`), aplicada exclusivamente ao wordmark "FORGE"
via a CSS var `--font-display` — nunca ao corpo do texto ou ao prompt.

## Internacionalização

`next-intl` com roteamento por locale (`src/i18n/routing.ts`: locales `en`/`pt`, `en`
como padrão — inglês por causa do público internacional/técnico deste site, ao
contrário dos produtos irmãos com prioridade em português). `LanguageSwitcher`
(`components/LanguageSwitcher.tsx`) alterna o locale mantendo a rota atual, renderizado
tanto na hero quanto no `MiniNav`.

Só o "chrome" da página é traduzido (`messages/en.json`, `messages/pt.json`): hero, nav,
passos de instalação, rodapé, microcópia de card/modal (tags, aria-labels, mensagens de
estado). **Nome, papel e descrição de cada agente permanecem sempre em inglês**,
independente do locale ativo — são conteúdo técnico buscado em `src/lib/agents.ts` do
repo público `forge` (ver seção "Fluxo de dados" acima), não texto de página que este
site possua ou deva traduzir. A lista de nomes de agentes "prontos" mostrada no modal
(`AgentModal.tsx`) usa `Intl.ListFormat` pra gerar a conjunção ("A, B and C" / "A, B e
C") localizada corretamente sem hardcodar o conectivo.

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
- **`LanguageSwitcher`** (`components/LanguageSwitcher.tsx`, client component) — botão
  que alterna pro outro locale (`en`↔`pt`) preservando a rota atual (`useRouter`/
  `usePathname` de `src/i18n/navigation.ts`).
- **`CopyButton`** (`components/CopyButton.tsx`) — copia o prompt via
  `navigator.clipboard`, com fallback em cascata: `document.execCommand("copy")` numa
  textarea oculta e, se isso também falhar, seleciona o texto visível pra Ctrl+C manual.
- **`MiniNav`** (`components/MiniNav.tsx`, client component) — uma barra de navegação
  fixa (marca + links âncora "Agents"/"Install" + `LanguageSwitcher`) que fica escondida
  até a hero sair da tela (rastreado por um listener de `scroll` comparando
  `window.scrollY` com o `offsetHeight` da hero), dando um caminho de volta pra galeria/
  instalação depois que o leitor rolou além da hero.
- **`InstallSection`** (`components/InstallSection.tsx`, client component) — a seção
  `#install` entre a galeria e o rodapé: um passo a passo de 3 etapas (clonar + rodar
  `scripts/setup-symlinks.sh`, descrever o que está sendo construído, deixar o
  orquestrador delegar) pra instalar o sistema Forge completo, não só copiar o prompt de
  um agente. O passo 1 tem seu próprio `CopyButton` pro comando de clone, com
  `--card-accent` fixado em `--orchestrator` pra seção toda.
- **`ForgeIcon`** (`components/ForgeIcon.tsx`) — a marca SVG do hexágono âmbar + 6
  pétalas, reaproveitada na hero (animada, girando em passos de 60° via as regras CSS de
  `.hero-icon` agindo sobre o grupo `forge-icon-accents` do ícone) e no `MiniNav`
  (estática). Diferente de `src/app/icon.svg`, o favicon/ícone da aba do navegador (um
  asset separado e mais simples que vive fora do segmento `[locale]` pra não ficar
  prefixado por locale — ver `docs/DESIGN.md`).
- **`figures.tsx`** — sistema compartilhado de "figuras" SVG (grafos de nós/arestas) que
  dá a cada agente pronto (`orchestrator`, `product`, `design`) um retrato desenhado à
  mão (versão pequena "Face" pro card, versão de corpo inteiro "Body" pro modal), mais um
  `SeedGraph` genérico determinístico (por índice, não aleatório — evita divergência
  entre render de servidor e cliente) usado para os agentes ainda não prontos. As
  coordenadas dos grafos foram portadas 1:1 de mockups validados fora do repo (comentado
  no topo do arquivo); ver `docs/DESIGN.pt-br.md` para a lógica visual por trás.

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
  `forge`.** Hoje só 3 dos 11 agentes estão marcados como prontos; os outros existem no
  Forge mas ainda não têm o tratamento visual (figura própria) nem foram "aprovados" para
  mostrar o prompt completo aqui.
