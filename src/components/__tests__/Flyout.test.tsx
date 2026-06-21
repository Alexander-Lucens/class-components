import { describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "../../test-utils";
import { makeStore } from "../../store";
import { selectPokemon } from "../../features/selectionSlice";
import Flyout from "../Flyout";

describe("Flyout", () => {
  it("is hidden when nothing is selected", () => {
    render(<Flyout />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("shows the selection count and clears the selection", async () => {
    const user = userEvent.setup();
    const store = makeStore();
    store.dispatch(
      selectPokemon({
        name: "bulbasaur",
        url: "https://pokeapi.co/api/v2/pokemon/1/",
        description: "Seed Pokémon",
      }),
    );

    render(<Flyout />, { store });

    expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /unselect all/i }));
    expect(store.getState().selection.items).toEqual({});
  });
});
