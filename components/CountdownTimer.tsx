import { useCallback, useEffect, useRef, useState } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Seconds } from '@/utils/types/time';
import { Colors } from '@/constants/Colors';

type CountdownTimerProps = {
  from: Seconds; // Initial time in seconds
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const TimeFormatter = (time: number, textStyle?: StyleProp<TextStyle>) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const textColorStyle =
    time < 0 ? styles.negative : seconds <= 5 ? styles.closeToZero : styles.default;

  return (
    <ThemedText style={[textStyle, textColorStyle]}>
      {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : seconds}s
    </ThemedText>
  );
};

export const CountdownTimer = ({ from, state, containerStyle, textStyle }: CountdownTimerProps) => {
  const timeLeftRef = useRef<number>(from); // Store remaining time when paused
  const [remainingTime, setRemainingTime] = useState<number>(from);

  const reduceTimer = useCallback(
    (_relativeEndTime: number) => () => {
      const timeLeft = Math.ceil((_relativeEndTime - Date.now()) / 1000);
      setRemainingTime(timeLeft);
    },
    [],
  );

  useEffect(() => {
    let timerIntervalRef: ReturnType<typeof setInterval>;
    if (state === 'running') {
      // Set end time if not already set, or adjust based on paused time
      const now = Date.now();
      let _relativeEndTime = now + from * 1000;

      if (!!timeLeftRef.current) {
        _relativeEndTime = now + timeLeftRef.current * 1000;
      }

      timerIntervalRef = setInterval(reduceTimer(_relativeEndTime), 1000);
    }

    if (state === 'paused') {
      timeLeftRef.current = remainingTime;
    }

    if (state === 'uninitialised') {
      setRemainingTime(from);
      timeLeftRef.current = from;
    }

    return () => {
      clearInterval(timerIntervalRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return <View style={containerStyle}>{TimeFormatter(remainingTime, textStyle)}</View>;
};

const styles = StyleSheet.create({
  default: {
    color: Colors.common.success,
  },
  negative: {
    color: Colors.common.danger,
  },
  closeToZero: {
    color: Colors.common.warning,
  },
});
