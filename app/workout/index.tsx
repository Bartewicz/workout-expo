import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { useWorkoutContext } from "@/store/workout/context";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { Centiseconds, Miliseconds } from "@/utils/types/aliases";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { WorkoutPlan } from "@/store/workout/reducer";

type GlobalTimerState = "uninitialised" | "running" | "paused" | "completed";

enum PeriodType {
  Exercise = "exercise",
  SetBreak = "setBreak",
  Break = "break",
}

type Timestamps = {
  startTime: Centiseconds;
  endTime: Centiseconds;
};

type ExerciseType = "reps" | "time";
type BaseExercise = {
  type: ExerciseType;
};
type RepsExercise = BaseExercise & {
  type: "reps";
  sets: { reps: number }[];
};
type TimedExercise = BaseExercise & {
  type: "time";
  sets: { time: number }[];
};
type Exercise = (RepsExercise & {}) | (TimedExercise & {});

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
interface InitialWorkoutProgressState extends BaseProgressState {
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
type WorkoutProgressState =
  | InitialWorkoutProgressState
  | ExerciseWorkoutProgressState
  | ExerciseSetBreakProgressState
  | BreakProgressState
  | LastExerciseProgressState
  | FinalWorkoutProgressState;

const ONE_MINUTE_MS = 60_000;
const ONE_HOUR_MS = 3_600_000;

const timeFormatter = {
  seconds: new Intl.DateTimeFormat("default", {
    second: "numeric",
    fractionalSecondDigits: 2,
  }),
  minutes: new Intl.DateTimeFormat("default", {
    minute: "numeric",
    second: "2-digit",
    // fractionalSecondDigits: 2,
  }),
  hours: new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    // fractionalSecondDigits: 2,
  }),
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

  const [time, setTime] = useState<Centiseconds>(0);
  const [startTime, setStartTime] = useState<Miliseconds>();
  const [endTime, setEndTime] = useState<Miliseconds>();
  const [timestamps, setTimestamps] = useState<Timestamps[]>([]);
  const [globalTimerState, setGlobalTimerState] =
    useState<GlobalTimerState>("uninitialised");
  const [formatterType, setFormatterType] =
    useState<keyof typeof timeFormatter>("seconds");

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

  // Global time passed
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (globalTimerState === "running") {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }

    return () => clearInterval(interval);
  }, [globalTimerState, setTime]);

  // Switch formatter
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (globalTimerState === "running") {
      if (time >= ONE_MINUTE_MS) {
        timeout = setTimeout(() => {
          setFormatterType("minutes");
        }, ONE_MINUTE_MS - time);
      } else if (time >= ONE_HOUR_MS) {
        timeout = setTimeout(() => {
          setFormatterType("hours");
        }, ONE_HOUR_MS - time);
      }
    }

    return () => clearTimeout(timeout);
  }, [globalTimerState]);

  const onTogglePaused = () => {
    switch (globalTimerState) {
      case "running": {
        return setGlobalTimerState("paused");
      }
      case "paused":
      default: {
        return setGlobalTimerState("running");
      }
    }
  };

  const onClickReset = () => {
    setTime(0);
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

      setStartTime(Date.now());
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

      console.log("exercises", exercises);
      console.log("currentExerciseIndex", currentExerciseIndex);
      console.log("exercises.length - 1", exercises.length - 1);
      console.log("isCurrentExerciseLast", isCurrentExerciseLast);
      console.log("isNextSetLast", isNextSetLast);

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
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      header={
        <View style={styles.titleContainer}>
          <ThemedText type="title">
            {globalTimerState === "uninitialised"
              ? "Rozpocznij trening! 🚀"
              : "Budowanie mięśni w trakcie... 💪"}
          </ThemedText>
        </View>
      }
    >
      <View style={styles.contentContainer}>
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
        <View style={styles.globalTimer}>
          <ThemedText>{timeFormatter[formatterType].format(time)}</ThemedText>
        </View>
        <View style={styles.mainContentContainer}>
          <Pressable
            disabled={isGloballyUninitialised}
            onPress={onClickReset}
            style={getActionBtnResetStyles({
              isGloballyUninitialised,
            })}
          >
            <Ionicons
              name="refresh"
              color={Colors.dark.backgroundInteractive}
              size={50}
            />
          </Pressable>
          <View style={styles.mainTimerContainer}>
            <ThemedText style={styles.mainTimerText}>
              {timeFormatter[formatterType].format(time)}
            </ThemedText>
          </View>
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
              color={Colors.dark.backgroundInteractive}
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
            color={Colors.dark.backgroundInteractive}
            size={50}
          />
        </Pressable>
        {/* </Animated.View> */}
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  contentContainer: { alignItems: "center" },
  globalTimer: {
    marginBottom: 20,
  },
  mainContentContainer: {
    flexDirection: "row",
    gap: 20,
  },
  mainTimerContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderRadius: 90,
    borderLeftColor: Colors.dark.backgroundInteractive,
    borderRightColor: Colors.dark.backgroundInteractive,
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  mainTimerText: {
    color: Colors.dark.backgroundInteractive,
    fontSize: 30,
    fontWeight: "bold",
  },
  actionBtn: {
    borderColor: Colors.dark.backgroundInteractive,
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
