import { createContext } from "@salt-ds/core";
import { type ReactNode, type SyntheticEvent, useContext } from "react";

interface TabValue {
  id: string;
  element: HTMLElement;
}

export interface TabsContextValue {
  registerItem: (tab: TabValue) => void;
  variant: "main" | "inline";
  setSelected: (event: SyntheticEvent, id: string) => void;
  handleClose: (event: SyntheticEvent, id: string) => void;
  selected?: string;
  focusInside: boolean;
}

export const TabsContext = createContext<TabsContextValue>("TabsContext", {
  registerItem: () => undefined,
  variant: "main",
  setSelected: () => undefined,
  handleClose: () => undefined,
  selected: undefined,
  focusInside: false,
});

export function useTabs() {
  return useContext(TabsContext);
}
