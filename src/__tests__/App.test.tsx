import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";
import { AppProvider } from "../context/AppContext";
import { clearSelection } from "../features/selectionSlice";
import store from "../store";

vi.mock("../pages/MainPage", () => ({
  default: () => <div>Mock Main Page</div>,
}));

const triggerError = vi.fn();
const resetError = vi.fn();
let appContextState = {
  hasError: false,
  triggerError,
  resetError,
};

vi.mock("../context/useAppContext", () => ({
  useAppContext: () => appContextState,
}));

describe("App integration", () => {
  beforeEach(() => {
    localStorage.clear();
    store.dispatch(clearSelection());
    appContextState = {
      hasError: false,
      triggerError,
      resetError,
    };
    triggerError.mockClear();
    resetError.mockClear();
  });

  it("renders App and hydrates selection from localStorage", async () => {
    localStorage.setItem(
      "selected_pokemon",
      JSON.stringify([{ name: "mew", url: "/mew", description: "psy" }])
    );

    const { container } = render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    expect(container).toBeTruthy();
    expect(screen.getByText("Mock Main Page")).toBeInTheDocument();

    await waitFor(() => {
      expect(store.getState().selection.items.mew).toBeDefined();
      expect(screen.getByRole("status")).toHaveTextContent(/1 selected/i);
    });
  });

  it("handles malformed localStorage data gracefully", async () => {
    localStorage.setItem("selected_pokemon", "not-json");

    const { container } = render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    expect(container).toBeTruthy();
    expect(screen.getByText("Mock Main Page")).toBeInTheDocument();

    await waitFor(() => {
      expect(store.getState().selection.items).toEqual({});
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });
  });

  it("renders the error boundary when the app context reports an error", async () => {
    appContextState = {
      hasError: true,
      triggerError,
      resetError,
    };

    render(
      <AppProvider>
        <App />
      </AppProvider>
    );

    expect(await screen.findByRole("heading", { name: /Something went wrong/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Try again/i })).toBeInTheDocument();
  });
});