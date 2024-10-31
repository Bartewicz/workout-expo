import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { useWorkoutContext } from "@/store/workout/context";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { Centiseconds } from "@/utils/types/aliases";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { WorkoutPlan } from "@/store/workout/reducer";

type GlobalTimerState = "uninitialised" | "running" | "paused";

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
  startTime: Centiseconds | null;
  endTime?: Centiseconds | null;
  currentPeriodType: PeriodType;
  nextPeriodType?: PeriodType;
  currentExerciseIndex?: number;
  currentExerciseType?: ExerciseType;
  currentExerciseMaxSets?: number;
  currentSetIndex?: number;
  nextExerciseType?: ExerciseType;
  nextExerciseIndex?: number;
  nextExerciseMaxSets?: number;
  nextSetIndex?: number;
}
interface InitialWorkoutProgressState extends BaseProgressState {
  uid: "Initial";
  startTime: null;
  currentPeriodType: PeriodType.Break;
  nextPeriodType: PeriodType.Exercise;
  nextExerciseType: ExerciseType;
  nextExerciseIndex: 0;
  nextExerciseMaxSets: number;
  nextSetIndex: 0;
}
interface ExerciseWorkoutProgressState extends BaseProgressState {
  uid: "ExerciseWorkout";
  startTime: Centiseconds;
  currentPeriodType: PeriodType.Exercise;
  nextPeriodType: PeriodType.Break | PeriodType.SetBreak;
  currentExerciseIndex: number;
  currentExerciseType: ExerciseType;
  currentExerciseMaxSets: number;
  currentSetIndex: number;
  nextSetIndex?: number;
}
interface ExerciseSetBreakProgressState extends BaseProgressState {
  uid: "SetBreak";
  startTime: Centiseconds;
  currentPeriodType: PeriodType.SetBreak;
  nextPeriodType: PeriodType.Exercise;
  currentExerciseIndex: number;
  currentExerciseType: ExerciseType;
  currentExerciseMaxSets: number;
  nextSetIndex: number;
}
interface BreakProgressState extends BaseProgressState {
  uid: "Break";
  startTime: Centiseconds;
  currentPeriodType: PeriodType.Break;
  nextPeriodType: PeriodType.Exercise;
  nextExerciseType: ExerciseType;
  nextExerciseIndex: number;
  nextExerciseMaxSets: number;
  nextSetIndex: number;
}
interface LastExerciseProgressState extends BaseProgressState {
  uid: "LastExercise";
  startTime: Centiseconds;
  currentPeriodType: PeriodType.Exercise;
  nextPeriodType: PeriodType.Break;
  currentExerciseIndex: number;
  currentExerciseType: ExerciseType;
  currentSetIndex: number;
}
interface FinalWorkoutProgressState extends BaseProgressState {
  uid: "Completed";
  startTime: Centiseconds;
  endTime: Centiseconds;
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
    second: "2-digit",
    fractionalSecondDigits: 2,
  }),
  minutes: new Intl.DateTimeFormat("default", {
    minute: "numeric",
    second: "2-digit",
    fractionalSecondDigits: 2,
  }),
  hours: new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "numeric",
    second: "2-digit",
    fractionalSecondDigits: 2,
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
  const [timestamps, setTimestamps] = useState<Timestamps[]>([]);
  const [globalTimerState, setGlobalTimerState] =
    useState<GlobalTimerState>("uninitialised");
  const [formatterType, setFormatterType] =
    useState<keyof typeof timeFormatter>("seconds");

  const [progressState, setProgressState] = useState<WorkoutProgressState>({
    uid: "Initial",
    startTime: null,
    currentPeriodType: PeriodType.Break,
    nextPeriodType: PeriodType.Exercise,
    nextExerciseType: exercises[0].type,
    nextExerciseIndex: 0,
    nextExerciseMaxSets: exercises[0].sets.length,
    nextSetIndex: 0,
  });

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
      if (time < ONE_MINUTE_MS) {
        timeout = setTimeout(() => {
          setFormatterType("minutes");
        }, ONE_MINUTE_MS - time);
      } else if (time < ONE_HOUR_MS) {
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

  const onPressWorkoutToggle = () => {
    switch (globalTimerState) {
      case "uninitialised": {
        const currentState = progressState as InitialWorkoutProgressState;
        const firstExercise = exercises[0];
        const {
          nextExerciseMaxSets: firstExerciceMaxSets,
          nextSetIndex: firstSetIndex,
        } = currentState;

        setProgressState({
          uid: "ExerciseWorkout",
          startTime: Date.now(),
          currentPeriodType: PeriodType.Exercise,
          nextPeriodType:
            firstExerciceMaxSets === 1 ? PeriodType.Break : PeriodType.SetBreak,
          currentExerciseType: firstExercise.type,
          currentExerciseIndex: 0,
          currentExerciseMaxSets: firstExerciceMaxSets,
          currentSetIndex: firstSetIndex,
        });
        setGlobalTimerState("running");
      }
      case "running": {
        const currentState = progressState;

        if (currentState.currentPeriodType === PeriodType.Exercise) {
          const { startTime } = currentState;
          // check if last -> set final state
          if (currentState.uid === "LastExercise") {
            setProgressState({
              startTime,
              uid: "Completed",
              currentPeriodType: PeriodType.Break,
              endTime: Date.now(),
            });
            // check if next set exists for current exercise -> set brake between sets
          } else if (currentState.nextSetIndex) {
            const {
              startTime,
              currentExerciseIndex,
              currentExerciseMaxSets,
              currentExerciseType,
              nextSetIndex,
            } = currentState;

            setProgressState({
              startTime,
              uid: "SetBreak",
              currentPeriodType: PeriodType.SetBreak,
              nextPeriodType: PeriodType.Exercise,
              currentExerciseType,
              currentExerciseIndex,
              currentExerciseMaxSets,
              nextSetIndex,
            });
          } else {
            // there's no next set -> set break between exercises
            const { currentExerciseIndex } = currentState;
            const nextExerciseIndex = currentExerciseIndex + 1;
            const nextExercise = exercises[nextExerciseIndex];

            setProgressState({
              startTime,
              uid: "Break",
              currentPeriodType: PeriodType.Break,
              nextPeriodType: PeriodType.Exercise,
              nextExerciseIndex: nextExerciseIndex,
              nextExerciseMaxSets: nextExercise.sets.length,
              nextExerciseType: nextExercise.type,
              nextSetIndex: 0,
            });
          }
        } else if (currentState.currentPeriodType === PeriodType.SetBreak) {
          const {
            startTime,
            currentExerciseType,
            currentExerciseIndex,
            currentExerciseMaxSets,
            nextSetIndex,
          } = currentState;
          const hasNextSet = nextSetIndex + 1 < currentExerciseMaxSets;

          setProgressState({
            startTime,
            uid: "ExerciseWorkout",
            currentPeriodType: PeriodType.Exercise,
            currentExerciseType,
            currentExerciseIndex,
            currentExerciseMaxSets,
            currentSetIndex: nextSetIndex,
            nextPeriodType: hasNextSet ? PeriodType.SetBreak : PeriodType.Break,
          });
          // Period type is 'Break' for all 3 - uninitialised, exercise break, completed - but uid differs
        } else if (currentState.uid === "Break") {
          // Set next exercise
          const {
            startTime,
            nextExerciseIndex,
            nextExerciseMaxSets,
            nextExerciseType,
          } = currentState;
          type ClashingProps = "uid" | "nextPeriodType";
          const commonProps: Omit<
            ExerciseWorkoutProgressState | LastExerciseProgressState,
            ClashingProps
          > = {
            startTime,
            currentPeriodType: PeriodType.Exercise,
            currentExerciseType: nextExerciseType,
            currentExerciseIndex: nextExerciseIndex,
            currentExerciseMaxSets: nextExerciseMaxSets,
            currentSetIndex: 0,
          };
          const isLastExercise = nextExerciseIndex === exercises.length - 1;

          if (isLastExercise) {
            const baseLastExerciseProps = commonProps as Omit<
              LastExerciseProgressState,
              ClashingProps
            >;
            setProgressState({
              ...baseLastExerciseProps,
              uid: "LastExercise",
              nextPeriodType: PeriodType.Break,
            } satisfies LastExerciseProgressState);
          }
          const baseNextExerciseProps = commonProps as Omit<
            ExerciseWorkoutProgressState,
            ClashingProps
          >;
          setProgressState({
            ...baseNextExerciseProps,
            uid: "ExerciseWorkout",
            nextPeriodType:
              nextExerciseMaxSets === 1
                ? PeriodType.Break
                : PeriodType.SetBreak,
          });
        }
      }
    }
  };

  const isGloballyUninitialised = globalTimerState === "uninitialised";
  const isGloballyPaused = globalTimerState === "paused";
  const isExerciseTimeNow = progressState.currentPeriodType === "exercise";
  const isCompleted = progressState.uid === "Completed";

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
        <View style={styles.globalTimer}>
          <ThemedText>{timeFormatter[formatterType].format(time)}</ThemedText>
        </View>
        <View style={styles.mainTimerContainer}>
          <ThemedText style={styles.mainTimerText}>
            {timeFormatter[formatterType].format(time)}
          </ThemedText>
        </View>
        {/* TODO: Add bounce animation on click: https://reactnative.dev/docs/animations */}
        <View style={styles.actionButtonsWrapper}>
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
  actionButtonsWrapper: {
    position: "relative",
  },
  actionBtn: {
    borderColor: Colors.dark.backgroundInteractive,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnWorkoutMain: {
    borderWidth: 5,
    borderRadius: 50,
    width: 100,
    height: 100,
  },
  actionBtnTogglePause: {
    position: "absolute",
    top: -30,
    left: 130,
    borderWidth: 4,
    borderRadius: 40,
    width: 80,
    height: 80,
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
