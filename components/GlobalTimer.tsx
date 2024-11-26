import type { Centiseconds } from '@/utils/types/time';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatTime } from '@/utils/time/formatTime';
import { ONE_MINUTE, ONE_HOUR } from '@/constants/Time';
import { Colors } from '@/constants/Colors';

type TimerProps = {
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
};

export const GlobalTimer = ({ state }: TimerProps) => {
  const timePassedRef = useRef<Centiseconds | null>(null);
  const [time, setTime] = useState<Centiseconds>(0);

  const advanceTimer = useCallback(
    (_relativeStartTime: number) => () => {
      // Todo bring back centiseconds
      setTime(Math.floor((Date.now() - _relativeStartTime) / 1000));
    },
    []
  );

  useEffect(() => {
    let timerIntervalRef: ReturnType<typeof setInterval>;
    if (state === 'running') {
      let _relativeStartTime = Date.now();

      if (!!timePassedRef.current) {
        _relativeStartTime = Date.now() - timePassedRef.current * 1000;
      }

      timerIntervalRef = setInterval(advanceTimer(_relativeStartTime), 1000);

      return () => {
        clearInterval(timerIntervalRef);
      };
    }

    if (state === 'paused') {
      timePassedRef.current = time;
    }

    if (state === 'uninitialised') {
      timePassedRef.current = 0;
      setTime(0);
    }

    return () => {
      if (timerIntervalRef) clearInterval(timerIntervalRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const absoluteTime = Math.abs(time);
  const formattedTime = formatTime(time);

  if (absoluteTime < ONE_MINUTE) {
    return (
      <View style={[styles.row, { justifyContent: 'center', width: 100 }]}>
        <ThemedText style={styles.textStyle}>{formattedTime}</ThemedText>
      </View>
    );
  }

  if (absoluteTime < ONE_HOUR) {
    const [minutes, seconds] = formattedTime.split(':');
    return (
      <View style={[styles.row, { width: 100 }]}>
        <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 1 }}>
          <ThemedText style={styles.textStyle}>{minutes}</ThemedText>
        </View>
        <View style={{ alignItems: 'center', width: 10 }}>
          <ThemedText style={styles.textStyle}>:</ThemedText>
        </View>
        <View style={{ flex: 1, justifyContent: 'flex-start', paddingLeft: 1 }}>
          <ThemedText style={styles.textStyle}>{seconds}</ThemedText>
        </View>
      </View>
    );
  }

  const [hours, minutes, seconds] = formattedTime.split(':');
  return (
    <View style={[styles.row, { width: 120 }]}>
      <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 1 }}>
        <ThemedText style={styles.textStyle}>{hours}</ThemedText>
      </View>
      <View style={{ alignItems: 'center', width: 10 }}>
        <ThemedText style={styles.textStyle}>:</ThemedText>
      </View>
      <View style={{ width: 24, alignItems: 'center' }}>
        <ThemedText style={styles.textStyle}>{minutes}</ThemedText>
      </View>
      <View style={{ alignItems: 'center', width: 10 }}>
        <ThemedText style={styles.textStyle}>:</ThemedText>
      </View>
      <View style={{ flex: 1, justifyContent: 'flex-start', paddingLeft: 1 }}>
        <ThemedText style={styles.textStyle}>{seconds}</ThemedText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: Colors.common.blue,
    fontSize: 24,
    lineHeight: 24,
    fontWeight: 600,
  },
  row: {
    flexDirection: 'row',
  },
});
