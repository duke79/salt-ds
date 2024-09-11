import { TabNext, TabstripNext } from "@salt-ds/lab";
import type { ReactElement } from "react";

const tabs = ["Home", "Transactions", "Loans", "Checks", "Liquidity"];

export const Inline = (): ReactElement => {
  return (
    <TabstripNext
      variant="inline"
      defaultValue={tabs[0]}
      style={{ maxWidth: "400px", margin: "auto" }}
    >
      {tabs.map((label) => (
        <TabNext value={label} key={label}>
          {label}
        </TabNext>
      ))}
    </TabstripNext>
  );
};
