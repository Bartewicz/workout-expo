import { useMemo, useReducer } from "react";
import type { Reducer } from "react";
import type { Seconds } from "@/utils/types/aliases";
import type { CamelCase } from "@/utils/types/casing";

type WorkoutPlanAction = {
  type:
    | "SET_REPETITION_EXERCISES_COUNT"
    | "SET_REPETITION_EXERCISE_SETS_COUNT"
    | "SET_REPETITION_EXERCISE_REPETITIONS_COUNT"
    | "SET_TIMED_EXERCISES_COUNT"
    | "SET_TIMED_EXERCISE_SETS_COUNT"
    | "SET_TIMED_EXERCISE_DURATION"
    | "SET_EXERCISES_BREAK_DURATION"
    | "SET_SETS_BREAK_DURATION";
  payload: number;
};

type WorkoutPlanActionsKey = CamelCase<WorkoutPlanAction["type"]>;
export type WorkoutPlanActions = Record<
  WorkoutPlanActionsKey,
  (textValue: string) => void
>;

export type WorkoutPlan = {
  repetitionExercisesCount: number;
  repetitionExercisesSetsCount: number;
  repetitionExercisesRepetitionsCount: number;
  timedExercisesCount: number;
  timedExercisesSetsCount: number;
  timedExercisesDuration: Seconds;
  setsBreakDuration: Seconds;
  exercisesBreakDuration: Seconds;
} & {};

export const workoutPlanReducer: Reducer<WorkoutPlan, WorkoutPlanAction> = (
  plan,
  action
) => {
  switch (action.type) {
    case "SET_REPETITION_EXERCISES_COUNT":
      return { ...plan, repetitionExercisesCount: action.payload };
    case "SET_REPETITION_EXERCISE_SETS_COUNT":
      return { ...plan, repetitionExercisesSetsCount: action.payload };
    case "SET_REPETITION_EXERCISE_REPETITIONS_COUNT":
      return { ...plan, repetitionExercisesRepetitionsCount: action.payload };
    case "SET_TIMED_EXERCISES_COUNT":
      return { ...plan, timedExercisesCount: action.payload };
    case "SET_TIMED_EXERCISE_SETS_COUNT":
      return { ...plan, timedExercisesSetsCount: action.payload };
    case "SET_TIMED_EXERCISE_DURATION":
      return { ...plan, timedExercisesDuration: action.payload };
    case "SET_EXERCISES_BREAK_DURATION":
      return { ...plan, exercisesBreakDuration: action.payload };
    case "SET_SETS_BREAK_DURATION":
      return { ...plan, setsBreakDuration: action.payload };
    default:
      throw new Error("Unknown action");
  }
};

export const useWorkoutPlan = () => {
  const [plan, dispatch] = useReducer(workoutPlanReducer, {} as WorkoutPlan);

  const actions: WorkoutPlanActions = useMemo(
    () => ({
      setRepetitionExercisesCount: (textValue: string) =>
        dispatch({
          type: "SET_REPETITION_EXERCISES_COUNT",
          payload: Number(textValue),
        }),
      setRepetitionExerciseSetsCount: (textValue: string) =>
        dispatch({
          type: "SET_REPETITION_EXERCISE_SETS_COUNT",
          payload: Number(textValue),
        }),
      setRepetitionExerciseRepetitionsCount: (textValue: string) =>
        dispatch({
          type: "SET_REPETITION_EXERCISE_REPETITIONS_COUNT",
          payload: Number(textValue),
        }),
      setTimedExercisesCount: (textValue: string) =>
        dispatch({
          type: "SET_TIMED_EXERCISES_COUNT",
          payload: Number(textValue),
        }),
      setTimedExerciseSetsCount: (textValue: string) =>
        dispatch({
          type: "SET_TIMED_EXERCISE_SETS_COUNT",
          payload: Number(textValue),
        }),
      setTimedExerciseDuration: (textValue: string) =>
        dispatch({
          type: "SET_TIMED_EXERCISE_DURATION",
          payload: Number(textValue),
        }),
      setExercisesBreakDuration: (textValue: string) =>
        dispatch({
          type: "SET_EXERCISES_BREAK_DURATION",
          payload: Number(textValue),
        }),
      setSetsBreakDuration: (textValue: string) =>
        dispatch({
          type: "SET_SETS_BREAK_DURATION",
          payload: Number(textValue),
        }),
    }),
    [dispatch]
  );

  return { plan, actions };
};
