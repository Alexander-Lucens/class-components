import { describe, expect, it } from "vitest";
import { buildCsv } from "../csv";

const sample = [
  {
    name: "bulbasaur",
    url: "https://pokeapi.co/api/v2/pokemon/1/",
    description: "Seed Pokémon",
  },
];

describe("buildCsv", () => {
  it("builds a csv with the header row and values", () => {
    const csv = buildCsv(sample);
    expect(csv).toContain("name,description,url");
    expect(csv).toContain(
      "bulbasaur,Seed Pokémon,https://pokeapi.co/api/v2/pokemon/1/",
    );
  });

  it("escapes values containing commas, quotes and newlines", () => {
    const csv = buildCsv([{ name: "x", url: "/x", description: 'a, "b"\nc' }]);
    expect(csv).toContain('"a, ""b""\nc"');
  });

  it("returns only the header for an empty list", () => {
    expect(buildCsv([])).toBe("name,description,url");
  });
});
