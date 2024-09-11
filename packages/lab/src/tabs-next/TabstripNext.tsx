import { Button, capitalize, makePrefixer, useForkRef } from "@salt-ds/core";
import { AddIcon } from "@salt-ds/icons";
import { useComponentCssInjection } from "@salt-ds/styles";
import { useWindow } from "@salt-ds/window";
import clsx from "clsx";
import {
  type ComponentPropsWithoutRef,
  type SyntheticEvent,
  type FocusEvent,
  forwardRef,
  useMemo,
  useRef,
  useState,
} from "react";

import { TabOverflowList } from "./TabOverflowList";
import tabstripCss from "./TabstripNext.css";
import { TabstripNextContext } from "./TabstripNextContext";
import { useOverflow } from "./useOverflow";
import { useTabstrip } from "./useTabstrip";

const withBaseName = makePrefixer("saltTabstripNext");

export interface TabstripNextProps
  extends Omit<ComponentPropsWithoutRef<"div">, "onChange"> {
  /* Styling active color variant. Defaults to "primary". */
  activeColor?: "primary" | "secondary";
  /* Tabs alignment. Defaults to "left" */
  align?: "left" | "center" | "right";
  /* Value for the controlled version. */
  value?: string;
  /* Callback for the controlled version. */
  onChange?: (event: SyntheticEvent, value: string) => void;
  /* Initial value for the uncontrolled version. */
  defaultValue?: string;
  /* The Tabs variant */
  variant?: "main" | "inline";
  onAdd?: () => void;
  onClose?: (event: SyntheticEvent, value: string) => void;
}

export const TabstripNext = forwardRef<HTMLDivElement, TabstripNextProps>(
  function TabstripNext(props, ref) {
    const {
      activeColor = "primary",
      align = "left",
      children,
      className,
      value,
      defaultValue,
      onAdd,
      onClose,
      onChange,
      onKeyDown,
      style,
      variant = "main",
      ...rest
    } = props;
    const targetWindow = useWindow();
    useComponentCssInjection({
      testId: "salt-tabstrip-next",
      css: tabstripCss,
      window: targetWindow,
    });

    const tabstripRef = useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(tabstripRef, ref);
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const overflowButtonRef = useRef<HTMLButtonElement>(null);

    const {
      registerItem,
      setSelected,
      selected,
      setActive,
      handleKeyDown,
      items,
      handleClose,
    } = useTabstrip({
      defaultSelected: defaultValue,
      selected: value,
      onChange,
      onClose,
    });

    const [visible, hidden, isMeasuring] = useOverflow({
      container: tabstripRef,
      tabs: items,
      children,
      selected,
      addButton: addButtonRef,
      overflowButton: overflowButtonRef,
    });

    const [focusInside, setFocusInside] = useState(false);

    const handleFocus = (event: FocusEvent) => {
      if (event.target !== addButtonRef.current) {
        setFocusInside(true);
      }
    };

    const handleBlur = () => {
      setFocusInside(false);
    };

    const contextValue = useMemo(
      () => ({
        registerItem,
        variant,
        setSelected,
        selected,
        setActive,
        focusInside,
        handleClose,
      }),
      [
        variant,
        setSelected,
        selected,
        registerItem,
        focusInside,
        handleClose,
        setActive,
      ],
    );

    const tabstripStyle = {
      "--tabstripNext-justifyContent": align,
      ...style,
    };

    return (
      <TabstripNextContext.Provider value={contextValue}>
        <div
          role="tablist"
          className={clsx(
            withBaseName(),
            withBaseName(variant),
            withBaseName("horizontal"),
            withBaseName(`activeColor${capitalize(activeColor)}`),
            className,
          )}
          style={tabstripStyle}
          ref={handleRef}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        >
          {visible}
          <TabOverflowList
            isMeasuring={isMeasuring}
            buttonRef={overflowButtonRef}
          >
            {hidden}
          </TabOverflowList>
          {onAdd && (
            <Button
              ref={addButtonRef}
              aria-label="Add Tab"
              variant="secondary"
              onClick={onAdd}
            >
              <AddIcon aria-hidden />
            </Button>
          )}
        </div>
      </TabstripNextContext.Provider>
    );
  },
);
