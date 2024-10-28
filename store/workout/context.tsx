import { createContext, useContext, useMemo, useReducer } from "react";
import type { ReactNode } from "react";
import {
  useWorkoutState,
  WorkoutActions,
  workoutInitialState,
  workoutReducer,
  WorkoutState,
} from "./reducer";

type WorkoutContextProviderProps = {
  children: ReactNode;
};

const WorkoutContext = createContext<{
  state: WorkoutState;
  actions: Record<string, (value: number) => void>;
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
