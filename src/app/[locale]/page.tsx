import { getTranslations } from "next-intl/server";
import { getAgents } from "@/lib/agents";
import { AgentGallery } from "@/components/AgentGallery";
import { InstallSection } from "@/components/InstallSection";
import { MiniNav } from "@/components/MiniNav";
import { ForgeIcon } from "@/components/ForgeIcon";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FORGE_REPO_URL } from "@/lib/site";

export default async function Home() {
  const [agents, t] = await Promise.all([getAgents(), getTranslations()]);

  return (
    <>
      <a className="skip-link" href="#gallery">
        {t("Common.skipToGallery")}
      </a>

      <MiniNav />

      <header className="hero stars">
        <LanguageSwitcher className="hero-lang-switch" />
        <div className="hero-mark">
          <ForgeIcon className="hero-icon" />
          <div className="hero-name-wrap">
            <h1>FORGE</h1>
          </div>
        </div>
        <p>{t("Hero.tagline", { count: agents.length })}</p>
        <a href={FORGE_REPO_URL} target="_blank" rel="noopener noreferrer" className="hero-cta">
          {t("Hero.viewOnGithub")}
        </a>
        <div className="hero-cues">
          <a href="#gallery" className="scroll-cue">
            {t("Hero.agentsCue")}
          </a>
          <span className="cue-sep">|</span>
          <a href="#install" className="install-cue">
            {t("Hero.installCue")}
          </a>
        </div>
      </header>

      <AgentGallery agents={agents} />

      <InstallSection />

      <footer className="site-footer">{t("Footer.text")}</footer>
    </>
  );
}
