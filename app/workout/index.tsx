import { ThemedText } from "@/components/ThemedText";
import ParallaxScrollView from "@/components/view/ParallaxScrollView";
import { useWorkoutContext } from "@/store/workout/context";
import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import type { Centiseconds } from "@/utils/types/aliases";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type WorkoutState = {
  startTime: Centiseconds;
  completedExercises: number;
  currentExerciseIndex: number;
  currentExerciseType: "reps" | "time";
  currentSetIndex: number;
};

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

export default function WorkoutScreen() {
  const { state } = useWorkoutContext();

  const [time, setTime] = useState<Centiseconds>(0);
  const [timestamps, setTimestamps] = useState<Centiseconds[]>([]);
  const [globalTimerState, setGlobalTimerState] = useState<
    "uninitialised" | "running" | "paused"
  >("uninitialised");
  const [formatterType, setFormatterType] =
    useState<keyof typeof timeFormatter>("seconds");
  const { current: workoutState } = useRef<WorkoutState>({
    startTime: 0,
    completedExercises: 0,
    currentExerciseType: "reps",
    currentExerciseIndex: 0, // first is 1
    currentSetIndex: 0, // first is 1
  });

  const isGlobalTimerPaused = globalTimerState === "paused";

  // 1. Start the timer:
  //    - set the initial timestamp at workoutState
  //    - set the timer state to 'running'
  //    - start first exercise and set
  //    -

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
      case "paused": {
        return setGlobalTimerState("running");
      }
    }
  };

  const onPressWorkoutToggle = () => {
    switch (globalTimerState) {
      case "uninitialised": {
        workoutState.currentExerciseIndex = 1;
        workoutState.currentSetIndex = 1;
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
      <View style={{ alignItems: "center", gap: 20 }}>
        <ThemedText>{timeFormatter[formatterType].format(time)}</ThemedText>
        {/* TODO: Add bounce animation on click: https://reactnative.dev/docs/animations */}
        <View style={styles.actionButtonsWrapper}>
          {/* <Animated.View > */}
          <Pressable
            onPress={onPressWorkoutToggle}
            disabled={isGlobalTimerPaused}
            style={getActionBtnWorkoutMainStyles(isGlobalTimerPaused)}
          >
            <Ionicons
              name={getActionBtnWorkoutMainName(
                globalTimerState,
                isGlobalTimerPaused
              )}
              color={Colors.dark.backgroundInteractive}
              size={50}
            />
          </Pressable>
          {/* </Animated.View> */}
          <Pressable
            onPress={onPressWorkoutToggle}
            style={getActionBtnTogglePauseStyles(isGlobalTimerPaused)}
          >
            <Ionicons
              name={isGlobalTimerPaused ? "play-outline" : "pause"}
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
    gap: 8,
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
    top: 10,
    left: 120,
    borderWidth: 4,
    borderRadius: 40,
    width: 80,
    height: 80,
  },
});

function getActionBtnWorkoutMainName(
  globalTimerState: string,
  isGlobalTimerPaused: boolean
) {
  return globalTimerState === "uninitialised"
    ? "rocket"
    : isGlobalTimerPaused
    ? "barbell-outline"
    : "timer-outline";
}

function getActionBtnTogglePauseStyles(isGlobalTimerPaused: boolean) {
  return [
    styles.actionBtn,
    styles.actionBtnTogglePause,
    { paddingLeft: isGlobalTimerPaused ? 5 : 0 },
  ];
}
function getActionBtnWorkoutMainStyles(isGlobalTimerPaused: boolean) {
  return [
    styles.actionBtn,
    styles.actionBtnWorkoutMain,
    isGlobalTimerPaused && {
      transform: "rotate(-45deg)",
      opacity: 0.5,
    },
  ];
}
