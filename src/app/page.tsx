import { getAgents } from "@/lib/agents";
import { AgentGallery } from "@/components/AgentGallery";
import { InstallSection } from "@/components/InstallSection";

export default async function Home() {
  const agents = await getAgents();

  return (
    <>
      <a className="skip-link" href="#gallery">
        Skip to agent gallery
      </a>

      <header className="hero stars">
        <h1>FORGE</h1>
        <p>{agents.length} specialists. Pick one, copy its prompt, go — no clone, no setup script.</p>
        <a
          href="https://github.com/CafeLabsDev/forge"
          target="_blank"
          rel="noopener noreferrer"
          className="hero-cta"
        >
          View on GitHub
        </a>
        <a href="#gallery" className="scroll-cue">
          Scroll ↓
        </a>
      </header>

      <AgentGallery agents={agents} />

      <InstallSection />

      <footer className="site-footer">
        Forge Skill Library — prompts sourced from the public Forge repository.
      </footer>
    </>
  );
}
