import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type Pokemon from "../interfaces/Pokemon";
import type { RootState } from "../store";

interface SelectionState {
  items: Record<string, Pokemon>;
}

// Start empty on both server and first client render to avoid hydration
// mismatches. The persisted selection is loaded post-mount via hydrateSelection
// (see StoreProvider).
const initialState: SelectionState = { items: {} };

const selectionSlice = createSlice({
  name: "selection",
  initialState,
  reducers: {
    toggleSelection: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      if (state.items[pokemon.name]) {
        delete state.items[pokemon.name];
      } else {
        state.items[pokemon.name] = pokemon;
      }
    },
    selectPokemon: (state, action: PayloadAction<Pokemon>) => {
      const pokemon = action.payload;
      state.items[pokemon.name] = pokemon;
    },
    unselectPokemon: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    clearSelection: (state) => {
      state.items = {};
    },
    hydrateSelection: (state, action: PayloadAction<Pokemon[]>) => {
      state.items = action.payload.reduce<Record<string, Pokemon>>((acc, pokemon) => {
        acc[pokemon.name] = pokemon;
        return acc;
      }, {});
    },
  },
});

export const {
  toggleSelection,
  selectPokemon,
  unselectPokemon,
  clearSelection,
  hydrateSelection,
} = selectionSlice.actions;

export const selectSelectedItems = (state: RootState) => Object.values(state.selection.items);
export const selectSelectedCount = (state: RootState) => selectSelectedItems(state).length;
export const selectIsPokemonSelected = (name: string) => (state: RootState) => Boolean(state.selection.items[name]);

export default selectionSlice.reducer;
