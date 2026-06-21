import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeProvider, { useTheme } from "../ThemeContext";

function Consumer() {
  const { theme, resolved, setTheme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolved}</span>
      <button onClick={() => setTheme("dark")}>set-dark</button>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("loads the persisted theme after mount and reflects it on <html>", async () => {
    localStorage.setItem("app_theme", "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("theme").textContent).toBe("dark"),
    );
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("persists the chosen theme", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    await user.click(screen.getByText("set-dark"));
    expect(localStorage.getItem("app_theme")).toBe("dark");
    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark"),
    );
  });

  it("toggles between light and dark", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>,
    );

    // default resolved is "light" (system preference mocked to light)
    await user.click(screen.getByText("toggle"));
    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-theme")).toBe("dark"),
    );

    await user.click(screen.getByText("toggle"));
    await waitFor(() =>
      expect(document.documentElement.getAttribute("data-theme")).toBe("light"),
    );
  });

  it("throws when used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});
