import { useEffect, useState, type ReactNode } from "react";
import { AppContext, type AppContextType } from "./AppContextType";
import ThemeProvider from "./ThemeContext";
import { Provider as ReduxProvider } from "react-redux";
import store from "../store";
import { hydrateSelection } from "../features/selectionSlice";
import type { RootState } from "../types/store";

export function AppProvider({ children }: { children: ReactNode }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("selected_pokemon");
      const parsed = raw ? (JSON.parse(raw) as Array<{ name: string; url: string; description: string }>) : [];
      store.dispatch(hydrateSelection(parsed));
    } catch {
      // ignore malformed persisted state and start from empty selection
      store.dispatch(hydrateSelection([]));
    }
  }, []);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      try {
        const selected = Object.values((store.getState() as RootState).selection.items);
        window.localStorage.setItem("selected_pokemon", JSON.stringify(selected));
      } catch {
        // ignore persistence failures in tests/private mode
      }
    });

    return unsubscribe;
  }, []);

  const value: AppContextType = {
    triggerError: () => setHasError(true),
    hasError,
    resetError: () => {
      setHasError(false);
    },
  };

  return (
    <AppContext.Provider value={value}>
      <ReduxProvider store={store}>
        <ThemeProvider>{children}</ThemeProvider>
      </ReduxProvider>
    </AppContext.Provider>
  );
}
