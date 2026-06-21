import { Suspense } from "react";
import { setRequestLocale, getTranslations } from "next-intl/server";
import type Pokemon from "../../interfaces/Pokemon";
import { getPokemonPage, searchPokemon } from "../../lib/pokemon";
import { Link } from "../../i18n/navigation";
import SearchForm from "../../components/SearchForm";
import RefreshButton from "../../components/RefreshButton";
import CardList from "../../components/CardList";
import Pagination from "../../components/Pagination";
import DetailsPanel from "../../components/DetailsPanel";
import ErrorMessage from "../../components/ErrorMessage";
import Spinner from "../../components/Spinner";

const PAGE_SIZE = 20;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; query?: string; details?: string }>;
};

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const query = (sp.query ?? "").trim();
  const details = sp.details ?? "";

  const t = await getTranslations("Results");
  const tDetails = await getTranslations("Details");

  let results: Pokemon[] = [];
  let hasNext = false;
  let error: string | null = null;

  try {
    if (query) {
      results = await searchPokemon(query);
    } else {
      const data = await getPokemonPage(page, PAGE_SIZE);
      results = data.results;
      hasNext = data.hasNext;
    }
  } catch (caught) {
    error = caught instanceof Error ? caught.message : "Unknown error";
  }

  const closeQuery: Record<string, string> = {};
  if (page > 1) closeQuery.page = String(page);
  if (query) closeQuery.query = query;

  return (
    <div className="page-wrapper">
      <div
        className="width-wrapper"
        style={{ display: "flex", flex: 1, gap: "1rem" }}
      >
        <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <section className="search-panel">
            <SearchForm defaultValue={query} />
            <RefreshButton />
          </section>

          <section className="results-panel" style={{ flex: 1 }}>
            {error ? (
              <ErrorMessage message={error} />
            ) : (
              <CardList
                results={results}
                page={page}
                query={query}
                selected={details}
              />
            )}

            {!error && !query && results.length > 0 && (
              <Pagination page={page} hasNext={hasNext} query={query} />
            )}
          </section>
        </main>

        <aside
          className="details-wrapper"
          data-open={details ? "true" : "false"}
        >
          {details ? (
            <>
              <Link
                href={{ pathname: "/", query: closeQuery }}
                className="details-wrapper__close-btn"
                aria-label={t("closeDetails")}
              >
                ×
              </Link>
              <div className="details-wrapper__content">
                <Suspense key={details} fallback={<Spinner />}>
                  <DetailsPanel name={details} />
                </Suspense>
              </div>
            </>
          ) : (
            <p className="details-empty">{tDetails("selectPrompt")}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
