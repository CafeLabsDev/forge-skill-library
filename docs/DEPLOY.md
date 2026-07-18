# Deploy

## Pipeline

Não há workflow de CI/CD neste repositório (nenhum arquivo em `.github/workflows/`,
nenhum `vercel.json`). O deploy é feito pela integração nativa da Vercel com o
repositório GitHub [`CafeLabsDev/forge-skill-library`](https://github.com/CafeLabsDev/forge-skill-library):
push/merge em `main` dispara um novo build e deploy automaticamente — mesmo padrão usado
nos demais sites da Café Labs (`dindin-landing`, `domo-landing`, `mind-landing`), nenhum
deles com pipeline própria em repo.

Como o conteúdo dos agentes é buscado via `fetch()` em build time (ver
`docs/ARQUITETURA.md`), cada novo build reflete o estado atual de
`agents/*.md` no repo público `CafeLabsDev/forge` naquele momento — não há revalidação
incremental configurada, então uma mudança no Forge só aparece aqui depois do próximo
deploy deste site (`TODO: confirmar` se isso motiva algum gatilho de rebuild quando o
Forge muda, hoje aparentemente não existe).

## Ambientes

Só produção — sem ambiente de staging configurado neste repo. A Vercel gera preview
deployments automáticos por PR/branch (comportamento padrão da plataforma), mas nenhum
domínio de staging fixo é usado.

## Domínio

- **Produção**: [forge.cafelabs.net](https://forge.cafelabs.net) — confirmado no ar em
  2026-07-18 (deploy + DNS feitos manualmente pelo Felipe, mesmo fluxo do
  `mind.cafelabs.net`; sem passo de configuração de domínio documentado neste repo).
- URL padrão da Vercel (`*.vercel.app`) também existe como fallback, como em qualquer
  projeto Vercel.
- `TODO: confirmar` onde o DNS de `cafelabs.net` é gerenciado (registrador/provedor) e o
  tipo exato de registro apontando pro Vercel (CNAME vs. registro A) — não verificável a
  partir deste repositório.

## Variáveis de ambiente / segredos

Nenhuma. O fetch de `src/lib/agents.ts` acessa `raw.githubusercontent.com` sem
autenticação (repo `forge` é público) — não há chaves de API, tokens ou `.env` a
configurar na Vercel para este projeto buildar ou rodar.

## Rollback

Não documentado neste repo. Na prática, o mecanismo disponível é o padrão da Vercel:
promover um deployment anterior pelo dashboard (cada deploy fica com sua própria URL
imutável) ou reverter o commit em `main` e deixar o próximo push redeployar.
`TODO: confirmar` se existe algum procedimento adicional específico da Café Labs além
disso.
