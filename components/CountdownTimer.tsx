import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { Seconds } from '@/utils/types/time';
import { Colors } from '@/constants/Colors';
import { formatTime } from '@/utils/time/formatTime';
import { ONE_HOUR, ONE_MINUTE } from '@/constants/Time';

type CountdownTimerProps = {
  from: Seconds; // Initial time
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
};

export const CountdownTimer = ({ from, state }: CountdownTimerProps) => {
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

  const absoluteTime = Math.abs(remainingTime);
  const formattedTime = formatTime(remainingTime);

  const colorStyle =
    remainingTime < 1
      ? styles.colorNegative
      : remainingTime <= 5
      ? styles.colorCloseToZero
      : styles.colorPositive;

  if (absoluteTime < ONE_MINUTE) {
    return (
      <View style={[styles.wrapper, { justifyContent: 'center' }]}>
        <ThemedText style={[styles.textStyle, colorStyle]}>{formattedTime}s</ThemedText>
      </View>
    );
  }

  if (absoluteTime < ONE_HOUR) {
    const [minutes, seconds] = formattedTime.split(':');
    return (
      <View style={styles.wrapper}>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 1 }}>
          <ThemedText style={[styles.textStyle, colorStyle]}>{minutes}</ThemedText>
        </View>
        <View style={{ alignItems: 'center', width: 10 }}>
          <ThemedText style={[styles.textStyle, colorStyle]}>:</ThemedText>
        </View>
        <View style={{ flex: 1.25, justifyContent: 'flex-start', paddingLeft: 1 }}>
          <ThemedText style={[styles.textStyle, colorStyle]}>{seconds}s</ThemedText>
        </View>
      </View>
    );
  }

  const [hours, minutes, seconds] = formattedTime.split(':');
  return (
    <View style={styles.wrapper}>
      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 1 }}>
        <ThemedText style={[styles.textStyle, colorStyle]}>{hours}</ThemedText>
      </View>
      <View style={{ alignItems: 'center', width: 10 }}>
        <ThemedText style={[styles.textStyle, colorStyle]}>:</ThemedText>
      </View>
      <View style={{ width: 30, alignItems: 'center' }}>
        <ThemedText style={[styles.textStyle, colorStyle]}>{minutes}</ThemedText>
      </View>
      <View style={{ alignItems: 'center', width: 10 }}>
        <ThemedText style={[styles.textStyle, colorStyle]}>:</ThemedText>
      </View>
      <View style={{ flex: 1.5, justifyContent: 'flex-start', paddingLeft: 1 }}>
        <ThemedText style={[styles.textStyle, colorStyle]}>{seconds}s</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    width: 160,
  },
  textStyle: {
    color: Colors.common.primary,
    fontSize: 30,
    lineHeight: 30,
    fontWeight: 'bold',
  },
  colorPositive: {
    color: Colors.common.success,
  },
  colorNegative: {
    color: Colors.common.danger,
  },
  colorCloseToZero: {
    color: Colors.common.warning,
  },
});
