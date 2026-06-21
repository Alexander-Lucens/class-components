import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "../../test-utils";
import CardList from "../CardList";
import type Pokemon from "../../interfaces/Pokemon";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock("../../i18n/navigation", () => ({
  Link: ({ children, className }: { children?: ReactNode; className?: string }) => (
    <a className={className}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

const results: Pokemon[] = [
  {
    name: "bulbasaur",
    url: "https://pokeapi.co/api/v2/pokemon/1/",
    description: "Seed Pokémon",
  },
];

describe("CardList", () => {
  it("renders the empty state when there are no results", async () => {
    render(await CardList({ results: [], page: 1, query: "", selected: "" }));
    expect(screen.getByText("noResults")).toBeInTheDocument();
  });

  it("renders cards and marks the selected one active", async () => {
    const { container } = render(
      await CardList({
        results,
        page: 2,
        query: "bulba",
        selected: "bulbasaur",
      }),
    );
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(container.querySelector(".card--active")).not.toBeNull();
  });

  it("renders cards with a default query on page 1 without a search term", async () => {
    const { container } = render(
      await CardList({ results, page: 1, query: "", selected: "" }),
    );
    expect(screen.getByText("bulbasaur")).toBeInTheDocument();
    expect(container.querySelector(".card--active")).toBeNull();
  });
});
