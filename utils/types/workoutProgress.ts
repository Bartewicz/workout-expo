import { PeriodType } from "@/constants/PeriodType";
import type { Exercise } from "./exercise";

interface BaseProgressState {
  uid: string;
  currentPeriodType: PeriodType;
  currentExercise?: Exercise;
  currentExerciseIndex?: number;
  currentExerciseMaxSets?: number;
  currentSetIndex?: number;
  nextExercise?: Exercise;
  nextExerciseIndex?: number;
  nextExerciseMaxSets?: number;
  nextSetIndex?: number;
}

export interface InitialWorkoutProgressState extends BaseProgressState {
  uid: "Initial";
  currentPeriodType: PeriodType.Break;
  nextExercise: Exercise;
  nextExerciseIndex: 0;
  nextExerciseMaxSets: number;
  nextSetIndex: 0;
}

interface ExerciseWorkoutProgressState extends BaseProgressState {
  uid: "ExerciseWorkout";
  currentPeriodType: PeriodType.Exercise;
  currentExerciseIndex: number;
  currentExercise: Exercise;
  currentExerciseMaxSets: number;
  currentSetIndex: number;
  nextSetIndex: number | undefined;
}

interface ExerciseSetBreakProgressState extends BaseProgressState {
  uid: "SetBreak";
  currentPeriodType: PeriodType.SetBreak;
  currentExerciseIndex: number;
  currentExercise: Exercise;
  currentExerciseMaxSets: number;
  nextSetIndex: number;
}

interface BreakProgressState extends BaseProgressState {
  uid: "Break";
  currentPeriodType: PeriodType.Break;
  nextExercise: Exercise;
  nextExerciseIndex: number;
  nextExerciseMaxSets: number;
  nextSetIndex: number;
}

interface LastExerciseProgressState extends BaseProgressState {
  uid: "LastExerciseLastSet";
  currentPeriodType: PeriodType.Exercise;
  currentExerciseIndex: number;
  currentExercise: Exercise;
  currentSetIndex: number;
}

interface FinalWorkoutProgressState extends BaseProgressState {
  uid: "Completed";
  currentPeriodType: PeriodType.Break;
}

export type WorkoutProgressState =
  | InitialWorkoutProgressState
  | ExerciseWorkoutProgressState
  | ExerciseSetBreakProgressState
  | BreakProgressState
  | LastExerciseProgressState
  | FinalWorkoutProgressState;
