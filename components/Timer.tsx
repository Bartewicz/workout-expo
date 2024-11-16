import type { Centiseconds } from '@/utils/types/time';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';
import { formatTime } from '@/utils/time/formatTime';
import { TEN_MINUTES, ONE_MINUTE, TEN_SECONDS, TEN_HOURS, ONE_HOUR } from '@/constants/Time';

type TimerProps = {
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
  fontSize: number;
  textStyle?: StyleProp<TextStyle>;
};

const TimeFormatter = ({
  time,
  fontSize,
  textStyle,
}: {
  time: number;
  fontSize: number;
  textStyle: StyleProp<TextStyle>;
}) => {
  const absoluteTime = Math.abs(time);
  const [formattedTime] = formatTime(time);

  const rightOffset: number =
    absoluteTime >= TEN_HOURS
      ? (7 / 4) * fontSize
      : absoluteTime >= ONE_HOUR
      ? (3 / 2) * fontSize
      : absoluteTime >= TEN_MINUTES
      ? fontSize
      : absoluteTime >= ONE_MINUTE
      ? (3 / 4) * fontSize
      : absoluteTime >= TEN_SECONDS
      ? (1 / 3) * fontSize
      : 0;

  return (
    <View id="top" style={styles.relativeRow}>
      <View style={{ transform: [{ translateX: rightOffset }] }}>
        <ThemedText style={textStyle}> </ThemedText>
        <ThemedText style={[textStyle, styles.absolute, { right: 7 }]}>{formattedTime}</ThemedText>
        {/* <ThemedText style={[textStyle, styles.absolute, { left: 6 }]}>{decimalSeconds}</ThemedText> */}
      </View>
    </View>
  );
};

export const Timer = ({ state, textStyle, fontSize }: TimerProps) => {
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

  return <TimeFormatter time={time} fontSize={fontSize} textStyle={textStyle} />;
};

const styles = StyleSheet.create({
  relativeRow: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  absolute: {
    position: 'absolute',
  },
});
