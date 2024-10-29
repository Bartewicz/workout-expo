import { useMemo, useReducer } from "react";
import type { Reducer } from "react";
import type { Seconds } from "@/utils/types/aliases";
import type { CamelCase } from "@/utils/types/casing";

type WorkoutAction = {
  type:
    | "SET_REPETITION_EXERCISES_COUNT"
    | "SET_REPETITION_EXERCISE_SETS_COUNT"
    | "SET_REPETITION_EXERCISE_REPETITIONS_COUNT"
    | "SET_TIMED_EXERCISES_COUNT"
    | "SET_TIMED_EXERCISE_SETS_COUNT"
    | "SET_TIMED_EXERCISE_DURATION"
    | "SET_REST_BETWEEN_EXERCISES"
    | "SET_REST_BETWEEN_SETS";
  payload: number;
};

type WorkoutActionsKey = CamelCase<WorkoutAction["type"]>;
export type WorkoutActions = Record<
  WorkoutActionsKey,
  (textValue: string) => void
>;

export type WorkoutState = {
  repetitionExercisesCount: number | undefined;
  repetitionExercisesSetsCount: number | undefined;
  repetitionExercisesRepetitionsCount: number | undefined;
  timedExercisesCount: number | undefined;
  timedExercisesSetsCount: number | undefined;
  timedExercisesDuration: Seconds | undefined;
  setsBreakDuration: Seconds | undefined;
  exercisesBreakDuration: Seconds | undefined;
};

export const workoutInitialState = {
  repetitionExercisesCount: undefined,
  repetitionExercisesSetsCount: undefined,
  repetitionExercisesRepetitionsCount: undefined,
  timedExercisesCount: undefined,
  timedExercisesSetsCount: undefined,
  timedExercisesDuration: undefined,
  setsBreakDuration: undefined,
  exercisesBreakDuration: undefined,
};

export const workoutReducer: Reducer<WorkoutState, WorkoutAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "SET_REPETITION_EXERCISES_COUNT":
      return { ...state, repetitionExercisesCount: action.payload };
    case "SET_REPETITION_EXERCISE_SETS_COUNT":
      return { ...state, repetitionExercisesSetsCount: action.payload };
    case "SET_REPETITION_EXERCISE_REPETITIONS_COUNT":
      return { ...state, repetitionExercisesRepetitionsCount: action.payload };
    case "SET_TIMED_EXERCISES_COUNT":
      return { ...state, timedExercisesCount: action.payload };
    case "SET_TIMED_EXERCISE_SETS_COUNT":
      return { ...state, timedExercisesSetsCount: action.payload };
    case "SET_TIMED_EXERCISE_DURATION":
      return { ...state, timedExercisesDuration: action.payload };
    case "SET_REST_BETWEEN_EXERCISES":
      return { ...state, setsBreakDuration: action.payload };
    case "SET_REST_BETWEEN_SETS":
      return { ...state, exercisesBreakDuration: action.payload };
    default:
      throw new Error("Unknown action");
  }
};

export const useWorkoutState = () => {
  const [state, dispatch] = useReducer(workoutReducer, workoutInitialState);

  const actions: WorkoutActions = useMemo(
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
      setRestBetweenExercises: (textValue: string) =>
        dispatch({
          type: "SET_REST_BETWEEN_EXERCISES",
          payload: Number(textValue),
        }),
      setRestBetweenSets: (textValue: string) =>
        dispatch({ type: "SET_REST_BETWEEN_SETS", payload: Number(textValue) }),
    }),
    [dispatch]
  );

  return { state, actions };
};
