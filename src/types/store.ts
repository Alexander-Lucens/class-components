import type Pokemon from "../interfaces/Pokemon";

export interface CounterState {
  value: number;
}

export interface SelectionState {
  items: Record<string, Pokemon>;
}

export interface RootState {
  counter: CounterState;
  selection: SelectionState;
}
