import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { useWorkoutContext } from "@/store/workout/context";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { Centiseconds, Miliseconds, TimeRange } from "@/utils/types/time";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { WorkoutPlan } from "@/store/workout/reducer";
import { Exercise, RepsExercise, TimedExercise } from "@/utils/types/exercise";
import { PeriodType } from "@/constants/PeriodType";
import {
  InitialWorkoutProgressState,
  WorkoutProgressState,
} from "@/utils/types/workoutProgress";
import { Timer } from "@/components/Timer";
import { GlobalTimer } from "@/components/GlobalTimer";

type GlobalTimerState = "uninitialised" | "running" | "paused" | "completed";

const timeFormatter = {
  seconds: {
    format: (time: number) => {
      const centisecondsStr = Math.floor(time / 10)
        .toString()
        .padStart(4, "0");
      const [dozenSeconds, seconds, deciSecond, centiSecond] = centisecondsStr;
      const formattedSeconds = seconds + "." + deciSecond + centiSecond;

      if (dozenSeconds === "0") {
        return formattedSeconds;
      }
      return dozenSeconds + formattedSeconds;
    },
  },
};

const composeExercisesFromPlan = (plan: WorkoutPlan): Exercise[] => {
  const repsExerciseSets = new Array<RepsExercise["sets"][number]>(
    plan.repetitionExercisesSetsCount
  ).fill({
    reps: plan.repetitionExercisesRepetitionsCount,
  });
  const repsExercises: Exercise[] = new Array<RepsExercise>(
    plan.repetitionExercisesCount
  ).fill({
    type: "reps",
    sets: [...repsExerciseSets],
  });

  const timedExerciseSets = new Array<TimedExercise["sets"][number]>(
    plan.timedExercisesSetsCount
  ).fill({
    time: plan.timedExercisesDuration,
  });
  const timedExercises: Exercise[] = new Array<TimedExercise>(
    plan.timedExercisesCount
  ).fill({
    type: "time",
    sets: [...timedExerciseSets],
  });

  return repsExercises.concat(timedExercises);
};

