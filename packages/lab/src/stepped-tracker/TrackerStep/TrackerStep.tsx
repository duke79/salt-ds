import { makePrefixer } from "@salt-ds/core";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  StepActiveIcon,
  StepDefaultIcon,
  StepSuccessIcon,
  SuccessIcon,
  ProgressInprogressIcon,
} from "@salt-ds/icons";
import { useComponentCssInjection } from "@salt-ds/styles";
import { useWindow } from "@salt-ds/window";
import { clsx } from "clsx";
import { type ComponentPropsWithoutRef, forwardRef, useEffect, useState } from "react";
import { TrackerConnector } from "../TrackerConnector";

import {
  useSteppedTrackerContext,
  useTrackerStepContext,
} from "../SteppedTrackerContext";

import trackerStepCss from "./TrackerStep.css";

const withBaseName = makePrefixer("saltTrackerStep");

type State = "default" | "completed" | "inprogress";
type Depth = 0 | 1 | 2;

type StateWithActive = State | "active";

export interface TrackerStepProps extends ComponentPropsWithoutRef<"li"> {
  /**
   * The state of the TrackerStep
   */
  state?: State;
  /**
   * The nesting depth of the TrackerStep
   */
  depth?: Depth;
  /**
   * Can the TrackerStep be collapsed?
   */
  collapsible?: boolean;
  /**
   * Is the collapsible TrackerStep expanded?
   */
  expanded?: boolean;
}

const iconMap = {
  default: StepDefaultIcon,
  completed: StepSuccessIcon,
  "completed-sub": SuccessIcon,
  inprogress: ProgressInprogressIcon,
};

const getStateIcon = ({
  isActive,
  state,
  depth = 0,
}: {
  isActive: boolean;
  state: State;
  depth: Depth;
}) => {
  if (state === "default" && isActive) {
    return StepActiveIcon;
  }
  const parsedState =
    depth > 0 && state === "completed" ? "completed-sub" : state;
  return iconMap[parsedState];
};

const getState = ({
  isActive,
  state,
}: {
  isActive: boolean;
  state: State;
}): StateWithActive => {
  if (state === "default" && isActive) {
    return "active";
  }
  return state;
};

const ExpansionIcon = ({ expanded }: { expanded: boolean }) => {
  if (expanded) {
    return <ChevronUpIcon aria-hidden className={withBaseName("expansion-toggle-icon")} />;
  }
  return <ChevronDownIcon aria-hidden className={withBaseName("expansion-toggle-icon")} />;
}

const useCheckWithinSteppedTracker = (isWithinSteppedTracker: boolean) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      if (!isWithinSteppedTracker) {
        console.error(
          "The TrackerStep component must be placed within a SteppedTracker component",
        );
      }
    }
  }, [isWithinSteppedTracker]);
};

export const TrackerStep = forwardRef<HTMLLIElement, TrackerStepProps>(
  function TrackerStep(props, ref) {
    const {
      state = "default",
      style,
      className,
      children,
      collapsible  = false,
      expanded: expandedProp = true,
      depth = 0,
      ...restProps
    } = props;

    const targetWindow = useWindow();
    useComponentCssInjection({
      testId: "salt-tracker-step",
      css: trackerStepCss,
      window: targetWindow,
    });

    const [expanded, setExpanded] = useState(expandedProp);

    const { activeStep, totalSteps, isWithinSteppedTracker } =
      useSteppedTrackerContext();
    const { stepNumber, parents } = useTrackerStepContext();
    console.log(stepNumber, parents);

    useCheckWithinSteppedTracker(isWithinSteppedTracker);

    const isActive = activeStep === stepNumber;
    const Icon = getStateIcon({ isActive, state, depth });
    const resolvedState = getState({ isActive, state });
    const connectorState = activeStep > stepNumber ? "active" : "default";
    const hasConnector = stepNumber < totalSteps - 1;
    const depthClass = withBaseName(`depth-${depth}`);
    const iconSize = depth > 0 ? 1 : 1.5;
    const expandedClass = withBaseName(expanded ? "expanded" : "collapsed");
    const stepNumberClass = withBaseName(`step-${stepNumber}`);
    const parentClasses = parents.map((parent) => withBaseName(`child-of-${parent}`));

    const innerStyle = {
      ...style,
      "--saltTrackerStep-width": `${100 / totalSteps}%`,
    };

    const handleClick = () => {
      console.log('toggling step expansion')
      setExpanded((prev) => !prev);
    };

    return (
      <li
        className={clsx(
          withBaseName(),
          withBaseName(resolvedState),
          depthClass,
          expandedClass,
          stepNumberClass,
          ...parentClasses,
          className
        )}
        style={innerStyle}
        aria-current={isActive ? "step" : undefined}
        data-state={state}
        ref={ref}
        {...restProps}
      >
        <div className={withBaseName("indicator")}>
          <Icon className={withBaseName("icon")} size={iconSize}/>
        </div>
        {hasConnector && <TrackerConnector state={connectorState} />}
        <div className={withBaseName("body")}>{children}</div>
        {collapsible && <div className={withBaseName("indicator")}>
        <button
            className={clsx(withBaseName("expansion-toggle"))}
            onClick={handleClick}
            aria-expanded={expanded}
            type="button"
            >
            <ExpansionIcon expanded={expanded} />
          </button>
        </div>}
      </li>
    );
  },
);
