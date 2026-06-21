"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore, type AppStore, type RootState } from "../store";
import { hydrateSelection } from "../features/selectionSlice";
import type Pokemon from "../interfaces/Pokemon";

const STORAGE_KEY = "selected_pokemon";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  const store = storeRef.current;

  // Load persisted selection after mount (keeps SSR and first client render in sync).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Pokemon[]) : [];
      store.dispatch(hydrateSelection(parsed));
    } catch {
      store.dispatch(hydrateSelection([]));
    }
  }, [store]);

  // Persist selection whenever it changes.
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      try {
        const selected = Object.values(
          (store.getState() as RootState).selection.items,
        );
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
      } catch {
        // ignore persistence failures (private mode, quota, SSR)
      }
    });
    return unsubscribe;
  }, [store]);

  return <Provider store={store}>{children}</Provider>;
}
