import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { getPokemonByName } from "../lib/pokemon";
import ErrorMessage from "./ErrorMessage";

export default async function DetailsPanel({ name }: { name: string }) {
  const t = await getTranslations("Details");

  let pokemon;
  try {
    pokemon = await getPokemonByName(name);
  } catch {
    return <ErrorMessage message={t("notFound")} />;
  }

  const id = pokemon.url.split("/").filter(Boolean).pop();
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <div className="pokemon-details">
      <div className="pokemon-details__content">
        <Image
          src={image}
          alt={pokemon.name}
          width={200}
          height={200}
          className="pokemon-details__image"
        />
        <div className="pokemon-details__info">
          <h2 className="pokemon-details__name">{pokemon.name}</h2>
          <p className="pokemon-details__id">#{id}</p>
          <p className="pokemon-details__description">{pokemon.description}</p>
        </div>
      </div>
    </div>
  );
}
