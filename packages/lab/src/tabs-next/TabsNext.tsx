import type { ReactNode } from "react";

import { TabsNextContext } from "./TabsNextContext";

export interface TabsNextProps {
  children: ReactNode;
}

export function TabsNext({ children }: TabsNextProps) {
  return (
    <TabsNextContext.Provider value={{}}>{children}</TabsNextContext.Provider>
  );
}
