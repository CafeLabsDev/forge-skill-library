[Read in English](README.md)

# Forge Skill Library

Site público de galeria do sistema multiagente [Forge](https://github.com/CafeLabsCorp/forge):
uma hero em tela cheia seguida de uma grade de cards de agentes, cada um abrindo um modal
com a descrição do agente e um botão de "copiar prompt" em um clique. O conteúdo dos
agentes não é escrito aqui — em tempo de build o site busca a definição em Markdown de
cada agente direto do repositório público `CafeLabsCorp/forge`, então este site é uma
camada de apresentação, não a fonte da verdade dos agentes.

Feito pela [Café Labs](https://cafelabs.net); publicado em
[forge.cafelabs.net](https://forge.cafelabs.net).

## Stack técnica

| Camada     | Escolha                                          |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 16 (App Router), React 19, TypeScript     |
| Estilo     | CSS puro (`src/app/globals.css`) + import do Tailwind CSS v4 (classes utilitárias ainda não usadas no markup — ver `docs/ARQUITETURA.md`) |
| Conteúdo   | Buscado em tempo de build em `raw.githubusercontent.com/CafeLabsCorp/forge` (sem clone, sem token de autenticação — o repo de origem é público) |
| Fonte      | `Bebas_Neue` via `next/font/google`, restrita ao wordmark "FORGE" |
| i18n       | `next-intl`, roteamento por locale (`/en`, `/pt`), inglês como locale padrão |
| Hospedagem | Vercel, domínio próprio `forge.cafelabs.net`        |
| Lint       | ESLint (`eslint-config-next`)                     |

## Pré-requisitos

- Node.js 20+ (desenvolvido contra a v20.20.1 — ainda sem campo `engines` fixando isso,
  ver `docs/DEPLOY.md`).
- Sem variáveis de ambiente e sem segredos: o fetch no GitHub em tempo de build acessa
  URLs públicas de conteúdo bruto, sem autenticação.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. Como o conteúdo é buscado em tempo de build/request no
repositório público do Forge, é preciso ter acesso de rede a `raw.githubusercontent.com`
pra galeria popular; se um fetch falhar, o card daquele agente degrada pra um estado
"Unavailable" em vez de quebrar a página (ver `docs/ARQUITETURA.md`).

Outros scripts:

```bash
npm run build   # build de produção (também busca o conteúdo dos agentes de novo)
npm run start   # serve o build de produção
npm run lint    # eslint
```

## Estrutura de pastas

```
src/
  app/
    [locale]/
      layout.tsx    # layout raiz, metadata, fonte de display, NextIntlClientProvider
      page.tsx       # composição hero + galeria + instalação + footer
      globals.css    # tokens de design, estilos de hero/galeria/card/modal/figura
    icon.svg          # favicon, fora de [locale] pra não ficar prefixado por locale
  components/
    AgentGallery.tsx  # client component: grid + estado de abrir/fechar modal
    AgentCard.tsx     # um card-crachá (foto, nome, papel, descrição)
    AgentModal.tsx     # diálogo de detalhe: descrição completa + prompt + copiar
    CopyButton.tsx      # copiar pra área de transferência com fallback execCommand/seleção manual
    LanguageSwitcher.tsx # alterna entre os dois locales, na hero + no mini-nav
    MiniNav.tsx           # nav fixa, escondida até o scroll passar da hero
    InstallSection.tsx    # #install: passo a passo pra instalar o Forge completo
    ForgeIcon.tsx          # marca dentro da página (hero + mini-nav), diferente do icon.svg
    figures.tsx          # "gramática de figuras" SVG compartilhada (retratos por agente)
  i18n/
    routing.ts        # locales (en, pt), locale padrão (en)
    navigation.ts      # Link/useRouter/usePathname cientes de locale
    request.ts          # resolve o arquivo de mensagens do locale ativo
  lib/
    agents.ts        # fetch em tempo de build de agents/*.md do CafeLabsCorp/forge
    site.ts            # constantes de URL externas compartilhadas (repo do Forge, âncora do quick-start)
  proxy.ts             # middleware do next-intl: resolve o prefixo de locale por requisição
messages/
  en.json, pt.json    # texto do "chrome" da página (hero, nav, passos de instalação, footer, ...)
```

## Internacionalização

Roteamento por locale (`/en`, `/pt`) via `next-intl`, inglês como locale padrão (o
público deste site é internacional/técnico, diferente dos produtos irmãos com
prioridade em português). Só o "chrome" da página é traduzido — texto da hero, rótulos
de navegação, passo a passo de instalação, rodapé, microcópia de card/modal. **Nome**,
**papel** e **descrição** de cada agente exibidos no card/modal continuam em inglês nos
dois locales: eles vêm, em tempo de build, da definição real em Markdown do agente no
repositório público `forge` (ver `src/lib/agents.ts`), que é conteúdo técnico só em
inglês, não texto de página que este site possua ou traduza.

## Docs

- [`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) — como o site é montado: rotas,
  componentes, e exatamente como/quando ele fala com o repositório público do Forge.
- [`docs/DESIGN.md`](docs/DESIGN.md) — identidade visual: paleta, tipografia, o sistema
  de figuras SVG por agente.
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — como ele é publicado em `forge.cafelabs.net`.
