export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
  next: string | null;
}

export interface PokemonDetailsResponse {
  id: number;
  name: string;
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
}
