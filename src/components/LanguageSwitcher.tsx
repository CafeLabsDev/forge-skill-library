"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("LanguageSwitcher");
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = locale === "en" ? "pt" : "en";

  return (
    <button
      type="button"
      className={`lang-switch${className ? ` ${className}` : ""}`}
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      aria-label={t("label")}
    >
      {nextLocale.toUpperCase()}
    </button>
  );
}
