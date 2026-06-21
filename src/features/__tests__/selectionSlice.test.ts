import { describe, expect, it } from "vitest";
import selectionReducer, {
  toggleSelection,
  selectPokemon,
  unselectPokemon,
  clearSelection,
  hydrateSelection,
  selectSelectedItems,
  selectSelectedCount,
  selectIsPokemonSelected,
} from "../selectionSlice";
import type { RootState } from "../../store";
import type Pokemon from "../../interfaces/Pokemon";

const sample: Pokemon = { name: "pikachu", url: "/pikachu", description: "cute" };

describe("selectionSlice", () => {
  it("toggles, selects and unselects pokemon", () => {
    let state = selectionReducer(undefined, { type: "@@init" });

    state = selectionReducer(state, toggleSelection(sample));
    expect(state.items.pikachu).toEqual(sample);

    state = selectionReducer(state, toggleSelection(sample));
    expect(state.items.pikachu).toBeUndefined();

    state = selectionReducer(state, selectPokemon(sample));
    expect(state.items.pikachu).toEqual(sample);

    state = selectionReducer(state, unselectPokemon("pikachu"));
    expect(state.items.pikachu).toBeUndefined();
  });

  it("clears and hydrates selection", () => {
    let state = selectionReducer(undefined, hydrateSelection([sample]));
    expect(Object.keys(state.items)).toHaveLength(1);

    state = selectionReducer(state, clearSelection());
    expect(Object.keys(state.items)).toHaveLength(0);
  });

  it("selectors return expected values", () => {
    const root = { selection: { items: { pikachu: sample } } } as RootState;
    expect(selectSelectedItems(root)).toEqual([sample]);
    expect(selectSelectedCount(root)).toBe(1);
    expect(selectIsPokemonSelected("pikachu")(root)).toBe(true);
    expect(selectIsPokemonSelected("unknown")(root)).toBe(false);
  });
});
