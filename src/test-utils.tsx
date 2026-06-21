import type { ReactElement, ReactNode } from "react";
import { render as rtlRender, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { NextIntlClientProvider } from "next-intl";
import { makeStore, type AppStore } from "./store";
import messages from "../messages/en.json";

interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  store?: AppStore;
}

function renderWithProviders(
  ui: ReactElement,
  { store = makeStore(), ...options }: CustomRenderOptions = {},
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Provider store={store}>{children}</Provider>
      </NextIntlClientProvider>
    );
  }

  return { store, ...rtlRender(ui, { wrapper: Wrapper, ...options }) };
}

export * from "@testing-library/react";
export { renderWithProviders as render };