export default function WorkoutScreen() {
  const { plan } = useWorkoutContext();
  const exercises = composeExercisesFromPlan(plan);

  const timerRefInterval = useRef<ReturnType<typeof setInterval>>();
  const [time, setTime] = useState<Centiseconds>(0);
  const [startTime, setStartTime] = useState<Miliseconds>();
  const [endTime, setEndTime] = useState<Miliseconds>();
  const [timestamps, setTimestamps] = useState<TimeRange[]>([]);
  const [globalTimerState, setGlobalTimerState] =
    useState<GlobalTimerState>("uninitialised");

  const initialState: InitialWorkoutProgressState = {
    uid: "Initial",
    currentPeriodType: PeriodType.Break,
    nextExercise: exercises[0],
    nextExerciseIndex: 0,
    nextExerciseMaxSets: exercises[0].sets.length,
    nextSetIndex: 0,
  };

  const [currentProgressState, setCurrentProgressState] =
    useState<WorkoutProgressState>(initialState);

  // Todo: maybe I can use that for determining timestamps?
  const { currentExerciseIndex } = currentProgressState;

  const onTogglePaused = () => {
    switch (globalTimerState) {
      case "paused": {
        setGlobalTimerState("running");
        return;
      }
      case "running":
      default: {
        setGlobalTimerState("paused");
        return;
      }
    }
  };

  const onClickReset = () => {
    setGlobalTimerState("uninitialised");
    setCurrentProgressState(initialState);
  };

  const onPressWorkoutToggle = () => {
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
      setStartTime(Date.now());
      setGlobalTimerState("running");
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
      setGlobalTimerState("completed");
      setEndTime(Date.now());
      setCurrentProgressState({
        uid: "Completed",
        currentPeriodType: PeriodType.Break,
      });
      return;
    }
    if (currentProgressState.uid === "Completed") {
      return void 0;
    }
  };

  const isGloballyUninitialised = globalTimerState === "uninitialised";
  const isGloballyPaused = globalTimerState === "paused";
  const isExerciseTimeNow =
    currentProgressState.currentPeriodType === "exercise";
  const isCompleted = currentProgressState.uid === "Completed";

  return (
    <ParallaxScrollView
      height={100}
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      header={
        <View style={styles.titleContainer}>
          <ThemedText type="title" style={styles.title}>
            {globalTimerState === "uninitialised"
              ? "Rozpocznij trening! 🚀"
              : "Budowanie mięśni w trakcie... 💪"}
          </ThemedText>
        </View>
      }
    >
      <View style={styles.contentContainer}>
        <GlobalTimer state={globalTimerState} />
        <View style={styles.mainContentContainer}>
          <Pressable
            disabled={isGloballyUninitialised}
            onPress={onClickReset}
            style={getActionBtnResetStyles({
              isGloballyUninitialised,
            })}
          >
            <Ionicons name="refresh" color={Colors.common.primary} size={50} />
          </Pressable>
          <Timer state={globalTimerState} />
          <Pressable
            disabled={isGloballyUninitialised}
            onPress={onTogglePaused}
            style={getActionBtnTogglePauseStyles({
              isGloballyUninitialised,
              isGloballyPaused,
            })}
          >
            <Ionicons
              name={
                isGloballyUninitialised || isGloballyPaused ? "play" : "pause"
              }
              color={Colors.common.primary}
              size={50}
            />
          </Pressable>
        </View>
        {/* TODO: Add bounce animation on click: https://reactnative.dev/docs/animations */}
        {/* <Animated.View > */}
        <Pressable
          onPress={onPressWorkoutToggle}
          disabled={isGloballyPaused}
          style={getMainActionBtnStyles({
            isExerciseTimeNow,
            isGloballyPaused,
          })}
        >
          <Ionicons
            name={getMainActionBtnIconName({
              isCompleted,
              isExerciseTimeNow,
              isGloballyUninitialised,
            })}
            color={isCompleted ? Colors.common.gold : Colors.common.primary}
            size={50}
          />
        </Pressable>
        {/* </Animated.View> */}
      </View>
      <View style={{ alignItems: "center" }}>
        <ThemedText>Faza: {currentProgressState.uid}</ThemedText>
        <ThemedText>
          Nr ćwiczenia:{" "}
          {typeof currentProgressState.currentExerciseIndex === "number" &&
            currentProgressState.currentExerciseIndex + 1}
        </ThemedText>
        <ThemedText>
          Typ: {currentProgressState.currentExercise?.type}
        </ThemedText>
        <ThemedText>
          Set:{" "}
          {typeof currentProgressState.currentSetIndex === "number" &&
            currentProgressState.currentSetIndex + 1}
        </ThemedText>
        {currentProgressState.currentExercise?.type === "reps" ? (
          <ThemedText>
            Ilość powtórzeń:{" "}
            {
              currentProgressState.currentExercise?.sets[
                currentProgressState.currentSetIndex || 0
              ].reps
            }
          </ThemedText>
        ) : currentProgressState.currentExercise?.type === "time" ? (
          <ThemedText>
            Czas trwania:{" "}
            {timeFormatter.seconds.format(
              currentProgressState.currentExercise.sets[
                currentProgressState.currentSetIndex || 0
              ].time
            )}{" "}
            s
          </ThemedText>
        ) : (
          <ThemedText> </ThemedText>
        )}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    lineHeight: 38,
  },
  contentContainer: { alignItems: "center" },
  mainContentContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    borderColor: Colors.common.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnReset: {
    borderWidth: 4,
    borderRadius: 40,
    width: 80,
    height: 80,
    transform: "scaleX(-1) rotate(-45deg)",
    paddingBottom: 5,
  },
  actionBtnTogglePause: {
    borderWidth: 4,
    borderRadius: 40,
    alignSelf: "flex-end",
    width: 80,
    height: 80,
  },
  actionBtnWorkoutMain: {
    borderWidth: 5,
    borderRadius: 50,
    width: 100,
    height: 100,
  },
});

function getMainActionBtnIconName({
  isCompleted,
  isExerciseTimeNow,
  isGloballyUninitialised,
}: {
  isCompleted: boolean;
  isExerciseTimeNow: boolean;
  isGloballyUninitialised: boolean;
}) {
  switch (true) {
    case isGloballyUninitialised:
      return "rocket";
    case isExerciseTimeNow:
      return "barbell-outline";
    case isCompleted:
      return "trophy";
    default:
      return "timer-outline";
  }
}

function getActionBtnResetStyles({
  isGloballyUninitialised,
}: {
  isGloballyUninitialised: boolean;
}) {
  return [
    styles.actionBtn,
    styles.actionBtnReset,
    isGloballyUninitialised && {
      opacity: 0.5,
    },
  ];
}

function getActionBtnTogglePauseStyles({
  isGloballyUninitialised,
  isGloballyPaused,
}: {
  isGloballyUninitialised: boolean;
  isGloballyPaused: boolean;
}) {
  const isNotRunning = isGloballyUninitialised || isGloballyPaused;
  return [
    styles.actionBtn,
    styles.actionBtnTogglePause,
    isNotRunning && {
      paddingLeft: 5,
    },
    isGloballyUninitialised && {
      opacity: 0.5,
    },
  ];
}

function getMainActionBtnStyles({
  isExerciseTimeNow,
  isGloballyPaused,
}: {
  isExerciseTimeNow: boolean;
  isGloballyPaused: boolean;
}) {
  return [
    styles.actionBtn,
    styles.actionBtnWorkoutMain,
    isExerciseTimeNow && {
      transform: "rotate(-45deg)",
    },
    isGloballyPaused && {
      opacity: 0.5,
    },
  ];
}
