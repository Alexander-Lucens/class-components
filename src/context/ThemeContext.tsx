import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  resolved: "light" | "dark";
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "app_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY) as Theme | null;
      return v ?? "system";
    } catch {
      return "system";
    }
  });

  const [prefersDark, setPrefersDark] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const resolved = theme === "system" ? (prefersDark ? "dark" : "light") : theme;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    const apply = (mode: "light" | "dark") => {
      document.documentElement.setAttribute("data-theme", mode);
    };

    apply(resolved);

    if (typeof window !== "undefined" && window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = (event: MediaQueryListEvent) => {
        setPrefersDark(event.matches);
        if (theme === "system") {
          apply(event.matches ? "dark" : "light");
        }
      };

      if (theme === "system") {
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", handler);
          return () => mediaQuery.removeEventListener("change", handler);
        }

        mediaQuery.addListener(handler);
        return () => mediaQuery.removeListener(handler);
      }
    }
    return;
  }, [resolved, theme]);

  const value: ThemeContextType = {
    theme,
    resolved,
    setTheme,
    toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default ThemeProvider;
