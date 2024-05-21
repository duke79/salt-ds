import { Badge } from "@salt-ds/core";
import {
  BankCheckIcon,
  CreditCardIcon,
  HomeIcon,
  LineChartIcon,
  ReceiptIcon,
} from "@salt-ds/icons";
import { TabNext, TabstripNext, type TabstripNextProps } from "@salt-ds/lab";
import type { StoryFn } from "@storybook/react";
import { type ComponentType, useState } from "react";

import "./tabstrip-next.stories.css";

export default {
  title: "Lab/Tabs Next/Tabstrip Next",
  component: TabstripNext,
  args: {
    value: undefined,
    onChange: undefined,
  },
};

type TabstripStory = StoryFn<
  TabstripNextProps & {
    width?: number;
    tabs?: string[];
  }
>;

const tabToIcon: Record<string, ComponentType> = {
  Home: HomeIcon,
  Transactions: ReceiptIcon,
  Loans: CreditCardIcon,
  Checks: BankCheckIcon,
  Liquidity: LineChartIcon,
};

const TabstripTemplate: TabstripStory = ({
  width = 600,
  tabs = [],
  ...tabstripProps
}) => {
  return (
    <div style={{ width, minWidth: 0, maxWidth: "100%" }}>
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => (
          <TabNext value={label} key={label}>
            {label}
          </TabNext>
        ))}
      </TabstripNext>
    </div>
  );
};

export const DefaultLeftAligned = TabstripTemplate.bind({});
DefaultLeftAligned.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
};

export const MainTabBleedingIntoPrimaryBackground: TabstripStory = ({
  width = 600,
  tabs = [],
  ...tabstripProps
}) => {
  return (
    <div
      style={{
        width,
        minWidth: 0,
        maxWidth: "100%",
      }}
      className="container secondary-container"
    >
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => {
          return (
            <TabNext value={label} key={label}>
              {label}
            </TabNext>
          );
        })}
      </TabstripNext>
      <div className="inner-container primary-container" />
    </div>
  );
};

MainTabBleedingIntoPrimaryBackground.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
};

export const MainTabBleedingIntoSecondaryBackground: TabstripStory = ({
  width = 600,
  tabs = [],
  ...tabstripProps
}) => {
  return (
    <div
      style={{
        width,
        minWidth: 0,
        maxWidth: "100%",
      }}
      className="container primary-container"
    >
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => {
          return (
            <TabNext value={label} key={label}>
              {label}
            </TabNext>
          );
        })}
      </TabstripNext>
      <div className="inner-container secondary-container" />
    </div>
  );
};

MainTabBleedingIntoSecondaryBackground.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
  activeColor: "secondary",
};

export const Inline = TabstripTemplate.bind({});
Inline.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
  variant: "inline",
};

export const InlineWithSecondaryBackground: TabstripStory = ({
  width = 600,
  tabs = [],
  ...tabstripProps
}) => {
  return (
    <div
      style={{ width, display: "flex", height: 200 }}
      className="secondary-container"
    >
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => (
          <TabNext value={label} key={label}>
            {label}
          </TabNext>
        ))}
      </TabstripNext>
    </div>
  );
};

InlineWithSecondaryBackground.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
  variant: "inline",
};

export const Centered = TabstripTemplate.bind({});
Centered.args = {
  align: "center",
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
};

export const RightAligned = TabstripTemplate.bind({});
RightAligned.args = {
  align: "right",
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
};

export const WithIcon: TabstripStory = ({
  width = 600,
  tabs = [],
  ...tabstripProps
}) => {
  return (
    <div style={{ width, minWidth: 0, maxWidth: "100%" }}>
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => {
          const Icon = tabToIcon[label];
          return (
            <TabNext
              value={label}
              key={label}
              disabled={label === "Transactions"}
            >
              <Icon aria-hidden /> {label}
            </TabNext>
          );
        })}
      </TabstripNext>
    </div>
  );
};

WithIcon.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
};

export const WithBadge: TabstripStory = ({
  width = 600,
  tabs = [],
  ...tabstripProps
}) => {
  return (
    <div style={{ width, minWidth: 0, maxWidth: "100%" }}>
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => (
          <TabNext value={label} key={label}>
            {label}
            {label === "Transactions" && <Badge value={2} />}
          </TabNext>
        ))}
      </TabstripNext>
    </div>
  );
};

WithBadge.args = {
  tabs: ["Home", "Transactions", "Loans", "Checks", "Liquidity"],
};

export const LotsOfTabsTabstrip = TabstripTemplate.bind({});
LotsOfTabsTabstrip.args = {
  tabs: [
    "Home",
    "Transactions",
    "Loans",
    "Checks",
    "Liquidity",
    "With",
    "Lots",
    "More",
    "Additional",
    "Tabs",
    "Added",
    "In order to",
    "Showcase overflow",
    "Menu",
    "On",
    "Larger",
    "Screens",
  ],
};

export const Dismissable: TabstripStory = ({
  width = 600,
  ...tabstripProps
}) => {
  const [tabs, setTabs] = useState([
    "Home",
    "Transactions",
    "Loans",
    "Checks",
    "Liquidity",
  ]);

  return (
    <div style={{ width, minWidth: 0, maxWidth: "100%" }}>
      <TabstripNext defaultValue={tabs[0]} {...tabstripProps}>
        {tabs.map((label) => (
          <TabNext
            value={label}
            key={label}
            onClose={() => {
              setTabs(tabs.filter((tab) => tab !== label));
            }}
          >
            {label}
            {label === "Transactions" && <Badge value={2} />}
          </TabNext>
        ))}
      </TabstripNext>
    </div>
  );
};

export const AddTabs: TabstripStory = ({ width = 600, ...tabstripProps }) => {
  const [tabs, setTabs] = useState(["Tab 1", "Tab 2", "Tab 3"]);

  return (
    <div style={{ width, minWidth: 0, maxWidth: "100%" }}>
      <TabstripNext
        defaultValue={tabs[0]}
        onAdd={() => {
          setTabs((old) => old.concat([`Tab ${old.length + 1}`]));
        }}
        {...tabstripProps}
      >
        {tabs.map((label) => (
          <TabNext value={label} key={label}>
            {label}
            {label === "Transactions" && <Badge value={2} />}
          </TabNext>
        ))}
      </TabstripNext>
    </div>
  );
};
