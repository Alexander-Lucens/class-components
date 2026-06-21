"use client";

import type { ChangeEvent } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/navigation";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  selectIsPokemonSelected,
  toggleSelection,
} from "../features/selectionSlice";

interface CardProps {
  name: string;
  url: string;
  description: string;
  detailsQuery: Record<string, string>;
  active: boolean;
}

export default function Card({
  name,
  url,
  description,
  detailsQuery,
  active,
}: CardProps) {
  const t = useTranslations("Results");
  const id = url.split("/").filter(Boolean).pop();
  const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const dispatch = useAppDispatch();
  const isSelected = useAppSelector(selectIsPokemonSelected(name));

  const handleCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    dispatch(toggleSelection({ name, url, description }));
  };

  return (
    <div
      className={`card${active ? " card--active" : ""}`}
      data-selected={isSelected ? "true" : "false"}
    >
      <input
        type="checkbox"
        aria-label={t("selectAria", { name })}
        checked={isSelected}
        onChange={handleCheckbox}
        className="card__checkbox"
      />
      <Link href={{ pathname: "/", query: detailsQuery }} className="card__link">
        <Image
          src={image}
          alt={name}
          width={96}
          height={96}
          className="card__image"
        />
        <div className="card__info">
          <h3 className="card__name">{name}</h3>
          <p className="card__description">#{id}</p>
          <p className="card__desc-text">{description}</p>
        </div>
      </Link>
    </div>
  );
}
