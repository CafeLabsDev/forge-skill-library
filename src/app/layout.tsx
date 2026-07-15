import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import "./globals.css";

// Scoped strictly to the "FORGE" wordmark (see .hero h1 in globals.css) —
// never used for body or prompt text, which stay on the system font stack.
// Next.js's per-text glyph subsetting (`text: "FORGE"`) isn't available in
// this next/font/google version's typings, so this ships the standard
// "latin" subset instead — still just one weight, non-variable, self-hosted
// by next/font (~20KB woff2), and still only ever applied to a single
// six-letter word.
const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Forge Skill Library",
  description:
    "Ten Forge specialists. Pick one, copy its prompt, go — no clone, no setup script.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body>{children}</body>
    </html>
  );
}
