import { useCallback, useEffect, useRef, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Seconds } from '@/utils/types/time';
import { Colors } from '@/constants/Colors';
import { formatTime } from '@/utils/time/formatTime';
import { TEN_HOURS, ONE_HOUR, TEN_MINUTES, ONE_MINUTE, TEN_SECONDS } from '@/constants/Time';

type CountdownTimerProps = {
  from: Seconds; // Initial time
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
  textStyle?: StyleProp<TextStyle>;
};

const TimeFormatter = ({
  time,
  fontSize = 32,
  textStyle,
}: {
  time: number;
  fontSize?: number;
  textStyle?: StyleProp<TextStyle>;
}) => {
  const absoluteTime = Math.abs(time);
  const [formattedTime] = formatTime(time).split('.');

  const textColorStyle =
    time < 1 ? styles.colorNegative : time <= 5 ? styles.colorCloseToZero : styles.colorDefault;
  const rightOffset: number =
    absoluteTime >= TEN_HOURS
      ? (5 / 6) * fontSize
      : absoluteTime >= ONE_HOUR
      ? fontSize
      : absoluteTime >= TEN_MINUTES
      ? (8 / 6) * fontSize
      : absoluteTime >= ONE_MINUTE
      ? (9 / 6) * fontSize
      : absoluteTime >= TEN_SECONDS
      ? (11 / 6) * fontSize
      : (25 / 12) * fontSize;

  return (
    <View style={styles.relativeRow}>
      <ThemedText style={[textStyle, styles.absolute, textColorStyle, { right: rightOffset }]}>
        {formattedTime}s
      </ThemedText>
    </View>
  );
};

export const CountdownTimer = ({ from, state, textStyle }: CountdownTimerProps) => {
  const timeLeftRef = useRef<number>(from); // Store remaining time when paused
  const [remainingTime, setRemainingTime] = useState<number>(from);

  const reduceTimer = useCallback(
    (_relativeEndTime: number) => () => {
      const timeLeft = Math.ceil((_relativeEndTime - Date.now()) / 1000);
      setRemainingTime(timeLeft);
    },
    []
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

      return () => {
        clearInterval(timerIntervalRef);
      };
    }

    if (state === 'paused') {
      timeLeftRef.current = remainingTime;
    }

    if (state === 'uninitialised') {
      timeLeftRef.current = from;
      setRemainingTime(from);
    }

    return () => {
      if (timerIntervalRef) clearInterval(timerIntervalRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return TimeFormatter({ time: remainingTime, textStyle });
};

const styles = StyleSheet.create({
  relativeRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
  },
  colorDefault: {
    color: Colors.common.success,
  },
  colorNegative: {
    color: Colors.common.danger,
  },
  colorCloseToZero: {
    color: Colors.common.warning,
  },
});
