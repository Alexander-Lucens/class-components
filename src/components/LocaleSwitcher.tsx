"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "../i18n/navigation";
import { routing } from "../i18n/routing";
import type { ChangeEvent } from "react";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    const search =
      typeof window !== "undefined" ? window.location.search : "";
    router.replace(`${pathname}${search}`, { locale: nextLocale });
  };

  return (
    <select
      className="locale-switcher"
      value={locale}
      onChange={handleChange}
      aria-label={t("label")}
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {t(loc)}
        </option>
      ))}
    </select>
  );
}
