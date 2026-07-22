"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AgentCardData } from "@/lib/agents";
import { getReadyFigures, SeedGraph } from "./figures";
import { CopyButton } from "./CopyButton";

type CSSVars = CSSProperties & Record<`--${string}`, string>;

// Kept in sync with the .modal-backdrop / .modal `transition` durations in
// globals.css (0.18s) plus a small safety margin. This is how long the
// close path waits, after starting the fade-out, before it actually hides
// the backdrop — if that CSS duration ever changes, update this too.
const CLOSE_TRANSITION_MS = 220;

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AgentModal({
  agent,
  agents,
  onClose,
}: {
  /** The agent the parent currently wants open, or null when closed. The
   * modal element itself stays mounted in the DOM at all times regardless
   * — see the `hidden` state below, which is what actually drives
   * visibility, kept deliberately independent from `agent` so closing can
   * cross-fade instead of unmounting mid-animation. */
  agent: AgentCardData | null;
  /** Full roster, used only to derive the ready/remaining counts (and
   * ready agents' names) shown in the not-designed-yet copy below — so
   * that copy self-updates as more agents ship `ready: true` in
   * `lib/agents.ts`, instead of going stale like the hardcoded "one agent
   * (Orchestrator)... the remaining nine" copy it replaced. */
  agents: AgentCardData[];
  onClose: () => void;
}) {
  const t = useTranslations("Modal");
  const locale = useLocale();
  const [renderedAgent, setRenderedAgent] = useState<AgentCardData | null>(null);
  const [hidden, setHidden] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [openToken, setOpenToken] = useState(0);
  // Tracks the previous `agent` prop for the render-phase comparison below.
  // React's documented "adjust state during render" recipe stores this in
  // useState rather than useRef — refs may not be read/written during
  // render (only in effects/handlers), only state may.
  const [prevAgent, setPrevAgent] = useState<AgentCardData | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const promptRef = useRef<HTMLPreElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Always reflects the LIVE "should a modal currently be open" intent,
  // updated at the top of the effect below on every run. The close-timer
  // callback checks this ref (not a value captured in its own closure) at
  // the moment it actually fires — necessary because the callback can end
  // up executing (its state update merely queued/batched by React, not
  // necessarily applied) around the same time as a subsequent reopen, and
  // a closure snapshot of `agent` taken when the timer was SCHEDULED can
  // already be stale by the time it FIRES. Checking live state here is
  // what stops a leftover close-timer from re-hiding a modal that has
  // since been reopened.
  const wantsOpenRef = useRef(false);

  // React's documented "adjust state during render" pattern (not an
  // effect): the moment `agent` changes identity, the content + base
  // transition state (`hidden`/`isOpen`) is derived synchronously in this
  // same render, before paint — no extra render/commit cycle, and no
  // setState-in-effect. The actual side effects (focus, scroll lock,
  // timers) still belong in the useEffect below, since those touch the
  // DOM/outside world rather than derive from props.
  if (agent !== prevAgent) {
    setPrevAgent(agent);
    if (agent) {
      setRenderedAgent(agent);
      setOpenToken((t) => t + 1);
      setHidden(false);
      // Reset to the base (un-transitioned) state first so there is
      // something to transition FROM once .is-open is added a couple of
      // frames later (in the effect below) — doing both in the same
      // commit would very likely get coalesced into a single style
      // recalc with no observable "before" frame, and the modal would
      // just pop in with no fade at all.
      setIsOpen(false);
    } else {
      setIsOpen(false);
    }
  }

  // Side effects only: DOM focus management, scroll lock, and the
  // deferred (rAF / timeout) state flips that actually drive the
  // cross-fade — every setState call below happens inside a callback, not
  // synchronously in the effect body.
  useEffect(() => {
    wantsOpenRef.current = Boolean(agent);

    if (agent) {
      lastFocusedRef.current = document.activeElement as HTMLElement | null;
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      document.body.style.overflow = "hidden";

      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
        raf2 = requestAnimationFrame(() => {
          setIsOpen(true);
        });
      });

      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }

    if (hidden) {
      // Nothing to close — either this is the initial mount (the modal
      // was never opened) or it's already fully hidden. Skipping here
      // matters: without this guard, the very first mount (agent starts
      // null) would schedule a real close-timer for a modal that was
      // never visible, and that phantom timer could still be pending
      // when the user's first-ever click opens the modal moments later,
      // racing the fresh `hidden:false` against a stale `hidden:true`.
      return undefined;
    }

    // Closing: the backdrop stays in the DOM and visible (mid fade-out)
    // for a moment instead of being hidden instantly, so closing
    // cross-fades too rather than cutting. Collapsed to a ~0ms timeout
    // under reduced motion instead of hiding synchronously here — still
    // effectively immediate, but keeps every setState call in this effect
    // deferred rather than direct.
    document.body.style.overflow = "";
    if (lastFocusedRef.current) lastFocusedRef.current.focus();

    const delay = prefersReducedMotion() ? 0 : CLOSE_TRANSITION_MS;
    closeTimerRef.current = setTimeout(() => {
      // Extra guard against a reopen that happened after this timer was
      // scheduled but before it fired — see the wantsOpenRef comment
      // above.
      if (!wantsOpenRef.current) {
        setHidden(true);
      }
      closeTimerRef.current = null;
    }, delay);
    return undefined;
  }, [agent, hidden]);

  // Esc to close + a basic focus trap, active only while a modal open is
  // requested (independent of the fade animation's own timing).
  useEffect(() => {
    if (!agent) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        const root = modalRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [agent, onClose]);

  const modalStyle: CSSVars = {
    "--card-accent": `var(${renderedAgent?.accentVar ?? "--orchestrator"})`,
  };

  const showPrompt = Boolean(renderedAgent?.ready && renderedAgent.content);
  const { Body } = getReadyFigures(renderedAgent?.id ?? "");

  const readyAgents = agents.filter((a) => a.ready);
  const readyCount = readyAgents.length;
  const remainingCount = agents.length - readyCount;
  const readyNames = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).format(
    readyAgents.map((a) => a.name),
  );

  return (
    <div
      className={`modal-backdrop${isOpen ? " is-open" : ""}`}
      hidden={hidden}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-name"
        style={modalStyle}
        ref={modalRef}
      >
        <button type="button" className="modal-close" aria-label={t("close")} onClick={onClose} ref={closeButtonRef}>
          &#10005;
        </button>
        <div className="modal-figure">
          {renderedAgent ? (
            <div key={openToken}>
              {renderedAgent.ready && Body ? <Body /> : <SeedGraph seed={9} />}
            </div>
          ) : null}
        </div>
        <div className="modal-main">
          <div className="modal-header">
            <div className="modal-id">{renderedAgent ? `N.${renderedAgent.num}` : ""}</div>
            <h2 className="modal-name" id="modal-name">
              {renderedAgent?.name ?? ""}
            </h2>
            <p className="modal-role">{renderedAgent?.role ?? ""}</p>
          </div>
          <div className="prompt-toolbar">
            <span>{renderedAgent?.sourcePath ?? ""}</span>
            {showPrompt && renderedAgent?.content ? (
              <CopyButton text={renderedAgent.content} targetRef={promptRef} />
            ) : null}
          </div>
          {showPrompt && renderedAgent?.content ? (
            <pre className="prompt-body" ref={promptRef}>
              {renderedAgent.content}
            </pre>
          ) : renderedAgent ? (
            <div className="prompt-body">
              {renderedAgent.unavailable ? (
                <p className="prompt-empty">
                  {t.rich("unavailableCopy", {
                    name: renderedAgent.name,
                    link: (chunks) => (
                      <a href={renderedAgent.githubUrl} target="_blank" rel="noopener noreferrer">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              ) : (
                <p className="prompt-empty">
                  {t("notDesignedYetIntro", { name: renderedAgent.name })}
                  <br />
                  <br />
                  {t("notDesignedYetBody", {
                    name: renderedAgent.name,
                    readyCount,
                    remainingCount,
                    readyNames,
                  })}
                </p>
              )}
            </div>
          ) : (
            <div className="prompt-body" />
          )}
        </div>
      </div>
    </div>
  );
}
