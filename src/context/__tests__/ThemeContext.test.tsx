import { render, screen } from "@testing-library/react";
import ThemeProvider, { useTheme } from "../ThemeContext";
import { vi } from "vitest";

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

  it("applies persisted theme and exposes hook", () => {
    localStorage.setItem("app_theme", "dark");
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId("theme").textContent).toBe("dark");
    // resolved applied to document
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("throws when used outside provider", () => {
    // suppress console error output from React
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow();
    spy.mockRestore();
  });
});
