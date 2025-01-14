import { type ReactNode, forwardRef } from "react";
import {
  DateRangeSelectionContext,
  type RangeDatePickerState,
  type SingleDatePickerState,
  SingleDateSelectionContext,
} from "./DatePickerContext";
import { DatePickerOverlayProvider } from "./DatePickerOverlayProvider";
import {
  type UseDatePickerRangeProps,
  type UseDatePickerSingleProps,
  useDatePicker,
} from "./useDatePicker";

/**
 * Base props for DatePicker.
 */
export interface DatePickerBaseProps {
  className?: string;
  children?: ReactNode;
  /** the open/close state of the overlay. The open/close state will be controlled when this prop is provided. */
  open?: boolean;
  /**
   * the initial open/close state of the overlay, when the open/close state is un-controlled.
   */
  defaultOpen?: DatePickerBaseProps["open"];
}

export interface DatePickerSingleProps
  extends DatePickerBaseProps,
    UseDatePickerSingleProps {
  selectionVariant: "single";
}

export interface DatePickerRangeProps
  extends DatePickerBaseProps,
    UseDatePickerRangeProps {
  selectionVariant: "range";
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

export const DatePickerMain = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePickerMain(props, ref) {
    const { className, children, ...rest } = props;
    if (props.selectionVariant === "range") {
      const stateAndHelpers = useDatePicker(rest, ref) as RangeDatePickerState;
      return (
        <DateRangeSelectionContext.Provider value={stateAndHelpers}>
          <div className={className} ref={stateAndHelpers?.state?.containerRef}>
            {children}
          </div>
        </DateRangeSelectionContext.Provider>
      );
    }
    const stateAndHelpers = useDatePicker(rest, ref) as SingleDatePickerState;
    return (
      <SingleDateSelectionContext.Provider value={stateAndHelpers}>
        <div className={className} ref={stateAndHelpers?.state?.containerRef}>
          {children}
        </div>
      </SingleDateSelectionContext.Provider>
    );
  },
);

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(props, ref) {
    const { open, defaultOpen, ...rest } = props;

    return (
      <DatePickerOverlayProvider open={open} defaultOpen={defaultOpen}>
        <DatePickerMain {...rest} ref={ref} />
      </DatePickerOverlayProvider>
    );
  },
);
