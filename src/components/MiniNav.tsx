"use client";

import { useEffect, useState } from "react";

/**
 * Hidden until the hero scrolls out of view — gives a way back to the
 * install section (and the top) once the reader is deep in the gallery.
 */
export function MiniNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".hero");
    if (!(hero instanceof HTMLElement)) return;

    const onScroll = () => setVisible(window.scrollY > hero.offsetHeight - 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`mini-nav${visible ? " mini-nav-visible" : ""}`}>
      <span className="mini-nav-mark">FORGE</span>
      <a href="#gallery">Agents</a>
      <a href="#install">Install</a>
    </nav>
  );
}
