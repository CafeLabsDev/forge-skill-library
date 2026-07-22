"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { AgentCardData } from "@/lib/agents";
import { AgentCard } from "./AgentCard";
import { AgentModal } from "./AgentModal";

export function AgentGallery({ agents }: { agents: AgentCardData[] }) {
  const [openAgent, setOpenAgent] = useState<AgentCardData | null>(null);
  const t = useTranslations("Gallery");

  return (
    <>
      <main className="gallery" id="gallery">
        <h2>{t("heading", { count: agents.length })}</h2>
        <ul className="grid">
          {agents.map((agent, index) => (
            <AgentCard key={agent.id} agent={agent} seed={index} onOpen={setOpenAgent} />
          ))}
        </ul>
      </main>
      <AgentModal agent={openAgent} agents={agents} onClose={() => setOpenAgent(null)} />
    </>
  );
}
