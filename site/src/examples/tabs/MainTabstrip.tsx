import { TabNext, TabstripNext } from "@salt-ds/lab";
import type { ReactElement } from "react";

const tabs = ["Home", "Transactions", "Loans", "Checks", "Liquidity"];

export const MainTabstrip = (): ReactElement => {
  return (
    <TabstripNext defaultValue={tabs[0]} align="center">
      {tabs.map((label) => (
        <TabNext value={label} key={label}>
          {label}
        </TabNext>
      ))}
    </TabstripNext>
  );
};
