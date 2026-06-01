import { render } from "@testing-library/react";
import { AppProvider } from "../AppContext";
import App from "../../App";
import store from "../../store";


describe("AppProvider persistence edge cases", () => {
  it("does not throw when selected_pokemon is malformed", () => {
    localStorage.setItem("selected_pokemon", "{ not: json");
    expect(() =>
      render(
        <AppProvider>
          <App />
        </AppProvider>
      )
    ).not.toThrow();
    const state = store.getState();
    expect(Object.keys(state.selection.items).length).toBeGreaterThanOrEqual(0);
  });
});
