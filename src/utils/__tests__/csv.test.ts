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

  it("escapes a quote-only value", () => {
    expect(buildCsv([{ name: "q", url: "/q", description: 'has "quote"' }])).toContain(
      '"has ""quote"""',
    );
  });

  it("escapes a newline-only value", () => {
    expect(
      buildCsv([{ name: "n", url: "/n", description: "line1\nline2" }]),
    ).toContain('"line1\nline2"');
  });

  it("returns only the header for an empty list", () => {
    expect(buildCsv([])).toBe("name,description,url");
  });
});
