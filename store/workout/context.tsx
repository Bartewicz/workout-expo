import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useWorkoutPlan, WorkoutPlanActions, WorkoutPlan } from './reducer';

type WorkoutContextProviderProps = {
  children: ReactNode;
};

const WorkoutContext = createContext<{
  plan: WorkoutPlan;
  actions: WorkoutPlanActions;
}>({ plan: {} as WorkoutPlan, actions: {} as WorkoutPlanActions });

export const WorkoutContextProvider = ({ children }: WorkoutContextProviderProps) => {
  const { plan, actions } = useWorkoutPlan();
  return <WorkoutContext.Provider value={{ plan, actions }}>{children}</WorkoutContext.Provider>;
};

export const useWorkoutContext = () => useContext(WorkoutContext);
