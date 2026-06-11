import type { ChangeEvent } from "react";
import type Pokemon from "../interfaces/Pokemon";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { selectIsPokemonSelected, toggleSelection } from "../features/selectionSlice";

interface CardProps extends Pokemon {
  onClick?: (name: string) => void;
}

export default function Card(props: CardProps) {
  const { name, url, description, onClick } = props;
  const id = url.split("/").filter(Boolean).pop();
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsPokemonSelected(name));

  const handleClick = () => {
    onClick?.(name);
  };

  const handleCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    dispatch(toggleSelection({ name, url, description }));
  };

  return (
    <div
      className="card"
      onClick={handleClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
      data-selected={isSelected ? "true" : "false"}
    >
      <input
        type="checkbox"
        aria-label={`Select ${name}`}
        checked={isSelected}
        onChange={handleCheckbox}
        onClick={(event) => event.stopPropagation()}
        className="card__checkbox"
      />
      <img src={image} alt={name} />
      <div className="card__info">
        <h3 className="card__name">{name}</h3>
        <p className="card__description">#{id}</p>
        <p className="card__desc-text">{description}</p>
      </div>
    </div>
  );
}
