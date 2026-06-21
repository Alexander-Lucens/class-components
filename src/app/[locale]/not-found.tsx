"use client";

import { useTranslations } from "next-intl";
import { Link } from "../../i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <main className="width-wrapper">
      <section className="results-panel">
        <div className="error-boundary">
          <h2>{t("title")}</h2>
          <p className="error-boundary__message">{t("message")}</p>
          <Link href="/" className="back-home">
            {t("backHome")}
          </Link>
        </div>
      </section>
    </main>
  );
}
