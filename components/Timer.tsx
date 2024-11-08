import type { Centiseconds } from '@/utils/types/time';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

type TimerProps = {
  state: 'uninitialised' | 'running' | 'paused' | 'completed';
  fontSize: number;
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

const TimeFormatter = (time: number, fontSize: number, textStyle: StyleProp<TextStyle>) => {
  const timeStr = (time / 10).toString();

  const [secondsRaw, centiSeconds = '0'] = timeStr.split('.');
  const secondsNum = Number(secondsRaw);
  const minutes = Math.floor(secondsNum / 60);
  const seconds = minutes > 0 ? (secondsNum % 60).toString().padStart(2, '0') : secondsNum % 60;

  const translateX =
    minutes > 9
      ? (3 / 4) * fontSize
      : minutes > 0
      ? (1 / 2) * fontSize
      : secondsNum > 9
      ? (1 / 6) * fontSize
      : 0;
  const containerPosition: StyleProp<ViewStyle> = {
    transform: [{ translateX }],
  };

  if (minutes > 0) {
    return (
      <View style={[{ position: 'relative', flexDirection: 'row' }, containerPosition]}>
        <ThemedText style={[textStyle, styles.absolute, { right: (4 / 15) * fontSize }]}>
          {minutes}:{seconds}
        </ThemedText>
        <ThemedText style={textStyle}>.</ThemedText>
        <ThemedText style={[textStyle, styles.absolute, { left: (4 / 15) * fontSize }]}>
          {centiSeconds}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={[{ position: 'relative' }, containerPosition]}>
      <ThemedText style={[textStyle, styles.absolute, { right: (4 / 15) * 30 }]}>
        {seconds}
      </ThemedText>
      <ThemedText style={textStyle}>.</ThemedText>
      <ThemedText style={[textStyle, styles.absolute, { left: (4 / 15) * 30 }]}>
        {centiSeconds}
      </ThemedText>
    </View>
  );
};

export const Timer = ({ state, containerStyle, textStyle, fontSize }: TimerProps) => {
  const timePassedRef = useRef<Centiseconds | null>(null);
  const [time, setTime] = useState<Centiseconds>(0);

  const advanceTimer = useCallback(
    (_relativeStartTime: number) => () => {
      setTime(Math.floor((Date.now() - _relativeStartTime) / 100));
    },
    []
  );

  useEffect(() => {
    let timerIntervalRef: ReturnType<typeof setInterval>;
    if (state === 'running') {
      let _relativeStartTime = Date.now();

      if (!!timePassedRef.current) {
        _relativeStartTime = Date.now() - timePassedRef.current * 100;
      }

      timerIntervalRef = setInterval(advanceTimer(_relativeStartTime), 100);

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

  return <View style={containerStyle}>{TimeFormatter(time, fontSize, textStyle)}</View>;
};

const styles = StyleSheet.create({
  absolute: {
    position: 'absolute',
  },
});
