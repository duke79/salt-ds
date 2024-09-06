import { createContext } from "@salt-ds/core";
import { useContext } from "react";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type TabsNextContextValue = {};

export const TabsNextContext = createContext<TabsNextContextValue>(
  "TabsNextContext",
  {},
);

export function useTabsNext() {
  return useContext(TabsNextContext);
}
