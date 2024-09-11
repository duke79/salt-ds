import { TabNext, TabstripNext } from "@salt-ds/lab";
import type { ReactElement } from "react";

const tabs = Array.from({ length: 20 }, (_, i) => `Tab ${i + 1}`);

export const OverflowMenu = (): ReactElement => {
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
