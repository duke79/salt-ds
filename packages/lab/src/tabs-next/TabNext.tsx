import { Button, makePrefixer, useForkRef } from "@salt-ds/core";
import { useComponentCssInjection } from "@salt-ds/styles";
import { useWindow } from "@salt-ds/window";
import clsx from "clsx";
import {
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
  type MouseEvent,
  type ReactElement,
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { CloseIcon } from "@salt-ds/icons";
import tabCss from "./TabNext.css";
import { useTabs } from "./TabNextContext";

const withBaseName = makePrefixer("saltTabNext");

export interface TabNextProps extends ComponentPropsWithoutRef<"div"> {
  /* Value prop is mandatory and must be unique in order for overflow to work. */
  disabled?: boolean;
  value: string;
  onClose?: () => void;
}

export const TabNext = forwardRef<HTMLDivElement, TabNextProps>(
  function Tab(props, ref): ReactElement<TabNextProps> {
    const {
      "aria-labelledby": ariaLabelledBy,
      children,
      className,
      disabled: disabledProp,
      onClick,
      onClose,
      onKeyDown,
      onFocus,
      value,
      ...rest
    } = props;
    const targetWindow = useWindow();
    useComponentCssInjection({
      testId: "salt-tab-next",
      css: tabCss,
      window: targetWindow,
    });
    const {
      registerItem,
      variant,
      setSelected,
      selected,
      focusInside,
      handleClose,
    } = useTabs();
    const disabled = disabledProp;

    const tabRef = useRef<HTMLDivElement>(null);
    const handleRef = useForkRef(ref, tabRef);

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      onClick?.(event);
      setSelected(event, value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);

      if (event.key === "Enter" || event.key === " ") {
        setSelected(event, value);
      }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
      if (value && tabRef.current) {
        return registerItem({ id: value, element: tabRef.current });
      }
    }, [value]);

    const closeButtonId = useId();
    const labelId = useId();

    const [focused, setFocused] = useState(false);

    const handleFocus = () => {
      setFocused(true);
    };

    const handleBlur = () => {
      setFocused(false);
    };

    const handleCloseButton = (event: MouseEvent<HTMLButtonElement>) => {
      onClose?.();
      handleClose(event, value);
      event.stopPropagation();
    };

    return (
      <div
        className={clsx(withBaseName(), withBaseName(variant), className)}
        data-value={value}
        aria-selected={selected === value || undefined}
        aria-disabled={disabled}
        tabIndex={selected === value ? 0 : -1}
        ref={handleRef}
        role="tab"
        onClick={!disabled ? handleClick : undefined}
        onKeyDown={!disabled ? handleKeyDown : undefined}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-labelledby={clsx(ariaLabelledBy, labelId)}
        {...rest}
      >
        <span className={withBaseName("label")} aria-hidden id={labelId}>
          {children}
        </span>
        {onClose ? (
          <Button
            aria-label="Dismiss tab"
            id={closeButtonId}
            aria-labelledby={clsx(closeButtonId, labelId)}
            tabIndex={focused || (!focusInside && selected === value) ? 0 : -1}
            variant="secondary"
            onClick={handleCloseButton}
          >
            <CloseIcon aria-hidden />
          </Button>
        ) : null}
      </div>
    );
  },
);
