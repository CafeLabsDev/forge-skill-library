import type { Metadata } from "next";
import { Bebas_Neue } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getAgents } from "@/lib/agents";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const [t, agents] = await Promise.all([
    getTranslations({ locale, namespace: "Metadata" }),
    getAgents(),
  ]);
  return {
    title: t("title"),
    description: t("description", { count: agents.length }),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={displayFont.variable}>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
