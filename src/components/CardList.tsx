import Card from "./Card";
import Spinner from "./Spinner";
import ErrorMessage from "./ErrorMessage";
import type Pokemon from "../interfaces/Pokemon";

interface CardListProps {
  results: Pokemon[];
  loading: boolean;
  error: string | null;
  onCardClick?: (name: string) => void;
}

export default function CardList(props: CardListProps) {
  const { results, loading, error, onCardClick } = props;

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (results.length === 0) {
    return <p className="no-results">No pokémon found</p>;
  }

  return (
    <div className="card-list">
      {results.map((pokemon) => (
        <Card
          key={pokemon.name}
          name={pokemon.name}
          url={pokemon.url}
          description={pokemon.description}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
}
