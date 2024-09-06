import { offset, size } from "@floating-ui/react";
import { Button, makePrefixer, useFloatingUI, useForkRef } from "@salt-ds/core";
import { OverflowMenuIcon } from "@salt-ds/icons";
import { useComponentCssInjection } from "@salt-ds/styles";
import { useWindow } from "@salt-ds/window";
import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
  forwardRef,
  useState,
} from "react";
import tabOverflowListCss from "./TabOverflowList.css";

interface TabOverflowListProps extends ComponentPropsWithoutRef<"button"> {
  buttonRef?: Ref<HTMLButtonElement>;
  children?: ReactNode;
  isMeasuring?: boolean;
}

const withBaseName = makePrefixer("saltTabOverflow");

export const TabOverflowList = forwardRef<HTMLDivElement, TabOverflowListProps>(
  function TabOverflowList(props, ref) {
    const { buttonRef, children, isMeasuring, ...rest } = props;
    const [hidden, setHidden] = useState(true);

    const targetWindow = useWindow();
    useComponentCssInjection({
      testId: "salt-tabstrip-next-overflow",
      css: tabOverflowListCss,
      window: targetWindow,
    });

    const handleClick = () => {
      setHidden((old) => !old);
    };

    const handleFocus = () => {
      setHidden(false);
    };

    const handleBlur = () => {
      setHidden(true);
    };

    const handleListClick = () => {
      setHidden(true);
    };

    const { refs, x, y, strategy } = useFloatingUI({
      open: !hidden,
      placement: "bottom-start",
      middleware: [
        offset(1),
        size({
          apply({ elements, availableHeight }) {
            Object.assign(elements.floating.style, {
              maxHeight: `max(calc((var(--salt-size-base) + var(--salt-spacing-100)) * 5), calc(${availableHeight}px - var(--salt-spacing-100)))`,
            });
          },
        }),
      ],
    });

    const handleButtonRef = useForkRef<HTMLButtonElement>(
      buttonRef,
      refs.setReference,
    );

    if (Children.count(children) === 0 && !isMeasuring) return null;

    return (
      <div className={withBaseName()} ref={ref}>
        <Button
          tabIndex={-1}
          variant="secondary"
          onClick={handleClick}
          ref={handleButtonRef}
          aria-label="More tabs"
          {...rest}
        >
          <OverflowMenuIcon aria-hidden />
        </Button>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <div
          className={withBaseName("list")}
          data-hidden={hidden}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClick={handleListClick}
          ref={refs.setFloating}
          style={
            !hidden
              ? { left: x ?? 0, top: y ?? 0, position: strategy }
              : undefined
          }
          tabIndex={-1}
        >
          <div className={withBaseName("listContainer")}>{children}</div>
        </div>
      </div>
    );
  },
);
