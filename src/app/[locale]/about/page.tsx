import type { ReactNode } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "../../../i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");

  const link = (href: string) => (chunks: ReactNode) => (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {chunks}
    </a>
  );

  return (
    <main className="width-wrapper">
      <section className="results-panel">
        <div className="about-page">
          <h1>{t("title")}</h1>
          <div className="about-content">
            <h3>{t("courseHeading")}</h3>
            <p>
              {t.rich("course", {
                link: link("https://rs.school/courses/reactjs"),
              })}
            </p>

            <h3>{t("apiHeading")}</h3>
            <p>
              {t.rich("api", { link: link("https://pokeapi.co") })}
            </p>

            <h3>{t("authorHeading")}</h3>
            <p>
              {t.rich("author", { link: link("https://github.com/olucens/") })}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
