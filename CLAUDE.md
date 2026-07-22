# CLAUDE.md

Ver [`README.md`](README.md) para o que este projeto é e como rodar localmente, e
[`docs/ARQUITETURA.md`](docs/ARQUITETURA.md) / [`docs/DESIGN.md`](docs/DESIGN.md) /
[`docs/DEPLOY.md`](docs/DEPLOY.md) para arquitetura, identidade visual e deploy.

- O conteúdo dos agentes vem de um `fetch()` em build time no repo público
  `CafeLabsCorp/forge` (`src/lib/agents.ts`) — não edite prompt/descrição de agente
  neste repositório, isso vive no repo `forge`. Mudanças aqui devem se limitar à
  apresentação (cards, modal, figuras, layout).
- Sem variáveis de ambiente/segredos: o fetch é público e sem token.
