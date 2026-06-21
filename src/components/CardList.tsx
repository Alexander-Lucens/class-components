import { getTranslations } from "next-intl/server";
import type Pokemon from "../interfaces/Pokemon";
import Card from "./Card";

interface CardListProps {
  results: Pokemon[];
  page: number;
  query: string;
  selected: string;
}

export default async function CardList({
  results,
  page,
  query,
  selected,
}: CardListProps) {
  const t = await getTranslations("Results");

  if (results.length === 0) {
    return <p className="no-results">{t("noResults")}</p>;
  }

  return (
    <div className="card-list">
      {results.map((pokemon) => {
        const detailsQuery: Record<string, string> = { details: pokemon.name };
        if (page > 1) detailsQuery.page = String(page);
        if (query) detailsQuery.query = query;

        return (
          <Card
            key={pokemon.name}
            name={pokemon.name}
            url={pokemon.url}
            description={pokemon.description}
            detailsQuery={detailsQuery}
            active={selected === pokemon.name}
          />
        );
      })}
    </div>
  );
}
