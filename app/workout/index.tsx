import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { useWorkoutContext } from "@/store/workout/context";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { Centiseconds } from "@/utils/types/aliases";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { WorkoutPlan } from "@/store/workout/reducer";

type GlobalTimerState = "uninitialised" | "running" | "paused";

type Timestamps = {
  type: "exercise" | "break";
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

type InitialWorkoutProgressState = {
  startTime: null;
  endTime: null;
  currentPeriodType: "break";
  nextPeriodType: "exercise";
  nextExerciseType: ExerciseType;
  nextExerciseIndex: 0;
  nextSetIndex: number;
};
type WorkoutExerciseProgressState = {
  startTime: Centiseconds;
  endTime: null;
  currentPeriodType: "exercise";
  nextPeriodType: "break";
  currentExerciseIndex: number;
  currentExerciseType: ExerciseType;
  currentSetIndex: number;
};
type WorkoutBreakProgressState = {
  startTime: Centiseconds;
  endTime: null;
  currentPeriodType: "break";
  nextPeriodType: "exercise";
  nextExerciseType: ExerciseType;
  nextExerciseIndex: number;
  nextSetIndex: number;
};
type LastExerciseProgressState = {
  startTime: Centiseconds;
  endTime: null;
  currentPeriodType: "exercise";
  currentExerciseIndex: number;
  currentExerciseType: ExerciseType;
  currentSetIndex: number;
};
type FinalWorkoutProgressState = {
  startTime: Centiseconds;
  endTime: Centiseconds;
  currentPeriodType: "break";
  nextPeriodType: "exercise";
  nextExerciseType: ExerciseType;
  nextExerciseIndex: number;
  nextSetIndex: number;
};
type WorkoutProgressState =
  | InitialWorkoutProgressState
  | WorkoutExerciseProgressState
  | WorkoutBreakProgressState
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

  const { current: progressState } = useRef<WorkoutProgressState>({
    startTime: null,
    endTime: null,
    currentPeriodType: "break",
    nextPeriodType: "exercise",
    nextExerciseType: exercises[0].type,
    nextExerciseIndex: 0,
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
        return setGlobalTimerState("running");
      }
      case "running": {
        return setGlobalTimerState("paused");
      }
      case "paused": {
        return setGlobalTimerState("running");
      }
    }
  };

  const isGloballyUninitialised = globalTimerState === "uninitialised";
  const isGloballyPaused = globalTimerState === "paused";
  const isExerciseTimeNow = progressState.currentPeriodType === "exercise";

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
                isGloballyUninitialised,
                isGloballyPaused,
              })}
              color={Colors.dark.backgroundInteractive}
              size={50}
            />
          </Pressable>
          {/* </Animated.View> */}
          <Pressable
            onPress={onTogglePaused}
            style={getActionBtnTogglePauseStyles(isGloballyPaused)}
          >
            <Ionicons
              name={isGloballyPaused ? "play-outline" : "pause"}
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
  isGloballyUninitialised,
  isGloballyPaused,
}: {
  isGloballyUninitialised: boolean;
  isGloballyPaused: boolean;
}) {
  switch (true) {
    case isGloballyUninitialised:
      return "rocket";
    case isGloballyPaused:
      return "barbell-outline";
    default:
      return "timer-outline";
  }
}

function getActionBtnTogglePauseStyles(isGloballyPaused: boolean) {
  return [
    styles.actionBtn,
    styles.actionBtnTogglePause,
    { paddingLeft: isGloballyPaused ? 5 : 0 },
  ];
}
function getMainActionBtnStyles({
  isExerciseTimeNow,
  isGloballyPaused,
}: {
  isGloballyPaused: boolean;
  isExerciseTimeNow: boolean;
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
