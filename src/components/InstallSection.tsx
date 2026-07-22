"use client";

import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { CopyButton } from "./CopyButton";
import { FORGE_QUICK_START_URL } from "@/lib/site";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

const CLONE_COMMAND = `git clone https://github.com/CafeLabsCorp/forge.git forge
cd forge
./scripts/setup-symlinks.sh`;

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
  const t = useTranslations("Install");
  const tCopy = useTranslations("CopyButton");
  const commandRef = useRef<HTMLPreElement>(null);

  const sectionStyle: CSSVars = {
    "--card-accent": "var(--orchestrator)",
  };

  return (
    <section id="install" className="install" style={sectionStyle}>
      <p className="install-kicker">{t("kicker")}</p>
      <h2 className="install-heading">{t("heading")}</h2>
      <p className="install-subhead">{t("subhead")}</p>

      <ol className="install-steps">
        <li className="install-step">
          <p className="install-step-num">{t("step1Num")}</p>
          <h3 className="install-step-title">{t("step1Title")}</h3>
          <p className="install-step-caption">{t("step1Caption")}</p>
          <div className="install-code">
            <div className="install-code-toolbar">
              <span>{t("shellLabel")}</span>
              <CopyButton text={CLONE_COMMAND} targetRef={commandRef} label={tCopy("copyCommand")} />
            </div>
            <pre className="install-code-body" ref={commandRef}>
              {CLONE_COMMAND}
            </pre>
          </div>
          <p className="install-legend">
            {t.rich("step1Legend", { code: (chunks) => <code>{chunks}</code> })}
          </p>
        </li>

        <li className="install-step">
          <p className="install-step-num">{t("step2Num")}</p>
          <h3 className="install-step-title">{t("step2Title")}</h3>
          <p className="install-step-caption">{t("step2Caption")}</p>
          <p className="install-phrase">{t("examplePhrase")}</p>
          <p className="install-legend">{t("step2Legend")}</p>
        </li>

        <li className="install-step">
          <p className="install-step-num">{t("step3Num")}</p>
          <h3 className="install-step-title">{t("step3Title")}</h3>
          <p className="install-step-caption">{t("step3Caption")}</p>
          <p className="install-step-body">{t("step3Body")}</p>
        </li>
      </ol>

      <p className="install-readme-link">
        {t("readmeLinkPrefix")}{" "}
        <a href={FORGE_QUICK_START_URL} target="_blank" rel="noopener noreferrer">
          {t("readmeLinkCta")}
        </a>
      </p>
    </section>
  );
}
