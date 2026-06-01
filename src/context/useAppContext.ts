import { useContext } from "react";
import { AppContext, type AppContextType } from "./AppContextType";

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
