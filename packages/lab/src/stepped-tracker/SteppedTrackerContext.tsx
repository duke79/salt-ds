import { type ReactNode, createContext, useContext, useMemo } from "react";

export interface SteppedTrackerContextType {
  activeStep: number;
  totalSteps: number;
  isWithinSteppedTracker: boolean;
}

const defaultSteppedTrackerContext = {
  activeStep: 0,
  totalSteps: 1,
  isWithinSteppedTracker: false,
};

const SteppedTrackerContext = createContext(
  defaultSteppedTrackerContext as unknown as SteppedTrackerContextType,
);

type SteppedTrackerProviderProps = Omit<
  SteppedTrackerContextType,
  "isWithinSteppedTracker"
> & {
  children: ReactNode;
};

export const SteppedTrackerProvider = ({
  activeStep,
  totalSteps,
  children,
}: SteppedTrackerProviderProps) => {
  const steppedTrackerContextValue: SteppedTrackerContextType = useMemo(
    () => ({
      activeStep,
      totalSteps,
      isWithinSteppedTracker: true,
    }),
    [activeStep, totalSteps],
  );

  return (
    <SteppedTrackerContext.Provider value={steppedTrackerContextValue}>
      {children}
    </SteppedTrackerContext.Provider>
  );
};

export const useSteppedTrackerContext = () => useContext(SteppedTrackerContext);

type TrackerStepNumberContextType = {
    stepNumber: number;
    parents: number[];
};

const TrackerStepContext = createContext<TrackerStepNumberContextType>({stepNumber: 0, parents: []});

export const useTrackerStepContext = () => useContext(TrackerStepContext);

interface TrackerStepProviderProps {
  stepNumber: number;
  parents: number[];
  children: ReactNode;
}

export const TrackerStepProvider = ({
  children,
  parents,
  stepNumber,
}: TrackerStepProviderProps) => {
  return (
    <TrackerStepContext.Provider value={{stepNumber,parents}}>
      {children}
    </TrackerStepContext.Provider>
  );
};
