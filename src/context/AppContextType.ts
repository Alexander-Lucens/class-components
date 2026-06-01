import { createContext } from "react";

export interface AppContextType {
  triggerError: () => void;
  hasError: boolean;
  resetError: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
