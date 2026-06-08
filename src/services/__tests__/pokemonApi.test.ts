import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi, getQueryErrorMessage } from "../pokemonApi";

const mockList = {
    results: [{ name: "bulbasaur", url: "https://pokeapi.co/api/v2/pokemon/1/" }],
    next: "next-url",
};
const mockDetails = { id: 1, name: "bulbasaur" };
const mockSpecies = {
    flavor_text_entries: [
        { flavor_text: "A strange seed.", language: { name: "en" } },
    ],
};

function createTestStore() {
    return configureStore({
        reducer: { [pokemonApi.reducerPath]: pokemonApi.reducer },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(pokemonApi.middleware),
    });
}

const originalFetch = globalThis.fetch;

describe("pokemonApi RTK Query service", () => {
    beforeEach(() => {
        window.localStorage.clear();
    });

    afterEach(() => {
        globalThis.fetch = originalFetch;
        window.localStorage.clear();
    });

    describe("getPokemonPage", () => {
        it("fetches pokemon page and returns results with hasNext", async () => {
            globalThis.fetch = vi
                .fn()
                .mockResolvedValueOnce({ ok: true, json: async () => mockList })
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonPage.initiate({ page: 1, pageSize: 20 }),
            );

            const state = pokemonApi.endpoints.getPokemonPage.select({
                page: 1,
                pageSize: 20,
            })(store.getState());

            expect(state.status).toBe("fulfilled");
            expect(state.data?.results).toHaveLength(1);
            expect(state.data?.results[0].name).toBe("bulbasaur");
            expect(state.data?.hasNext).toBe(true);
        });

        it("returns error when fetch fails", async () => {
            globalThis.fetch = vi
                .fn()
                .mockRejectedValueOnce(new Error("Network error"));

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonPage.initiate({ page: 1, pageSize: 20 }),
            );

            const state = pokemonApi.endpoints.getPokemonPage.select({
                page: 1,
                pageSize: 20,
            })(store.getState());

            expect(state.status).toBe("rejected");
            expect(state.error).toBeDefined();
        });

        it("caches results — does not refetch for the same page", async () => {
            const fetchMock = vi
                .fn()
                .mockResolvedValueOnce({ ok: true, json: async () => mockList })
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });
            globalThis.fetch = fetchMock;

            const store = createTestStore();

            await store.dispatch(
                pokemonApi.endpoints.getPokemonPage.initiate({ page: 1, pageSize: 20 }),
            );
            const callsAfterFirst = fetchMock.mock.calls.length;

            // Same args — should use cache
            await store.dispatch(
                pokemonApi.endpoints.getPokemonPage.initiate({ page: 1, pageSize: 20 }),
            );

            expect(fetchMock.mock.calls.length).toBe(callsAfterFirst);
        });

        it("hasNext is false when no next page", async () => {
            globalThis.fetch = vi
                .fn()
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ ...mockList, next: null }),
                })
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonPage.initiate({ page: 1, pageSize: 20 }),
            );

            const state = pokemonApi.endpoints.getPokemonPage.select({
                page: 1,
                pageSize: 20,
            })(store.getState());

            expect(state.data?.hasNext).toBe(false);
        });
    });

    describe("getPokemonByTerm", () => {
        it("fetches pokemon by search term", async () => {
            globalThis.fetch = vi
                .fn()
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonByTerm.initiate("bulbasaur"),
            );

            const state = pokemonApi.endpoints.getPokemonByTerm.select("bulbasaur")(
                store.getState(),
            );

            expect(state.status).toBe("fulfilled");
            expect(state.data).toHaveLength(1);
            expect(state.data?.[0].name).toBe("bulbasaur");
        });

        it("returns error when pokemon not found", async () => {
            globalThis.fetch = vi
                .fn()
                .mockResolvedValueOnce({ ok: false, status: 404 });

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonByTerm.initiate("unknown-pokemon"),
            );

            const state = pokemonApi.endpoints.getPokemonByTerm.select(
                "unknown-pokemon",
            )(store.getState());

            expect(state.status).toBe("rejected");
        });

        it("caches search term — does not refetch for same term", async () => {
            const fetchMock = vi
                .fn()
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });
            globalThis.fetch = fetchMock;

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonByTerm.initiate("bulbasaur"),
            );
            const callsAfterFirst = fetchMock.mock.calls.length;

            await store.dispatch(
                pokemonApi.endpoints.getPokemonByTerm.initiate("bulbasaur"),
            );

            expect(fetchMock.mock.calls.length).toBe(callsAfterFirst);
        });
    });

    describe("getPokemonDetails", () => {
        it("fetches details for a single pokemon", async () => {
            globalThis.fetch = vi
                .fn()
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonDetails.initiate("bulbasaur"),
            );

            const state = pokemonApi.endpoints.getPokemonDetails.select("bulbasaur")(
                store.getState(),
            );

            expect(state.status).toBe("fulfilled");
            expect(state.data?.name).toBe("bulbasaur");
            expect(state.data?.description).toContain("strange seed");
        });

        it("returns error state on fetch failure", async () => {
            globalThis.fetch = vi
                .fn()
                .mockRejectedValueOnce(new Error("Pokemon not found"));

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonDetails.initiate("invalid"),
            );

            const state = pokemonApi.endpoints.getPokemonDetails.select("invalid")(
                store.getState(),
            );

            expect(state.status).toBe("rejected");
        });

        it("caches pokemon details — same name does not trigger new fetch", async () => {
            const fetchMock = vi
                .fn()
                .mockResolvedValueOnce({ ok: true, json: async () => mockDetails })
                .mockResolvedValueOnce({ ok: true, json: async () => mockSpecies });
            globalThis.fetch = fetchMock;

            const store = createTestStore();
            await store.dispatch(
                pokemonApi.endpoints.getPokemonDetails.initiate("bulbasaur"),
            );
            const callsAfterFirst = fetchMock.mock.calls.length;

            await store.dispatch(
                pokemonApi.endpoints.getPokemonDetails.initiate("bulbasaur"),
            );

            expect(fetchMock.mock.calls.length).toBe(callsAfterFirst);
        });
    });

    describe("getQueryErrorMessage", () => {
        it("extracts message from CUSTOM_ERROR format", () => {
            expect(
                getQueryErrorMessage({ status: "CUSTOM_ERROR", error: "Something went wrong" }),
            ).toBe("Something went wrong");
        });

        it("extracts message from SerializedError format", () => {
            expect(
                getQueryErrorMessage({ name: "Error", message: "Serialized error" }),
            ).toBe("Serialized error");
        });

        it("extracts message from HTTP error data format", () => {
            expect(
                getQueryErrorMessage({ status: 500, data: "Internal server error" }),
            ).toBe("Internal server error");
        });

        it("returns Unknown error for null and undefined", () => {
            expect(getQueryErrorMessage(null)).toBe("Unknown error");
            expect(getQueryErrorMessage(undefined)).toBe("Unknown error");
        });

        it("returns Unknown error for non-object values", () => {
            expect(getQueryErrorMessage(42)).toBe("Unknown error");
        });

        it("returns Unknown error for empty object", () => {
            expect(getQueryErrorMessage({})).toBe("Unknown error");
        });
    });
});
