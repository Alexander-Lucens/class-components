import { describe, expect, it, vi, afterEach } from "vitest";
import { getPokemonByName, getPokemonPage, searchPokemon } from "../pokemon";

const detail = { id: 25, name: "pikachu" };
const species = {
  flavor_text_entries: [
    { flavor_text: "an\nelectric\fmouse", language: { name: "en" } },
  ],
};
const list = {
  results: [{ name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" }],
  next: "https://pokeapi.co/api/v2/pokemon?offset=1",
};

function mockFetchSequence(...responses: unknown[]) {
  const fn = vi.fn();
  responses.forEach((response) =>
    fn.mockResolvedValueOnce({ ok: true, json: async () => response }),
  );
  return fn;
}

describe("lib/pokemon", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("getPokemonByName returns a normalized pokemon", async () => {
    vi.stubGlobal("fetch", mockFetchSequence(detail, species));
    const pokemon = await getPokemonByName("pikachu");
    expect(pokemon).toEqual({
      name: "pikachu",
      url: "https://pokeapi.co/api/v2/pokemon/25/",
      description: "an electric mouse",
    });
  });

  it("getPokemonByName throws on an HTTP error", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    await expect(getPokemonByName("missing")).rejects.toThrow(/404/);
  });

  it("getPokemonPage returns results and hasNext", async () => {
    vi.stubGlobal("fetch", mockFetchSequence(list, detail, species));
    const page = await getPokemonPage(1, 1);
    expect(page.results).toHaveLength(1);
    expect(page.hasNext).toBe(true);
  });

  it("searchPokemon returns an empty array on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    expect(await searchPokemon("nope")).toEqual([]);
  });
});
