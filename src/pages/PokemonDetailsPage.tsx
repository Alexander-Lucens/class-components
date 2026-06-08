import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import ButtonComponent from "../components/ButtonComponent";
import { useParams } from "react-router-dom";
import {
    useGetPokemonDetailsQuery,
    getQueryErrorMessage,
} from "../services/pokemonApi";

export default function PokemonDetailsPage() {
    const { pokemonName } = useParams<{ pokemonName: string }>();

    const {
        data: pokemon,
        isLoading,
        error,
        refetch,
    } = useGetPokemonDetailsQuery(pokemonName ?? "", { skip: !pokemonName });

    const id = pokemon?.url?.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <ErrorMessage message={getQueryErrorMessage(error)} />;
    }

    if (!pokemon) {
        return <p className="no-results">No Pokémon details found.</p>;
    }

    return (
        <div className="pokemon-details">
            <div className="pokemon-details__header">
                <ButtonComponent
                    className="btn-refresh"
                    onClick={() => void refetch()}
                    aria-label="Refresh pokemon details"
                >
                    Refresh
                </ButtonComponent>
            </div>
            <div className="pokemon-details__content">
                <img
                    src={image}
                    alt={pokemon.name}
                    className="pokemon-details__image"
                />
                <div className="pokemon-details__info">
                    <h2 className="pokemon-details__name">{pokemon.name}</h2>
                    <p className="pokemon-details__id">#{id}</p>
                    <p className="pokemon-details__description">
                        {pokemon.description}
                    </p>
                </div>
            </div>
        </div>
    );
}
