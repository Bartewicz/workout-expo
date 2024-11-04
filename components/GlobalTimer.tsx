import { Centiseconds } from "@/utils/types/time";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

type TimerProps = {
  state: "uninitialised" | "running" | "paused" | "completed";
};

const timeFormatter = {
  seconds: {
    format: (time: number) => {
      const centisecondsStr = time.toString().padStart(4, "0");
      const [dozenSeconds, seconds, deciSecond, centiSecond] = centisecondsStr;
      const formattedSeconds = seconds + "." + deciSecond + centiSecond;

      if (dozenSeconds === "0") {
        return formattedSeconds;
      }
      return dozenSeconds + formattedSeconds;
    },
  },
  minutes: new Intl.DateTimeFormat("default", {
    minute: "numeric",
    second: "2-digit",
  }),
  hours: new Intl.DateTimeFormat("default", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }),
};

export const GlobalTimer = ({ state }: TimerProps) => {
  const counterRef = useRef<number>(0);
  const timerRefInterval = useRef<ReturnType<typeof setInterval>>();
  const [time, setTime] = useState<Centiseconds>(0);

  console.log("Global Timer", counterRef.current++);
  console.log("Global Time", time);

  useEffect(() => {
    console.log("state", state);
    if (state === "running") {
      timerRefInterval.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 10);
      return;
    } else if (state === "uninitialised") {
      setTime(0);
    }

    clearInterval(timerRefInterval.current);

    return () => {
      console.log("unmounting");
      clearInterval(timerRefInterval.current);
    };
  }, [state]);

  const formatterType = "seconds";

  return (
    <View style={styles.container}>
      <ThemedText style={styles.time}>
        {timeFormatter[formatterType].format(time)}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  time: {
    color: Colors.text.secondary,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 600,
  },
});
