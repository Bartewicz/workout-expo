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
  // Todo: eventually remove mock
  // const { plan, actions } = useWorkoutPlan();
  const { actions } = useWorkoutPlan();
  const planMock: WorkoutPlan = {
    repetitionExercisesCount: 8,
    repetitionExercisesSetsCount: 4,
    repetitionExercisesRepetitionsCount: 10,
    timedExercisesCount: 1,
    timedExercisesSetsCount: 4,
    timedExercisesDuration: 45,
    exercisesBreakDuration: 90,
    setsBreakDuration: 45,
  };

  return (
    <WorkoutContext.Provider value={{ plan: planMock, actions }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkoutContext = () => useContext(WorkoutContext);
