"use client";

import { useTranslations } from "next-intl";
import type { AgentCardData } from "@/lib/agents";
import { getReadyFigures, SeedGraph } from "./figures";

export function AgentCard({
  agent,
  seed,
  onOpen,
}: {
  agent: AgentCardData;
  seed: number;
  onOpen: (agent: AgentCardData) => void;
}) {
  const t = useTranslations("Card");
  const { Face } = getReadyFigures(agent.id);
  const stateClass = agent.unavailable ? " is-unavailable" : !agent.ready ? " is-locked" : "";
  const tag = agent.unavailable ? t("tagUnavailable") : !agent.ready ? t("tagSoon") : null;
  const ariaLabel = agent.unavailable
    ? t("viewProfileUnavailable", { name: agent.name })
    : !agent.ready
      ? t("viewProfileNotReady", { name: agent.name })
      : t("viewProfile", { name: agent.name });

  return (
    <li>
      <button
        type="button"
        className={`card${stateClass}`}
        style={{ ["--card-accent" as string]: `var(${agent.accentVar})` }}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        onClick={() => onOpen(agent)}
      >
        <span className="card-photo">
          {agent.ready && Face ? <Face /> : <SeedGraph seed={seed} />}
        </span>
        <span className="card-body">
          <span className="card-id">N.{agent.num}</span>
          <span className="card-name">
            {agent.name}
            {tag ? (
              <span className={`card-tag${agent.unavailable ? " is-unavailable" : ""}`}>{tag}</span>
            ) : null}
          </span>
          <span className="card-role">{agent.role}</span>
          <span className="card-desc">{agent.description}</span>
        </span>
      </button>
    </li>
  );
}
