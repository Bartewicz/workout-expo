import { PeriodType } from "@/constants/PeriodType";
import { Exercise } from "@/utils/types/exercise";
import {
  InitialWorkoutProgressState,
  WorkoutProgressState,
} from "@/utils/types/workoutProgress";
import { useCallback, useMemo, useState } from "react";

type useWorkoutProgressStateProps = {
  exercises: Exercise[];
  onInit: () => void;
  onComplete: () => void;
};

export const useWorkoutProgressState = ({
  exercises,
  onInit,
  onComplete,
}: useWorkoutProgressStateProps) => {
  const initialState: InitialWorkoutProgressState = useMemo(
    () => ({
      uid: "Initial",
      currentPeriodType: PeriodType.Break,
      nextExercise: exercises[0],
      nextExerciseIndex: 0,
      nextExerciseMaxSets: exercises[0].sets.length,
      nextSetIndex: 0,
    }),
    [exercises]
  );

  const [currentProgressState, setCurrentProgressState] =
    useState<WorkoutProgressState>(initialState);

  const setInitialWorkoutState = useCallback(() => {
    setCurrentProgressState(initialState);
  }, [initialState, setCurrentProgressState]);

  const setNextWorkoutState = useCallback(() => {
    if (currentProgressState.uid === "Initial") {
      const {
        nextExercise: firstExercise,
        nextExerciseIndex: firstExerciseIndex,
        nextExerciseMaxSets: firstExerciceMaxSets,
        nextSetIndex: firstSetIndex,
      } = currentProgressState;
      const hasNextSet = 1 < firstExerciceMaxSets;
      const hasNextExercise = exercises.at(1) !== undefined;

      setCurrentProgressState({
        uid: "ExerciseWorkout",
        currentPeriodType: PeriodType.Exercise,
        currentExercise: firstExercise,
        currentExerciseIndex: firstExerciseIndex,
        currentExerciseMaxSets: firstExerciceMaxSets,
        currentSetIndex: firstSetIndex,
        nextExerciseIndex: hasNextExercise ? 1 : undefined,
        nextSetIndex: hasNextSet ? 1 : undefined,
      });
      onInit();
      return;
    }

    if (currentProgressState.uid === "ExerciseWorkout") {
      if (!!currentProgressState.nextSetIndex) {
        // set break between sets
        const {
          currentExerciseIndex,
          currentExerciseMaxSets,
          currentExercise,
          nextSetIndex,
        } = currentProgressState;

        setCurrentProgressState({
          uid: "SetBreak",
          currentPeriodType: PeriodType.SetBreak,
          currentExercise,
          currentExerciseIndex,
          currentExerciseMaxSets,
          nextSetIndex,
        });
        return;
      }

      // last set -> set break between exercises
      const { currentExerciseIndex } = currentProgressState;
      const nextExerciseIndex = currentExerciseIndex + 1;
      const nextExercise = exercises[currentExerciseIndex + 1];

      setCurrentProgressState({
        uid: "Break",
        currentPeriodType: PeriodType.Break,
        nextExerciseIndex: nextExerciseIndex,
        nextExerciseMaxSets: nextExercise.sets.length,
        nextExercise: nextExercise,
        nextSetIndex: 0,
      });
      return;
    }

    if (currentProgressState.uid === "SetBreak") {
      // set next exercise set
      const {
        currentExercise,
        currentExerciseIndex,
        currentExerciseMaxSets,
        nextSetIndex,
      } = currentProgressState;
      const hasNextSet = nextSetIndex + 1 < currentExerciseMaxSets;
      const isCurrentExerciseLast =
        currentExerciseIndex === exercises.length - 1;
      const isNextSetLast = nextSetIndex + 1 === currentExerciseMaxSets;

      if (isCurrentExerciseLast && isNextSetLast) {
        setCurrentProgressState({
          uid: "LastExerciseLastSet",
          currentPeriodType: PeriodType.Exercise,
          currentExercise,
          currentExerciseIndex,
          currentExerciseMaxSets,
          currentSetIndex: nextSetIndex,
        });
        return;
      }

      setCurrentProgressState({
        uid: "ExerciseWorkout",
        currentPeriodType: PeriodType.Exercise,
        currentExercise,
        currentExerciseIndex,
        currentExerciseMaxSets,
        currentSetIndex: nextSetIndex,
        nextSetIndex: hasNextSet ? nextSetIndex + 1 : undefined,
      });
      return;
    }

    if (currentProgressState.uid === "Break") {
      const { nextExercise, nextExerciseIndex, nextExerciseMaxSets } =
        currentProgressState;
      const hasNextSet = 1 < nextExerciseMaxSets;

      // Set next exercise

      setCurrentProgressState({
        uid: "ExerciseWorkout",
        currentPeriodType: PeriodType.Exercise,
        currentExercise: nextExercise,
        currentExerciseIndex: nextExerciseIndex,
        currentExerciseMaxSets: nextExerciseMaxSets,
        currentSetIndex: 0,
        nextSetIndex: hasNextSet ? 1 : undefined,
      });
      return;
    }

    if (currentProgressState.uid === "LastExerciseLastSet") {
      setCurrentProgressState({
        uid: "Completed",
        currentPeriodType: PeriodType.Break,
      });
      return;
    }

    if (currentProgressState.uid === "Completed") {
      onComplete();
      return;
    }
  }, [exercises, currentProgressState, onComplete, onInit]);

  return { currentProgressState, setInitialWorkoutState, setNextWorkoutState };
};
