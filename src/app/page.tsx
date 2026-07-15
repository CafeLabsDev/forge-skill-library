import { getAgents } from "@/lib/agents";
import { AgentGallery } from "@/components/AgentGallery";

export default async function Home() {
  const agents = await getAgents();

  return (
    <>
      <a className="skip-link" href="#gallery">
        Skip to agent gallery
      </a>

      <header className="hero stars">
        <h1>FORGE</h1>
        <p>Ten specialists. Pick one, copy its prompt, go — no clone, no setup script.</p>
        <div className="scroll-cue" aria-hidden="true">
          Scroll ↓
        </div>
      </header>

      <AgentGallery agents={agents} />

      <footer className="site-footer">
        Forge Skill Library — prompts sourced from the public Forge repository.
      </footer>
    </>
  );
}
