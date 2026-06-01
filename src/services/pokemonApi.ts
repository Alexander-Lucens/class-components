import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type Pokemon from "../interfaces/Pokemon";
import {
    fetchPokemonPage,
    fetchPokemonByTerm,
    fetchPokemonDetails,
} from "../api/fetch-data-api";

const CACHE_TTL = parseInt(import.meta.env.VITE_CACHE_TTL ?? "60", 10);

export interface PokemonPageResult {
    results: Pokemon[];
    hasNext: boolean;
}

export interface PokemonPageArgs {
    page: number;
    pageSize: number;
}

function serializeError(error: unknown): string {
    if (error instanceof Error) return error.message;
    return "Unknown error";
}

export const pokemonApi = createApi({
    reducerPath: "pokemonApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://pokeapi.co/api/v2/" }),
    keepUnusedDataFor: CACHE_TTL,
    tagTypes: ["Pokemon", "PokemonPage"],
    endpoints: (builder) => ({
        getPokemonPage: builder.query<PokemonPageResult, PokemonPageArgs>({
            queryFn: async ({ page, pageSize }) => {
                try {
                    const data = await fetchPokemonPage(page - 1, pageSize);
                    return { data };
                } catch (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR" as const,
                            error: serializeError(error),
                        },
                    };
                }
            },
            providesTags: (_result, _error, { page }) => [
                { type: "PokemonPage", id: page },
            ],
        }),

        getPokemonByTerm: builder.query<Pokemon[], string>({
            queryFn: async (term) => {
                try {
                    const data = await fetchPokemonByTerm(term);
                    return { data };
                } catch (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR" as const,
                            error: serializeError(error),
                        },
                    };
                }
            },
            providesTags: (_result, _error, term) => [
                { type: "Pokemon", id: term },
            ],
        }),

        getPokemonDetails: builder.query<Pokemon, string>({
            queryFn: async (name) => {
                try {
                    const data = await fetchPokemonDetails(
                        `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}/`,
                    );
                    return { data };
                } catch (error) {
                    return {
                        error: {
                            status: "CUSTOM_ERROR" as const,
                            error: serializeError(error),
                        },
                    };
                }
            },
            providesTags: (_result, _error, name) => [
                { type: "Pokemon", id: name },
            ],
        }),
    }),
});

export const {
    useGetPokemonPageQuery,
    useGetPokemonByTermQuery,
    useGetPokemonDetailsQuery,
} = pokemonApi;

export function getQueryErrorMessage(error: unknown): string {
    if (!error || typeof error !== "object") return "Unknown error";
    if ("error" in error) return String((error as { error: string }).error);
    if ("message" in error) return String((error as { message: string }).message);
    if ("data" in error) return String((error as { data: unknown }).data);
    return "Unknown error";
}
