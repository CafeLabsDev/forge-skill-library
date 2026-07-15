"use client";

import { useState } from "react";
import type { AgentCardData } from "@/lib/agents";
import { AgentCard } from "./AgentCard";
import { AgentModal } from "./AgentModal";

export function AgentGallery({ agents }: { agents: AgentCardData[] }) {
  const [openAgent, setOpenAgent] = useState<AgentCardData | null>(null);

  return (
    <>
      <main className="gallery" id="gallery">
        <h2>Skill Library — 10 agents</h2>
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
