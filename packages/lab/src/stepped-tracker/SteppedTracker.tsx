import { makePrefixer } from "@salt-ds/core";
import { useComponentCssInjection } from "@salt-ds/styles";
import { useWindow } from "@salt-ds/window";
import { clsx } from "clsx";
import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
  forwardRef,
  isValidElement,
  useEffect,
} from "react";

import {
  SteppedTrackerProvider,
  TrackerStepProvider,
} from "./SteppedTrackerContext";

import steppedTrackerCss from "./SteppedTracker.css";

const withBaseName = makePrefixer("saltSteppedTracker");

export interface SteppedTrackerProps extends ComponentPropsWithoutRef<"ul"> {
  /**
   * The index of the current activeStep
   */
  activeStep: number;
  /**
   * Should be one or more TrackerStep components
   */
  children: ReactNode;
  /**
   * The orientation of the SteppedTracker. Defaults to `horizontal`
   */
  orientation?: "horizontal" | "vertical";
}

const useCheckInvalidChildren = (children: ReactNode) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      let hasInvalidChild = false;
      Children.forEach(children, (child) => {
        if (!isValidElement(child)) {
          hasInvalidChild = true;
        }
      });

      if (hasInvalidChild) {
        console.error(
          "Invalid child: children of SteppedTracker must be a TrackerStep component",
        );
      }
    }
  }, [children]);
};

const getDepthMap = (children: ReactNode) => {

    const depths = Children.map(children, (child, i) => isValidElement(child) ? child.props.depth || 0 : 0);

    const result = depths.reduce((acc, depth, i) => {
        const lastIndexAtDepth = acc.lastIndexAtDepth;

        const newAncestors = Array.from(Array(10).keys())
            .map(d => lastIndexAtDepth[d])
            .filter(index => index !== undefined);

        lastIndexAtDepth[depth] = i;

        const ancestors = [...acc.ancestors, newAncestors]

        return { lastIndexAtDepth, ancestors };
    }, { lastIndexAtDepth: [], ancestors: [] });
    return result.ancestors;
};

export const SteppedTracker = forwardRef<HTMLUListElement, SteppedTrackerProps>(
  function SteppedTracker(
    {
      children,
      className,
      activeStep,
      orientation = "horizontal",
      ...restProps
    },
    ref,
  ): ReactElement<SteppedTrackerProps> {
    const targetWindow = useWindow();
    useComponentCssInjection({
      testId: "salt-stepped-tracker",
      css: steppedTrackerCss,
      window: targetWindow,
    });
    useCheckInvalidChildren(children);

    const depthMap = getDepthMap(children);
    
    console.log({depthMap})

    const totalSteps = Children.count(children);

    return (
      <SteppedTrackerProvider totalSteps={totalSteps} activeStep={activeStep}>
        <ul
          className={clsx(withBaseName(), className, withBaseName(orientation))}
          ref={ref}
          {...restProps}
        >
          {Children.map(children, (child, i) => (
            <TrackerStepProvider stepNumber={i} parents={depthMap[i]}>{child}</TrackerStepProvider>
          ))}
        </ul>
      </SteppedTrackerProvider>
    );
  },
);
