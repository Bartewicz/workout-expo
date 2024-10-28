import { Seconds } from "@/utils/types/aliases";
import { CamelCase } from "@/utils/types/casing";
import { useMemo, useReducer } from "react";
import type { Reducer } from "react";

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
export type WorkoutActions = Record<WorkoutActionsKey, (value: number) => void>;

export type WorkoutState = {
  repetitionExercisesCount: number;
  repetitionExercisesSetsCount: number;
  repetitionExercisesRepetitionsCount: number;
  timedExercisesCount: number;
  timedExercisesSetsCount: number;
  timedExercisesDuration: Seconds;
  setsBreakDuration: Seconds;
  exercisesBreakDuration: Seconds;
};

export const workoutInitialState = {
  repetitionExercisesCount: 1,
  repetitionExercisesSetsCount: 1,
  repetitionExercisesRepetitionsCount: 1,
  timedExercisesCount: 1,
  timedExercisesSetsCount: 1,
  timedExercisesDuration: 30,
  setsBreakDuration: 45,
  exercisesBreakDuration: 90,
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
      setRepetitionExercisesCount: (value: number) =>
        dispatch({ type: "SET_REPETITION_EXERCISES_COUNT", payload: value }),
      setRepetitionExerciseSetsCount: (value: number) =>
        dispatch({
          type: "SET_REPETITION_EXERCISE_SETS_COUNT",
          payload: value,
        }),
      setRepetitionExerciseRepetitionsCount: (value: number) =>
        dispatch({
          type: "SET_REPETITION_EXERCISE_REPETITIONS_COUNT",
          payload: value,
        }),
      setTimedExercisesCount: (value: number) =>
        dispatch({ type: "SET_TIMED_EXERCISES_COUNT", payload: value }),
      setTimedExerciseSetsCount: (value: number) =>
        dispatch({ type: "SET_TIMED_EXERCISE_SETS_COUNT", payload: value }),
      setTimedExerciseDuration: (value: number) =>
        dispatch({ type: "SET_TIMED_EXERCISE_DURATION", payload: value }),
      setRestBetweenExercises: (value: number) =>
        dispatch({ type: "SET_REST_BETWEEN_EXERCISES", payload: value }),
      setRestBetweenSets: (value: number) =>
        dispatch({ type: "SET_REST_BETWEEN_SETS", payload: value }),
    }),
    [dispatch]
  );

  return { state, actions };
};