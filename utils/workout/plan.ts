import { WorkoutPlan } from '@/store/workout/reducer';

export const getHasPlanAllRepsExerciseInput = (plan: WorkoutPlan) =>
  [
    plan.repetitionExercisesCount,
    plan.repetitionExercisesSetsCount,
    plan.repetitionExercisesRepetitionsCount,
  ].every((value) => value);

export const getHasPlanAllTimedExerciseInput = (plan: WorkoutPlan) =>
  [plan.timedExercisesCount, plan.timedExercisesSetsCount, plan.timedExercisesDuration].every(
    (value) => value
  );

export const getHasPlanAllBreakDurations = (plan: WorkoutPlan) =>
  [plan.exercisesBreakDuration, plan.setsBreakDuration].every((value) => value);
