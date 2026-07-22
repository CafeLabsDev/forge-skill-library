// Build-time content source: fetches each agent's markdown definition
// straight from the public Forge repo on GitHub (no clone, no auth token —
// the repo is public). This runs once per build, inside a Server Component,
// so Next.js statically renders the page against whatever the repo looked
// like at build/deploy time (see next.config.ts / README for the tradeoff).
//
// Unhappy path: every agent is fetched independently (Promise.all over
// per-agent try/catch, not a single fetch-everything call), so one bad
// fetch marks only that agent "unavailable" instead of failing the whole
// build or blanking the whole page.

const REPO = "CafeLabsCorp/forge";
const REPO_BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${REPO}/${REPO_BRANCH}/agents`;
const GITHUB_BLOB_BASE = `https://github.com/${REPO}/blob/${REPO_BRANCH}/agents`;

export type AgentCardData = {
  id: string;
  num: string;
  /** Presentational subtitle (e.g. "Tech Lead / Coordinator") — not part of
   * the agent's markdown content, kept alongside the accent color as UI
   * chrome the page controls, same as the badge color. */
  role: string;
  /** CSS custom property name holding this agent's accent HSL triplet,
   * e.g. "--orchestrator". */
  accentVar: string;
  /** From the agent .md frontmatter `name:` field, or a title-cased
   * fallback of the id if the fetch failed. */
  name: string;
  /** From the agent .md frontmatter `description:` field, or an
   * "unavailable" explanation if the fetch failed. */
  description: string;
  /** True only for the one agent whose design + prompt are fully shipped
   * this round (orchestrator) AND whose fetch succeeded. */
  ready: boolean;
  /** True if the build-time fetch for this agent failed. Independent of
   * `ready` — even the ready agent can end up unavailable if GitHub is
   * unreachable at build time. */
  unavailable: boolean;
  /** Full raw file content (frontmatter + body), exactly as it lives in the
   * repo — this is what gets shown/copied in the modal for the ready
   * agent, since that's the literal content someone would paste as the
   * subagent definition. */
  content: string | null;
  /** Path shown in the prompt toolbar, e.g. "agents/orchestrator.md". */
  sourcePath: string;
  /** Link to the file on GitHub, used as a graceful fallback when the
   * build-time fetch failed. */
  githubUrl: string;
};

type AgentConfig = {
  id: string;
  num: string;
  role: string;
  accentVar: string;
};

// Presentational config only — the id ordering, badge number, subtitle and
// accent color. Real content (name + description shown on the card) comes
// from each agent's fetched frontmatter below, not from this list.
const AGENT_CONFIGS: AgentConfig[] = [
  { id: "orchestrator", num: "01", role: "Tech Lead / Coordinator", accentVar: "--orchestrator" },
  { id: "product", num: "02", role: "Brainstorm / Validation", accentVar: "--product" },
  { id: "design", num: "03", role: "UX / UI", accentVar: "--design" },
  { id: "mobile", num: "04", role: "Flutter Implementation", accentVar: "--mobile" },
  { id: "backend", num: "05", role: "Cloud Architect", accentVar: "--backend" },
  { id: "frontend-web", num: "06", role: "Web Implementation", accentVar: "--frontend-web" },
  { id: "devops", num: "07", role: "CI/CD / Infra", accentVar: "--devops" },
  { id: "qa", num: "08", role: "Testing", accentVar: "--qa" },
  { id: "security", num: "09", role: "Independent Review", accentVar: "--security" },
  { id: "analytics", num: "10", role: "Instrumentation", accentVar: "--analytics" },
  { id: "docs", num: "11", role: "Documentation", accentVar: "--docs" },
];

// Naive kebab-case -> Title Case can't know "qa" and "devops" are meant as
// acronyms/compounds rather than ordinary words — these two display
// overrides are the only exceptions to the otherwise-derived display name.
const DISPLAY_NAME_OVERRIDES: Record<string, string> = {
  qa: "QA",
  devops: "DevOps",
};

function titleCase(id: string): string {
  if (DISPLAY_NAME_OVERRIDES[id]) return DISPLAY_NAME_OVERRIDES[id];
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function parseFrontmatter(raw: string): { name: string; description: string } | null {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return null;
  const frontmatter = match[1];
  const name = /^name:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim();
  const description = /^description:\s*(.+)$/m.exec(frontmatter)?.[1]?.trim();
  if (!name || !description) return null;
  return { name, description };
}

async function fetchAgent(config: AgentConfig): Promise<AgentCardData> {
  const sourcePath = `agents/${config.id}.md`;
  const githubUrl = `${GITHUB_BLOB_BASE}/${config.id}.md`;

  try {
    const res = await fetch(`${RAW_BASE}/${config.id}.md`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = await res.text();
    const parsed = parseFrontmatter(raw);
    if (!parsed) throw new Error("Missing or malformed frontmatter");

    return {
      ...config,
      // frontmatter `name:` is the agent's kebab-case id (e.g.
      // "frontend-web"), not display copy — title-case it for the card,
      // same transform used for the fetch-failure fallback below, so the
      // display name is consistently derived rather than hand-written.
      name: titleCase(parsed.name),
      description: parsed.description,
      ready: config.id === "orchestrator" || config.id === "product" || config.id === "design",
      unavailable: false,
      content: raw.trim(),
      sourcePath,
      githubUrl,
    };
  } catch {
    // Per-agent isolation: this agent ships as an explicit "unavailable"
    // card instead of taking the rest of the page down with it.
    return {
      ...config,
      name: titleCase(config.id),
      description:
        "This agent's content could not be fetched from the Forge repository at build time.",
      ready: false,
      unavailable: true,
      content: null,
      sourcePath,
      githubUrl,
    };
  }
}

export async function getAgents(): Promise<AgentCardData[]> {
  return Promise.all(AGENT_CONFIGS.map(fetchAgent));
}
