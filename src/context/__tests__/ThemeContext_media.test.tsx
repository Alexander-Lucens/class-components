import { render, screen, act } from "@testing-library/react";
import ThemeProvider, { useTheme } from "../ThemeContext";

function Consumer() {
  const { theme, resolved, setTheme, toggle } = useTheme();
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <span data-testid="resolved">{resolved}</span>
      <button onClick={() => setTheme("system")}>set-system</button>
      <button onClick={toggle}>toggle</button>
    </div>
  );
}

describe("ThemeContext media changes", () => {
  const listeners: Record<string, any[]> = {};

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    // mock matchMedia
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: (q: string) => {
        const m = {
          matches: false,
          media: q,
          addEventListener: (ev: string, cb: any) => {
            listeners[ev] = listeners[ev] || [];
            listeners[ev].push(cb);
          },
          removeEventListener: (ev: string, cb: any) => {
            listeners[ev] = (listeners[ev] || []).filter((f) => f !== cb);
          },
        } as unknown as MediaQueryList;
        return m;
      },
    });
  });

  it("reacts to media query change when theme=system", () => {
    render(
      <ThemeProvider>
        <Consumer />
      </ThemeProvider>
    );

    // set system
    const btn = screen.getByText("set-system");
    act(() => btn.click());

    // simulate media query change to dark
    act(() => {
      const ev = { matches: true } as MediaQueryListEvent;
      (listeners.change || []).forEach((fn) => fn(ev));
    });

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });
});
