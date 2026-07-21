"use client";

import { useRef, useState } from "react";

type CopyState = "idle" | "copied" | "manual";

/**
 * Copy-to-clipboard button with a manual-select fallback: if
 * navigator.clipboard is unavailable/blocked, falls back to a hidden
 * textarea + document.execCommand("copy"); if that also fails, selects the
 * visible prompt text so the user can copy it manually with Ctrl+C.
 */
export function CopyButton({
  text,
  targetRef,
  label = "Copy prompt",
}: {
  text: string;
  targetRef: React.RefObject<HTMLElement | null>;
  label?: string;
}) {
  const [state, setState] = useState<CopyState>("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function markCopied() {
    setState("copied");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setState("idle"), 2000);
  }

  function selectPromptTextManually() {
    const el = targetRef.current;
    if (el && window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(el);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
    setState("manual");
  }

  async function handleClick() {
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        markCopied();
        return;
      } catch {
        // fall through to the legacy fallback below
      }
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (ok) {
        markCopied();
        return;
      }
      selectPromptTextManually();
    } catch {
      document.body.removeChild(textarea);
      selectPromptTextManually();
    }
  }

  const buttonLabel = state === "copied" ? "Copied!" : state === "manual" ? "Select & Ctrl+C" : label;

  return (
    <button
      type="button"
      className="copy-btn"
      data-copied={state === "copied" ? "true" : "false"}
      onClick={handleClick}
    >
      {buttonLabel}
    </button>
  );
}
