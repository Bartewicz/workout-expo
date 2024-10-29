import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import {
  useWorkoutState,
  WorkoutActions,
  workoutInitialState,
  WorkoutState,
} from "./reducer";

type WorkoutContextProviderProps = {
  children: ReactNode;
};

const WorkoutContext = createContext<{
  state: WorkoutState;
  actions: WorkoutActions;
}>({ state: workoutInitialState, actions: {} as WorkoutActions });

export const WorkoutContextProvider = ({
  children,
}: WorkoutContextProviderProps) => {
  const { state, actions } = useWorkoutState();

  return (
    <WorkoutContext.Provider value={{ state, actions }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);
