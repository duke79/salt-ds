import { useId } from "@salt-ds/core";
import { type ComponentPropsWithoutRef, forwardRef } from "react";

export interface TabNextPanelProps extends ComponentPropsWithoutRef<"div"> {}

export const TabNextPanel = forwardRef<HTMLDivElement, TabNextPanelProps>(
  function TabNextPanel(props, ref) {
    const { children, id: idProp, ...rest } = props;
    const id = useId(idProp);

    return (
      <div id={id} ref={ref} role="tabpanel" {...rest}>
        {children}
      </div>
    );
  },
);
