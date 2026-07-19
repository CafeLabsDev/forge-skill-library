"use client";

import { useRef, type CSSProperties } from "react";
import { CopyButton } from "./CopyButton";
import { FORGE_QUICK_START_URL } from "@/lib/site";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const CLONE_COMMAND = `git clone https://github.com/CafeLabsDev/forge.git forge
cd forge
./scripts/setup-symlinks.sh`;

const EXAMPLE_PHRASE =
  '"I have an idea for an app that helps small gyms schedule classes and manage member check-ins."';

/**
 * Sits between the agent gallery and the footer. Copying a prompt from the
 * gallery above already works standalone (no install needed) — this
 * section is the other half: wiring up the orchestrator so it keeps
 * pulling in the right specialists on its own, project after project.
 *
 * `--card-accent` is set once here, on the section root, to `--orchestrator`
 * (the same amber used for the wordmark glow in the hero) so the shared
 * `.copy-btn` class — which reads `--card-accent` — renders amber without
 * any per-instance override.
 */
export function InstallSection() {
  const commandRef = useRef<HTMLPreElement>(null);
  const phraseRef = useRef<HTMLParagraphElement>(null);

  const sectionStyle: CSSVars = {
    "--card-accent": "var(--orchestrator)",
  };

  return (
    <section id="install" className="install" style={sectionStyle}>
      <p className="install-kicker">Run the full system</p>
      <h2 className="install-heading">One prompt now. All the specialists, permanently.</h2>
      <p className="install-subhead">
        Copying a prompt above works on its own — paste it, done, nothing installed. Installing Forge adds the
        other half: an orchestrator that pulls in the right specialists on its own, project after project,
        instead of you hunting for one prompt at a time.
      </p>

      <ol className="install-steps">
        <li className="install-step">
          <p className="install-step-num">Step 01</p>
          <h3 className="install-step-title">Clone &amp; wire it up</h3>
          <p className="install-step-caption">One-time setup, any project.</p>
          <div className="install-code">
            <div className="install-code-toolbar">
              <span>shell</span>
              <CopyButton text={CLONE_COMMAND} targetRef={commandRef} />
            </div>
            <pre className="install-code-body" ref={commandRef}>
              {CLONE_COMMAND}
            </pre>
          </div>
          <p className="install-legend">
            Symlinks every agent into <code>~/.claude/agents/</code> — Claude Code picks them up right away, no
            restart.
          </p>
        </li>

        <li className="install-step">
          <p className="install-step-num">Step 02</p>
          <h3 className="install-step-title">Say what you&apos;re building</h3>
          <p className="install-step-caption">In Claude Code, in your own project folder:</p>
          <div className="install-phrase-row">
            <p className="install-phrase" ref={phraseRef}>
              {EXAMPLE_PHRASE}
            </p>
            <CopyButton text={EXAMPLE_PHRASE} targetRef={phraseRef} />
          </div>
          <p className="install-legend">
            Any plain description works. Already mid-project? Say &quot;let&apos;s loop in the team&quot;
            instead — the orchestrator switches to triage mode.
          </p>
        </li>

        <li className="install-step">
          <p className="install-step-num">Step 03</p>
          <h3 className="install-step-title">The orchestrator takes it from there</h3>
          <p className="install-step-caption">No command to run — this is what happens automatically:</p>
          <p className="install-step-body">
            It scopes the idea, delegates to whichever specialists apply — design, backend, mobile, whichever
            the project actually needs — and synthesizes everything back into one plan, flagging any trade-off
            a specialist raised along the way.
          </p>
        </li>
      </ol>

      <p className="install-readme-link">
        Prerequisites, customizing the roster for your own stack, and the full architecture doc all live in the
        repo.{" "}
        <a href={FORGE_QUICK_START_URL} target="_blank" rel="noopener noreferrer">
          See the full walkthrough in the README →
        </a>
      </p>
    </section>
  );
}
