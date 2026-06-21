import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DetailsPanel from "../DetailsPanel";
import { getPokemonByName } from "../../lib/pokemon";

vi.mock("next-intl/server", () => ({
  getTranslations: async () => (key: string) => key,
}));

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    <img alt={alt} src={src} />
  ),
}));

vi.mock("../../lib/pokemon", () => ({
  getPokemonByName: vi.fn(),
}));

describe("DetailsPanel", () => {
  it("renders the server-fetched pokemon", async () => {
    vi.mocked(getPokemonByName).mockResolvedValueOnce({
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
      description: "an electric mouse",
    });

    render(await DetailsPanel({ name: "pikachu" }));

    expect(screen.getByText("pikachu")).toBeInTheDocument();
    expect(screen.getByText("#25")).toBeInTheDocument();
    expect(screen.getByText("an electric mouse")).toBeInTheDocument();
    expect(screen.getByAltText("pikachu")).toBeInTheDocument();
  });

  it("shows an error message when the fetch fails", async () => {
    vi.mocked(getPokemonByName).mockImplementationOnce(async () => {
      throw new Error("nope");
    });

    render(await DetailsPanel({ name: "missing" }));

    expect(screen.getByRole("alert")).toHaveTextContent("notFound");
  });
});
