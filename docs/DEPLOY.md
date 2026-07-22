**[Leia em Português](DEPLOY.pt-br.md)**

# Deploy

## Pipeline

There is no CI/CD workflow in this repository (no file under `.github/workflows/`,
no `vercel.json`). Deployment happens through Vercel's native integration with the
[`CafeLabsCorp/forge-skill-library`](https://github.com/CafeLabsCorp/forge-skill-library) GitHub
repository: a push/merge to `main` automatically triggers a new build and deploy — the same pattern used
across the other Café Labs sites (`dindin-landing`, `domo-landing`, `mind-landing`), none of
them with their own in-repo pipeline.

Since agent content is fetched via `fetch()` at build time (see
`docs/ARQUITETURA.md`), each new build reflects the current state of
`agents/*.md` in the public `CafeLabsCorp/forge` repo at that moment — there is no
incremental revalidation configured, so a change in Forge only shows up here after the next
deploy of this site (`TODO: confirm` whether this motivates any rebuild trigger when
Forge changes; today there doesn't appear to be one).

## Environments

Production only — no staging environment configured in this repo. Vercel generates automatic
preview deployments per PR/branch (the platform's default behavior), but no fixed
staging domain is used.

## Domain

- **Production**: [forge.cafelabs.net](https://forge.cafelabs.net) — confirmed live on
  2026-07-18 (deploy + DNS done manually by Felipe, the same flow as
  `mind.cafelabs.net`; no domain configuration step documented in this repo).
- The default Vercel URL (`*.vercel.app`) also exists as a fallback, as in any
  Vercel project.
- `TODO: confirm` where `cafelabs.net`'s DNS is managed (registrar/provider) and the
  exact record type pointing to Vercel (CNAME vs. A record) — not verifiable from
  this repository.

## Environment variables / secrets

None. The fetch in `src/lib/agents.ts` hits `raw.githubusercontent.com` without
authentication (the `forge` repo is public) — there are no API keys, tokens, or `.env` to
configure on Vercel for this project to build or run.

## Rollback

Not documented in this repo. In practice, the available mechanism is Vercel's default:
promote a previous deployment from the dashboard (each deploy has its own immutable
URL) or revert the commit on `main` and let the next push redeploy.
`TODO: confirm` whether any additional Café Labs-specific procedure exists beyond
this.
