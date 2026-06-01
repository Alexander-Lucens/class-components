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

const sample = { name: "pikachu", url: "/pikachu", description: "cute" };

describe("selectionSlice reducers and selectors", () => {
  it("toggles, selects and unselects pokemon", () => {
    let state = selectionReducer(undefined as any, { type: "unknown" });
    state = selectionReducer(state, toggleSelection(sample));
    expect(state.items.pikachu).toBeDefined();

    state = selectionReducer(state, toggleSelection(sample));
    expect(state.items.pikachu).toBeUndefined();

    state = selectionReducer(state, selectPokemon(sample));
    expect(state.items.pikachu).toEqual(sample);

    state = selectionReducer(state, unselectPokemon("pikachu"));
    expect(state.items.pikachu).toBeUndefined();
  });

  it("clears and hydrates selection", () => {
    let state = { items: { a: { name: "a", url: "/a", description: "x" } } } as any;
    state = selectionReducer(state, clearSelection());
    expect(Object.keys(state.items)).toHaveLength(0);

    state = selectionReducer(state, hydrateSelection([sample]));
    expect(state.items.pikachu).toEqual(sample);
  });

  it("selectors return expected values", () => {
    const root = { selection: { items: { pikachu: sample } } } as any;
    const items = selectSelectedItems(root);
    expect(Array.isArray(items)).toBe(true);
    expect(selectSelectedCount(root)).toBe(1);
    expect(selectIsPokemonSelected("pikachu")(root)).toBe(true);
    expect(selectIsPokemonSelected("unknown")(root)).toBe(false);
  });
});
