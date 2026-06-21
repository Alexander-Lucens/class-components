import "server-only";
import type Pokemon from "../interfaces/Pokemon";
import type {
  PokemonDetailsResponse,
  PokemonListResponse,
  PokemonSpeciesResponse,
} from "../types/interfaces";

const API_BASE = "https://pokeapi.co/api/v2";
const REVALIDATE = Number(process.env.REVALIDATE_SECONDS ?? "60");

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { next: { revalidate: REVALIDATE } });
  if (!response.ok) {
    throw new Error(`Server error: ${response.status}`);
  }
  return (await response.json()) as T;
}

function normalizeText(value: string): string {
  return value.replace(/[\n\f\r]+/g, " ").replace(/\s+/g, " ").trim();
}

function getDescription(species: PokemonSpeciesResponse): string {
  const english = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en",
  );
  return english ? normalizeText(english.flavor_text) : "No description available.";
}

export async function getPokemonByName(name: string): Promise<Pokemon> {
  const detail = await fetchJson<PokemonDetailsResponse>(
    `${API_BASE}/pokemon/${encodeURIComponent(name.trim().toLowerCase())}/`,
  );
  const species = await fetchJson<PokemonSpeciesResponse>(
    `${API_BASE}/pokemon-species/${detail.id}/`,
  );

  return {
    name: detail.name,
    url: `${API_BASE}/pokemon/${detail.id}/`,
    description: getDescription(species),
  };
}

export interface PokemonPage {
  results: Pokemon[];
  hasNext: boolean;
}

export async function getPokemonPage(
  page: number,
  pageSize: number,
): Promise<PokemonPage> {
  const offset = (page - 1) * pageSize;
  const list = await fetchJson<PokemonListResponse>(
    `${API_BASE}/pokemon?limit=${pageSize}&offset=${offset}`,
  );
  const results = await Promise.all(
    list.results.map((item) => getPokemonByName(item.name)),
  );

  return { results, hasNext: Boolean(list.next) };
}

export async function searchPokemon(term: string): Promise<Pokemon[]> {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return [];

  try {
    const pokemon = await getPokemonByName(normalized);
    return [pokemon];
  } catch {
    return [];
  }
}
